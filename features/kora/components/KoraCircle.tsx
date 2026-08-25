"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { playBell, unlockBell } from "@/lib/bell";
import { Label } from "@/components/ui";
import { fadeOutSiteSound, restoreSiteSound } from "@/features/preloader/audio";
import { CIRC, HOURS } from "../kora";
import { KoraRing } from "./KoraRing";

/**
 * The site's one literal illustration of its own name: Lingkor means walking the
 * circle around a sacred place, so a day is drawn as a circle you travel.
 *
 * What makes it more than a rotating dot:
 *
 * - **The light changes, and the section is pinned while it does.** Four skies —
 *   pre-dawn dark, flat daylight, low gold, then night — interpolated across two and a
 *   half screens of scroll rather than the moment the section takes to cross the
 *   viewport. That distance is the whole difference between a dawn and a jump cut.
 * - **A bell rings at each station** as the walk reaches it, muteable from the navbar.
 * - **Three rings, three speeds.** Counter-rotating like the tiers of a prayer wheel.
 * - **The lamps light** around the circuit as evening comes, and go out at midday.
 * - **Ringing a station sends a ripple** out across the whole drawing.
 *
 * Desktop + no-reduced-motion for the scrubbed walk; below that it is four moments in
 * a plain list, and the ring is static.
 */
/**
 * Resolve `var(--token)` to the concrete colour behind it.
 *
 * The hour data holds token references so the palette stays in `globals.css` — but
 * GSAP's colour parser understands hex, rgb, hsl and named colours, and nothing else.
 * Handed `var(--color-canvas)` it cannot interpolate at all, so the sky and the type
 * would snap between states instead of crossing between them. Reading the computed
 * value keeps one source of truth *and* gives the tween two real colours to travel
 * between.
 */
function resolveVar(value: string) {
  const name = value.match(/^var\((--[\w-]+)\)$/)?.[1];
  if (!name) return value;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    value
  );
}

export default function KoraCircle() {
  const sectionRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const ringSlowRef = useRef<SVGGElement>(null);
  const ringFastRef = useRef<SVGGElement>(null);
  const walkerRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGCircleElement>(null);
  const lampsRef = useRef<SVGGElement>(null);

  const [active, setActive] = useState(0);
  const [held, setHeld] = useState<number | null>(null);
  const [rung, setRung] = useState<number | null>(null);

  useEffect(() => unlockBell(), []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      { ok: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)" },
      (ctx) => {
        if (!ctx.conditions?.ok) return;
        let lastHour = -1;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",

            end: "+=240%",
            pin: true,

            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(
                HOURS.length - 1,
                Math.floor(self.progress * HOURS.length),
              );
              if (i === lastHour) return;

              lastHour = i;
              setActive(i);

              if (self.isActive) playBell(i);
            },
          },
        });

        tl.fromTo(
          pathRef.current,
          { strokeDashoffset: CIRC },
          { strokeDashoffset: 0, ease: "none", duration: 1 },
          0,
        );

        tl.fromTo(
          ringSlowRef.current,
          { rotation: 0 },
          {
            rotation: -140,
            transformOrigin: "50% 50%",
            ease: "none",
            duration: 4,
          },
          0,
        )
          .fromTo(
            ringFastRef.current,
            { rotation: 0 },
            {
              rotation: 300,
              transformOrigin: "50% 50%",
              ease: "none",
              duration: 4,
            },
            0,
          )
          .fromTo(
            [walkerRef.current, trailRef.current],
            { rotation: 0 },
            {
              rotation: 360,
              transformOrigin: "50% 50%",
              ease: "none",
              duration: 3.2,
            },
            0.5,
          );

        gsap.set(lampsRef.current, { opacity: HOURS[0].lamps });

        gsap.set(skyRef.current, {
          backgroundColor: resolveVar(HOURS[0].sky),
          color: resolveVar(HOURS[0].ink),
          "--knot-tone": HOURS[0].knotTone,
          "--knot-opacity": HOURS[0].knotOpacity,
        });

        HOURS.slice(1).forEach((h, i) => {
          const at = i * 1.25;
          tl.to(
            skyRef.current,
            {
              backgroundColor: resolveVar(h.sky),
              color: resolveVar(h.ink),

              "--knot-tone": h.knotTone,
              "--knot-opacity": h.knotOpacity,
              ease: "none",
              duration: 1.1,
            },
            at,
          );
          tl.to(
            lampsRef.current,
            { opacity: h.lamps, ease: "none", duration: 1.1 },
            at,
          );
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        pinned:
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const pinned = Boolean(ctx.conditions?.pinned);
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: pinned ? "top top" : "top 65%",
          end: pinned ? "+=240%" : "bottom 35%",
          invalidateOnRefresh: true,
          onEnter: () => fadeOutSiteSound(),
          onEnterBack: () => fadeOutSiteSound(),
          onLeave: () => restoreSiteSound(),
          onLeaveBack: () => restoreSiteSound(),
        });

        return () => {
          restoreSiteSound(600);
          trigger.kill();
        };
      },
    );

    return () => {
      restoreSiteSound(600);
      mm.revert();
    };
  }, []);

  function strike(i: number) {
    setHeld(i);
    setActive(i);
    playBell(i);
    setRung(i);
    window.setTimeout(() => setRung((r) => (r === i ? null : r)), 900);
  }

  const current = HOURS[active];

  return (
    <section id="boudha" ref={sectionRef} className="w-full   ">
      <div
        ref={skyRef}
        className="home-knot-gutters flex w-full items-center py-32 lg:min-h-svh lg:py-0"
        style={
          {
            backgroundColor: HOURS[0].sky,
            color: HOURS[0].ink,
            "--knot-tone": HOURS[0].knotTone,
            "--knot-opacity": HOURS[0].knotOpacity,
          } as React.CSSProperties
        }
      >
        <div className="relative z-10 mx-auto w-full shell-max shell-px">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <KoraRing
                ringSlowRef={ringSlowRef}
                ringFastRef={ringFastRef}
                walkerRef={walkerRef}
                trailRef={trailRef}
                pathRef={pathRef}
                lampsRef={lampsRef}
                held={held}
                active={active}
                rung={rung}
                onStrike={strike}
                setHeld={setHeld}
              />

              <Label className="mt-10 block text-center opacity-40">
                <span className="lg:hidden">Four moments on the circuit</span>
                <span className="hidden lg:inline">
                  Scroll the day · touch a station to ring it
                </span>
              </Label>
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <Label className="opacity-60">Where it stands</Label>
              <h2 className="font-display mt-8 text-section">
                The kora begins
                <br />
                outside our door
              </h2>
              <p className="text-body mt-10 max-w-[42ch] opacity-90">
                Every morning and every evening the same circle of people walks
                clockwise around the stupa, turning the prayer wheels set into
                its base. It is called a kora. Ours is called Lingkor.
              </p>

              <div className="mt-14 hidden lg:block">
                <div className="flex items-baseline gap-6">
                  <Label className="opacity-50">{current.time}</Label>
                  <span className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none">
                    {current.label}
                  </span>
                </div>
                <p className="text-body mt-5 min-h-22 max-w-[38ch] opacity-70">
                  {current.line}
                </p>
              </div>

              <ul className="mt-12 space-y-8 lg:hidden">
                {HOURS.map((h) => (
                  <li key={h.time}>
                    <div className="flex items-baseline gap-5">
                      <Label className="opacity-50">{h.time}</Label>
                      <span className="font-display text-[1.75rem] leading-none">
                        {h.label}
                      </span>
                    </div>
                    <p className="text-body mt-3 opacity-70">{h.line}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
