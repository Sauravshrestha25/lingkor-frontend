import type { Voice } from "../types";

/**
 * ⚠️ PLACEHOLDER. Every quote and every guest name below is fabricated.
 *
 * The hotel has not opened. There are no guests, no stays and no reviews, so there is
 * no such thing as a real Lingkor testimonial yet. This data exists so the section can
 * be designed and reviewed with something that looks like real content — which is the
 * normal way to build a review carousel, and is fine right up until it ships.
 *
 * **Do not put this live.** Two separate problems if it goes out as-is:
 *
 * 1. **The quotes.** Invented endorsements are deceptive advertising under the FTC's
 *    endorsement rules in the US and equivalent consumer-protection law in the UK, EU
 *    and elsewhere. It does not matter that the sentiment is plausible.
 * 2. **The pictures.** No guest portraits exist yet. The cards therefore use the
 *    client's own photographs of rooms and places, never documentary pictures of
 *    identifiable people presented as hotel guests.
 *
 * Real quotes drop into the same shape. A consented guest portrait can replace the
 * atmospheric image later; dropping `image` entirely uses the wordmark tile.
 */
/*
 * `onTint` is "ink" on every card, and that is a measurement rather than a default.
 * All five element colours are mid-tones, so dark type beats light on each of them:
 *
 *   ochre  white 2.25:1  ink  6.60:1
 *   teal   white 2.78:1  ink  5.34:1
 *   slate  white 3.52:1  ink  4.22:1
 *   fire   white 3.53:1  ink  4.21:1
 *   space  white 1.00:1  ink 14.85:1
 *
 * ⚠️ Slate and fire land at ~4.2:1 — just under WCAG AA's 4.5:1 for body text, though
 * clear of the 3:1 large-text bar. Ink is the best available answer without deepening
 * two brand colours; flag it if the client wants AA across the board.
 */
export const VOICES: Voice[] = [
  {
    quote:
      "We came for one night on the way to Lo Manthang and stayed four. Nobody told us to slow down — the building just does it to you.",
    name: "Anneke de Vries",
    from: "Utrecht, Netherlands",
    rating: 5,
    room: "Ghegu",
    tint: "var(--color-earth)",
    onTint: "ink",
    image: "/images/spaces/arrival.webp",
    imageAlt: "The welcoming entrance hall at Lingkor",
  },
  {
    quote:
      "You hear the kora before you see it. At five in the morning it is just feet on stone, going one way, and you find yourself in it.",
    name: "Tenzin Norbu",
    from: "Darjeeling, India",
    rating: 5,
    tint: "var(--color-water)",
    onTint: "ink",
    image: "/images/boudhanath.webp",
    imageAlt: "Evening movement around the Boudhanath stupa",
  },
  {
    quote:
      "I have been to Mustang twice and never understood the colours until I saw them put next to each other in one building.",
    name: "Marta Salas",
    from: "Barcelona, Spain",
    rating: 4,
    room: "Netsang",
    tint: "var(--color-wind)",
    onTint: "ink",
    image: "/images/mustang/_ECS0971-mod.webp",
    imageAlt: "Painted bands of colour on a carved wall in Mustang",
  },
  {
    quote:
      "The treatment ran an hour and a half and I did not once think about what came next. That is the whole review.",
    name: "Yuki Tanabe",
    from: "Kyoto, Japan",
    rating: 5,
    room: "Menthang",
    tint: "var(--color-fire)",
    onTint: "ink",
    image: "/images/spaces/gallery/menthang-2.webp",
    imageAlt: "Treatment beds in the turquoise Menthang spa",
  },
  {
    quote:
      "Last light on the dome, from the roof, with tea going cold because nobody wanted to move and get another one.",
    name: "Callum Reid",
    from: "Edinburgh, Scotland",
    rating: 5,
    room: "Luri",
    tint: "var(--color-space)",
    onTint: "ink",
    image: "/images/spaces/luri.webp",
    imageAlt: "The warm red interior of the Luri rooftop café",
  },
];
