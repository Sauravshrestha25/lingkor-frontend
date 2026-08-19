"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, reduced } from "@/lib/gsap";
import { WITH_PREVIEW } from "../nav";
import { NavOverlay } from "./NavOverlay";
import { Button } from "@/components/shared/button";
import {
  isBellMuted,
  isBellMutedOnServer,
  subscribeBell,
} from "@/lib/bell";

export default function Navbar() {
  const [past, setPast] = useState(false);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(WITH_PREVIEW[0]?.img);
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Read the mute preference as an external store: the server has no localStorage,
  // so it renders "on", and the client reconciles on hydration without an effect
  // writing state back into the component.
  const bellOff = useSyncExternalStore(
    subscribeBell,
    isBellMuted,
    isBellMutedOnServer,
  );

  // Navigating from inside the overlay must close it, or the new page arrives
  // underneath a full-screen menu that is still open. Adjusted during render rather
  // than in an effect — this is the "derive state from a changing value" case, and an
  // effect here would paint the new route with the menu still over it for one frame.
  const pathname = usePathname();
  const [routeAtOpen, setRouteAtOpen] = useState(pathname);
  if (routeAtOpen !== pathname) {
    setRouteAtOpen(pathname);
    setOpen(false);
  }

  // Past the hero the bar takes canvas ground and ink marks; it also gets out of the
  // way going down and comes back the moment you scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setPast(y > window.innerHeight * 0.7);
      const el = headerRef.current;
      if (el && !open) {
        const hide = y > last && y > 400;
        gsap.to(el, {
          yPercent: hide ? -100 : 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Overlay: panel wipes down, then the names rise in sequence.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    if (reduced()) {
      gsap.set(el, { clipPath: open ? "inset(0% 0 0 0)" : "inset(0 0 100% 0)" });
      return;
    }

    const items = el.querySelectorAll("[data-menu-item]");
    if (open) {
      gsap
        .timeline()
        .fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0% 0 0% 0)", duration: 0.8, ease: "power4.inOut" },
        )
        .fromTo(
          items,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: "power4.out" },
          "-=0.35",
        );
    } else {
      gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "power4.inOut",
      });
    }
  }, [open]);

  // The page must not scroll behind an open fullscreen menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Only the homepage has a dark hero for white marks to sit on. Everywhere else the
  // bar opens over canvas, so it must start in ink or the logo is invisible against
  // its own background.
  const overHero = pathname === "/" && !past;
  const mark = open || overHero ? "text-space" : "text-ink";
  const solid = !overHero && !open;

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? "bg-canvas/92 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        {/* Three columns with the logo in the middle one, not a flex row with the
            logo first: the mark stays optically centred in the viewport no matter
            how wide the labels either side get. */}
        <nav
          className={`mx-auto grid h-24 w-full shell-max grid-cols-[1fr_auto_1fr] items-center shell-px ${mark}`}
        >
          <div className="flex items-center">
            <Button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="text-label flex cursor-pointer items-center gap-3 uppercase"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 block h-px w-6 bg-current transition-all duration-400 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-6 bg-current transition-all duration-400 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
              <span className="text-trim hidden sm:inline">
                {open ? "Close" : "Menu"}
              </span>
            </Button>
          </div>

          <Link
            href="/"
            aria-label="Lingkor, home"
            className="relative block justify-self-center"
          >
            <Image
              src="/Logo/logo-white.svg"
              alt="Lingkor"
              width={200}
              height={120}
              priority
              className={`nav-logo h-11 w-auto object-contain transition-[filter] duration-500 sm:h-12 ${
                solid ? "invert" : ""
              }`}
            />
          </Link>

          <div className="flex items-center justify-end">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-label uppercase underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-transparent"
            >
              Enquire
            </Link>
          </div>
        </nav>
      </header>

      <NavOverlay
        overlayRef={overlayRef}
        open={open}
        pathname={pathname}
        preview={preview}
        setPreview={setPreview}
        setOpen={setOpen}
        bellOff={bellOff}
      />
    </>
  );
}
