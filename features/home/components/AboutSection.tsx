import Image from "next/image";
import { RevealParagraph } from "@/components/anim/RevealParagraph";

export function AboutSection() {
  return (
    <section
      id="about"
      className="home-knot-gutters relative w-full overflow-hidden bg-netsang"
    >
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center shell-max shell-px py-[calc(var(--shell-gutter)+2rem)]">
        {/* next/image renders an <img>, which can't inherit currentColor into
            the SVG's fill — masked with a background colour instead. */}
        <span
          role="img"
          aria-label="Lingkor"
          className="mx-auto block h-auto w-44 aspect-[431/255]"
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
          className="text-body mt-10"
        />

        <p
          className="font-display mt-16 text-[clamp(1.75rem,1.3rem+2vw,2.75rem)] leading-tight"
          style={{ color: "#a15147" }}
        >
          Lingkor will welcome you soon
        </p>
        <p className="text-body mt-3">a hotel, restaurant and garden in Boudha</p>

        <Image
          src="/images/newwww+contact.png"
          alt=""
          width={2063}
          height={762}
          className="mx-auto mt-12 h-auto w-72 sm:w-96"
        />

        <div className="mt-12">
          <p className="text-body opacity-90">
            For information, please contact us:
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="tel:+9779851413633"
              className="text-body transition-opacity duration-300 hover:opacity-70"
            >
              Mobile &amp; WhatsApp: +977 9851413633
            </a>
            <a
              href="mailto:phuntsokg6808@gmail.com"
              className="text-body transition-opacity duration-300 hover:opacity-70"
            >
              phuntsokg6808@gmail.com
            </a>
          </div>
        </div>

        <p className="mt-10" style={{ color: "#a15147" }}>
          More informations coming soon…
        </p>
      </div>
    </section>
  );
}
