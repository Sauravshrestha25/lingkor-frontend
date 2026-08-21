// The data and geometry behind the kora ring. Kept out of the component so the drawing
// maths can be read — and checked — without scrolling past four hundred lines of JSX.

/**
 * The hours of a day at the stupa. `sky` and `ink` are the light at that hour — the
 * section repaints itself as you scroll, so the circuit is walked from dark morning
 * through daylight to lamplit night.
 *
 * ⚠️ Times are invented — see CONTENT.md. The two koras are real daily practice; the
 * clock values are not confirmed.
 *
 * `sky` and `ink` reference the palette tokens where the moment *is* a brand colour —
 * the walk starts on the white page ground and ends at the shared midnight colour.
 * The two raw hexes below are deliberately not tokens: `#D8A66B` low gold and
 * `#2C1B10` its type. Those are stages of daylight, not reusable brand values.
 */
export const HOURS = [
  {
    time: "05:30",
    label: "First kora",
    line: "The circle starts before the shops do. Butter lamps, and a thousand feet going the same way.",
    sky: "var(--color-canvas)",
    ink: "var(--color-ink)",
    lamps: 1,
  },
  {
    time: "11:00",
    label: "Ghegu",
    line: "Tea in the garden. The square outside empties into its own quiet.",
    sky: "var(--color-canvas)",
    ink: "var(--color-ink)",
    lamps: 0,
  },
  {
    time: "17:45",
    label: "Luri",
    line: "Last light lands on the dome before it reaches the street. The roof gets it first.",
    sky: "#D8A66B",
    ink: "#2C1B10",
    lamps: 0.4,
  },
  {
    time: "19:30",
    label: "Evening kora",
    line: "The circle fills again. Lamps lit the whole way round, and the dome holds the light.",
    sky: "var(--color-midnight)",
    ink: "var(--color-space)",
    lamps: 1,
  },
];

export const R = 150;
export const CIRC = 2 * Math.PI * R;

/**
 * Server and client don't agree on the last bits of `Math.cos`/`Math.sin`, which is
 * enough to trip React's hydration check on an SVG coordinate. Rounding to three
 * decimals is far finer than a pixel at this viewBox and identical on both sides.
 */
export const at = (angle: number, radius: number) => ({
  x: Math.round((200 + Math.cos(angle) * radius) * 1000) / 1000,
  y: Math.round((200 + Math.sin(angle) * radius) * 1000) / 1000,
});
/** Butter lamps set around the circuit. */
export const LAMPS = 24;
