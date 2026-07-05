#!/usr/bin/env bash
# Convert every PNG sprite sheet in public/images/sprites to WebP.
#
# Requires cwebp (part of the `webp` package):
#   macOS:  brew install webp
#   Linux:  apt-get install webp   (or your distro equivalent)
#
# Usage:
#   ./scripts/convert-sprites-to-webp.sh                 # both sizes, lossy q=85
#   QUALITY=90 ./scripts/convert-sprites-to-webp.sh
#   LOSSLESS=1 ./scripts/convert-sprites-to-webp.sh
#   SIZE=2000 HD_SIZE=4000 ./scripts/convert-sprites-to-webp.sh
#   HD_SIZE=0 ./scripts/convert-sprites-to-webp.sh       # HD keeps original resolution
#
# Produces per input:
#   NN_name.webp     (standard — fast to decode, used in the loading view)
#   NN_name-hd.webp  (high-res — for larger use cases like marching sprites)

set -euo pipefail

if ! command -v cwebp >/dev/null 2>&1; then
  echo "error: cwebp not found. Install it with 'brew install webp' (macOS) or your package manager." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPRITE_DIR="${SCRIPT_DIR}/../public/images/sprites"

QUALITY="${QUALITY:-85}"
LOSSLESS="${LOSSLESS:-0}"
SIZE="${SIZE:-1500}"
HD_SIZE="${HD_SIZE:-3500}"

if [[ "$LOSSLESS" == "1" ]]; then
  BASE_ARGS=(-lossless -z 9)
  MODE_LABEL="lossless"
else
  BASE_ARGS=(-q "$QUALITY" -m 6)
  MODE_LABEL="lossy q=$QUALITY"
fi

shopt -s nullglob
files=("$SPRITE_DIR"/*.png)

if (( ${#files[@]} == 0 )); then
  echo "No PNG files found in $SPRITE_DIR"
  exit 0
fi

echo "Converting ${#files[@]} sprite(s) to WebP ($MODE_LABEL)"
echo "  standard: ${SIZE}x${SIZE}   hd: ${HD_SIZE:-original}x${HD_SIZE:-original}"
echo

total_png=0
total_webp=0

human_mb() { awk -v n="$1" 'BEGIN{printf "%.2f", n/1048576}'; }
file_size() { stat -f%z "$1" 2>/dev/null || stat -c%s "$1"; }

convert_variant() {
  local src="$1" dest="$2" size="$3"
  local args=("${BASE_ARGS[@]}")
  if [[ "$size" != "0" ]]; then
    args+=(-resize "$size" "$size")
  fi
  cwebp "${args[@]}" "$src" -o "$dest" >/dev/null 2>&1
}

for src in "${files[@]}"; do
  base="${src%.png}"
  std_dest="${base}.webp"
  hd_dest="${base}-hd.webp"

  convert_variant "$src" "$std_dest" "$SIZE"
  convert_variant "$src" "$hd_dest" "$HD_SIZE"

  src_size=$(file_size "$src")
  std_size=$(file_size "$std_dest")
  hd_size=$(file_size "$hd_dest")

  total_png=$((total_png + src_size))
  total_webp=$((total_webp + std_size + hd_size))

  printf "  %-32s  %6.2f MB -> std %5.2f MB   hd %5.2f MB\n" \
    "$(basename "$src")" \
    "$(human_mb "$src_size")" \
    "$(human_mb "$std_size")" \
    "$(human_mb "$hd_size")"
done

echo
awk -v p="$total_png" -v w="$total_webp" 'BEGIN{
  printf "Total: %.2f MB PNG -> %.2f MB WebP (both variants combined, %.1f%% of PNG)\n",
    p/1048576, w/1048576, (w/p)*100
}'
