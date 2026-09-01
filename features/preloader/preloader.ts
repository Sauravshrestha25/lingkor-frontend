import type React from "react";
import { BOUDHA } from "@/lib/photo";

// Timing, assets and scroll-locking for the intro. Separated from the component so the
// beats of the sequence can be read and retuned in one place — every duration below is
// load-bearing on how the handoff to the hero lands.

// The client's proposed sequence: four Mustang frames chosen for *texture and
// geology* — no skyline, no landscape-with-sky — running warm → cool → warm, then
// the stupa. Closest matches from `public/images/mustang` to the contact sheet the
// client sent; swap any of these four for a supplied full-res frame when it arrives.
export const PHOTOS = [
  "/images/mustang/_ECS3379-mod.webp",
  "/images/mustang/_ECS1673-mod.webp",
  "/images/mustang/_DSF5827-mod.webp",
  "/images/mustang/_ECS0407.webp",
  BOUDHA,
];

// One line per frame. The last frame carries no quote — the logo is its payoff.
// Sourced from the Dhammapada (public domain); "Peace comes from within" is the
// common English rendering attributed to the Buddha.
export const QUOTES: ({ text: string; source: string } | null)[] = [
  { text: "Peace comes from within.", source: "Buddha" },
  {
    text: "Hatred does not cease by hatred, but by love alone.",
    source: "Dhammapada",
  },
  {
    text: "Better than a thousand hollow words is one word that brings peace.",
    source: "Dhammapada",
  },
  null,
];

export const SESSION_KEY = "lb-preloaded";
/**
 * Play the cinematic on every arrival at `/` — hard refresh, and client navigation
 * back from another route (which remounts `Hero`), by request from the client.
 *
 * Set `true` to instead play it once per tab session: `Hero` stamps `SESSION_KEY`
 * when the film starts and jumps straight to the resting hero on any later mount.
 */
export const ONCE_PER_SESSION = false;
export const MIN_MS = 300; // floor before the timeline starts — frame 1 is on screen for it
export const MAX_MS = 5000; // ceiling: start anyway, even if the first frame never arrives
export const FAILSAFE_MS = 45000; // last resort: never leave the navbar logo hidden (> full runtime)

// ~25s total, by request — the musician is scoring to this length, and every frame
// should have room to be looked at. The visitor is never trapped in it: any scroll,
// wheel or touch-drag fast-forwards it to the resting hero (see Hero.tsx).
export const HOLD = 3.2; // each Mustang frame
// Boudha's beats. They add up to BOUDHA_HOLD.
export const SHARP_BEAT = 2.5; // Boudha alone, sharp
export const REVEAL_BEAT = 4.0; // blur comes up while the mark writes itself on
/**
 * The blur runs on its own, much shorter curve inside REVEAL_BEAT.
 *
 * It has to, because the reveal is a *sharp* cut-out against a *soft* field: until the
 * blur has built, there is no contrast between the two and the letters writing on are
 * invisible. Matching the blur to the full reveal wasted most of the write-on.
 */
export const BLUR_IN = 1.2;
export const WRITE_LEAD = 0.4; // blur gets this head start before the pen moves
export const FILL_BEAT = 2.5; // glyph dissolves to solid
export const BOUDHA_HOLD = SHARP_BEAT + REVEAL_BEAT + FILL_BEAT;
export const FADE = 2.2; // cross-dissolve length — must stay under HOLD so frames keep moving

// The SVG is both the mask and the stroked outline, so the two share one geometry —
// the PNG has different padding and would not line up with the drawn paths.
export const LOGO_SRC = "/Logo/logo-white.svg";

/**
 * Placing the wordmark so its SPIRE GLYPH registers to the real stupa.
 *
 * The client's reference: "Lingkor" script draped across the dome, the little
 * zigzag spire mark sitting exactly on the gold spire of the stupa behind it, and
 * the mark writing itself on from that pinnacle downward — "as if it is built on
 * top of it".
 *
 * The glyph is not centred in the artwork. Measured off `logo-white.svg`
 * (viewBox `28 112 1491 846`, one compound path): the pinnacle dot is at ~x0.565 /
 * y0.09 of the box, the zigzag runs to ~y0.26, the script fills the rest. So the
 * whole mark is pulled left of centre (`LOGO_X_FRAC < 0.5`) to bring that glyph
 * back over the stupa, and sized larger than the old centred wordmark so the glyph
 * itself is big enough to read on the spire.
 *
 * Fractions, not `center`, because `mask-position: X% Y%` aligns the X%,Y% point of
 * the image with the same point of the viewport — the exact model `flightLayout()`
 * in Hero re-uses to place the flat mark for the flight to the navbar. Keep the two
 * in sync. Tuned against BOUDHA at ~16:10; nudge on review.
 */
export const LOGO_RATIO = 1491 / 846; // artwork viewBox aspect, for the flight box

/**
 * `vw`  — width as a share of the viewport width; `max` caps it in px on wide screens.
 * `xF`  — mask-position X as a fraction (0.5 = dead centre). Pulled left of centre on
 *         desktop so the glyph (at x0.565 of the artwork) lands on the stupa axis.
 * `yF`  — mask-position Y as a fraction; tuned so the zigzag rides the gold spire and
 *         the ring closes on the harmika.
 *
 * Portrait viewports crop `boudhanath_new` hard to the sides, so the stupa fills far
 * more of the frame — the wordmark has to be much wider (and roughly centred) to keep
 * the glyph on the spire.
 */
export type LogoNums = { vw: number; max: number; xF: number; yF: number };
export const LOGO_DESKTOP: LogoNums = { vw: 73, max: 1250, xF: 0.335, yF: 0.105 };
// Portrait: nothing is cropped vertically, so the stupa sits lower and the frame
// only shows a narrow centre band. Whole wordmark kept on-screen (glyph ends up
// smaller than the real spire). Tune these four against a real phone / Chrome
// responsive mode if the glyph drifts off the spire.
export const LOGO_MOBILE: LogoNums = { vw: 96, max: 560, xF: 0.12, yF: 0.18 };
export const MOBILE_MAX_W = 640; // <= this viewport width uses LOGO_MOBILE

export const pickLogo = (viewportW: number): LogoNums =>
  viewportW <= MOBILE_MAX_W ? { ...LOGO_MOBILE } : { ...LOGO_DESKTOP };

export const logoW = (p: LogoNums) => `min(${p.vw}vw, ${p.max}px)`;
export const logoX = (p: LogoNums) => `${p.xF * 100}%`;
export const logoY = (p: LogoNums) => `${p.yF * 100}%`;

/**
 * The logo is an SVG, so it has no meaningful pixel size — these numbers exist only so
 * Next can reserve the right aspect box before it loads. The rendered width is
 * `LOGO_W` above; the ratio is what matters here.
 */
export const LOGO_INTRINSIC = { width: 1200, height: 400 };



/**
 * Two mask layers, intersected.
 *
 * Layer 1 is the logo. Layer 2 is a soft-edged wipe, twice the viewport TALL, whose
 * vertical position the timeline animates — sliding it from y=100% to y=0% walks the
 * boundary DOWN the mark, so it reveals top to bottom: pinnacle first, "Lingkor"
 * script last, "built from the spire down". There is no drawn line anywhere; the
 * interior appearing IS the drawing.
 *
 * `intersect` is what makes it work — a pixel shows only where the logo says yes AND
 * the wipe has already passed. The element is full-bleed and never transformed, so
 * what shows through is exactly the frame behind it, pixel for pixel.
 *
 * The wipe layer is exactly TWO viewports tall, and that number is load-bearing.
 * With a layer of height 2H at `mask-position: … y%`, the visible window covers
 * gradient fractions [y/200, 0.5 + y/200] — always half the gradient, sliding
 * linearly with y. A gradient opaque over its first half and clear over its second
 * is fully hidden at y=100 and fully shown at y=0, boundary crossing evenly between.
 */
const WIPE = "linear-gradient(to bottom, #000 0 48%, transparent 52% 100%)";
export const WIPE_HIDDEN = "100%";

export const wipeMaskFor = (
  p: LogoNums,
  y: string,
): React.CSSProperties => ({
  WebkitMaskImage: `url(${LOGO_SRC}), ${WIPE}`,
  maskImage: `url(${LOGO_SRC}), ${WIPE}`,
  WebkitMaskRepeat: "no-repeat, no-repeat",
  maskRepeat: "no-repeat, no-repeat",
  WebkitMaskPosition: `${logoX(p)} ${logoY(p)}, ${logoX(p)} ${y}`,
  maskPosition: `${logoX(p)} ${logoY(p)}, ${logoX(p)} ${y}`,
  WebkitMaskSize: `${logoW(p)}, 100% 200%`,
  maskSize: `${logoW(p)}, 100% 200%`,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
});

/**
 * What the mask becomes the instant the write-on finishes: the logo alone, no wipe
 * layer. The gradient carries a soft edge so the very end of the travel would leave
 * the last few percent of the mark fractionally translucent; swapping to this makes
 * the finished state exactly opaque instead of almost.
 */
export const logoOnlyFor = (p: LogoNums): React.CSSProperties => ({
  WebkitMaskImage: `url(${LOGO_SRC})`,
  maskImage: `url(${LOGO_SRC})`,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: `${logoX(p)} ${logoY(p)}`,
  maskPosition: `${logoX(p)} ${logoY(p)}`,
  WebkitMaskSize: logoW(p),
  maskSize: logoW(p),
  WebkitMaskComposite: "source-over",
  maskComposite: "add",
});

// Desktop values for the initial React render; Hero re-applies the viewport-correct
// placement before the timeline starts.
export const LOGO_MASK = wipeMaskFor(LOGO_DESKTOP, WIPE_HIDDEN);

// Scroll lock lives on <html>: body carries `overflow-x: hidden` from globals.css,
// so clearing an inline overflow on body does not reliably give scrolling back.
export const lockScroll = () => {
  document.documentElement.style.overflow = "hidden";
};
export const unlockScroll = () => {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
};
