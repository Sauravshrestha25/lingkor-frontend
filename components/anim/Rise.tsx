"use client";

import { useEffect, useRef } from "react";
import { gsap, reduced } from "../../lib/gsap";

/**
 * The house reveal: 28px rise, 1.1s, on entry. Replaces the CSS/IntersectionObserver
 * version now that GSAP drives every other motion on the page — one timeline authority
 * means pinned sections and reveals cannot disagree about scroll position.
 */
export function Rise({
  children,
  delay = 0,
  y = 28,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "figure" | "li" | "section" | "header";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        delay: delay / 1000,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, y]);

  return (
    // @ts-expect-error — one ref type across the small set of tags above.
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}
