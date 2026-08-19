import type React from "react";
import { BOUDHA } from "@/lib/photo";

// Timing, assets and scroll-locking for the intro. Separated from the component so the
// beats of the sequence can be read and retuned in one place — every duration below is
// load-bearing on how the handoff to the hero lands.

export const PHOTOS = [
  "/images/extras/mustang3.webp",
  "/images/extras/MustangValley.webp",
  "/images/extras/MustangValley2.webp",
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
 * Every page load, by request.
 *
 * `true` plays it once per tab session — the arrival ritual earns its ~7s on first
 * contact and is a toll booth on every refresh after. That is the setting to ship with;
 * this is the setting to develop against, and to demo with.
 *
 * Soft navigation is unaffected either way: the preloader is mounted in the root layout
 * (`app/layout.tsx`), which client navigation does not remount, so moving between routes
 * never replays it. This flag only governs hard loads.
 */
export const ONCE_PER_SESSION = false;
export const MIN_MS = 300; // floor before the timeline starts — frame 1 is on screen for it
export const MAX_MS = 5000; // ceiling: start anyway, even if the first frame never arrives
export const FAILSAFE_MS = 25000; // last resort: never leave the navbar logo hidden

export const HOLD = 1.0; // the three Mustang frames, quote included
// Boudha's beats. They add up to BOUDHA_HOLD.
export const SHARP_BEAT = 0.8; // Boudha alone, sharp
export const REVEAL_BEAT = 1.6; // blur comes up while the mark writes itself on
/**
 * The blur runs on its own, much shorter curve inside REVEAL_BEAT.
 *
 * It has to, because the reveal is a *sharp* cut-out against a *soft* field: until the
 * blur has built, there is no contrast between the two and the letters writing on are
 * invisible. Matching the blur to the full reveal wasted most of the write-on.
 */
export const BLUR_IN = 0.7;
export const WRITE_LEAD = 0.25; // blur gets this head start before the pen moves
export const FILL_BEAT = 1.0; // glyph dissolves to solid
export const BOUDHA_HOLD = SHARP_BEAT + REVEAL_BEAT + FILL_BEAT;
export const FADE = 0.7; // cross-dissolve length — must stay under HOLD so frames keep moving

// The SVG is both the mask and the stroked outline, so the two share one geometry —
// the PNG has different padding and would not line up with the drawn paths.
export const LOGO_SRC = "/Logo/logo-white.svg";
export const LOGO_W = "min(94vw, 1150px)";

/**
 * The logo is an SVG, so it has no meaningful pixel size — these numbers exist only so
 * Next can reserve the right aspect box before it loads. The rendered width is
 * `LOGO_W` above; the ratio is what matters here.
 */
export const LOGO_INTRINSIC = { width: 1200, height: 400 };



/**
 * Two mask layers, intersected.
 *
 * Layer 1 is the logo. Layer 2 is a soft-edged wipe, three viewports wide, whose
 * horizontal position the timeline animates — sliding it from 100% to 0% walks the
 * boundary across the mark, so the letterforms reveal left to right as if written.
 * There is no drawn line anywhere: the interior appearing IS the drawing.
 *
 * `intersect` is what makes it work — a pixel shows only where the logo says yes AND
 * the wipe has already passed. The element itself is full-bleed and never transformed,
 * so what shows through is exactly the frame behind it, pixel for pixel.
 */
/**
 * The wipe is exactly TWO viewports wide, and that number is load-bearing.
 *
 * With a layer of width 2W at `mask-position: x%`, the visible window covers gradient
 * fractions [x/200, 0.5 + x/200] — always half the gradient, sliding linearly with x.
 * So a gradient that is opaque over its first half and clear over its second half is
 * fully hidden at x=100 and fully shown at x=0, with the boundary crossing the mark
 * evenly in between.
 *
 * A 3W layer (the first attempt) does not have that property: the reveal edge only
 * enters the frame after the first third of the travel, and at x=0 the right end of
 * the mark is still sitting in the gradient's fade, so it never reaches full opacity.
 */
const WIPE = "linear-gradient(to right, #000 0 48%, transparent 52% 100%)";
export const WIPE_HIDDEN = "100%";

export const wipeMask = (x: string): React.CSSProperties => ({
  WebkitMaskImage: `url(${LOGO_SRC}), ${WIPE}`,
  maskImage: `url(${LOGO_SRC}), ${WIPE}`,
  WebkitMaskRepeat: "no-repeat, no-repeat",
  maskRepeat: "no-repeat, no-repeat",
  WebkitMaskPosition: `center, ${x} center`,
  maskPosition: `center, ${x} center`,
  WebkitMaskSize: `${LOGO_W}, 200% 100%`,
  maskSize: `${LOGO_W}, 200% 100%`,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
});

/**
 * What the mask becomes the instant the write-on finishes: the logo alone, no wipe
 * layer. The gradient carries a soft edge so the very end of the travel would leave
 * the last few percent of the mark fractionally translucent; swapping to this makes
 * the finished state exactly opaque instead of almost.
 */
export const LOGO_ONLY: React.CSSProperties = {
  WebkitMaskImage: `url(${LOGO_SRC})`,
  maskImage: `url(${LOGO_SRC})`,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskSize: LOGO_W,
  maskSize: LOGO_W,
  WebkitMaskComposite: "source-over",
  maskComposite: "add",
};

export const LOGO_MASK = wipeMask(WIPE_HIDDEN);

// Scroll lock lives on <html>: body carries `overflow-x: hidden` from globals.css,
// so clearing an inline overflow on body does not reliably give scrolling back.
export const lockScroll = () => {
  document.documentElement.style.overflow = "hidden";
};
export const unlockScroll = () => {
  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
};
