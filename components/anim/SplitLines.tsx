"use client";

import { useEffect, useRef } from "react";
import { gsap, reduced } from "../../lib/gsap";

/**
 * Display type that rises line by line from behind a mask. Used on the big headings
 * only; on body copy it would read as a gimmick.
 */
export function SplitLines({
  lines,
  className = "",
  delay = 0,
}: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.querySelectorAll<HTMLElement>("[data-line]");
    if (reduced()) {
      gsap.set(inner, { yPercent: 0, opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      inner,
      { yPercent: 118, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.25,
        delay: delay / 1000,
        ease: "power4.out",
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        // Overflow hidden per line is what makes it a rise rather than a fade.
        <span key={i} data-notrim className="block overflow-hidden pb-[0.12em]">
          <span data-line className="block opacity-0">
            {line}
          </span>
        </span>
      ))}
    </div>
  );
}
