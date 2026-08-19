"use client";

import { useEffect, useRef } from "react";
import { gsap, reduced } from "../../lib/gsap";

/**
 * A long passage that inks in as it crosses the viewport — scrubbed, so the reading
 * is tied to the scroll rather than firing once. Words rather than characters: at
 * paragraph length, per-character would take longer to finish than anyone will wait.
 */
export function RevealParagraph({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    if (reduced()) {
      gsap.set(words, { opacity: 1 });
      return;
    }

    const tween = gsap.fromTo(
      words,
      { opacity: 0.18 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "bottom 55%",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} data-word className="inline-block">
          {word}
          <span>&nbsp;</span>
        </span>
      ))}
    </p>
  );
}
