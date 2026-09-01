import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/features/navigation/components/Footer";
import EnquireForm from "@/features/enquiry/components/EnquireForm";
import { Rise, SplitChars } from "@/components/anim";
import { LineArt } from "@/components/media/Photo";
import { Label } from "@/components/ui";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — Lingkor",
  description:
    "Write to Lingkor, Boudha — Kathmandu, Nepal. Enquiries, dates and directions.",
};

export default function ContactPage() {
  return (
    <main className="w-full">
      {/* Contact opening, laid out to the client's sample page: kicker, a Hasweny
          headline in their words, the yak-caravan line drawing used delicately
          beside a short note, and a Mustang texture that fades up slowly on the
          right. */}
      <header className="w-full bg-canvas pt-40 pb-20 lg:pt-44 lg:pb-28">
        <div className="mx-auto w-full shell-max shell-px">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-16">
            <div className="lg:col-span-5 lg:pt-24">
              <Rise>
                <Label className="opacity-60">Contact</Label>
              </Rise>

              <SplitChars
                lines={[
                  "Send us a message.",
                  "We will thrive to grant",
                  "your wishes.",
                ]}
                delay={120}
                className="font-display mt-8 text-[clamp(2.25rem,1.35rem+2.1vw,3rem)] leading-[1.08]"
              />

              <Rise delay={240} className="mt-12">
                <div className="flex justify-center">
                  <LineArt
                    name="caravan"
                    tone="terracotta"
                    className="h-auto w-32 opacity-80 lg:w-40"
                  />
                </div>
                <p className="text-body mt-12 max-w-[36ch] opacity-70">
                  Tell us when you would like to come and for how long. We
                  answer every message ourselves.
                </p>
              </Rise>
            </div>

            <Rise delay={360} y={18} className="lg:col-span-7 lg:pt-16">
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src="/images/mustang/_ECS0507-mod.webp"
                  alt="Wind-cut cliffs of Upper Mustang"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Rise>
          </div>
        </div>
      </header>

      <section className="w-full bg-canvas pb-28 lg:pb-40">
        <div className="mx-auto w-full shell-max shell-px">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            <Rise className="lg:col-span-6 lg:order-2">
              <EnquireForm />
            </Rise>

            <div className="lg:col-span-4 lg:order-1">
              <Rise>
                <Label className="opacity-50">Direct</Label>
                <address className="text-body mt-6 space-y-3 not-italic">
                  {/* TODO: street address, and a hotel line rather than a personal
                      one — none supplied. See CONTENT.md. */}
                  <p className="opacity-75">{CONTACT.address}</p>
                  <p>
                    <a
                      href={CONTACT.phoneHref}
                      className="underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-transparent"
                    >
                      {CONTACT.phone}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`mailto:${CONTACT.email}?subject=Enquiry%20—%20Lingkor%20Boudha`}
                      className="underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-transparent"
                    >
                      {CONTACT.email}
                    </a>
                  </p>
                </address>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
