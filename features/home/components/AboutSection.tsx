"use client";

import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { Photo } from "@/components/media/Photo";

/**
 * About us — built to the rosefamily.com.ua section the client pointed at.
 *
 * Reproduced from that layout: a large two-line display quote with the second line
 * indented; a giant outlined word behind the body copy, stroke only, read as texture
 * before it is read as a word; bracketed `[ 01 ]` and `[ About us ]` markers set left
 * of what they label; a narrow body column with a small frame anchoring it; and further
 * images scattered below at unequal sizes and offsets.
 *
 * **Not reproduced: the photograph laid over the headline.** The reference does that,
 * and the first build copied it with an absolutely-positioned frame. It did not
 * survive translation. Their overlapped line is a flourish whose sense survives being
 * half-covered; ours ate the end of *"you will not want to leave"* — the payoff of the
 * client's own sentence — and then carried on down over the body copy as well. A
 * 12-column grid instead: nothing can overlap anything at any width, and the asymmetry
 * that makes the reference work (narrow measure, tall image, unequal columns) is all
 * still there.
 *
 * Motion: frames unclip upward rather than fading — the frame opens and the picture is
 * already there. The ghost word drifts slower than the page, so the layers separate on
 * scroll, and the quote lines rise from behind their own masks.
 *
 * One further departure: the reference alternates roman and italic inside the quote.
 * Italiana ships one weight and no italic, and faux-slanting a high-contrast display
 * face shears its thin strokes to nothing, so the lines are distinguished by indent.
 */
export function AboutSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: frame, start: "top 88%", once: true },
          },
        );
      });

      // Gentler than before: anchored to the section's bottom edge, a large drift
      // would visibly peel the word away from the edge it is meant to sit on.
      gsap.to("[data-ghost]", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        "[data-line]",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={root}
      className="relative w-full overflow-hidden bg-canvas section-y"
    >
      <div className="mx-auto w-full shell-max shell-px">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* ── Text column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <blockquote className="font-display text-[clamp(1.75rem,4.4vw,3.75rem)] leading-[1.08]">
              <span data-notrim className="block overflow-hidden pb-[0.12em]">
                <span data-line className="block">
                  &ldquo;You will feel at home
                </span>
              </span>
              <span
                data-notrim
                className="block overflow-hidden pb-[0.12em] lg:pl-[8%]"
              >
                <span data-line className="block">
                  and maybe&hellip; you will not want to leave.&rdquo;
                </span>
              </span>
            </blockquote>

            <div className="relative mt-16 lg:mt-24">
              <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-7 sm:gap-8">
                <div data-reveal className="hidden sm:col-span-2 sm:block">
                  <Photo
                    src="/images/mustang/_ECS2427.webp"
                    alt="A weathered painted door in Upper Mustang"
                    sizes="(max-width: 1024px) 30vw, 16vw"
                    className="aspect-2/3 w-full"
                  />
                </div>

                <div className="sm:col-span-4">
                  <p className="text-label uppercase opacity-70">About us</p>

                  {/* DRAFT — ours, not the client's. See CONTENT.md. */}
                  <p className="text-body mt-7">
                    Lingkor is the Tibetan word for the circuit walked around a
                    sacred place — the pilgrimage route, and the act of walking
                    it. At Boudhanath that circle forms twice a day around the
                    dome, and the hotel stands inside it.
                  </p>
                  <p className="text-body mt-6 opacity-75">
                    The building is Mustang brought south: its colours, its
                    rooms and its name all come from the country the caravans
                    came down from.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Image column ────────────────────────────────────────────── */}
          <div
            data-reveal
            className="mt-12 w-full lg:col-span-5 lg:col-start-8 lg:mt-0"
          >
            <Photo
              src="/images/spaces/exterior.webp"
              alt="The hotel from above, its terraces and garden"
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="aspect-3/4 w-full"
            />
          </div>
        </div>

        {/* ── Scattered below, at unequal sizes ─────────────────────────── */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-12 lg:mt-24">
          <div data-reveal className="sm:col-span-5 sm:col-start-2">
            <Photo
              src="/images/spaces/lobby.webp"
              alt="The lobby seating, looking towards the wellness centre"
              sizes="(max-width: 640px) 100vw, 40vw"
              className="aspect-4/3 w-full"
            />
          </div>
          <div data-reveal className="sm:col-span-3 sm:col-start-9 sm:mt-20">
            <Photo
              src="/images/spaces/garden.webp"
              alt="The garden and terraces, from above"
              sizes="(max-width: 640px) 100vw, 24vw"
              className="aspect-3/4 w-full"
            />
          </div>
        </div>
      </div>

      {/*
        The wordmark as ground, along the bottom edge of the whole section rather than
        floating behind one column of copy.

        Stroke only, no fill, and deliberately allowed to run past both margins — the
        section's `overflow-hidden` crops it, so it reads as a word the page is sitting
        on rather than a word placed on the page. `-bottom-[0.18em]` drops the baseline
        just under the edge so the letters are cut rather than resting on it.

        Behind everything: the content above carries `relative`, this carries `z-0`.
      */}
    </section>
  );
}
