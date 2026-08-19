"use client";

import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { Photo } from "@/components/media/Photo";
import { Label } from "@/components/ui";
import { STORY } from "../data/copy";

/**
 * The road south — five beats, choreographed.
 *
 * Rebuilt against the motion-design framework, which named what was wrong with both
 * previous versions of this section.
 *
 * **Personality: Premium.** Chosen once and applied throughout — 350–600ms, zero
 * overshoot, decelerating entrances. Nothing on this site bounces, and a single
 * bouncing element here would read as a different brand. The signature curve is the
 * site's own `--ease-brand`, cubic-bezier(0.22, 1, 0.36, 1), rather than Premium's
 * generic (0.4, 0, 0.2, 1): the framework's rule is *one* curve for 80% of animations,
 * and this site already had one.
 *
 * **Three layers, which is what was missing.** The framework is explicit that flat
 * animation means missing layers, and both earlier builds had only the first:
 *
 *   Primary   the photograph arrives — position + opacity, 600ms, decelerating
 *   Secondary number, title and line follow in a 90ms stagger, 420ms each
 *   Ambient   the giant ghost numeral drifts counter to the image, continuously
 *
 * **Counter-motion.** The ambient numeral moves *against* the photograph at roughly a
 * quarter of its rate. The framework calls for this explicitly — hero one way, ambient
 * the other at 20–30% — and it is what stops a page of parallax reading as one sheet
 * of glass sliding about.
 *
 * **Stagger budget.** 90ms between elements, four elements, 270ms total — inside the
 * 400ms "standard" budget and well inside the 500ms hard ceiling.
 *
 * **1/3 rule.** Each beat owns its own trigger and animates alone, so no more than one
 * of five is ever in motion. Travel is 40px, nowhere near a third of the viewport.
 *
 * **Emotion: calm, elegance.** The brief asks for "peaceful, meditative", "like a
 * dream". That maps to long, controlled, decelerating motion with gentle curves — not
 * to speed, and not to the reader having to drag anything.
 */
export function StorySection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (reduced()) {
      gsap.set(el.querySelectorAll("[data-beat] > *"), { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-beat]").forEach((beat) => {
        const frame = beat.querySelector("[data-frame]");
        const lines = beat.querySelectorAll("[data-copy]");

        // Primary → secondary, on one timeline so the order can never drift.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: beat, start: "top 78%", once: true },
        });

        tl.fromTo(
          frame,
          { yPercent: 6, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "brand" },
        ).fromTo(
          lines,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.42, ease: "brand", stagger: 0.09 },
          // Overlapped, not queued: the copy starts while the frame is still settling,
          // which is what makes it read as one arrival rather than two.
          0.18,
        );

        // Ambient: the numeral drifts against the frame, continuously, at a quarter
        // of the rate. Scrubbed, so it is tied to the reader rather than looping.
        gsap.fromTo(
          beat.querySelector("[data-ghost]"),
          { yPercent: -12 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: beat,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="story" className="w-full overflow-hidden bg-canvas py-24 lg:py-32">
      <div className="mx-auto w-full shell-max shell-px">
        <div data-beat className="mb-20 lg:mb-32">
          <Label data-copy className="opacity-65">The road south</Label>
          <h2
            data-copy
            className="font-display mt-6 max-w-[18ch] text-[clamp(2rem,5vw,4.5rem)] leading-[1.02]"
          >
            The road south, and then a door
          </h2>
        </div>

        {STORY.map((beat, i) => {
          const flip = i % 2 === 1;
          return (
            <div
              key={beat.n}
              data-beat
              className={`relative mb-24 lg:mb-40 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 ${
                flip ? "" : ""
              }`}
            >
              {/* Ambient — the third layer. Hidden from assistive tech: the number is
                  already announced beside the title. */}
              <span
                data-ghost
                aria-hidden="true"
                className={`font-display pointer-events-none absolute top-1/2 -z-0 select-none text-[28vw] leading-none text-ink/[0.05] lg:text-[16vw] ${
                  flip ? "left-0" : "right-0"
                }`}
              >
                {beat.n}
              </span>

              <div
                data-frame
                className={`relative z-10 ${
                  flip ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-7"
                }`}
              >
                <Photo
                  src={beat.photo}
                  alt={beat.alt}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  loading={i < 2 ? "eager" : "lazy"}
                  className="aspect-[4/3] w-full"
                />
              </div>

              <div
                className={`relative z-10 mt-8 lg:mt-0 ${
                  flip ? "lg:col-span-4 lg:col-start-1 lg:row-start-1" : "lg:col-span-4 lg:col-start-9"
                }`}
              >
                <Label data-copy className="opacity-40">{beat.n}</Label>
                <h3
                  data-copy
                  className="font-display mt-4 text-[clamp(1.75rem,3vw,2.75rem)] leading-none"
                >
                  {beat.title}
                </h3>
                <p data-copy className="text-body mt-5 max-w-[38ch] opacity-75">
                  {beat.line}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
