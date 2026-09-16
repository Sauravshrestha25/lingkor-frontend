// Fill the outlined side-border asset without changing its size or outer edges.
// Resolve Next's existing image dependency; no extra package is required.
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
const resolve = createRequire(import.meta.url).resolve;
const nextRequire = createRequire(resolve("next/package.json"));
const { default: sharp } = await import(nextRequire.resolve("sharp"));

async function main() {
  const directory = fileURLToPath(new URL("../public/images/art/", import.meta.url));
  const { data, info } = await sharp(path.join(directory, "knot-white.png"))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const count = width * height;
  const barrier = new Uint8Array(count);

  function neighbors(pixel, visit) {
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (x + dx >= 0 && x + dx < width && y + dy >= 0 && y + dy < height) {
          visit((y + dy) * width + x + dx);
        }
      }
    }
  }

  // Expand only the temporary barrier to close subpixel breaks in the outlines.
  for (let pixel = 0; pixel < count; pixel++) {
    if (data[pixel * 4 + 3] >= 16) neighbors(pixel, (p) => { barrier[p] = 1; });
  }

  const exterior = new Uint8Array(count);
  const queue = [];
  function enqueue(pixel) {
    if (!barrier[pixel] && !exterior[pixel]) {
      exterior[pixel] = 1;
      queue.push(pixel);
    }
  }
  for (let x = 0; x < width; x++) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const pixel = queue[cursor];
    const x = pixel % width;
    if (x > 0) enqueue(pixel - 1);
    if (x < width - 1) enqueue(pixel + 1);
    if (pixel >= width) enqueue(pixel - width);
    if (pixel < count - width) enqueue(pixel + width);
  }

  const output = Buffer.from(data);
  let filled = 0;
  for (let pixel = 0; pixel < count; pixel++) {
    if (!barrier[pixel] && !exterior[pixel]) {
      // Recover the interior pixels covered by the temporary expanded barrier.
      neighbors(pixel, (p) => { output.fill(255, p * 4, p * 4 + 4); });
      filled++;
    }
  }
  assert(filled > 100000 && filled < count / 2, "Unexpected ribbon fill area");
  for (let pixel = 0; pixel < count; pixel++) {
    assert(output[pixel * 4 + 3] >= data[pixel * 4 + 3], "Original outline lost");
    if (exterior[pixel]) {
      assert.equal(output[pixel * 4 + 3], data[pixel * 4 + 3], "Exterior changed");
    }
  }
  const destination = path.join(directory, "knot-filled.png");
  await sharp(output, { raw: { width, height, channels: 4 } }).png().toFile(destination);
  console.log(`Filled ${filled} interior pixels; preserved ${width} × ${height} canvas and exterior transparency.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
