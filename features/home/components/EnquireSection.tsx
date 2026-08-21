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
        className="relative w-full overflow-hidden bg-midnight text-space section-y"
      >
        <Image
          src="/images/art/fiore-rose.webp"
          alt=""
          aria-hidden="true"
          width={453}
          height={560}
          loading="lazy"
          className="pointer-events-none absolute -bottom-[6%] -left-[7%] hidden w-[34vw] max-w-[420px] -rotate-6 select-none opacity-[0.13] invert sm:block"
        />

        <div className="relative mx-auto w-full shell-max shell-px">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Rise>
                <Label className="text-2xl font-sub font-black uppercase ">
                  Enquire
                </Label>
              </Rise>
              <SplitLines
                lines={["Write to us,", "and we will hold", "a room"]}
                className="font-display mt-8 text-display leading-[0.95]"
              />
              <Rise delay={220} className="mt-10">
                <p className="text-body max-w-[34ch] opacity-70">
                  Tell us when you would like to come and how long you can stay.
                  Or write us directly:
                </p>
                <div className="mt-6 flex flex-col gap-2 space-y-2">
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
              <EnquireForm tone="dark" />
            </Rise>
          </div>
        </div>
      </section>
    </>
  );
}
