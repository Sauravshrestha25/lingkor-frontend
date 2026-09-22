"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, reduced } from "@/lib/gsap";
import { NavOverlay } from "./NavOverlay";
import { Button } from "@/components/shared/button";
import { ExternalLinkIcon } from "@/components/shared/ExternalLinkIcon";
import { getLenis } from "@/lib/lenis";
import { isIntroActive, subscribeIntroActive } from "@/features/preloader/gate";
import {
  getSpacesNav,
  getSpacesNavServer,
  subscribeSpacesNav,
} from "@/features/home/spacesNav";

export default function Navbar() {
  const [past, setPast] = useState(false);
  const [open, setOpen] = useState(false);
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

  // While the hero cinematic is playing on the homepage, the Menu button and the
  // Enquire link stay off-screen — the film owns the frame until the visitor
  // scrolls (which also fast-forwards it) or it finishes on its own. Both exits
  // clear the intro gate, which re-renders this via the store below.
  const introActive = useSyncExternalStore(
    subscribeIntroActive,
    isIntroActive,
    () => false,
  );
  const heroPlaying = introActive && !past;

  // The pinned homepage spaces circuit is its own full-bleed colour per panel; while
  // it owns the frame the bar goes transparent and just swaps its own text/logo
  // colour to match, panel by panel, instead of the usual scroll-based rule below.
  const spacesNav = useSyncExternalStore(
    subscribeSpacesNav,
    getSpacesNav,
    getSpacesNavServer,
  );

  const [routeAtOpen, setRouteAtOpen] = useState(pathname);
  if (routeAtOpen !== pathname) {
    setRouteAtOpen(pathname);
    setOpen(false);
  }

  // On the homepage only: the bar stays off-screen for the entire hero section — the
  // ~30s cinematic and its resting state alike — and slides in once the visitor
  // scrolls past it into the next section. It hides again on scrolling back up into
  // the hero. Every other route keeps the bar always on screen (see `onScroll`
  // below, which leaves `pastHero` at its initial `true` there).
  const [pastHero, setPastHero] = useState(true);
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const syncPastHero = () => {
      if (pathname !== "/") {
        setPastHero(true);
        return;
      }
      const hero = document.getElementById("top");
      setPastHero(hero ? hero.getBoundingClientRect().bottom <= 0 : true);
    };
    syncPastHero();
  }, [pathname]);

  const hideForHero = pathname === "/" && !pastHero;

  // The bar is otherwise a persistent fixture — always on screen, never hidden on
  // scroll direction. It only ever changes transparent-vs-solid, tracked here.
  useEffect(() => {
    const onScroll = (scrollY?: number) => {
      const y = scrollY ?? window.scrollY;
      // 1px, not 12. The bar is transparent *only* while the page is genuinely at
      // rest at the top; the first perceptible movement should already have made it
      // solid, because the moment the hero starts sliding underneath it there is
      // photograph behind the labels rather than sky.
      setPast(y > 1);
      if (pathnameRef.current === "/") {
        const hero = document.getElementById("top");
        setPastHero(hero ? hero.getBoundingClientRect().bottom <= 0 : true);
      }
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
  }, []);

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
    const onKeyDown = (event: KeyboardEvent) => {
      if (open && event.key === "Escape") {
        setOpen(false);
        headerRef.current?.querySelector<HTMLButtonElement>("[aria-controls='site-menu']")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
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
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-brand ${
          hideForHero ? "-translate-y-full" : "translate-y-0"
        } ${
          open
            ? "bg-[#f7f0e1] text-ink"
            : spacesNav.active
              ? `bg-transparent ${spacesNav.dark ? "text-space" : "text-ink"}`
              : past
                ? "bg-[#f7f0e1] text-ink"
                : `bg-transparent ${darkTop ? "text-space" : "text-ink"}`
        } ${past && !open && !spacesNav.active ? "shadow-[0_1px_0_rgba(28,26,23,0.1)]" : ""}`}
      >
        {/* Three columns with the logo in the middle one, not a flex row with the
            logo first: the mark stays optically centred in the viewport no matter
            how wide the labels either side get. */}
        <nav className="mx-auto flex h-20 w-full items-center justify-between shell-max shell-px sm:grid sm:h-22 sm:grid-cols-[1fr_auto_1fr]">
          <div
            className={`order-2 flex items-center transition-opacity duration-500 sm:order-none ${
              heroPlaying ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <Button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="text-label flex cursor-pointer items-center gap-3 uppercase transition-colors duration-500"
            >
              <span className="text-trim">
                {open ? "Close" : "Menu"}
              </span>
            </Button>
          </div>

          <Link
            href="/"
            aria-label="Lingkor, home"
            aria-hidden={heroPlaying}
            tabIndex={heroPlaying ? -1 : undefined}
            /*
              Kept in layout (opacity, not display) so the hero cinematic's mark has a
              stable rect to fly into — it lands here as the intro ends and this fades
              up underneath it. Hidden meanwhile so it does not double the wordmark
              baked at the top of the flying artwork.
            */
            className={`relative order-1 block transition-opacity duration-500 sm:order-none sm:justify-self-center ${
              heroPlaying ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            {/* Brick ("Rato mato") on any white / off-white bar, per the client;
                the white mark only over a dark photo top. Two files rather than a
                CSS filter — an inverted white SVG rendered as near-black ink, not
                the brand colour. */}
            <Image
              src={
                !open && (spacesNav.active ? spacesNav.dark : !past && darkTop)
                  ? "/Logo/logo-white.svg"
                  : "/Logo/logo-brick.svg"
              }
              alt="Lingkor"
              width={200}
              height={120}
              priority
              className="nav-logo h-16 w-auto object-contain sm:h-18"
            />
          </Link>

          <div
            className={`hidden items-center justify-end gap-6 transition-opacity duration-500 sm:flex ${
              heroPlaying ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <Button asChild><Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="group text-label inline-flex items-center gap-1.5 uppercase"
            >
              Enquire
              <ExternalLinkIcon size={11} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link></Button>
          </div>
        </nav>
      </header>

      <NavOverlay
        overlayRef={overlayRef}
        open={open}
        pathname={pathname}
        setOpen={setOpen}
      />
    </>
  );
}
