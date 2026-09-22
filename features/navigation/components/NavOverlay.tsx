"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CONTACT } from "@/lib/site";
import { Button } from "@/components/shared/button";
import { NAV } from "../nav";
import {
  ExternalLinkIcon,
  type ExternalLinkIconHandle,
} from "@/components/shared/ExternalLinkIcon";

const BOUDHA_MAPS_URL =
  "https://www.google.com/maps/place/Boudhanath/@27.7215062,85.3594225,17z/data=!3m1!4b1!4m6!3m5!1s0x39eb1b0c4bf34e89:0x9e398a10248b4a6d!8m2!3d27.7215062!4d85.3619974!16s%2Fg%2F11vdfg74zw?entry=ttu&g_ep=EgoyMDI2MDgyNC4wIKXMDSoASAFQAw%3D%3D";

function OverlayExternalLink({
  children,
  className,
  href,
  onClick,
  tabIndex,
  target,
  rel,
}: {
  children: ReactNode;
  className: string;
  href: string;
  onClick: () => void;
  tabIndex: number;
  target?: string;
  rel?: string;
}) {
  const iconRef = useRef<ExternalLinkIconHandle>(null);

  function startIconAnimation() {
    iconRef.current?.startAnimation();
  }

  function stopIconAnimation() {
    iconRef.current?.stopAnimation();
  }

  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      onPointerEnter={startIconAnimation}
      onPointerLeave={stopIconAnimation}
      onFocus={startIconAnimation}
      onBlur={stopIconAnimation}
      tabIndex={tabIndex}
      className={className}
    >
      {children}
      <ExternalLinkIcon ref={iconRef} size={11} />
    </Link>
  );
}

export function NavOverlay({
  overlayRef,
  open,
  pathname,
  setOpen,
}: {
  overlayRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  pathname: string;
  setOpen: (open: boolean) => void;
}) {
  // Mustang, Boudha and About are hidden from the menu for now — the pages still
  // exist, just not linked to.
  const primary: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
    { label: "Spaces", href: "/spaces" },
    { label: "Rooms", href: "/rooms" },
  ];

  // Journal is hidden from the menu for now too — page still exists, unlinked.
  const secondary: { label: string; href: string; count?: number }[] = [
    ...NAV.filter((n) => n.href === "/contact"),
  ];

  return (
    <div
      ref={overlayRef}
      id="site-menu"
      data-lenis-prevent
      inert={!open}
      className="fixed inset-0 z-40 overflow-y-auto overscroll-contain text-ink"
      style={{
        clipPath: "inset(0 0 100% 0)",
        backgroundColor: "var(--color-canvas)",
      }}
      aria-hidden={!open}
    >
      <div className="relative z-20 mx-auto flex min-h-full w-full shell-max flex-col shell-px pt-24 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pt-28">
        <div className="grid flex-1 gap-10 border-t border-ink/15 py-7 md:grid-cols-[1.15fr_1fr] md:gap-16 md:py-9 lg:gap-24">
          <nav
            aria-label="Main navigation"
            className="flex flex-col justify-center"
          >
            <p data-menu-item className="text-label mb-6 uppercase text-ink/80">
              Explore Lingkor
            </p>
            <ol className="flex flex-col">
              {primary.map((p, index) => {
                const active =
                  p.href === "/"
                    ? pathname === "/"
                    : pathname === p.href || pathname.startsWith(`${p.href}/`);
                return (
                  <li
                    key={p.href}
                    data-notrim
                    className="border-b border-ink/10"
                  >
                    <Link
                      href={p.href}
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center gap-5 py-3 outline-offset-4 transition-colors duration-300 hover:text-brick focus-visible:text-brick ${active ? "text-brick" : "text-ink"}`}
                    >
                      <span
                        data-menu-item
                        className="flex w-full items-center gap-5"
                      >
                        <span className="w-5 text-[0.625rem] font-body tabular-nums tracking-widest opacity-80">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-none transition-transform duration-300 group-hover:translate-x-2 group-focus-visible:translate-x-2">
                          {p.label}
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          strokeWidth={1}
                          className={`ml-auto size-5 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100 ${active ? "opacity-100" : "-translate-x-2 opacity-0"}`}
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <aside
            data-menu-item
            className="flex flex-col justify-center md:border-l md:border-ink/15 md:pl-12 lg:pl-16"
          >
            <div className="relative hidden h-[clamp(12rem,32vh,24rem)] overflow-hidden md:block">
              <Image
                src="/images/spaces/exterior-1280.webp"
                alt="Lingkor, Boudha — the building exterior"
                fill
                sizes="(min-width: 768px) 40vw, 1px"
                className="object-cover"
              />
            </div>
            <p className="text-label uppercase text-ink/80 md:mt-6">
              Rooted in Mustang. At home in Boudha.
            </p>
            <p className="mt-4 max-w-[18ch] font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-tight">
              A place to arrive.
              <br />A little longer to stay.
            </p>
            <Button asChild>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="group mt-6 inline-flex min-h-12 items-center justify-between gap-8 self-start text-label uppercase text-brick"
              >
                <span className="text-trim">Enquire about a stay</span>
                {/* <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /> */}
              </Link>
            </Button>
          </aside>
        </div>

        {/* Bottom — justify-between: Elsewhere (left) / Where (right) */}
        <div
          data-menu-item
          className="flex flex-col items-stretch gap-5 border-t pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-8"
          style={{
            borderColor: "color-mix(in srgb, #1c1a17 15%, transparent)",
          }}
        >
          <div>
            {/* <p className="text-label uppercase opacity-45 mb-3">Elsewhere</p> */}
            <ul className="grid grid-cols-2 gap-x-5 gap-y-2 sm:flex sm:flex-wrap">
              {secondary.map((p) => (
                <li key={p.href}>
                  <Button asChild>
                    <Link
                      href={p.href}
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                      className={`text-label uppercase transition-opacity duration-300 hover:opacity-100 ${
                        pathname === p.href ? "opacity-100" : "opacity-85"
                      }`}
                    >
                      {p.label}
                      {p.count !== undefined && (
                        <sup
                          aria-hidden="true"
                          className="ml-0.5 text-[0.7em] leading-none tabular-nums opacity-85"
                        >
                          {String(p.count).padStart(2, "0")}
                        </sup>
                      )}
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={CONTACT.phoneHref}
            tabIndex={open ? 0 : -1}
            className="text-label tracking-wider text-ink/85 transition-colors hover:text-brick"
          >
            {CONTACT.phone}
          </a>

          <div className="text-left sm:text-right">
            {/* <p className="text-label uppercase opacity-45 mb-3">Where</p> */}
            <OverlayExternalLink
              href={BOUDHA_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="group text-label inline-flex max-w-44 items-center justify-start gap-1.5 uppercase transition-opacity duration-300 hover:opacity-60 sm:max-w-none sm:justify-end"
            >
              Boudha, Kathmandu
            </OverlayExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
}
