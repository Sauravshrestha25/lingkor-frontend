"use client";

import type { RefObject } from "react";
import NextImage from "next/image";
import { Button } from "@/components/shared/button";
import { LOGO_INTRINSIC, LOGO_MASK, LOGO_SRC, LOGO_W, PHOTOS } from "../preloader";
import { BOUDHA } from "@/lib/photo";

/**
 * The intro's markup, with no timing in it.
 *
 * Every element here is a target the parent's single GSAP timeline drives by class
 * name — `.pl-stack`, `.pl-blur`, `.pl-mask-wrap`, `.pl-flat`, `.pl-bar-fill`. Those
 * class names are the contract between the two files: renaming one here silently
 * breaks a tween there, since GSAP fails quietly on a selector that matches nothing.
 */
export function IntroStage({
  root,
  onSkip,
}: {
  root: RefObject<HTMLDivElement | null>;
  onSkip: () => void;
}) {
  const boudha = BOUDHA;

  return (
    <div ref={root} className="fixed inset-0 z-100 overflow-hidden">
      <div className="pl-bg absolute inset-0 bg-ink" />

      {/* The stack: full-bleed frames dissolving into each other, in DOM order. */}
      <div className="pl-stack absolute inset-0" aria-hidden>
        {PHOTOS.map((src) => (
          <div key={src} className="pl-page absolute inset-0">
            <NextImage
              src={src}
              alt=""
              fill
              sizes="100vw"
              // The intro plays immediately, so none of these may wait for lazy
              // loading — a frame that arrives late is a frame the sequence skips.
              loading="eager"
              className="object-cover will-change-transform"
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        onClick={onSkip}
        className="absolute bottom-6 left-5 z-10 cursor-pointer rounded-full bg-white px-5 py-2.5 font-inter text-xs font-medium uppercase tracking-[0.2em] text-ink shadow-lg transition-opacity hover:opacity-85 sm:bottom-8 sm:left-8"
      >
        Skip
      </Button>

      {/* Softens everything behind it, edge to edge, with no transparent border. */}
      <div
        className="pl-blur pointer-events-none absolute inset-0 opacity-0"
        style={{
          backdropFilter: "blur(18px) brightness(0.6)",
          WebkitBackdropFilter: "blur(18px) brightness(0.6)",
        }}
      />

      {/* Quotes ride above the frames, one per photo. */}
      {/* <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
        <div className="relative w-full max-w-2xl text-center">
          {QUOTES.map((q, i) =>
            q ? (
              <div key={i} className="pl-quote absolute inset-x-0 top-1/2 -translate-y-1/2">
                <p className="text-balance font-inter text-[clamp(1.35rem,3.4vw,2.25rem)] font-semibold leading-snug tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]">
                  {q.text}
                </p>
                <p className="mt-5 font-inter text-xs font-semibold uppercase tracking-[0.3em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-sm">
                  {q.source}
                </p>
              </div>
            ) : null,
          )}
        </div>
      </div> */}

      {/* The lock: ONE masked container. Inside it, the clear Boudha frame in exact
          register with the blurred one behind, and a white sheet that dissolves in
          over it. Masking once is what keeps the letterform edges solid throughout. */}
      <div className="pl-mask-wrap absolute inset-0 opacity-0" style={LOGO_MASK}>
        {/* Same file and same `sizes` as the hero, so both resolve to one
            /_next/image URL and the handoff frame is already in cache. */}
        <NextImage
          src={boudha}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="object-cover"
        />
        <div className="pl-white absolute inset-0 bg-white opacity-0" />
      </div>

      {/* The flyer: same glyph, same size, as a real element. */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <NextImage
          src={LOGO_SRC}
          alt=""
          width={LOGO_INTRINSIC.width}
          height={LOGO_INTRINSIC.height}
          loading="eager"
          className="pl-flat h-auto opacity-0 will-change-transform"
          style={{ width: LOGO_W }}
        />
      </div>

      <div className="pl-bar absolute inset-x-0 bottom-0 h-px bg-white/20">
        <div className="pl-bar-fill h-full origin-left scale-x-0 bg-white/80" />
      </div>
    </div>
  );
}
