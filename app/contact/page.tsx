import type { Metadata } from "next";
import Image from "next/image";
import Footer from "@/features/navigation/components/Footer";
import EnquireForm from "@/features/enquiry/components/EnquireForm";
import { Rise, SplitChars } from "@/components/anim";
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
      {/* Contact opening — built to the client's sample: a small "• Contact"
          kicker, the headline in their exact words and line breaks, the yak
          caravan drawing left-aligned beneath it (a slice of the descending
          trail), a two-line note, and a tall Mustang texture on the right. */}
      <header className="w-full bg-canvas pt-40 pb-20 lg:pt-44 lg:pb-28">
        <div className="mx-auto w-full shell-max shell-px">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-x-12">
            <div className="lg:col-span-6 lg:pt-16">
              <Rise>
                <p className="text-sm text-ink/45">
                  <span className="mr-2">&bull;</span>Contact
                </p>
              </Rise>

              <SplitChars
                lines={[
                  "Send us a message.",
                  "We will thrive to grant",
                  "your wishes.",
                ]}
                delay={120}
                className="font-display mt-10 whitespace-nowrap text-[clamp(2rem,1.1rem+2.6vw,3rem)] leading-[1.08]"
              />

              <Rise delay={240} className="mt-16">
                <div className="relative aspect-[13/5] w-[clamp(240px,26vw,360px)] overflow-hidden">
                  <Image
                    src="/images/art/caravan-terracotta.png"
                    alt="A caravan of pack yaks on the trail"
                    fill
                    sizes="(min-width: 1024px) 26vw, 60vw"
                    className="object-cover object-[50%_33%] opacity-90"
                  />
                </div>
              </Rise>

              <Rise delay={320} className="mt-14">
                <p className="text-sm leading-relaxed text-ink/55">
                  Tell us when you would like to come and for how long.
                  <br />
                  We answer every messages ourselves
                </p>
              </Rise>
            </div>

            <Rise delay={360} y={18} className="lg:col-span-6">
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image
                  src="/images/mustang/_ECS1673-mod.webp"
                  alt="Wind-cut earth pinnacles of Upper Mustang"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
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
