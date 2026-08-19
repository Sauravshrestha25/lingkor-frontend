"use client";

import { useEffect, useRef } from "react";
import { gsap, reduced } from "../../lib/gsap";
import { afterIntro } from "@/features/preloader/gate";

/**
 * Display type revealed one character at a time.
 *
 * Split by word first, then by character *within* each word, with the word as the
 * non-breaking unit — splitting a line straight into characters lets the browser wrap
 * mid-word, which looks like a bug the moment the viewport narrows.
 *
 * Screen readers get the whole string from `aria-label`; the per-character spans are
 * hidden from them, otherwise the line is announced letter by letter.
 */
export function SplitChars({
  lines,
  className = "",
  delay = 0,
  stagger = 0.022,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>("[data-char]");
    if (reduced()) {
      gsap.set(chars, { yPercent: 0, opacity: 1 });
      return;
    }

    // Same hold as Rise — see `afterIntro`.
    let tween: gsap.core.Tween | undefined;
    const stopWaiting = afterIntro(() => {
      tween = gsap.fromTo(
      chars,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        delay: delay / 1000,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      },
      );
    });

    return () => {
      stopWaiting();
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [delay, stagger]);

  return (
    <div ref={ref} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, li) => (
        <span key={li} data-notrim className="block pb-[0.12em]">
          {line.split(" ").map((word, wi) => (
            <span
              key={wi}
              aria-hidden="true"
              className="inline-block whitespace-nowrap"
            >
              {[...word].map((ch, ci) => (
                <span key={ci} data-char className="inline-block opacity-0">
                  {ch}
                </span>
              ))}
              {/* Real space between words, outside the no-wrap unit. */}
              <span data-char className="inline-block opacity-0">
                &nbsp;
              </span>
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
