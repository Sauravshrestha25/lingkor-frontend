"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

// One registration point. Importing the plugins in each component re-registers them
// on every mount and makes the load order a guessing game.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Draggable);

  // The site's signature curve, registered by name so components ask for "brand"
  // rather than restating the bezier. Same value as `--ease-brand` in globals.css —
  // one curve, one definition, whether it is CSS or GSAP driving it.
  gsap.registerEase("brand", (p) => {
    // cubic-bezier(0.22, 1, 0.36, 1), solved for y at x = p.
    const cx = 3 * 0.22, bx = 3 * (0.36 - 0.22) - cx, ax = 1 - cx - bx;
    const cy = 3 * 1, by = 3 * (1 - 1) - cy, ay = 1 - cy - by;
    let t = p;
    for (let i = 0; i < 8; i++) {
      const x = ((ax * t + bx) * t + cx) * t - p;
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(x) < 1e-6 || d === 0) break;
      t -= x / d;
    }
    return ((ay * t + by) * t + cy) * t;
  });
}

/** True when the visitor has asked the OS to cut animation. */
export const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, Draggable };
