import EnquireForm from "@/features/enquiry/components/EnquireForm";
import { Rise, SplitChars } from "@/components/anim";
import { Label } from "@/components/ui";

export function EnquireSection() {
  return (
    <>
      {/* ── Enquire ─────────────────────────────────────────────────────── */}
      <section
        id="enquire"
        className="home-knot-gutters relative w-full overflow-hidden bg-surface text-ink section-y"
      >
        {/* <Image
          src="/images/art/fiore-rose.webp"
          alt=""
          aria-hidden="true"
          width={453}
          height={560}
          loading="lazy"
          className="pointer-events-none absolute -bottom-[6%] -left-[7%] hidden w-[34vw] max-w-[420px] -rotate-6 select-none opacity-[0.13] invert sm:block"
        /> */}

        <div className="relative z-10 mx-auto w-full shell-max shell-px">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Rise>
                <Label className="text-2xl font-sub font-black uppercase ">
                  Enquire
                </Label>
              </Rise>
              <SplitChars
                lines={["Write to us, and we will hold a room"]}
                className="font-display mt-8 text-[clamp(1.75rem,1.5rem+2vw,2.75rem)] leading-[0.95]"
              />
              <Rise delay={220} className="mt-10">
                <p className="text-body max-w-[34ch] opacity-70">
                  Tell us when you would like to come and how long you can stay.
                  Or write us directly:
                </p>
                <div className="mt-6 flex flex-col gap-2 space-y-2">
                  <a
                    href="mailto:boudhalingkor@gmail.com?subject=Enquiry%20—%20Lingkor%20Boudha"
                    className="text-body transition-opacity duration-300 hover:opacity-70"
                  >
                    boudhalingkor@gmail.com
                  </a>
                  <a
                    href="tel:+9779851413633"
                    className="text-body transition-opacity duration-300 hover:opacity-70"
                  >
                    +977 9851413633
                  </a>
                </div>
              </Rise>
            </div>

            <Rise delay={140} className="lg:col-span-5 lg:col-start-8">
              <EnquireForm />
            </Rise>
          </div>
        </div>
      </section>
    </>
  );
}
