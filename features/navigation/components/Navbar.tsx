"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, reduced } from "@/lib/gsap";
import { NavOverlay } from "./NavOverlay";
import { Button } from "@/components/shared/button";
import { getLenis } from "@/lib/lenis";

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

  // Navigating from inside the overlay must close it, or the new page arrives
  // underneath a full-screen menu that is still open. Adjusted during render rather
  // than in an effect — this is the "derive state from a changing value" case, and an
  // effect here would paint the new route with the menu still over it for one frame.
  const pathname = usePathname();

  /*
   * Whether the bar is currently sitting on top of something dark.
   *
   * The bar is transparent until the page scrolls, so its ink has to come from what is
   * underneath it — and that differs by route. The homepage and individual space
   * pages open on photographs under a dark overlay, while `/mustang` opens on an ink
   * header. The remaining routes open on canvas or sand.
   *
   * If a future route opens dark, it goes in this list — or better, `PageHeader` grows
   * a way to declare it and this reads that instead of hard-coding paths.
   */
  const darkTop =
    pathname === "/" ||
    pathname === "/mustang" ||
    pathname.startsWith("/spaces/");

  const [routeAtOpen, setRouteAtOpen] = useState(pathname);
  if (routeAtOpen !== pathname) {
    setRouteAtOpen(pathname);
    setOpen(false);
  }

  // Like the reference, the bar is a quiet white constant. It gets out of the way
  // going down and comes back the moment the visitor reverses direction.
  useEffect(() => {
    let last = window.scrollY;
    let hidden = false;
    const onScroll = (scrollY?: number) => {
      const y = scrollY ?? window.scrollY;
      // 1px, not 12. The bar is transparent *only* while the page is genuinely at
      // rest at the top; the first perceptible movement should already have made it
      // solid, because the moment the hero starts sliding underneath it there is
      // photograph behind the labels rather than sky.
      setPast(y > 1);
      const el = headerRef.current;
      // A no-movement echo, not a scroll. `lenis.stop()`/`.start()` — the pinned
      // spaces circuit calls both on every panel gesture — each end in `reset()` then
      // `emit()`, which fires a 'scroll' event carrying the position it was already
      // at. That lands here as `y === last`, and `hide = y > last && ...` reads any
      // non-decrease as "scrolling up": the bar popped visible the instant you
      // entered the circuit, then could not hide again until you left it, because no
      // further scroll events fire while the page is pinned. Bailing out on an exact
      // repeat is what keeps the bar in whatever state it was actually left in.
      if (y === last) return;
      if (el && !open) {
        const hide = y > last && y > 80;
        // Only on a change of state. This used to run on every scroll event — with
        // Lenis emitting one per frame that is a fresh tween sixty times a second,
        // each rewriting the header's inline style, which also kept interrupting the
        // background transition so it never reached its target and sat frozen at a
        // part-way blend.
        if (hide !== hidden) {
          hidden = hide;
          gsap.to(el, {
            yPercent: hide ? -100 : 0,
            duration: 0.5,
            ease: "power3.out",
            overwrite: true,
          });
        }
      }
      last = y;
    };

    /*
     * Driven by Lenis where it exists, and by the native event otherwise.
     *
     * Lenis eases each wheel gesture over ~1.1s, writing a new scroll position every
     * frame. The native `scroll` event does fire for those writes, but it arrives
     * after the frame has painted and is subject to the browser's own coalescing — so
     * the hero could be a hundred pixels up the screen while the bar was still
     * transparent, and it only caught up once the easing settled. Subscribing to
     * Lenis puts this on the same tick as the movement itself.
     *
     * The native listener stays as the fallback path: under `prefers-reduced-motion`
     * SmoothScroll never starts, so there is no Lenis to subscribe to.
     */
    const lenis = getLenis();
    const onLenisScroll = ({ scroll }: { scroll: number }) => onScroll(scroll);
    const onNativeScroll = () => onScroll();
    if (lenis) {
      lenis.on("scroll", onLenisScroll);
    } else {
      window.addEventListener("scroll", onNativeScroll, { passive: true });
    }
    onScroll();

    return () => {
      if (lenis) {
        lenis.off("scroll", onLenisScroll);
      } else {
        window.removeEventListener("scroll", onNativeScroll);
      }
    };
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
        /*
          No transition on the ground. Transparent-at-rest / solid-once-moving is a
          binary state, and a fade only ever showed a half-opaque bar over the
          photograph while it made its mind up. The shadow keeps its own transition.
        */
        className={`fixed inset-x-0 top-0 z-50 ${
          past || open
            ? "bg-white text-ink"
            : `bg-transparent ${darkTop ? "text-space" : "text-ink"}`
        } ${past && !open ? "shadow-[0_1px_0_rgba(28,26,23,0.1)]" : ""}`}
      >
        {/* Three columns with the logo in the middle one, not a flex row with the
            logo first: the mark stays optically centred in the viewport no matter
            how wide the labels either side get. */}
        <nav className="mx-auto grid h-24 w-full shell-max grid-cols-[1fr_auto_1fr] items-center shell-px">
          <div className="flex items-center">
            <Button
              type="button"
              onClick={() => {
                setAccent(null);
                setOpen((v) => !v);
              }}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              style={{ color: open ? (accent ?? undefined) : undefined }}
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
              style={{ color: open ? (accent ?? undefined) : undefined }}
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
        onAccent={setAccent}
      />
    </>
  );
}
