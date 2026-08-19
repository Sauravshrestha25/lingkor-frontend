"use client";

import type { RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shared/button";
import { setBellMuted } from "@/lib/bell";
import { NAV, SPACES, WITH_PREVIEW } from "../nav";

/**
 * The full-screen menu.
 *
 * Everything inside is `tabIndex={-1}` while closed. The panel stays mounted so its
 * clip-path can be animated, and a mounted-but-invisible panel is still in the tab
 * order — without this, tabbing from the header walks the user through a menu they
 * cannot see.
 */
export function NavOverlay({
  overlayRef,
  open,
  pathname,
  preview,
  setPreview,
  setOpen,
  bellOff,
}: {
  overlayRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  pathname: string;
  preview: string | undefined;
  setPreview: (src: string | undefined) => void;
  setOpen: (open: boolean) => void;
  bellOff: boolean;
}) {
  return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-ink text-space"
        style={{ clipPath: "inset(0 0 100% 0)" }}
        aria-hidden={!open}
      >
        <div className="mx-auto flex h-full w-full shell-max flex-col justify-center gap-16 shell-px pt-24 lg:flex-row lg:items-center lg:gap-24">
          <div className="lg:flex-1">
            <p className="text-label uppercase opacity-40">The five spaces</p>
            <ul className="mt-8">
              {SPACES.map((s) => (
                <li key={s.n} className="overflow-hidden">
                  <Link
                    data-menu-item
                    href={s.href}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => s.img && setPreview(s.img)}
                    onFocus={() => s.img && setPreview(s.img)}
                    tabIndex={open ? 0 : -1}
                    className="group flex items-baseline gap-5 py-1.5 opacity-0 transition-opacity duration-300 hover:opacity-100 lg:opacity-70"
                  >
                    <span className="text-label uppercase opacity-40">{s.n}</span>
                    <span className="font-display text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.15]">
                      {s.label}
                    </span>
                    <span className="text-label ml-auto hidden uppercase opacity-40 sm:block">
                      {s.role}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-[38%]">
            {/* Preview follows the hovered name. Hidden on small screens, where there
                is no hover and the image would only push the list off the fold. */}
            <div className="relative hidden aspect-[4/3] w-full overflow-hidden lg:block">
              {WITH_PREVIEW.map((s) => (
                <Image
                  key={s.img}
                  src={s.img}
                  alt=""
                  fill
                  sizes="38vw"
                  className={`object-cover transition-opacity duration-700 ${
                    preview === s.img ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 lg:mt-8">
              {NAV.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                    className={`text-label uppercase transition-opacity duration-300 hover:opacity-100 ${
                      pathname === p.href ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* The site makes a sound when you reach for the lists. Anything that can
                make noise unprompted needs a way to stop it, in reach, not buried. */}
            <Button
              type="button"
              onClick={() => setBellMuted(!bellOff)}
              tabIndex={open ? 0 : -1}
              aria-pressed={bellOff}
              className="text-label mt-10 cursor-pointer uppercase opacity-50 underline decoration-1 underline-offset-[6px] transition-opacity duration-300 hover:opacity-100"
            >
              {bellOff ? "Bell — off" : "Bell — on"}
            </Button>
          </div>
        </div>
      </div>
  );
}
