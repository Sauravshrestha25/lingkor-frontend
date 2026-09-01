"use client";

import { useRef, useState, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { NAV, SPACES } from "../nav";
import { POSTS } from "@/lib/journal";
import { BOUDHA } from "@/lib/photo";
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
  onAccent,
}: {
  overlayRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  pathname: string;
  setOpen: (open: boolean) => void;
  onAccent: (accent: string | null) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const space = hovered === null ? null : SPACES[hovered];
  const live = space?.tintable ? space.field : null;

  function enter(i: number) {
    setHovered(i);
    const s = SPACES[i];
    onAccent(s.tintable ? s.field : null);
  }
  function leave() {
    setHovered(null);
    onAccent(null);
  }

  const secondary: { label: string; href: string; count?: number }[] = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
    { label: "Journal", href: "/journal", count: POSTS.length },
    { label: "Mustang", href: "/mustang" },
    { label: "Boudha", href: "/boudha" },
    { label: "About", href: "/about" },
    ...NAV.filter((n) => n.href === "/contact"),
  ];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 overflow-y-auto text-ink"
      style={{
        clipPath: "inset(0 0 100% 0)",
        backgroundColor: live
          ? `color-mix(in srgb, ${live} 10%, var(--color-canvas))`
          : "var(--color-canvas)",
        transition: "background-color 600ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      aria-hidden={!open}
    >
      <div className="relative z-20 mx-auto flex min-h-full w-full shell-max flex-col shell-px pt-20 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:pb-6 lg:pt-24 lg:pb-8">
        {/* Centered image — switches to hovered space photo */}
        <div className="hidden justify-center sm:flex">
          <div className="relative h-20 w-32 overflow-hidden lg:h-60 lg:w-120">
            {/* Base: Netsang (first space) when nothing hovered */}
            <NextImage
              src={SPACES[0].img ?? BOUDHA}
              alt={SPACES[0].label}
              fill
              sizes="360px"
              className={`object-cover transition-opacity duration-400 ${hovered !== null ? "opacity-0" : "opacity-100"}`}
            />
            {/* Per-space images */}
            {SPACES.map((s, i) =>
              s.img ? (
                <NextImage
                  key={s.href}
                  src={s.img}
                  alt={s.label}
                  fill
                  sizes="360px"
                  className={`object-cover transition-opacity duration-400 ${hovered === i ? "opacity-100" : "opacity-0"}`}
                />
              ) : null,
            )}
          </div>
        </div>

        {/* 5 spaces — 3 + 2, centered */}
        <nav
          className="flex min-h-0 flex-1 flex-col items-center justify-center gap-y-0 "
          onPointerLeave={leave}
        >
          {[SPACES.slice(0, 3), SPACES.slice(3)].map((row, ri) => (
            <ol
              key={ri}
              className="flex flex-wrap items-baseline justify-center gap-x-[0.45em] font-display text-[clamp(1.75rem,7vw,3.25rem)] leading-[1.08]  sm:flex-nowrap sm:gap-x-[0.5em] sm:text-[clamp(2rem,4.6vw,3.5rem)] sm:leading-[1.15]"
            >
              {row.map((s) => {
                const i = SPACES.indexOf(s);
                const active = pathname.startsWith(s.href);
                const dimmed = hovered !== null && hovered !== i;
                return (
                  <li key={s.href} data-notrim className="overflow-hidden ">
                    <Link
                      href={s.href}
                      onClick={() => setOpen(false)}
                      onPointerEnter={() => enter(i)}
                      onFocus={() => enter(i)}
                      onBlur={leave}
                      tabIndex={open ? 0 : -1}
                      aria-current={active ? "page" : undefined}
                      className="inline-flex items-start transition-opacity duration-500"
                      style={{ opacity: dimmed ? 0.25 : 1 }}
                    >
                      <span
                        data-menu-item
                        className="inline-flex flex-col items-start transition-colors duration-500"
                        style={{
                          color: hovered === i && live ? live : undefined,
                        }}
                      >
                        <span className="text-[0.19em] leading-none tracking-[0.18em] whitespace-nowrap uppercase opacity-60 mb-[0.4em]">
                          {s.role}
                        </span>
                        {s.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          ))}
        </nav>

        {/* Bottom — justify-between: Elsewhere (left) / Where (right) */}
        <div
          className="flex flex-col items-stretch gap-6 border-t pt-5 pr-16 transition-colors duration-500 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pr-0"
          style={{
            borderColor: live ?? "color-mix(in srgb, #1c1a17 15%, transparent)",
          }}
        >
          <div>
            {/* <p className="text-label uppercase opacity-45 mb-3">Elsewhere</p> */}
            <ul className="grid grid-cols-2 gap-x-5 gap-y-2 sm:flex sm:flex-wrap">
              {secondary.map((p) => (
                <li key={p.href}>
                  <OverlayExternalLink
                    href={p.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className={`group text-label inline-flex items-center gap-1.5 uppercase transition-opacity duration-300 hover:opacity-100 ${
                      pathname === p.href ? "opacity-100" : "opacity-60"
                    }`}
                  >
                    {p.label}
                    {p.count !== undefined && (
                      <sup
                        aria-hidden="true"
                        className="ml-0.5 text-[0.7em] leading-none tabular-nums opacity-60"
                      >
                        {String(p.count).padStart(2, "0")}
                      </sup>
                    )}
                  </OverlayExternalLink>
                </li>
              ))}
            </ul>
          </div>

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
