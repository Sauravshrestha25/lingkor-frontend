"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, reduced } from "@/lib/gsap";
import { NavOverlay } from "./NavOverlay";
import { Button } from "@/components/shared/button";
import { isBellMuted, isBellMutedOnServer, subscribeBell } from "@/lib/bell";

export default function Navbar() {
  const [past, setPast] = useState(false);
  const [open, setOpen] = useState(false);
  /*
   * The colour of whichever space is under the pointer inside the menu.
   *
   * It lives up here because the header and the overlay are DOM *siblings* — there is
   * no shared ancestor to hang a CSS variable on that isn't <body>. Lifting the one
   * value is cheaper and far more traceable than writing to documentElement from a
   * child and hoping nothing else reads it.
   */
  const [accent, setAccent] = useState<string | null>(null);
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

  /*
   * Whether the bar is currently sitting on top of something dark.
   *
   * The bar is transparent until the page scrolls, so its ink has to come from what is
   * underneath it — and that differs by route. The homepage opens on the lobby
   * photograph under a dark overlay and `/mustang` opens on `PageHeader tone="ink"`;
   * every other route opens on canvas or sand. A single light colour for all of them
   * would be invisible on five of the seven, so the two dark-topped routes are named
   * rather than assumed.
   *
   * If a future route opens dark, it goes in this list — or better, `PageHeader` grows
   * a way to declare it and this reads that instead of hard-coding paths.
   */
  const darkTop = pathname === "/" || pathname === "/mustang";

  const [routeAtOpen, setRouteAtOpen] = useState(pathname);
  if (routeAtOpen !== pathname) {
    setRouteAtOpen(pathname);
    setOpen(false);
  }

  // Like the reference, the bar is a quiet white constant. It gets out of the way
  // going down and comes back the moment the visitor reverses direction.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setPast(y > 12);
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
  //
  // ⚠️ The timeline is killed on every re-run. Without that, toggling the menu
  // faster than an animation lasts left two tweens alive on one clip-path, and
  // the last one to *finish* won rather than the last one started — so the panel
  // could sit fully clipped while React state, aria-expanded and the Close label
  // all said it was open. `overwrite` alone does not cover it, because the two
  // tweens are created in separate effect runs.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    const items = el.querySelectorAll("[data-menu-item]");

    if (reduced()) {
      gsap.set(el, {
        clipPath: open ? "inset(0% 0 0 0)" : "inset(0 0 100% 0)",
      });
      // The names carry `opacity-0` in the markup and are lifted by the timeline
      // below. This branch used to return before touching them, so with reduced
      // motion the panel opened onto a blank white screen — the one case where the
      // menu has to work without any animation at all.
      gsap.set(items, { opacity: 1, yPercent: 0 });
      return;
    }
    let tl: gsap.core.Timeline | gsap.core.Tween;
    if (open) {
      tl = gsap
        .timeline()
        .fromTo(
          el,
          { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0% 0 0% 0)", duration: 0.8, ease: "power4.inOut" },
        )
        .fromTo(
          items,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.06,
            ease: "power4.out",
          },
          "-=0.35",
        );
    } else {
      tl = gsap.to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.6,
        ease: "power4.inOut",
      });
    }

    return () => {
      tl.kill();
    };
  }, [open]);

  // The page must not scroll behind an open fullscreen menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        /*
          Transparent at rest, solid once the page moves.
          `bg-white` was unconditional, which put an opaque band across the top of the
          hero photograph — the one image on the site that is meant to run to the edge.
        */
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
          past || open
            ? "bg-white text-ink"
            : `bg-transparent ${darkTop ? "text-space" : "text-ink"}`
        } ${past && !open ? "shadow-[0_1px_0_rgba(28,26,23,0.1)]" : ""}`}
      >
        {/* Three columns with the logo in the middle one, not a flex row with the
            logo first: the mark stays optically centred in the viewport no matter
            how wide the labels either side get. */}
        <nav
          className="mx-auto grid h-24 w-full shell-max grid-cols-[1fr_auto_1fr] items-center shell-px"
        >
          <div className="flex items-center">
            <Button
              type="button"
              onClick={() => {
                setAccent(null);
                setOpen((v) => !v);
              }}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              style={{ color: accent ?? undefined }}
              className="text-label flex cursor-pointer items-center gap-3 uppercase transition-colors duration-500"
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
              /* The source is a white SVG, inverted to read as ink on a light bar.
                 Over a dark top it is already the right colour, so the invert comes
                 off — inverted, it was a black mark on a black photograph. */
              className={`nav-logo h-11 w-auto object-contain sm:h-12 ${
                !past && !open && darkTop ? "" : "invert"
              }`}
            />
          </Link>

          <div className="flex items-center justify-end">
            <Link
              href="/contact"
              onClick={() => {
                setAccent(null);
                setOpen(false);
              }}
              style={{ color: accent ?? undefined }}
              className="text-label uppercase underline decoration-1 underline-offset-[6px] transition-[text-decoration-color,color] duration-500 hover:decoration-transparent"
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
        setOpen={(next) => {
          if (!next) setAccent(null);
          setOpen(next);
        }}
        bellOff={bellOff}
        onAccent={setAccent}
      />
    </>
  );
}
