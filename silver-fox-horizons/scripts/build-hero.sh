#!/usr/bin/env bash
# Rebuilds every hero asset from assets/hero.mp4.
# To swap the film: replace assets/hero.mp4, then run  bash scripts/build-hero.sh
# (Current hero is made from a still: python3 scripts/hero-from-still.py ..., which
#  writes its own mobile loop, so it is followed by  SKIP_MOBILE=1 bash scripts/build-hero.sh)
#
#   assets/hero-frames/frame-001.webp ... (desktop scroll sequence, 1920px wide, quality 75)
#   assets/hero-720.mp4                  (mobile loop, 720x1280 portrait crop, no audio)
#   assets/hero-mobile.webp              (mobile poster, first frame of the loop)
#
# Keep FRAMES in sync with data-frame-count on the hero canvas in index.html.
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=assets/hero.mp4
FRAMES=${FRAMES:-140}
OUT=assets/hero-frames

dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")
# Sample slightly faster than needed, then cap, so we always get exactly $FRAMES.
fps=$(awk -v n="$FRAMES" -v d="$dur" 'BEGIN { printf "%.6f", (n + 0.5) / d }')

rm -rf "$OUT" && mkdir -p "$OUT"
ffmpeg -v error -i "$SRC" -an \
  -vf "fps=$fps,scale=1920:-2:flags=lanczos" \
  -frames:v "$FRAMES" -c:v libwebp -quality 75 -compression_level 6 \
  "$OUT/frame-%03d.webp"

# Mobile: centre crop to 9:16 so phones get real pixels instead of an upscaled slice.
if [ -z "${SKIP_MOBILE:-}" ]; then
ffmpeg -v error -y -i "$SRC" -an \
  -vf "crop=ih*9/16:ih,scale=720:1280:flags=lanczos" \
  -c:v libx264 -crf 27 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart \
  assets/hero-720.mp4

ffmpeg -v error -y -i assets/hero-720.mp4 -frames:v 1 -c:v libwebp -quality 70 assets/hero-mobile.webp
fi

count=$(ls "$OUT" | wc -l | tr -d ' ')
echo "frames: $count  ($(du -sh "$OUT" | cut -f1))"
echo "mobile: $(du -h assets/hero-720.mp4 | cut -f1)"
