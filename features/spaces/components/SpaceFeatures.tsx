"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Photo } from "@/components/media/Photo";
import { Label } from "@/components/ui";

export type Feature = { title: string; line: string; photo: string };

/**
 * The pinned feature run, after hillbrookestate.co.nz/the-house.
 *
 * On that page the equivalent section stacks every image at one position, full-bleed,
 * with every caption stacked at one position over them — six of each, cross-fading, so
 * the frame stays still while its contents change. Measured there: images 1633×828 all
 * at x0/y5744, headings all at x68/y5812.
 *
 * The pin makes the swap legible. Without it the images would scroll past mid-fade and
 * you would never see any of them whole.
 *
 * Implementation notes that matter:
 *
 * - **The pinned element is not the animated one.** The section is pinned; the frames
 *   and captions inside it are what move. Animating a pinned element fights the pin.
 * - **One ScrollTrigger, on the timeline** — never on the child tweens. A ScrollTrigger
 *   on a tween that is already inside a timeline is driven twice.
 * - **`scrub` without `toggleActions`.** They are mutually exclusive; scrub wins
 *   silently if both are set, which hides the mistake.
 * - Desktop and no-reduced-motion only. Below that it degrades to an honest stacked
 *   list — same content, same order, no machinery.
 */
export function SpaceFeatures({
  features,
  name,
}: {
  features: Feature[];
  name: string;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || features.length < 2) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const frames = el.querySelectorAll<HTMLElement>("[data-frame]");
        const caps = el.querySelectorAll<HTMLElement>("[data-cap]");

        // Everything starts hidden except the first, so the section is legible before
        // the timeline has run a single tick.
        gsap.set([frames, caps], { autoAlpha: 0 });
        gsap.set([frames[0], caps[0]], { autoAlpha: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            // One viewport of scroll per swap. Fewer and the crossfades trip over each
            // other; more and the section overstays.
            end: () => `+=${(features.length - 1) * 100}%`,
            pin: true,
            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        for (let i = 1; i < features.length; i++) {
          tl.to(frames[i - 1], { autoAlpha: 0, duration: 0.4 }, i - 1)
            .to(frames[i], { autoAlpha: 1, duration: 0.4 }, i - 1)
            // Captions swap a beat late, so the words follow the picture rather than
            // changing with it — the reference does the same.
            .to(caps[i - 1], { autoAlpha: 0, duration: 0.25 }, i - 1 + 0.08)
            .to(caps[i], { autoAlpha: 1, duration: 0.25 }, i - 1 + 0.25);
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set([frames, caps], { clearProps: "all" });
        };
      },
    );

    // Images arriving late change the page height, and a pinned trigger measured
    // against the old height ends in the wrong place.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, [features.length]);

  if (features.length < 2) return null;

  return (
    <section
      ref={root}
      className="relative w-full overflow-hidden bg-ink text-space lg:h-svh"
    >
      {/* ── Desktop: the stack ─────────────────────────────────────────── */}
      <div className="hidden lg:block">
        {features.map((f) => (
          <div key={f.photo} data-frame className="absolute inset-0">
            <Photo
              src={f.photo}
              alt={`${name} — ${f.title}`}
              sizes="100vw"
              className="h-full w-full"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-0 pb-16">
          <div className="mx-auto w-full shell-max shell-px">
            <div className="relative h-[9rem]">
              {features.map((f, i) => (
                <div key={f.title} data-cap className="absolute inset-x-0 bottom-0">
                  <Label className="opacity-60">
                    {String(i + 1).padStart(2, "0")} /{" "}
                    {String(features.length).padStart(2, "0")}
                  </Label>
                  <h3 className="font-display mt-4 text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
                    {f.title}
                  </h3>
                  <p className="text-body mt-4 max-w-[46ch] opacity-80">{f.line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Below lg: the same content, stacked, no machinery ──────────── */}
      <div className="lg:hidden">
        {features.map((f, i) => (
          <div key={f.title} className={i > 0 ? "mt-16" : ""}>
            <Photo
              src={f.photo}
              alt={`${name} — ${f.title}`}
              sizes="100vw"
              className="aspect-[4/3] w-full"
            />
            <div className="px-6 py-8">
              <Label className="opacity-60">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(features.length).padStart(2, "0")}
              </Label>
              <h3 className="font-display mt-4 text-[clamp(1.75rem,6vw,2.5rem)] leading-[1.05]">
                {f.title}
              </h3>
              <p className="text-body mt-4 opacity-80">{f.line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
