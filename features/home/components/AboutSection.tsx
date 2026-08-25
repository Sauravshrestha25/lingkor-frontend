"use client";

import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { Photo } from "@/components/media/Photo";
import { RevealParagraph } from "@/components/anim/RevealParagraph";

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

  const JOURNEY =
    " You will feel at home and maybe... you will not want to leave.";

  return (
    <section
      id="about"
      ref={root}
      className="home-knot-gutters relative w-full overflow-hidden bg-netsang "
    >
      <div className="relative z-10 mx-auto text-center w-full pb-[calc(var(--shell-gutter)+2rem)] shell-max shell-px">
        <blockquote className="font-display flex flex-col justify-center text-[clamp(1.75rem,4.4vw,3.75rem)] h-[60vh] text-center max-w-5xl py-12  mx-auto w-full leading-[1.08]">
          <span data-notrim className="block overflow-hidden ">
            <span data-line className="block">
              <RevealParagraph text={JOURNEY} className="  text-center" />
            </span>
          </span>
        </blockquote>
        <div className="max-w-4xl w-full mx-auto pb-12">
          <p className="text-2xl font-sub font-black uppercase ">About us</p>

          {/* DRAFT — ours, not the client's. See CONTENT.md. */}
          <p className="text-body mt-7">
            Lingkor is the Tibetan word for the circuit walked around a sacred
            place — the pilgrimage route, and the act of walking it. At
            Boudhanath that circle forms twice a day around the dome, and the
            hotel stands inside it.
          </p>
          <p className="text-body mt-6 opacity-75">
            The building is Mustang brought south: its colours, its rooms and
            its name all come from the country the caravans came down from.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-6">
          {/* ── Text column ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div data-reveal>
              <Photo
                src="/images/mustang/_ECS2427.webp"
                alt="A weathered painted door in Upper Mustang"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 16vw"
                className="h-80 w-full sm:h-96 lg:h-[32rem]"
              />
            </div>
          </div>

          {/* ── Image column ────────────────────────────────────────────── */}
          <div data-reveal className="w-full lg:col-span-4">
            <Photo
              src="/images/spaces/arrival.webp"
              alt="The warm entrance hall at Lingkor, with the garden door beyond"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 32vw"
              className="h-80 w-full sm:h-96 lg:h-[32rem]"
              imgClassName="object-[52%_center]"
            />
          </div>
          <div data-reveal className="lg:col-span-3">
            <Photo
              src="/images/mustang/_DSF5358.webp"
              alt="A narrow sunlit passage between earthen walls in Mustang"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
              className="h-80 w-full sm:h-96 lg:h-[32rem]"
              imgClassName="object-[50%_58%]"
            />
          </div>
          <div data-reveal className="lg:col-span-3">
            <Photo
              src="/images/mustang/_DSF6291.webp"
              alt="The garden and terraces, from above"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
              className="h-80 w-full sm:h-96 lg:h-[32rem]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
