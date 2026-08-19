"use client";

import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { Photo, LineArt } from "@/components/media/Photo";
import { Label } from "@/components/ui";
import { STORY } from "../data/copy";

/**
 * The road south — the caravan comes down the margin while the story passes.
 *
 * **Why this is not a carousel.** It was one, three times, and each one was wrong for a
 * reason that had nothing to do with how it was built: the page already runs drag rails
 * for spaces, for rooms and for voices. A fourth made the story read as more inventory.
 * The beats are a sequence you move *through*, not a set you pick from — so they are set
 * as ordinary scroll, and the only thing that animates is the journey itself.
 *
 * **The commissioned drawing is the mechanism.** `caravan-ink` is a yak train switching
 * back down from a fort, each animal larger than the one above it — the artist already
 * drew the descent, and drew it at 592×1600, which is a margin. It is held sticky and
 * unclipped from the top down as the section scrolls, so the caravan arrives at the
 * bottom of its own path at the moment beat 05 arrives at the door in Boudha. One
 * continuous move, tied to the reader's own scrolling, with nothing taken over.
 *
 * Note the clip runs top-to-bottom, matching the direction of travel in the drawing.
 * Every other reveal on this site opens upward; this one would fight the picture.
 *
 * **The beats are deliberately uneven.** Equal cards in a column is a list, and a list
 * is what the last version failed at horizontally. Widths and indents come from
 * `SHAPE` — a wide plate, two narrow ones held in from opposite sides, then the door at
 * full width. Nothing shares an edge with the beat above it.
 */

/** Per-beat frame: width of the plate, indent from the column's left, crop shape. */
const SHAPE = [
  { w: "lg:w-[64%]", x: "lg:ml-0", ratio: "aspect-[5/4]" },
  { w: "lg:w-[38%]", x: "lg:ml-[44%]", ratio: "aspect-[3/4]" },
  { w: "lg:w-[52%]", x: "lg:ml-[8%]", ratio: "aspect-[4/3]" },
  { w: "lg:w-[36%]", x: "lg:ml-[52%]", ratio: "aspect-[3/4]" },
  { w: "lg:w-[80%]", x: "lg:ml-0", ratio: "aspect-[16/10]" },
] as const;

export function StorySection() {
  const root = useRef<HTMLElement>(null);
  const trail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced()) return;

    const ctx = gsap.context(() => {
      // The descent. Scrubbed rather than played, so the caravan moves at exactly the
      // reader's pace — it is their scrolling that walks it down, not a timer.
      if (trail.current) {
        gsap.fromTo(
          trail.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 62%",
              // Ends on the last beat rather than the section's foot, so the caravan
              // completes against the door and not against empty margin.
              endTrigger: "[data-beat]:last-child",
              end: "bottom 78%",
              scrub: 0.6,
            },
          },
        );
      }

      // Secondary layer: each plate opens as it arrives. Same language as the About
      // section — a frame unclipping, never a fade-and-rise.
      gsap.utils.toArray<HTMLElement>("[data-plate]").forEach((plate) => {
        gsap.fromTo(
          plate,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: plate, start: "top 85%", once: true },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={root} className="w-full bg-canvas section-y">
      <div className="mx-auto w-full shell-max shell-px">
        <div>
          <Label className="opacity-65">The road south</Label>
          {/*
            The measure is in `em`, so it is a multiple of *this heading's own size* and
            holds the same three-or-four words per line at every width. It was `22ch` on
            a parent, which broke the line after every single word: `ch` is the width of
            the zero glyph, Hasweny's is narrow, and the parent resolved it against body
            type while the heading rendered several times larger.
          */}
          <h2 className="font-display mt-6 max-w-[13em] text-section">
            Everything here came down the same road
          </h2>
        </div>

        <div className="mt-20 lg:mt-28 lg:grid lg:grid-cols-12 lg:gap-12">
          {/* ── The descent, in the margin ──────────────────────────────────
              Sticky, so it holds while the beats move past it. `self-start` is
              what makes that work in a grid: a stretched track item is already
              the height of the row and has nowhere to stick to. */}
          <div className="lg:col-span-3 lg:self-start lg:sticky lg:top-[14vh]">
            <div
              ref={trail}
              aria-hidden="true"
              className="mx-auto w-[42%] sm:w-[30%] lg:mx-0 lg:w-full"
            >
              <LineArt
                name="caravan"
                tone="ink"
                className="h-auto w-full opacity-70"
              />
            </div>
          </div>

          {/* ── The beats ──────────────────────────────────────────────────── */}
          <div className="mt-16 lg:col-span-8 lg:col-start-5 lg:mt-0">
            {STORY.map((beat, i) => {
              const s = SHAPE[i];
              return (
                <article
                  key={beat.n}
                  data-beat
                  className={i > 0 ? "mt-20 lg:mt-28" : ""}
                >
                  <div className={`${s.w} ${s.x}`}>
                    <div data-plate>
                      <Photo
                        src={beat.photo}
                        alt={beat.alt}
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        loading={i < 2 ? "eager" : "lazy"}
                        className={`${s.ratio} w-full`}
                      />
                    </div>

                    <div className="mt-6 flex gap-5">
                      <Label className="shrink-0 pt-1.5 opacity-40">
                        {beat.n}
                      </Label>
                      <div>
                        <h3 className="font-display text-sub">
                          {beat.title}
                        </h3>
                        <p className="text-body mt-3 max-w-[34ch] opacity-75">
                          {beat.line}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
