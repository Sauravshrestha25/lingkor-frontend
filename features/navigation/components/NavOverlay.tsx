"use client";

import { useState, type RefObject } from "react";
import Link from "next/link";
import { NAV, SPACES } from "../nav";
import { POSTS } from "@/lib/journal";
import { MenuCursorPlate } from "./MenuCursorPlate";

/**
 * The full-screen menu, after the one on fleava.com.
 *
 * **The structure is theirs**, measured live rather than eyeballed: the destinations are
 * not a stacked list. They run *inline and wrap like a line of prose* — at a 900px
 * viewport `Home` sat at x135, `Works 17` at x312, `Journal 33` at x512, and
 * `Expertise 06` wrapped back to x135. A menu that reads as one sentence of places.
 * Under it, a band of much smaller links carries everything else.
 *
 * **The content is ours, and inverted from theirs.** The five element spaces hold the
 * big line, because they are what the hotel actually is; Home, Rooms, Journal, Mustang,
 * Boudha, About and Contact drop to the band underneath. Pointing at a space brings its
 * photograph up on a plate that follows the cursor, washes the menu in a light tint of
 * that element's colour, and runs the colour through the name, its role, the rule and
 * the header controls.
 *
 * ⚠️ **Namkha is the exception, by design.** Space's colour is `#F0EDE6` — the identical
 * off-white the site is built on, because Namkha *is* the ground. It therefore has no
 * tint that would be visible and no accent that would read on white, so it shows its
 * photograph and leaves the colour alone. See `tintable` in `../nav`.
 *
 * The bottom band never drives colour or imagery. Only the spaces do, which is what
 * keeps the effect meaning something.
 */
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
  /** Lifts the hovered space's colour to the header, which is a DOM sibling. */
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
      className="fixed inset-0 z-40 text-ink"
      style={{
        clipPath: "inset(0 0 100% 0)",
        /*
          The wash. `color-mix` against white rather than five hand-picked pale
          variants: one rule, five colours, and it stays correct if a brand hex is ever
          corrected. 10% is about as far as this goes before label-sized type sitting
          on it drops under AA.
        */
        backgroundColor: live
          ? `color-mix(in srgb, ${live} 10%, white)`
          : "#ffffff",
        transition: "background-color 600ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      aria-hidden={!open}
    >
      <MenuCursorPlate
        open={open}
        active={hovered}
        images={SPACES.map((s) => ({ src: s.img, alt: "" }))}
      />

      <div className="relative z-20 mx-auto flex h-full w-full shell-max flex-col justify-between overflow-y-auto shell-px pt-32 pb-10 lg:pt-40 lg:pb-14">
        {/* ── The five spaces, as one wrapping line ──────────────────────────
            `flex-wrap` with a word-sized column gap is what produces the
            reference's behaviour: names sit shoulder to shoulder and break to a
            new line only when they run out of width. A grid would lock them into
            columns and lose exactly the quality being copied. The gap is in `em`
            so it stays proportional as the clamp scales. */}
        {/*
          The leave handler sits on the names region, not on the overlay.

          On the overlay it only fired when the pointer left the *menu*, so crossing
          from a name into the empty space beside it left the photograph up and the
          tint on — pointing at nothing, still showing something. Bound here, the
          plate goes the moment the pointer is off the words.
        */}
        <nav className="flex flex-1 items-center" onPointerLeave={leave}>
          <ol className="flex flex-wrap items-baseline gap-x-[0.5em] gap-y-1 font-display text-[clamp(2rem,5.4vw,4.5rem)] leading-[1.2] tracking-[-0.017em]">
            {SPACES.map((s, i) => {
              const active = pathname.startsWith(s.href);
              const dimmed = hovered !== null && hovered !== i;
              // `data-notrim`, and padding on both edges of the mask below.
              //
              // The mask is `overflow-hidden` (the names rise into it) and the global
              // base rule in globals.css trims every box to cap height, so the line
              // box stopped at the baseline and descenders were sliced off — 18px
              // gone from the g of Ghegu. Top padding too, because the role tag is a
              // <sup> and rises above the cap line.
              return (
                <li
                  key={s.href}
                  data-notrim
                  className="overflow-hidden pt-[0.3em] pb-[0.14em]"
                >
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
                    {/*
                      Two elements, on purpose. The link owns the hover and the dim,
                      the span owns the entrance, and they must not be the same node:
                      GSAP tweens `opacity` on `[data-menu-item]`, and when a CSS
                      `transition-opacity` sat on that same element the transition
                      chased the tween every frame and the names settled at 0.09.

                      The initial hidden state is a *class*, never a React `style`
                      prop — GSAP writes inline styles, which beat a class, but React
                      re-applies a style prop on every render and re-zeroed the
                      opacity mid-animation. Class: no conflict. Prop: React wins.
                    */}
                    <span
                      data-menu-item
                      className="inline-flex items-start opacity-0 transition-colors duration-500"
                      style={{
                        color: hovered === i && live ? live : undefined,
                      }}
                    >
                      {s.label}
                      <sup className="ml-2 text-[0.19em] leading-none tracking-[0.18em] whitespace-nowrap uppercase opacity-60">
                        {s.role}
                      </sup>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* ── Everything else ────────────────────────────────────────────────
            Label-sized and deliberately inert: it takes no colour and shows no
            image, so the five spaces above stay the only thing in here that
            reacts to the pointer. */}
        <div
          className="mt-16 border-t pt-8 transition-colors duration-500"
          style={{
            borderColor: live ?? "color-mix(in srgb, #1c1a17 15%, transparent)",
          }}
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            <div className="col-span-2">
              <p className="text-label uppercase opacity-45">Elsewhere</p>
              <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
                {secondary.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      onClick={() => setOpen(false)}
                      tabIndex={open ? 0 : -1}
                      className={`text-label inline-flex items-start uppercase transition-opacity duration-300 hover:opacity-45 ${
                        pathname === p.href ? "opacity-100" : "opacity-70"
                      }`}
                    >
                      {p.label}
                      {p.count !== undefined && (
                        <sup
                          aria-hidden="true"
                          className="ml-1 text-[0.7em] leading-none tabular-nums opacity-60"
                        >
                          {String(p.count).padStart(2, "0")}
                        </sup>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-label uppercase opacity-45">Where</p>
              <p className="text-label mt-4 uppercase opacity-70">
                Boudha, Kathmandu
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
