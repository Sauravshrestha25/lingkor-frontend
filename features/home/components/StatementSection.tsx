"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, reduced } from "@/lib/gsap";
import { Photo } from "@/components/media/Photo";
import { Label } from "@/components/ui";

export function StatementSection() {
  const root = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced()) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "clamp(top bottom)",
          end: "clamp(bottom top)",
          scrub: 0.8,
        },
      });

      tl.to(leftRef.current, { y: -200, duration: 0.5, ease: "none" }, 0.1);
      tl.to(rightRef.current, { y: 200, duration: 0.5, ease: "none" }, 0.1);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="statement"
      ref={root}
      className="relative w-full bg-canvas pt-24 lg:pt-[9.8rem]"
    >
      <span
        data-ghost
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-[4%]  select-none whitespace-nowrap text-[26vw] font-title leading-none text-transparent lg:text-[19vw]"
        style={{ WebkitTextStroke: "1px rgb(28 26 23 / 0.14)" }}
      >
        LINGKOR
      </span>
      <div className="mx-auto w-full shell-max shell-px">
        {/* Subject and sentence share a baseline. */}
        <div className="lg:flex lg:items-start">
          <Image
            src="/Logo/logo.svg"
            alt="Lingkor"
            width={431}
            height={255}
            className="h-auto w-32 text-ink lg:ml-[15.5%] lg:w-[6.6%] lg:shrink-0 lg:translate-y-[0.15em]"
          />

          <h2 className="mt-6 font-tibetan text-[clamp(1.5rem,2.29vw,2rem)]  leading-[1.2] lg:mt-0 lg:ml-[0.94rem] lg:w-[60%]">
            Takes the whole of Mustang — its colours, its rooms, its quiet — and
            sets it down four hundred kilometres south of itself.
          </h2>
        </div>
        <div ref={rightRef} className="relative mt-16 lg:mt-[4.9rem]">
          <div className="mb-10 max-w-[42ch] lg:absolute lg:left-0 lg:top-1/2 lg:mb-0 lg:w-[30%] lg:-translate-y-1/2">
            <p className="font-display mt-5 text-[clamp(1.375rem,2vw,2rem)] leading-tight">
              Nothing here is scheduled.
            </p>
            <p className="text-body mt-5 opacity-75">
              The kora is there at five in the morning and again at seven in the
              evening. Everything else waits until you want it.
            </p>
          </div>

          <Photo
            src="/images/spaces/gallery/menthang-2.webp"
            alt="Treatment beds in the turquoise calm of the spa"
            sizes="(max-width: 1024px) 100vw, 27vw"
            className="aspect-5/7 w-full lg:ml-[55.7%] lg:w-[26.4%]"
          />
        </div>
        <div className="relative">
          <div className="mb-12 max-w-[42ch] lg:absolute lg:right-0 lg:top-[34%] lg:mb-0 lg:w-[31%]">
            <p className="font-display mt-5 text-[clamp(1.375rem,2vw,2rem)] leading-tight">
              Five rooms, five elements.
            </p>
            <p className="text-body mt-5 opacity-75">
              Earth, water, wind, fire and space. Each one carries a colour, a
              name, and the piece of Mustang it was named for.
            </p>
            <p className="text-body mt-4 opacity-75">
              Walk them in order and you have walked a circuit — which is what
              the word Lingkor means.
            </p>
          </div>

          <div ref={leftRef} className="mt-16 lg:mt-[7.8rem]">
            <Photo
              src="/images/spaces/gallery/netsang-2.webp"
              alt="A table laid for a meal in the ochre dining room"
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="aspect-5/7 w-full lg:w-[45.4%]"
              imgClassName="object-[52%_center]"
            />

            <div className="mt-6 lg:w-[45.4%]">
              <Label className="opacity-45">Netsang · Fine dining</Label>
              <p className="text-body mt-3 max-w-[46ch] opacity-75">
                The long table, and food that arrives because it is time to eat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
