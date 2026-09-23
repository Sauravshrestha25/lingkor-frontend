import Image from "next/image";
import { Button } from "@/components/shared/button";
import { Rise, SplitChars } from "@/components/anim";

export function ContactTeaserSection() {
  return (
    <section
      id="contact"
      className="home-knot-gutters w-full bg-[#f7f0e1] section-y"
    >
      <div className="mx-auto w-full shell-max shell-px">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-6">
            <Rise>
              <Button type="button" className="text-label uppercase">
                Contact
              </Button>
            </Rise>

            <SplitChars
              lines={[
                "Send us a message.",
                "We will thrive to grant",
                "your wishes.",
              ]}
              delay={120}
              className="font-display mt-8 whitespace-nowrap text-[clamp(1.9rem,1.1rem+2vw,2.5rem)] leading-[1.14]"
            />

            <Rise delay={240} className="mt-16">
              <Image
                src="/images/newwww+contact.png"
                alt=""
                width={2063}
                height={762}
                sizes="384px"
                className="h-auto w-72 lg:w-96"
              />
              <p className="text-body mt-14 max-w-[34rem] opacity-90">
                Tell us when you would like to come and for how long. We
                answer every messages ourselves
              </p>
            </Rise>
          </div>

          <Rise delay={360} y={18} className="lg:col-span-6 lg:pt-16">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src="/images/mustang/_ECS3504.webp"
                alt="Eroded pinnacles of Upper Mustang"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
