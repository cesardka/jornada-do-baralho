/**
 * Generates low-quality (LQ) placeholder versions of every card image
 * from `public/images/card/*.webp` into `public/images/cards-LQ/`.
 *
 * These small blurry placeholders are meant to be used as CSS
 * `background-image` under the full-resolution Next.js <Image>, so the
 * first paint is instant while the high-res asset is still downloading.
 *
 * Usage:
 *   pnpm run generate:lq-cards
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "public/images/card");
const OUT_DIR = path.join(ROOT, "public/images/cards-LQ");

// Target width in pixels. The original cards are 652x1020, so 96px keeps
// the aspect ratio and stays well under 5KB per file at quality 40.
const TARGET_WIDTH = 96;
const WEBP_QUALITY = 40;

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const entries = await fs.readdir(SRC_DIR);
  const sources = entries.filter(
    (f) => f.endsWith(".webp") && !f.endsWith("-lower.webp"),
  );

  console.log(`Generating ${sources.length} LQ card images -> ${OUT_DIR}`);

  const results = await Promise.all(
    sources.map(async (file) => {
      const src = path.join(SRC_DIR, file);
      const out = path.join(OUT_DIR, file);
      const info = await sharp(src)
        .resize({ width: TARGET_WIDTH })
        .webp({ quality: WEBP_QUALITY, effort: 6 })
        .toFile(out);
      return { file, bytes: info.size };
    }),
  );

  const total = results.reduce((sum, r) => sum + r.bytes, 0);
  for (const r of results.sort((a, b) => a.bytes - b.bytes)) {
    console.log(`  ${String(r.bytes).padStart(6)} B  ${r.file}`);
  }
  console.log(`Total: ${total} B across ${results.length} files`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
