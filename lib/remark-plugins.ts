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

const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

/**
 * Remark plugin that wraps images in a clickable container for lightbox functionality.
 *
 * Example: ![Alt text](/path/to/image.png) becomes:
 * <figure class="image-lightbox" data-src="/path/to/image.png">
 *   <img src="/path/to/image.png" alt="Alt text" />
 * </figure>
 */
export function remarkImageLightbox() {
  return (tree: Root) => {
    visit(
      tree,
      "image",
      (node: Image, index: number | undefined, parent: Parent | undefined) => {
        const src = node.url;
        const isImage = imageExtensions.some((ext) =>
          src.toLowerCase().endsWith(ext),
        );

        // Skip if it's a video or audio file (already handled by other plugins)
        const isMedia =
          videoExtensions.some((ext) => src.toLowerCase().endsWith(ext)) ||
          audioExtensions.some((ext) => src.toLowerCase().endsWith(ext));

        if (isImage && !isMedia && parent && typeof index === "number") {
          const alt = node.alt || "";

          const imageHtml = `<figure class="image-lightbox" data-src="${src}"><img src="${src}" alt="${alt}" loading="lazy" /></figure>`;

          (parent.children as unknown[])[index] = {
            type: "html",
            value: imageHtml,
          };
        }
      },
    );
  };
}

export function remarkYoutube() {
  return (tree: Root) => {
    visit(
      tree,
      "image",
      (node: Image, index: number | undefined, parent: Parent | undefined) => {
        const src = node.url;
        const youtubeMatch = src.match(
          /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        );

        if (youtubeMatch && parent && typeof index === "number") {
          const videoId = youtubeMatch[1];
          const alt = node.alt || "YouTube Video";

          const youtubeHtml = `<div class="youtube-video-wrapper"><iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="${alt}" frameborder="0" allowfullscreen></iframe></div>`;

          (parent.children as unknown[])[index] = {
            type: "html",
            value: youtubeHtml,
          };
        }
      },
    );
  };
}
