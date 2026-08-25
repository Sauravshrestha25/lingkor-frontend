const r3 = (n: number) => Math.round(n * 1000) / 1000;

function spiral(
  cx: number,
  cy: number,
  outer: number,
  turns: number,
  dir: 1 | -1,
  start = 0,
) {
  const steps = Math.ceil(turns * 24);
  const b = Math.log(6) / (turns * 2 * Math.PI); // ends ~1/6 of its starting radius
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * 2 * Math.PI;
    const r = outer * Math.exp(-b * t);
    const a = start + dir * t;
    pts.push(`${r3(cx + Math.cos(a) * r)} ${r3(cy + Math.sin(a) * r)}`);
  }
  return `M ${pts.join(" L ")}`;
}

/** One cloud, drawn to a 200×90 box, tail running left. */
function CloudPaths() {
  return (
    <>
      {/* The head: three scallops, largest at the leading (right) edge. */}
      <path d="M 196 44 A 17 17 0 0 0 162 42 A 21 21 0 0 0 121 40 A 15 15 0 0 0 92 45 A 13 13 0 0 0 68 52" />
      {/* Underside, returning right and tucking into the curl. */}
      <path d="M 68 52 A 13 13 0 0 0 92 62 A 18 18 0 0 0 128 63 A 20 20 0 0 0 168 62 A 15 15 0 0 0 196 44" />
      {/* The leading curl, the detail that makes it Tibetan rather than a weather icon. */}
      <path d={spiral(171, 52, 12, 1.35, 1, -0.5)} />
      <path d={spiral(112, 52, 9, 1.2, -1, Math.PI + 0.4)} />
      {/* The tail: two wisps streaming away behind the head. */}
      <path d="M 68 52 C 50 52, 40 44, 22 45 C 12 45.5, 7 49, 4 53" />
      <path d="M 74 60 C 56 64, 44 60, 28 62 C 20 63, 15 66, 11 70" />
    </>
  );
}

/**
 * `size` is the drawn width; height follows the 200:90 box. Decorative by definition —
 * it repeats nothing the copy says — so it is hidden from assistive tech.
 */
export function CloudMotif({
  className = "",
  strokeWidth = 2.4,
  flip = false,
}: {
  className?: string;
  strokeWidth?: number;
  /** Mirror it, so a pair of clouds can face each other across a panel. */
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 200 90"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <CloudPaths />
    </svg>
  );
}
