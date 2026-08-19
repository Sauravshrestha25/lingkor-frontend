import Image from "next/image";
import Link from "next/link";
import { SparklesCore } from "@/components/SparklesCore";
import { LineArt } from "@/components/media/Photo";
import { Rise } from "@/components/anim";
import { Label } from "@/components/ui";
import { CONTACT, NAV, SPACES } from "@/lib/site";

/**
 * The close: the caravan drawing running the full width above the wordmark, then the
 * site's own map, then the fine print.
 *
 * **Light, on the page's own off-white.** It has been sand and it has been ink; it is
 * the ground now, so the whole site stays in the one colour the brief asks for.
 *
 * The label opacities are the thing to be careful with here, and they are not
 * transferable between grounds. Ink type on this off-white measures:
 *
 *   40%  2.44:1     55%  3.72:1     65%  5.06:1
 *   50%  3.20:1     60%  4.34:1     75%  6.99:1
 *
 * So **65% is the floor** for anything at label size — 55% cleared AA comfortably when
 * the footer was dark, and fails here. The original sand version ran these at 40%,
 * which is why they were the least readable text on the page.
 */
export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-canvas pt-24 pb-10 text-ink">
      <div className="mx-auto w-full shell-max shell-px">
        {/* The line the whole site is built on, drawn once at the end. */}
        <Rise className="flex justify-center">
          <LineArt
            name="panorama"
            tone="terracotta"
            className="h-auto w-full max-w-275 opacity-70"
          />
        </Rise>

        <Rise
          delay={120}
          className="mt-20 grid grid-cols-2 gap-x-8 gap-y-14 border-t border-ink/15 pt-16 md:grid-cols-4"
        >
          <div className="col-span-2 md:col-span-1">
            <Label className="opacity-65">Lingkor</Label>
            <p className="text-body mt-6 max-w-[30ch] opacity-75">
              A caravan&rsquo;s last stop, still standing. Mustang&rsquo;s five
              elements, a short walk from the stupa.
            </p>
          </div>

          <div>
            <Label className="opacity-65">The five spaces</Label>
            <ul className="mt-6 space-y-6">
              {SPACES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/spaces/${s.slug}`}
                    className="text-body opacity-75 transition-opacity duration-300 hover:opacity-100"
                  >
                    {s.name}
                    <span className="text-body ml-2 opacity-65">{s.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Label className="opacity-65">Explore</Label>
            <ul className="mt-6 space-y-6">
              {NAV.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="text-body opacity-75 transition-opacity duration-300 hover:opacity-100"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Label className="opacity-65">Find us</Label>
            {/* TODO: street address — none supplied. See CONTENT.md. */}
            <address className="text-body mt-6 space-y-6 not-italic opacity-75">
              <p>{CONTACT.address}</p>
              <p>
                <a href={CONTACT.phoneHref} className="hover:opacity-100">
                  {CONTACT.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="underline decoration-1 underline-offset-[6px]"
                >
                  {CONTACT.email}
                </a>
              </p>
            </address>
          </div>
        </Rise>

        <div className="mt-20 flex justify-center">
          <Image
            src="/Logo/logo-white.svg"
            alt="Lingkor"
            width={1200}
            height={400}
            className="h-auto w-full max-w-104 opacity-80 invert"
          />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ink/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Label className="opacity-65">
            © {new Date().getFullYear()} Lingkor · Boudha, Kathmandu
          </Label>

          {/* Agency credit. Moved down from the hero, where it competed with the one
              line the brand actually wants read first. */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://webxnepal.com/"
            aria-label="Designed and developed by WebX Nepal"
            className="flex items-center gap-2  duration-300 hover:opacity-100"
          >
            <Label>Designed and developed by</Label>
            <span className="relative flex h-6 w-12 items-center justify-center">
              <SparklesCore
                className="pointer-events-none absolute inset-0"
                minSize={0.5}
                maxSize={1.1}
                speed={0.6}
                particleColor="#1C1A17"
                particleDensity={110}
              />
              <Image
                src="/webx-logo.jpg"
                alt="WebX"
                height={20}
                width={40}
                // No blend mode. `mix-blend-multiply` was knocking the white box out
                // of the old JPEG against a light footer; multiplied against ink it
                // renders #1A1815 — the logo becomes the background exactly. The SVG
                // has real transparency, so it needs no blending at all.
                className="relative z-10 h-auto w-9"
              />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
