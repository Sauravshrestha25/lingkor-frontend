/**
 * One answer to "may I start animating yet?".
 *
 * The entrance primitives (`Rise`, `SplitChars`) fire on a ScrollTrigger at ~88% of the
 * viewport with `once: true`. Anything above the fold is therefore already in view at
 * mount, so on the homepage the hero's reveal used to run *behind* the preloader and be
 * finished before the curtain lifted — you waited seven seconds to arrive at a hero that
 * had already animated.
 *
 * Hence a claim/finish handshake rather than a plain flag:
 *
 * - `claimIntro()` is called by the preloader in a **layout** effect, i.e. before any
 *   passive effect in the tree. If it is never called — no preloader on this route, or
 *   it decided to skip — the gate stays open and everything animates immediately.
 * - `afterIntro(cb)` runs `cb` now if nothing has claimed, otherwise when the intro
 *   finishes. It returns an unsubscribe so components can clean up.
 *
 * The gate must be released on EVERY exit the preloader has, including the skip button
 * and the reduced-motion bail-out. A page that animates nothing because a promise never
 * settled is worse than one with no intro at all — hence `NEVER_LONGER_THAN` below as a
 * backstop rather than releasing from the preloader's effect cleanup.
 *
 * ⚠️ Releasing on cleanup is what it looked like it should do, and it is wrong: React's
 * StrictMode mounts, tears down and remounts every effect in development, so the very
 * first teardown opened the gate ~200ms in and the hero animated behind the curtain
 * anyway. Cleanup cannot tell a StrictMode rehearsal from a real unmount.
 */
const EVENT = "lb:intro-finished";
const CLAIM_EVENT = "lb:intro-claimed";

let claimed = false;
let finished = false;

/**
 * Safety net, in milliseconds. If whoever claimed the gate never releases it — a thrown
 * timeline, a component torn down at the wrong moment — the page must still animate.
 * Comfortably longer than the intro itself.
 */
const NEVER_LONGER_THAN = 38_000;
let safety: number | undefined;

export function claimIntro() {
  claimed = true;
  window.clearTimeout(safety);
  safety = window.setTimeout(finishIntro, NEVER_LONGER_THAN);
  window.dispatchEvent(new Event(CLAIM_EVENT));
}

export function finishIntro() {
  if (finished) return;
  finished = true;
  window.clearTimeout(safety);
  window.dispatchEvent(new Event(EVENT));
}

export function afterIntro(cb: () => void): () => void {
  if (!claimed || finished) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}

/**
 * The `useSyncExternalStore` pair for "is the preloader currently up" — for chrome that
 * has to stay off the screen while it runs (the sound toggle: a persistent control
 * floating over the intro doubles the door's own With Sound / Silent Entry choice).
 *
 * Two events, not one: `finishIntro` already had `EVENT` to announce the close; without
 * `CLAIM_EVENT` a subscriber mounted before `claimIntro()` runs would never learn the
 * gate had shut, since nothing tells it "true" — only ever "false".
 */
export function isIntroActive() {
  return claimed && !finished;
}

export function subscribeIntroActive(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener(CLAIM_EVENT, cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener(CLAIM_EVENT, cb);
  };
}
