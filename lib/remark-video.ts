import { visit } from "unist-util-visit";
import type { Root, Image, Parent } from "mdast";

/**
 * Remark plugin that converts image syntax with video extensions (.mp4, .webm, .ogg)
 * into HTML video elements.
 *
 * Example: ![Alt text](/path/to/video.mp4) becomes:
 * <video controls width="100%"><source src="/path/to/video.mp4" type="video/mp4"></video>
 */
export function remarkVideo() {
  const videoExtensions = [".mp4", ".webm", ".ogg"];

  const getMimeType = (src: string): string => {
    if (src.endsWith(".mp4")) return "video/mp4";
    if (src.endsWith(".webm")) return "video/webm";
    if (src.endsWith(".ogg")) return "video/ogg";
    return "video/mp4";
  };

  return (tree: Root) => {
    visit(
      tree,
      "image",
      (node: Image, index: number | undefined, parent: Parent | undefined) => {
        const src = node.url;
        const isVideo = videoExtensions.some((ext) =>
          src.toLowerCase().endsWith(ext),
        );

        if (isVideo && parent && typeof index === "number") {
          const mimeType = getMimeType(src);
          const alt = node.alt || "";

          const videoHtml = `<video controls width="100%" title="${alt}"><source src="${src}" type="${mimeType}"></video>`;

          (parent.children as unknown[])[index] = {
            type: "html",
            value: videoHtml,
          };
        }
      },
    );
  };
}
