"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reduced } from "../lib/gsap";
import { registerLenis } from "../lib/lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Long, soft tail — the site's whole argument is that nothing is in a hurry.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 4,
    });

    // Published so that pinned, gesture-driven sections can hand the wheel back and
    // forth instead of scrolling behind Lenis's back — see lib/lenis.ts.
    registerLenis(lenis);

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
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
