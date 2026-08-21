import type { Space } from "../types";

// Colours and mappings from REQUIREMENTS.md §3 — the May-2026 per-area PDF, not the
// Dec-2025 deck. Sentences are the client's own, from the page 3-7 comps.
export const SPACES: Space[] = [
  {
    id: "netsang",
    name: "Netsang",
    role: "Fine dining",
    element: "Earth",
    hue: "Ocre yellow",
    line: "The warmth of family, or of a best friend's table. Netsang gathers guests the way a household gathers at the end of a day's travel.",
    image: "/images/spaces/netsang.webp",
    field: "var(--color-earth)",
    displayOnField: "white",
  },
  {
    id: "menthang",
    name: "Menthang",
    role: "Tibetan spa",
    element: "Water",
    hue: "Turquoise blue",
    line: "The plain of medicinal herbs — a place given over to slowness, warm water, and the plants that have long eased Himalayan bodies.",
    image: "/images/spaces/menthang.webp",
    field: "var(--color-water)",
    displayOnField: "white",
  },
  {
    id: "ghegu",
    name: "Ghegu",
    role: "Tea garden",
    element: "Wind",
    // Deviation from the client's own colour doc, which sets Wind/Ghegu as green
    // (#939D2C) — see REQUIREMENTS.md §3. Confirm with the client before shipping.
    hue: "Slate blue",
    line: "Named for the main entrance of Lo Manthang, where people gather and talk. Ghegu is the garden threshold where conversation collects.",
    image: "/images/spaces/ghegu.webp",
    field: "var(--color-wind)",
    displayOnField: "white",
  },
  {
    id: "luri",
    name: "Luri",
    role: "Rooftop café",
    element: "Fire",
    hue: "Red",
    line: "For the Mountain of the Nāga, and the cliff caves of Luri in Upper Mustang. A place for open sky, low sun, and the last light on the stupa.",
    image: "/images/spaces/luri.webp",
    field: "var(--color-fire)",
    displayOnField: "white",
  },
  {
    id: "namkha",
    name: "Namkha",
    role: "Yoga & teaching hall",
    element: "Space",
    hue: "Off-white",
    line: "The sky. A celestial hall held open and unhurried, for spiritual teaching and yogic practice — the element that contains all the others.",
    image: "/images/spaces/namkha.webp",
    field: "var(--color-namkha)",
    displayOnField: "ink",
  },
];
