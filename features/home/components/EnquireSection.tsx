import Image from "next/image";
import EnquireForm from "@/features/enquiry/components/EnquireForm";
import { Rise, SplitLines } from "@/components/anim";
import { Label } from "@/components/ui";

export function EnquireSection() {
  return (
    <>
    {/* ── Enquire ─────────────────────────────────────────────────────── */}
    <section
      id="enquire"
      className="relative w-full overflow-hidden bg-canvas py-32 lg:py-44"
    >
      {/*
        The engraved rose, as ground rather than as an illustration.

        A form is the one part of a page with nothing to look at — all label, field and
        rule — so it is where a flourish earns its keep. It sits bottom-left, in the
        gap the left column leaves once the taller form has run past it, and it is
        allowed to run off both edges: the section crops it, so it reads as something
        the page is resting on rather than a picture that was placed.

        Held at 13%, which is the point where the cross-hatching stops resolving as
        botany and becomes texture. Any darker and it competes with the form it is
        supposed to be behind.

        Hidden below sm — at phone widths the form fills the column it would sit under,
        and a watermark behind live input fields is noise, not atmosphere.
      */}
      <Image
        src="/images/art/fiore-rose.webp"
        alt=""
        aria-hidden="true"
        width={453}
        height={560}
        loading="lazy"
        className="pointer-events-none absolute -bottom-[6%] -left-[7%] hidden w-[34vw] max-w-[420px] -rotate-6 select-none opacity-[0.13] sm:block"
      />

      <div className="relative mx-auto w-full shell-max shell-px">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Rise>
              <Label className="opacity-60">Enquire</Label>
            </Rise>
            <SplitLines
              lines={["Write to us,", "and we will hold", "a room"]}
              /* `text-display`, not another inline clamp — this one escaped the sweep
                 that put every other heading on a token because it rides on SplitLines
                 rather than an h2. Its old middle term was a bare `6vw`, so like the
                 rest it stopped scaling above 1440px. Leading stays tighter than the
                 token's: three stacked display lines want to close up. */
              className="font-display mt-8 text-display leading-[0.95]"
            />
            <Rise delay={220} className="mt-10">
              <p className="text-body max-w-[34ch] opacity-70">
                Tell us when you would like to come and how long you can
                stay. Or write us directly:
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <a
                  href="mailto:phuntsokg8808@gmail.com?subject=Enquiry%20—%20Lingkor%20Boudha"
                  className="text-body underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-transparent"
                >
                  phuntsokg8808@gmail.com
                </a>
                <a
                  href="tel:+9779861413633"
                  className="text-body underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-transparent"
                >
                  +977 9861413633
                </a>
              </div>
            </Rise>
          </div>

          <Rise delay={140} className="lg:col-span-6 lg:col-start-7">
            <EnquireForm />
          </Rise>
        </div>
      </div>
    </section>
    </>
  );
}
