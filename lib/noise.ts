/**
 * A small deterministic 2D value-noise function — not Perlin- or simplex-grade, but
 * smooth, cheap, and dependency-free.
 *
 * Used to drive the page-transition wall's paint edges: the ripple in the leading
 * boundary, the drip lengths, and the jitter on the vertical seams between strokes.
 * None of that needs to be a physically accurate fluid — it needs to look hand-painted
 * and to keep moving while it's on screen, and a value-noise field does that for a
 * fraction of the cost of a real simplex implementation.
 */

function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Returns a value in [0, 1], continuous and smooth across integer grid lines. */
export function noise2D(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const tl = hash(xi, yi);
  const tr = hash(xi + 1, yi);
  const bl = hash(xi, yi + 1);
  const br = hash(xi + 1, yi + 1);

  const u = smooth(xf);
  const v = smooth(yf);

  const top = tl + (tr - tl) * u;
  const bottom = bl + (br - bl) * u;
  return top + (bottom - top) * v;
}

/** `noise2D` remapped to [-1, 1] — the common case for a displacement/ripple offset. */
export function noise2DSigned(x: number, y: number): number {
  return noise2D(x, y) * 2 - 1;
}
