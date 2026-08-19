import type { Voice } from "../types";

/**
 * ⚠️ PLACEHOLDER. Every quote, every name and every face below is fabricated.
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
 * 2. **The faces.** These are real, identifiable people photographed by Unsplash
 *    contributors. The Unsplash licence covers commercial *use* of the image, but it
 *    does not grant the depicted person's likeness rights, and it explicitly does not
 *    cover using someone's face to imply they endorse a product. A stranger appearing
 *    to recommend a hotel they have never visited is the exact case that rule exists
 *    for — and it is a claim against us by the person in the photograph, quite apart
 *    from the advertising-standards problem.
 *
 * Real quotes drop into the same shape. Set `image` to a guest's own photograph, taken
 * with their permission, or drop `image` entirely and the card falls back to the
 * wordmark tile. See CONTENT.md.
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
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1200&h=750&fit=crop&crop=faces",
  },
  {
    quote:
      "You hear the kora before you see it. At five in the morning it is just feet on stone, going one way, and you find yourself in it.",
    name: "Tenzin Norbu",
    from: "Darjeeling, India",
    rating: 5,
    tint: "var(--color-water)",
    onTint: "ink",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=750&fit=crop&crop=faces",
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
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1200&h=750&fit=crop&crop=faces",
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
    image:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=1200&h=750&fit=crop&crop=faces",
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
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=1200&h=750&fit=crop&crop=faces",
  },
];
