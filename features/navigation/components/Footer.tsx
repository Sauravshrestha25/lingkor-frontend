import Image from "next/image";
import Link from "next/link";
import { SparklesCore } from "@/components/SparklesCore";
import { Rise } from "@/components/anim";
import { Label } from "@/components/ui";
import { CONTACT, NAV, SPACES } from "@/lib/site";

/**
 * The close: the caravan drawing running the full width above the wordmark, then the
 * site's own map, then the fine print.
 *
 * The homepage closes in midnight. Interior routes use the inverse white treatment.
 */
export default function Footer({ dark = false }: { dark?: boolean }) {
  const ground = dark ? "bg-midnight text-space" : "bg-canvas text-ink";
  const rule = dark ? "border-space/20" : "border-ink/20";

  return (
    <footer
      className={`relative w-full overflow-hidden pt-24 pb-10 ${ground} ${dark ? "home-knot-gutters" : ""}`}
    >
      <div className="relative z-10 mx-auto w-full shell-max shell-px">
        {/* The line the whole site is built on, drawn once at the end. */}
        {/* <Rise className="flex justify-center">
          <LineArt
            name="panorama"
            tone="white"
            className="h-auto w-full max-w-275 opacity-70"
          />
        </Rise> */}

        <Rise
          delay={120}
          className={`mt-20 grid grid-cols-2 gap-x-8 gap-y-14 border-t pt-16 md:grid-cols-4 ${rule}`}
        >
          <div className="col-span-2 md:col-span-1">
            <Label className="">Lingkor</Label>
            <p className="text-md font-body mt-6 max-w-[30ch] opacity-75">
              A caravan&rsquo;s last stop, still standing. Mustang&rsquo;s five
              elements, a short walk from the stupa.
            </p>
          </div>

          <div>
            <Label className="">The five spaces</Label>
            <ul className="mt-6 space-y-6">
              {SPACES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/spaces/${s.slug}`}
                    className="font-body text-md opacity-75 transition-opacity duration-300 hover:opacity-100"
                  >
                    {s.name}
                    <span className="text-xs font-body ml-2 opacity-65">
                      {s.role}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Label className="">Explore</Label>
            <ul className="mt-6 space-y-6">
              {NAV.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="font-body text-md opacity-75 transition-opacity duration-300 hover:opacity-100"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Label className="">Find us</Label>
            {/* TODO: street address — none supplied. See CONTENT.md. */}
            <address className="font-body text-md mt-6 space-y-6 not-italic">
              <p className="opacity-50 hover:opacity-100">{CONTACT.address}</p>
              <p className="opacity-50 hover:opacity-100">
                <a href={CONTACT.phoneHref} className="hover:opacity-100">
                  {CONTACT.phone}
                </a>
              </p>
              <p className="opacity-50 hover:opacity-100">
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
            className={`h-auto w-full max-w-104 opacity-80 ${dark ? "" : "invert"}`}
          />
        </div>

        <div
          className={`mt-8 flex flex-col gap-4 border-t text-xs font-body tracking-wide pt-8 sm:flex-row sm:items-center sm:justify-between ${rule}`}
        >
          <Label className="opacity-65">
            © {new Date().getFullYear()} Lingkor · Boudha, Kathmandu
          </Label>

          {/* Agency credit. Moved down from the hero, where it competed with the one
              line the brand actually wants read first. */}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://webxnepal.com/"
            aria-label="Designed and developed by WebX Nepal"
            className="flex items-center gap-2  duration-300 hover:opacity-100"
          >
            <Label className="text-xs font-body tracking-wide">
              Designed and Developed by
            </Label>
            <span className="relative flex h-6 w-12 items-center justify-center">
              <SparklesCore
                className="pointer-events-none absolute inset-0"
                minSize={0.5}
                maxSize={1.1}
                speed={0.6}
                particleColor={dark ? "#F0EDE6" : "#1C1A17"}
                particleDensity={110}
              />
              <Image
                src={dark ? "/webx-white-logo.svg" : "/webx-logo.jpg"}
                alt="WebX"
                height={30}
                width={60}
                // Use purpose-built artwork for each ground. Inverting the white SVG
                // also inverted WebX's multicolour X, which changed the brand mark.
                className="relative z-10 h-auto w-12"
              />
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
