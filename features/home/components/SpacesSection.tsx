"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Photo } from "@/components/media/Photo";
import { Button } from "@/components/shared/button";
import { gsap, Observer, reduced, ScrollTrigger } from "@/lib/gsap";
import { SPACES } from "@/features/spaces/data/spaces";
import { jumpTo, pauseLenis, resumeLenis } from "@/lib/lenis";
import { setSpacesNav } from "@/features/home/spacesNav";

// Netsang and Namkha are pale grounds and read best with ink text; every other space
// is its own full, saturated field colour, which needs light (white) text/navbar.
const isPaleGround = (id: string) => id === "netsang" || id === "namkha";

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
        resumeLenis();
        jumpTo(direction > 0 ? pinTrigger.end + 2 : pinTrigger.start - 2);
      };

      const goTo = (next: number, direction: 1 | -1) => {
        if (animating) {
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
          duration: 1.05,
          ease: "power4.inOut",
          overwrite: true,
          onComplete: () => {
            current = next;
            animating = false;
            gestureActive = false;
            setSpacesNav({ active: true, dark: !isPaleGround(SPACES[current].id) });

            if (queuedDirection !== null) {
              const queued = queuedDirection;
              queuedDirection = null;
              goTo(current + queued, queued);
            }
          },
        });
      };

      const handleGesture = (direction: 1 | -1) => {
        if (gestureActive) return;
        gestureActive = true;
        goTo(current + direction, direction);
      };

      const observer = Observer.create({
        type: "wheel,touch,pointer",
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
        end: `+=${panels.length * 100}%`,
        pin,
        anticipatePin: 0,
        onEnter: (self) => {
          jumpTo(self.start + 1);
          pauseLenis();
          observer.enable();
          setSpacesNav({ active: true, dark: !isPaleGround(SPACES[current].id) });
        },
        onEnterBack: (self) => {
          jumpTo(self.end - 1);
          pauseLenis();
          observer.enable();
          setSpacesNav({ active: true, dark: !isPaleGround(SPACES[current].id) });
        },
        onLeave: () => {
          observer.disable();
          resumeLenis();
          setSpacesNav({ active: false, dark: false });
        },
        onLeaveBack: () => {
          observer.disable();
          resumeLenis();
          setSpacesNav({ active: false, dark: false });
        },
      });
    }, section);

    return () => {
      resumeLenis();
      setSpacesNav({ active: false, dark: false });
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
          const textColor = isPaleGround(space.id)
            ? "var(--color-ink)"
            : "var(--color-namkha)";

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
                  backgroundColor:
                    space.id === "netsang"
                      ? "var(--color-netsang)"
                      : space.id === "namkha"
                        ? "var(--color-namkha2)"
                        : space.field,
                }}
              />

              <div className="relative mx-auto grid h-full w-full grid-cols-1 content-center gap-8 py-20 shell-max shell-px md:grid-cols-12 md:items-center md:gap-10 lg:gap-16">
                <div className="md:col-span-5">
                  <p className="mt-8 text-label uppercase opacity-90">
                    {space.role} · {space.element}
                  </p>
                  <h2 className="mt-4 font-display text-[clamp(1.75rem,3.5vw,3.5rem)] leading-[0.9]">
                    {space.name}
                  </h2>
                  <p className="text-body mt-7 max-w-[38ch]">{space.line}</p>

                  <div className="mt-8 flex justify-start">
                    <Button asChild hoverScale={1.01} tapScale={0.99}>
                      <Link
                        href={`/spaces#${space.id}`}
                        data-notrim
                        className="text-label font-body min-h-14 uppercase"
                      >
                        <span className="text-trim">View Details</span>
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
