import { visit } from "unist-util-visit";
import type { Root, Image, Parent } from "mdast";

const videoExtensions = [".mp4", ".webm"];
const audioExtensions = [".mp3", ".wav", ".ogg"];

const getVideoMimeType = (src: string): string => {
  if (src.endsWith(".mp4")) return "video/mp4";
  if (src.endsWith(".webm")) return "video/webm";
  return "video/mp4";
};

const getAudioMimeType = (src: string): string => {
  if (src.endsWith(".mp3")) return "audio/mpeg";
  if (src.endsWith(".wav")) return "audio/wav";
  if (src.endsWith(".ogg")) return "audio/ogg";
  return "audio/mpeg";
};

/**
 * Remark plugin that converts image syntax with video extensions (.mp4, .webm)
 * into HTML video elements.
 *
 * Example: ![Alt text](/path/to/video.mp4) becomes:
 * <video controls width="100%"><source src="/path/to/video.mp4" type="video/mp4"></video>
 */
export function remarkVideo() {
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
          const mimeType = getVideoMimeType(src);
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

/**
 * Remark plugin that converts image syntax with audio extensions (.mp3, .wav, .ogg)
 * into HTML audio elements with custom styling.
 *
 * Example: ![Alt text](/path/to/audio.mp3) becomes:
 * <div class="audio-player-container">...</div>
 */
export function remarkAudio() {
  return (tree: Root) => {
    visit(
      tree,
      "image",
      (node: Image, index: number | undefined, parent: Parent | undefined) => {
        const src = node.url;
        const isAudio = audioExtensions.some((ext) =>
          src.toLowerCase().endsWith(ext),
        );

        if (isAudio && parent && typeof index === "number") {
          const mimeType = getAudioMimeType(src);
          const alt = node.alt || "Ouvir áudio";

          const audioHtml = `<div class="audio-player-wrapper" data-src="${src}" data-label="${alt}" data-mime="${mimeType}"><audio controls class="w-full"><source src="${src}" type="${mimeType}"></audio></div>`;

          (parent.children as unknown[])[index] = {
            type: "html",
            value: audioHtml,
          };
        }
      },
    );
  };
}
