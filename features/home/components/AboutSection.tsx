import Image from "next/image";
import { RevealParagraph } from "@/components/anim/RevealParagraph";
import { InfinitePattern } from "@/components/media/InfinitePattern";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative isolate flex h-svh w-full overflow-hidden bg-netsang md:px-[9.2%]"
    >
      {/* Strip width from the client's mockup: 118px of 1280. Both strips are the same
          crop, not mirrored, as in the mockup. */}
      <div className="absolute inset-y-0 left-0 hidden w-[9.2%] opacity-30 md:block">
        <InfinitePattern />
      </div>
      <div className="absolute inset-y-0 right-0 hidden w-[9.2%] opacity-30 md:block">
        <InfinitePattern />
      </div>
      <div className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-between text-center shell-max shell-px pt-1 pb-[3svh]">
        {/* next/image renders an <img>, which can't inherit currentColor into
            the SVG's fill — masked with a background colour instead. */}
        <span
          role="img"
          aria-label="Lingkor"
          className="mx-auto block mt-4 h-auto w-[min(16rem,26svh)] aspect-[431/255]"
          style={{
            backgroundColor: "#a15147",
            WebkitMaskImage: "url(/Logo/logo.svg)",
            maskImage: "url(/Logo/logo.svg)",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />

        <RevealParagraph
          text="Inspired by memories of caravans descending from Mustang towards the great Stupa of Boudha, we created a place that reconnects these two worlds — allowing you to experience the elemental simplicity and subtle spirit of this culture within a warm and homely Mustang atmosphere."
          className="text-body text-justify"
        />

        <div>
          <p
            className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-tight text-[#bd3119]"
            style={{ color: "#a15147" }}
          >
            Lingkor will welcome you soon
          </p>
          <p className="text-body mt-4">
            a hotel, restaurant and garden in Boudha
          </p>
        </div>

        <Image
          src="/images/newwww+contact.png"
          alt=""
          width={2063}
          height={762}
          className="mx-auto h-auto w-[min(14rem,11svh*2.7)]"
        />

        <div className="flex flex-col gap-3 mb-6">
          <p className="text-body opacity-90">
            For information, please contact us:
          </p>
          <div className="mt-1 flex flex-col gap-1">
            <a
              href="tel:+9779851413633"
              className="text-body transition-opacity duration-300 hover:opacity-70"
            >
              Mobile &amp; WhatsApp: +977 9851413633
            </a>
            <a
              href="mailto:phuntsokg6808@gmail.com"
              className="text-body transition-opacity duration-300 mt-2 hover:opacity-70"
            >
              phuntsokg6808@gmail.com
            </a>
          </div>
        </div>

        <p
          className="text-2xl mb-2  text-[#bd3119]"
          style={{ color: "#a15147" }}
        >
          More informations coming soon…
        </p>
      </div>
    </section>
  );
}
