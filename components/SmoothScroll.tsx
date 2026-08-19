"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reduced } from "../lib/gsap";

/**
 * Lenis drives the scroll; GSAP's ticker drives Lenis. Wiring it the other way — two
 * independent rAF loops — is what makes pinned sections judder, because ScrollTrigger
 * reads a scroll position that Lenis has already moved on from.
 *
 * Also owns every `href="#…"` click on the page. Lenis does not intercept anchor
 * navigation by itself: left alone, a nav link does a native instant jump, and
 * Lenis's next rAF tick fights it back toward wherever its own state last was — the
 * page stutters, and anything reading scrollY (the navbar's colour switch, any
 * ScrollTrigger) reads a value that is about to be overwritten. Routing every anchor
 * through `lenis.scrollTo` keeps one authority for "where the page actually is".
 *
 * Mounted once in the layout. Renders nothing.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Long, soft tail — the site's whole argument is that nothing is in a hurry.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
