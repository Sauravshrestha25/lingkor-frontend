import EnquireForm from "@/features/enquiry/components/EnquireForm";
import { Rise, SplitLines } from "@/components/anim";
import { Label } from "@/components/ui";

export function EnquireSection() {
  return (
    <>
    {/* ── Enquire ─────────────────────────────────────────────────────── */}
    <section id="enquire" className="w-full bg-canvas py-32 lg:py-44">
      <div className="mx-auto w-full shell-max shell-px">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Rise>
              <Label className="opacity-60">Enquire</Label>
            </Rise>
            <SplitLines
              lines={["Write to us,", "and we will hold", "a room"]}
              className="font-display mt-8 text-[clamp(2.75rem,6vw,6rem)] leading-[0.95]"
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
