#!/usr/bin/env bash
# Convert images to WebP. Usage: scripts/webp.sh [dir] [quality] [max-width]
# ponytail: cwebp + sips only, no node deps. Originals are left in place.
set -euo pipefail

DIR="${1:-public/images/mustang}"
Q="${2:-82}"
MAXW="${3:-2560}"

command -v cwebp >/dev/null || { echo "need cwebp: brew install webp"; exit 1; }

find "$DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) -print0 |
while IFS= read -r -d '' f; do
  out="${f%.*}.webp"
  [ -f "$out" ] && [ "$out" -nt "$f" ] && continue
  w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
  if [ "${w:-0}" -gt "$MAXW" ]; then
    cwebp -quiet -q "$Q" -m 6 -mt -metadata icc -resize "$MAXW" 0 "$f" -o "$out"
  else
    cwebp -quiet -q "$Q" -m 6 -mt -metadata icc "$f" -o "$out"
  fi
  echo "$(basename "$out")  $(du -h "$f" | cut -f1) -> $(du -h "$out" | cut -f1)"
done
