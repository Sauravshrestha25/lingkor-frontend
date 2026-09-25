import Link from "next/link";
import { RevealParagraph } from "@/components/anim/RevealParagraph";
import { InfinitePattern } from "@/components/media/InfinitePattern";

export default function NotFound() {
  return (
    <main className="w-full">
      <section className="relative isolate w-full overflow-hidden bg-netsang md:px-[9.2%]">
        <div className="absolute inset-y-0 left-0 hidden w-[9.2%] md:block">
          <InfinitePattern />
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-[9.2%] md:block">
          <InfinitePattern />
        </div>
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center text-center shell-max shell-px py-[calc(var(--shell-gutter)+2rem)]">
          <span
            role="img"
            aria-label="Lingkor"
            className="mx-auto block h-auto w-32 aspect-[431/255]"
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

          <p
            className="font-display mt-16 text-[clamp(1.75rem,1.3rem+2vw,2.75rem)] leading-tight"
            style={{ color: "#a15147" }}
          >
            404
          </p>

          <RevealParagraph
            text="The page you're looking for has wandered off the path between Mustang and Boudha."
            className="text-body mt-4 text-justify"
          />

          <Link
            href="/"
            className="text-body mt-10 transition-opacity duration-300 hover:opacity-70"
            style={{ color: "#a15147" }}
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
