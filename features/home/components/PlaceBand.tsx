"use client";

import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { Photo } from "@/components/media/Photo";

/**
 * Boudhanath, full width, moving slower than the page.
 *
 * The band lands straight after the road south, whose last beat is "all of it, behind a
 * wall in Boudha" — so the cut is from that door to the thing on the other side of it,
 * at full width, with the journey over. No heading, no caption, no overlay: the
 * sentence has just been made, and a label here would only re-make it in smaller type.
 *
 * The photograph is a long exposure. The stupa is sharp and the crowd walking the kora
 * around its base is dragged into a band of motion — which is the one image on the site
 * that shows what the hotel is named after actually happening.
 *
 * **How the parallax is built.** The frame is `overflow-hidden` at a fixed height, and
 * the picture inside it is deliberately taller than the frame — 130% — and hung so the
 * surplus splits evenly above and below. That surplus is the whole travel budget, and
 * the numbers have to be checked against each other rather than picked to taste:
 *
 *     half the slack   = 15% of the frame
 *     the excursion    = 10% of the *image*, and the image is 1.3 frames = 13%
 *
 * 13 < 15, so the frame stays covered at both ends of the travel with a little to
 * spare. The first version of this ran ±12% against a 128% image — 15.4% against a
 * 14% budget — and uncovered a 12px strip of the frame at full excursion. Building it
 * the other way round (move an exactly-fitting image and hope) is how parallax bands
 * end up flashing their background at one scroll position or another.
 *
 * `yPercent`, not `y` — a percentage of the element's own height survives every resize,
 * where a pixel figure is only correct at the width it was written for.
 */
export function PlaceBand() {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!frame.current || !inner.current || reduced()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          // Linear, because the scroll position *is* the timeline. An ease here would
          // make the picture drift at a different rate than the reader's own scrolling,
          // which reads as lag rather than as depth.
          ease: "none",
          scrollTrigger: {
            trigger: frame.current,
            // clamp() keeps the range inside the document, so the band is not stuck
            // mid-travel when it happens to sit near the top or foot of the page.
            start: "clamp(top bottom)",
            end: "clamp(bottom top)",
            scrub: 0.8,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={frame}
      className="relative w-full overflow-hidden bg-ink h-[58svh] lg:h-[82svh]"
    >
      <div ref={inner} className="absolute inset-x-0 -top-[15%] h-[130%]">
        <Photo
          src="/images/boudhanath.webp"
          alt="The stupa at Boudhanath, the evening kora blurred to a band of movement around its base"
          sizes="100vw"
          className="h-full w-full"
          imgClassName="object-[50%_38%]"
        />
      </div>
    </div>
  );
}
