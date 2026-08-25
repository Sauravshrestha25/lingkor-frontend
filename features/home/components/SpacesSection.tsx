"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { Button } from "@/components/shared/button";
import { gsap, Observer, reduced, ScrollTrigger } from "@/lib/gsap";
import { SPACES } from "@/features/spaces/data/spaces";
import { jumpTo, pauseLenis, resumeLenis } from "@/lib/lenis";

/** A pinned circuit that advances one complete panel per wheel or swipe gesture. */
export function SpacesSection() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = root.current;
    const pin = stage.current;
    if (!section || !pin || reduced()) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-space-panel]");
      gsap.set(panels, {
        visibility: "visible",
        clipPath: "inset(0% 0% 0% 0%)",
      });

      let current = 0;
      let animating = false;
      let gestureActive = false;
      let queuedDirection: 1 | -1 | null = null;

      const leaveSection = (direction: 1 | -1) => {
        gestureActive = false;
        queuedDirection = null;
        observer.disable();
        // Lenis gets the wheel back *before* the jump, or it is still stopped when the
        // page lands and the visitor is left on a page that will not scroll.
        resumeLenis();
        // Move just beyond the pinned range so the same trigger does not immediately
        // capture the gesture again at either boundary.
        //
        // ⚠️ Through Lenis, never `window.scrollTo`. Lenis holds its own scroll
        // position and re-applies it every frame, so a native jump is undone on the
        // next tick — the page lurched out of the section and was dragged straight
        // back in, which is exactly what "stuck" looked like.
        jumpTo(direction > 0 ? pinTrigger.end + 2 : pinTrigger.start - 2);
      };

      const goTo = (next: number, direction: 1 | -1) => {
        if (animating) {
          // Keep one deliberate follow-up gesture instead of throwing it away. This
          // matters most on the final panel, where a discarded input felt like the
          // section had become stuck.
          queuedDirection = direction;
          return;
        }
        if (next === panels.length) return leaveSection(1);
        if (next < 0) return leaveSection(-1);

        animating = true;
        const target = direction > 0 ? panels[current] : panels[next];

        gsap.to(target, {
          clipPath:
            direction > 0 ? "inset(0% 0% 100% 0%)" : "inset(0% 0% 0% 0%)",
          // 1.9s was most of the reason this felt like work: a panel took nearly two
          // seconds, and nothing could be asked of it until that finished.
          duration: 1.05,
          ease: "power4.inOut",
          overwrite: true,
          onComplete: () => {
            current = next;
            animating = false;
            // Release the gesture lock here as well as on `onStop`.
            //
            // It used to be released *only* when Observer reported that movement had
            // stopped (0.18s after the last event). Nobody scrolls that way: keep the
            // wheel or trackpad moving and `onStop` never fires, so every gesture
            // after the first was dropped and the section only advanced if you came
            // to a complete halt and started again — once per panel. Freeing it when
            // the wipe lands means a sustained scroll advances at the animation's own
            // cadence, and a single flick still moves exactly one panel.
            gestureActive = false;

            if (queuedDirection !== null) {
              const queued = queuedDirection;
              queuedDirection = null;
              goTo(current + queued, queued);
            }
          },
        });
      };

      const handleGesture = (direction: 1 | -1) => {
        // A trackpad emits many wheel events for one physical movement. Accept only
        // the first until Observer reports that movement has stopped.
        if (gestureActive) return;
        gestureActive = true;
        goTo(current + direction, direction);
      };

      const observer = Observer.create({
        type: "wheel,touch,pointer",
        // Normalise a downward wheel gesture with an upward finger swipe: both
        // advance to the next panel.
        wheelSpeed: -1,
        preventDefault: true,
        allowClicks: true,
        tolerance: 8,
        onDown: () => handleGesture(-1),
        onUp: () => handleGesture(1),
        onStopDelay: 0.18,
        onStop: () => {
          gestureActive = false;
        },
        onEnable: () => {
          gestureActive = false;
        },
      });
      observer.disable();

      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        // This is a safety runway for wheel/trackpad momentum, not animation
        // progress. Observer still advances exactly one complete panel per gesture;
        // no panel property is tied to this distance and there is no scrub.
        end: `+=${panels.length * 100}%`,
        pin,
        anticipatePin: 0,
        // Entering from either end: park just inside the pinned range, take the
        // wheel off Lenis, and let Observer drive the panels.
        //
        // `pauseLenis` is the other half of the fix. `preventDefault` on the Observer
        // stops the *browser* scrolling, but Lenis scrolls from JavaScript and never
        // sees a cancelled event — so both were driving the page at once and the pin
        // ran away while the panels were still advancing.
        onEnter: (self) => {
          jumpTo(self.start + 1);
          pauseLenis();
          observer.enable();
        },
        onEnterBack: (self) => {
          jumpTo(self.end - 1);
          pauseLenis();
          observer.enable();
        },
        // Any other way out of the pin — an anchor jump, a resize, a refresh — must
        // also give the wheel back. A Lenis left stopped is a page that cannot be
        // scrolled at all, so every exit resumes it, not just the gesture path.
        onLeave: () => {
          observer.disable();
          resumeLenis();
        },
        onLeaveBack: () => {
          observer.disable();
          resumeLenis();
        },
      });
    }, section);

    return () => {
      // Unmounting mid-section would otherwise strand Lenis in its stopped state and
      // leave the entire site unscrollable until a reload.
      resumeLenis();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} aria-label="The hotel is a circuit">
      <div
        ref={stage}
        className="relative home-knot-gutters  home-knot-gutters-over h-svh min-h-160 overflow-hidden"
      >
        {SPACES.map((space, index) => {
          const textColor =
            space.id === "namkha" ? "var(--color-ink)" : space.field;

          return (
            <article
              key={space.id}
              id={space.id}
              data-space-panel
              className={`absolute inset-0 ${index === 0 ? "visible" : "invisible"}`}
              style={{
                color: textColor,
                zIndex: SPACES.length - index,
              }}
            >
              <div
                data-space-background
                className="absolute inset-0"
                style={{
                  backgroundColor: `color-mix(in srgb, ${space.field} 14%, var(--color-canvas))`,
                }}
              />

              <div className="relative mx-auto grid h-full w-full grid-cols-1 content-center gap-8 py-20 shell-max shell-px md:grid-cols-12 md:items-center md:gap-10 lg:gap-16">
                <div className="md:col-span-5">
                  <p className="mt-8 text-label uppercase opacity-70">
                    {space.role} · {space.element}
                  </p>
                  <h2 className="mt-4 font-display text-[clamp(3rem,7vw,7rem)] leading-[0.9]">
                    {space.name}
                  </h2>
                  <p className="text-body mt-7 max-w-[38ch]">{space.line}</p>

                  <div className="mt-8 flex justify-start">
                    <Button asChild hoverScale={1.03} tapScale={0.97}>
                      <Link
                        href="#enquire"
                        data-notrim
                        className="text-label font-body inline-flex min-h-14 items-center justify-center border px-5 py-4 text-md leading-none uppercase transition-opacity duration-300 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4"
                        style={{
                          backgroundColor: space.field,
                          borderColor:
                            space.id === "namkha"
                              ? "var(--color-ink)"
                              : space.field,
                          color:
                            space.displayOnField === "white"
                              ? "var(--color-space)"
                              : "var(--color-ink)",
                        }}
                      >
                        <span className="translate-y-[0.36em]">Book now</span>
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-7">
                  <Photo
                    src={space.image}
                    alt={`${space.name}, ${space.role}`}
                    sizes="(max-width: 768px) 100vw, 58vw"
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-[34svh] min-h-56 w-full md:h-[58svh]"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
