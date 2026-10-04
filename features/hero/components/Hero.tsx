"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ChevronDown, ChevronsRight, Volume2, VolumeX } from "lucide-react";
import { gsap, reduced } from "@/lib/gsap";

import { Button } from "@/components/shared/button";
import { BOUDHA } from "@/lib/photo";
import { claimIntro, finishIntro } from "@/features/preloader/gate";
import { setBellMuted, unlockBell } from "@/lib/bell";
import {
  enterSilently,
  fadeOutPreloaderSound,
  isSiteSoundMuted,
  prewarmIntroSound,
  setSiteSoundMuted,
  startPreloaderSound,
} from "@/features/preloader/audio";
import {
  FADE,
  FILL_BEAT,
  HOLD,
  bigLogoFor,
  LOGO_MASK,
  LOGO_RATIO,
  LOGO_SRC,
  logoOnlyFor,
  logoW,
  logoX,
  logoY,
  ONCE_PER_SESSION,
  PHOTOS,
  REVEAL_BEAT,
  SESSION_KEY,
  SHARP_BEAT,
  wipeMaskFor,
  WIPE_HIDDEN,
  WRITE_LEAD,
} from "@/features/preloader/preloader";

/**
 * The hero **is** the cinematic.
 *
 * The client wants the homepage to open straight into a 25–30s film — Mustang
 * geology, slowly, dissolving into Boudhanath and then the mark — scored to a ~25s
 * track, "but anytime, we should be able to scroll down". No door screen. So it is a
 * real section of the page: it starts the moment it mounts, plays muted (browsers
 * will not autoplay sound without a gesture), and a quiet "sound on" prompt fades in
 * over it. The page scrolls normally underneath, and the first scroll / wheel / key
 * fast-forwards the film to its resting state.
 *
 * The mark: the "Lingkor" wordmark is placed so its little spire glyph registers to
 * the real gold spire of the stupa in the Boudha frame, then it writes itself on
 * from that pinnacle downward ("as if it is built on top of it"), goes solid white,
 * and flies up into the navbar's own logo slot — which is where the intro hands off.
 * The hero then rests on the supplied wall image with the Tibetan name and tagline.
 *
 * Frames, mask geometry and every duration live in `features/preloader/preloader.ts`.
 */

// `/?step` authoring mode — read once on the client, `false` during SSR + hydration
// so the step UI never causes a mismatch.
const noopSubscribe = () => () => {};
const readStepMode = () =>
  new URLSearchParams(window.location.search).has("step");
const stepModeServer = () => false;

const REST_HOLD = 0.1; // mark holds before the resting state fades in
const HOLD_1 = 0.08; // clean big wordmark holds after the write-on, before the blur
const BLUR_ONLY = 1.0; // background blurs in; the mark stays solid + still, unmoved
const SHRUNK_HOLD = 0.2; // holds before the signboard fill
const SIGN_FADE = 1.0; // blur lifts / signboard arrives / mark shrinks
const REST_FADE = 0.5; // resting content comes up
const SKIP_IN_AT = 0.9; // when the skip button fades in
const PROMPT_IN_AT = 1.6; // when the sound prompt fades in

// Authoring aid: `/?step` freezes the cinematic at each scene / animation boundary
// and shows a "Next ▸" button to advance one beat at a time. Order matches the
// pauses added to the timeline below.
const STEP_NAMES = [
  "Mustang 1",
  "Mustang 2",
  "Mustang 3",
  "Mustang 4",
  "Boudhanath",
  "Big wordmark (drawn on)",
  "Blurred, mark unmoved (filled)",
  "BG → signboard (final state)",
  "Resting hero: text + cue",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const soundRef = useRef(false);

  const stepMode = useSyncExternalStore(
    noopSubscribe,
    readStepMode,
    stepModeServer,
  );
  const stopsRef = useRef<number[] | null>(null);
  const stepIRef = useRef(0);
  const [stepI, setStepI] = useState(0);
  const stepGo = (dir: number) => {
    const s = stopsRef.current;
    if (!s || !tlRef.current) return;
    const n = Math.min(Math.max(stepIRef.current + dir, 0), s.length - 1);
    stepIRef.current = n;
    tlRef.current.pause();
    tlRef.current.seek(s[n], false);
    setStepI(n);
  };

  // With `ONCE_PER_SESSION` on, a `sessionStorage` stamp skips the film on any later
  // mount in this tab, refresh included. Read once, at render, before any effect
  // claims the intro gate.
  const seenRef = useRef(
    typeof window !== "undefined" &&
      ONCE_PER_SESSION &&
      window.sessionStorage.getItem(SESSION_KEY) === "1",
  );

  // Before paint, so the below-the-fold reveals and the floating sound toggle stay
  // held until the film ends (see `afterIntro` / `isIntroActive`). Only skipped when
  // `ONCE_PER_SESSION` is on and the film has already run this tab.
  useLayoutEffect(() => {
    if (seenRef.current && !stepMode) return;
    claimIntro();
    unlockBell();
    enterSilently(); // muted by default; makes the mute flags read correctly
    prewarmIntroSound(); // buffer the audio so the click's play() lands on a ready element
  }, [stepMode]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    const prompt = () => q(".hero-prompt")[0] as HTMLElement | undefined;
    const flightEl = () => q(".hero-flight")[0] as HTMLElement | undefined;
    const maskEl = () => q(".hero-mask")[0] as HTMLElement | undefined;

    // Re-derived on resize — it depends on where the cover-scaled photo lands.
    let place = bigLogoFor(window.innerWidth, window.innerHeight);

    // The write-on mask is the whole "Lingkor" wordmark, spire glyph on the gold
    // spire — unchanged. The React inline `style={LOGO_MASK}` is the desktop default.
    const applyStartMask = () => {
      const el = maskEl();
      if (el) Object.assign(el.style, wipeMaskFor(place, WIPE_HIDDEN));
    };

    // The flat mark sits exactly where the write-on mask rendered it (spire glyph on
    // the gold spire). The bg fades from Boudhanath to the wall behind it; then it
    // flies, unmoved until then, to the navbar's logo slot.
    const layoutFlight = () => {
      const el = flightEl();
      if (!el) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const w = Math.min((place.vw / 100) * W, place.max);
      const h = w / LOGO_RATIO;
      gsap.set(el, {
        width: w,
        height: h,
        left: place.xF * (W - w),
        top: place.yF * (H - h),
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      });
    };

    // Final-state mark: the big mark scaled down, centred horizontally, top edge
    // fixed — so it never drifts up. Shared by the timeline
    // and the "jump to rest" / "skip mid-film" paths.
    // Final state on the signboard, from the client's reference frame: the mark is
    // 47.7% of the screen width, centred, its top at 12.3% of the height. Height-capped
    // on very wide screens; portrait gets a wider mark lower down.
    const restingLogoBounds = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const portrait = W < H;
      const w = portrait ? 0.8 * W : Math.min(0.477 * W, 0.916 * H);
      return {
        width: w,
        height: w / LOGO_RATIO,
        // Slightly left of centre, as in the reference (3% of the width).
        left: (W - w) / 2 - 0.03 * W,
        top: portrait ? 0.2 * H : 0.123 * H,
      };
    };
    // Glyph extent of a text block relative to its own box (the Tibetan font's
    // stacked letters reach far outside its line box).
    const glyphs = (el: HTMLElement | undefined) => {
      if (!el) return { above: 0, below: 0 };
      const r = document.createRange();
      r.selectNodeContents(el);
      const g = r.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      return { above: b.top - g.top, below: g.bottom - b.top };
    };
    // Tibetan name tucked just under the mark's flourish (the artwork's ink ends
    // at 95.4% of its box height).
    const tibetanTop = () => {
      const b = restingLogoBounds();
      const tib = q(".hero-tibetan")[0] as HTMLElement | undefined;
      return b.top + b.height * 0.954 + window.innerHeight * 0.01 + glyphs(tib).above;
    };
    // Tagline centred at 90% of the height on landscape (reference), straight under
    // the Tibetan name on portrait — never closer than a small gap to it.
    const taglineTop = () => {
      const H = window.innerHeight;
      const tib = q(".hero-tibetan")[0] as HTMLElement | undefined;
      const tag = q(".hero-tagline")[0] as HTMLElement | undefined;
      const tibBottom = tibetanTop() + glyphs(tib).below;
      const tagH = tag?.offsetHeight ?? 0;
      return window.innerWidth < H
        ? tibBottom + H * 0.06
        : Math.max(H * 0.9 - tagH / 2, tibBottom + H * 0.03);
    };
    let resting = false;
    const layoutFlightRest = () => {
      const el = flightEl();
      if (!el) return;
      resting = true;
      gsap.set(el, {
        ...restingLogoBounds(),
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
      });
      gsap.set(q(".hero-tibetan"), { top: tibetanTop() });
      gsap.set(q(".hero-tagline"), { top: taglineTop() });
    };

    const setStart = () => {
      gsap.set(q(".hero-page"), { opacity: 0 });
      gsap.set(q(".hero-page")[0], { opacity: 1 });
      gsap.set(
        [
          q(".hero-blur"),
          q(".hero-mask"),
          q(".hero-flight"),
          q(".hero-sign"),
          q(".hero-ground"),
          q(".hero-mask-photo"),
        ],
        { opacity: 0 },
      );
      gsap.set([q(".hero-rest"), q(".hero-prompt"), q(".hero-skip")], {
        opacity: 0,
      });
      applyStartMask();
      layoutFlight();
    };

    const jumpToRest = () => {
      gsap.set(q(".hero-page"), { opacity: 0 });
      gsap.set(q(".hero-page").at(-1) ?? q(".hero-page")[0], { opacity: 1 });
      gsap.set([q(".hero-blur"), q(".hero-mask")], {
        opacity: 0,
      });
      // The mark rests in place, permanently, as the logo.
      layoutFlightRest();
      gsap.set([q(".hero-prompt"), q(".hero-skip")], {
        opacity: 0,
        pointerEvents: "none",
      });
      // Rests on the signboard, not the Boudha ground. No overlay wash on it.
      gsap.set([q(".hero-sign"), q(".hero-rest")], {
        opacity: 1,
      });
      sessionStorage.setItem(SESSION_KEY, "1");
      finishIntro();
    };

    if (!stepMode && (reduced() || seenRef.current)) {
      jumpToRest();
      window.addEventListener("resize", layoutFlightRest);
      return () => window.removeEventListener("resize", layoutFlightRest);
    }

    setStart();
    const onResize = () => {
      place = bigLogoFor(window.innerWidth, window.innerHeight);
      if (resting) layoutFlightRest();
      else layoutFlight();
      // The write-on mask is sized/positioned from `place` too — re-apply it.
      const el = maskEl();
      if (!el) return;
      if (wipeDropped) {
        dropWipe();
      } else {
        const size = `${logoW(place)}, 100% 200%`;
        el.style.setProperty("-webkit-mask-size", size);
        el.style.maskSize = size;
        paintWipe();
      }
    };
    window.addEventListener("resize", onResize);

    // Count this play the moment it starts, so ANY reload from here on lands on the
    // resting hero. Deferred to an animation frame, not set inline: StrictMode's
    // dev-only mount → unmount → remount would otherwise stamp on the first run and
    // make the second run (the real one) skip the film. The frame fires after that
    // rehearsal has settled; the cleanup cancels it if this run was the rehearsal.
    const stampId = requestAnimationFrame(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
    });

    // The wipe layer's y is a list value GSAP cannot tween, so it is repainted each
    // frame: y from 100% (glyph hidden) to 0% (glyph shown) sweeps the reveal DOWN.
    const wipe = { y: 100 };
    const paintWipe = () => {
      const el = maskEl();
      if (!el) return;
      const pos = `${logoX(place)} ${logoY(place)}, ${logoX(place)} ${wipe.y}%`;
      el.style.setProperty("-webkit-mask-position", pos);
      el.style.maskPosition = pos;
    };
    let wipeDropped = false;
    const dropWipe = () => {
      wipeDropped = true;
      const el = maskEl();
      if (!el) return;
      const only = logoOnlyFor(place);
      el.style.maskImage = String(only.maskImage);
      el.style.maskPosition = String(only.maskPosition);
      el.style.maskSize = String(only.maskSize);
      el.style.setProperty("-webkit-mask-image", `url(${LOGO_SRC})`);
      el.style.setProperty("-webkit-mask-position", String(only.maskPosition));
      el.style.setProperty("-webkit-mask-size", String(only.maskSize));
    };

    const settle = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
    };

    // The music belongs to the film only — it fades out as the curtain lifts, on
    // every exit (natural end and skip alike).
    const endIntro = () => {
      finishIntro();
      fadeOutPreloaderSound();
    };

    const tl = gsap.timeline({ onComplete: settle });
    tlRef.current = tl;
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __heroTl?: gsap.core.Timeline }).__heroTl = tl;
    }

    // Phase 1 — the Mustang frames, long cross-dissolves.
    q(".hero-page").forEach((page, i) => {
      if (i === 0) return;
      // Melt: the incoming frame dissolves in soft-focus and sharpens as it lands.
      tl.fromTo(
        page,
        { opacity: 0, filter: "blur(14px)" },
        { opacity: 1, filter: "blur(0px)", duration: FADE, ease: "sine.inOut" },
        i * HOLD,
      );
    });

    const boudhaAt = (PHOTOS.length - 1) * HOLD;
    // Write-on waits for Boudha's melt to land, then a short sharp beat.
    const glyphAt = boudhaAt + Math.max(SHARP_BEAT, FADE + 0.77);
    const solidAt = glyphAt + REVEAL_BEAT;
    const bigCleanAt = solidAt + FILL_BEAT; // big wordmark solid + clean over sharp Boudha
    const blurShrinkAt = bigCleanAt + HOLD_1; // short hold, then blur + shrink together
    const fillAt = blurShrinkAt + BLUR_ONLY + SHRUNK_HOLD; // bg → signboard (mark stays filled)
    const restAt = fillAt + SIGN_FADE + REST_HOLD; // final resting state begins here

    // Once the shrink lands, resizes re-place the mark at its resting bounds.
    const markResting = () => {
      resting = true;
    };

    tl.fromTo(
      q(".hero-skip"),
      { opacity: 0, pointerEvents: "none" },
      { opacity: 1, pointerEvents: "auto", duration: 0.5, ease: "power2.out" },
      SKIP_IN_AT,
    )
      .fromTo(
        q(".hero-prompt"),
        { opacity: 0, pointerEvents: "none" },
        {
          opacity: 1,
          pointerEvents: "auto",
          duration: 0.6,
          ease: "power2.out",
        },
        PROMPT_IN_AT,
      )
      // Phase 2 — Boudhanath settles, then the big WHITE mark writes itself on from
      // the pinnacle downward over the sharp, undimmed frame (no blur, no dim). The
      // sound prompt + Skip stay up through the whole film (see the fade near the end).
      .set(q(".hero-mask"), { opacity: 1 }, glyphAt)
      .to(
        wipe,
        {
          y: 0,
          duration: REVEAL_BEAT - WRITE_LEAD,
          ease: "power2.inOut",
          onUpdate: paintWipe,
          onComplete: dropWipe,
        },
        glyphAt + WRITE_LEAD,
      )
      .call(layoutFlight, [], solidAt)
      // The written wordmark goes solid (mask hands off to the flat mark, same shape
      // and place)…
      .to(
        q(".hero-flight"),
        { opacity: 1, duration: FILL_BEAT, ease: "power2.inOut" },
        solidAt,
      )
      .to(
        q(".hero-mask"),
        { opacity: 0, duration: FILL_BEAT, ease: "power2.inOut" },
        solidAt + FILL_BEAT * 0.45,
      )
      // Step 7 — the background blurs in; the mark holds exactly where it first
      // appeared, solid and still.
      .fromTo(
        q(".hero-blur"),
        { opacity: 0 },
        { opacity: 1, duration: BLUR_ONLY, ease: "power2.inOut" },
        blurShrinkAt,
      )
      // Step 8 — background fades to the signboard wall while the mark shrinks in
      // place (top edge fixed) to make room for the Tibetan name below it.
      .to(
        q(".hero-flight"),
        {
          width: () => restingLogoBounds().width,
          height: () => restingLogoBounds().height,
          left: () => restingLogoBounds().left,
          top: () => restingLogoBounds().top,
          duration: SIGN_FADE,
          ease: "power2.inOut",
        },
        fillAt,
      )
      .set(q(".hero-tibetan"), { top: () => tibetanTop() }, fillAt)
      .set(q(".hero-tagline"), { top: () => taglineTop() }, fillAt)
      .call(markResting, [], fillAt + SIGN_FADE)
      .to(
        q(".hero-sign"),
        { opacity: 1, duration: SIGN_FADE, ease: "power2.inOut" },
        fillAt,
      )
      .to(
        q(".hero-blur"),
        { opacity: 0, duration: SIGN_FADE, ease: "power2.inOut" },
        fillAt,
      )
      // Phase 3 — this IS the final state: the mark stays put, on the signboard, no
      // overlay wash over it. The sound prompt + Skip retire, and "Rest in the
      // Spirit of Mustang" + the scroll cue fade in.
      .to(
        [q(".hero-prompt"), q(".hero-skip")],
        {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.5,
          ease: "power2.out",
        },
        restAt,
      )
      .call(endIntro, [], restAt + 0.1)
      .to(
        q(".hero-rest"),
        { opacity: 1, duration: REST_FADE, ease: "power2.out" },
        restAt + 0.2,
      );

    // Authoring: freeze at every scene / animation boundary. The Prev/Next buttons
    // `tl.tweenTo()` between these times (works in both directions). Line up with
    // STEP_NAMES.
    if (stepMode) {
      const stops = [
        0, // Mustang 1
        1 * HOLD + FADE, // Mustang 2 fully crossed in
        2 * HOLD + FADE, // Mustang 3
        3 * HOLD + FADE, // Mustang 4
        boudhaAt + FADE, // Boudhanath sharp
        bigCleanAt, // BIG wordmark drawn on, filled white, over sharp Boudha
        fillAt - 0.05, // blurred, mark unmoved, still filled
        fillAt + SIGN_FADE, // bg → signboard, mark stays filled at its shrunk size — final state
        tl.duration() - 0.05, // resting hero: text + scroll cue in
      ].map((t) => Math.max(0, t));
      stopsRef.current = stops;
      tl.pause(stops[0]);
    }

    // Turn sound on mid-film: start the music and unmute.
    // Toggles: first press builds the audio graph and unmutes; every press after
    // flips mute on/off, updating the prompt's label + icon to match.
    const enableSound = () => {
      if (!soundRef.current) {
        soundRef.current = true;
        startPreloaderSound(tl.time());
      }
      const nextMuted = !isSiteSoundMuted();
      setSiteSoundMuted(nextMuted);
      setBellMuted(nextMuted);
      const el = prompt();
      el?.setAttribute(
        "aria-label",
        nextMuted ? "Play with sound" : "Mute sound",
      );
      el?.querySelector(".hero-prompt-off")?.classList.toggle(
        "hidden",
        !nextMuted,
      );
      el?.querySelector(".hero-prompt-on")?.classList.toggle(
        "hidden",
        nextMuted,
      );
    };

    // Skip button / first scroll / wheel / key: leave the film and cross-fade to the
    // resting hero. Racing the timeline's progress to 1 flashed 20s of frames in a
    // second — this just dissolves whatever is on screen into the resting hero instead.
    let skipped = false;
    let ff: Array<() => void> = [];
    const skipToRest = (dur = 0.7) => {
      if (skipped) return;
      skipped = true;
      ff.forEach((off) => off());
      ff = [];
      tlRef.current?.kill();

      const leaving = [...q(".hero-page"), q(".hero-blur"), q(".hero-mask")];
      gsap.killTweensOf([
        ...leaving,
        q(".hero-flight"),
        q(".hero-sign"),
        q(".hero-rest"),
        q(".hero-prompt"),
        q(".hero-skip"),
      ]);

      gsap.to([q(".hero-prompt"), q(".hero-skip")], {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(leaving, { opacity: 0, duration: dur, ease: "power2.inOut" });
      // The mark snaps straight to its permanent resting place as the logo, no
      // matter which beat it was skipped from.
      layoutFlightRest();
      // Rests on the signboard — whatever fade it was mid-way through just continues
      // to full, rather than fading out and back in.
      gsap.to(q(".hero-sign"), {
        opacity: 1,
        duration: dur,
        ease: "power2.inOut",
      });
      gsap.to(q(".hero-rest"), {
        opacity: 1,
        duration: dur * 0.9,
        ease: "power2.out",
        delay: dur * 0.35,
      });

      endIntro();
      sessionStorage.setItem(SESSION_KEY, "1");
    };

    // NB: no `touchmove` — a tap on the sound prompt carries a few px of finger
    // movement, which fired this and ran skipToRest() instead of enableSound(): the
    // prompt vanished and sound never came on. `scroll` already covers a real
    // touch-drag scroll.
    const once: AddEventListenerOptions = { passive: true, once: true };
    if (!stepMode) {
      (["wheel", "scroll", "keydown"] as const).forEach((ev) => {
        const h = () => skipToRest();
        window.addEventListener(ev, h, once);
        ff.push(() => window.removeEventListener(ev, h));
      });
    }

    const promptEl = prompt();
    promptEl?.addEventListener("click", enableSound);
    const skipEl = q(".hero-skip")[0] as HTMLElement | undefined;
    const onSkip = () => skipToRest();
    skipEl?.addEventListener("click", onSkip);

    return () => {
      cancelAnimationFrame(stampId);
      ff.forEach((off) => off());
      window.removeEventListener("resize", onResize);
      promptEl?.removeEventListener("click", enableSound);
      skipEl?.removeEventListener("click", onSkip);
      tlRef.current?.kill();
    };
  }, [stepMode]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-svh w-full overflow-hidden bg-ink text-space"
    >
      {/* The frame stack — full-bleed, dissolving in DOM order. */}
      <div className="absolute inset-0" aria-hidden>
        {PHOTOS.map((src, i) => (
          <div key={src} className="hero-page absolute inset-0">
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              loading={i === 0 ? undefined : "eager"}
              className="object-cover will-change-transform"
            />
          </div>
        ))}
      </div>

      {/* Softens the stack while the mark writes on. */}
      <div
        className="hero-blur pointer-events-none absolute inset-0 opacity-0"
        style={{
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
        }}
        aria-hidden
      />

      {/* The mark, clipped by the glyph. White during the write-on (the Boudha photo
          child is hidden, so the wipe reveals solid white over a sharp, undimmed
          frame); the photo fades in later to turn the mark into a window. */}
      <div
        className="hero-mask absolute inset-0 bg-white opacity-0"
        style={LOGO_MASK}
        aria-hidden
      >
        <Image
          src={BOUDHA}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="hero-mask-photo object-cover opacity-0"
        />
      </div>

      {/* The solid mark — placed by JS over the written glyph, then flown to the
          navbar's logo slot. */}
      <div
        className="hero-flight absolute left-0 top-0 z-20 opacity-0 will-change-transform"
        aria-hidden
      >
        <Image
          src={LOGO_SRC}
          alt=""
          fill
          sizes="100vw"
          className="object-fill"
        />
      </div>

      {/* The supplied wall texture behind the final brand composition. */}
      <div className="hero-sign absolute inset-0 opacity-0" aria-hidden>
        <Image
          src="/hero-final-image.jpg"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="object-cover"
        />
      </div>

      {/* What the hero settles on once the mark has flown — the same Boudhanath
          frame the film ends on, held as its own layer so it can breathe under the
          resting content without the write-on mask on top of it. */}
      <div className="hero-ground absolute inset-0 opacity-0" aria-hidden>
        <Image
          src={BOUDHA}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="object-cover will-change-transform"
        />
      </div>

      {/* Quiet "sound on" prompt over the film — starts muted. */}
      <button
        type="button"
        className="hero-prompt absolute bottom-[max(0.5rem,env(safe-area-inset-bottom))] left-5 z-30 flex size-[7rem] cursor-pointer items-center justify-center text-white opacity-0 sm:left-8"
        aria-label="Play with sound"
      >
        <span className="grid size-[3rem] place-items-center">
          <VolumeX
            className="hero-prompt-off col-start-1 row-start-1 size-[2.5rem]"
            strokeWidth={2.5}
            aria-hidden
          />
          <Volume2
            className="hero-prompt-on col-start-1 row-start-1 hidden size-[2.5rem]"
            strokeWidth={2.5}
            aria-hidden
          />
        </span>
      </button>

      {/* Skip the cinematic. */}
      <button
        type="button"
        aria-label="Skip intro"
        className="hero-skip absolute bottom-[max(0.5rem,env(safe-area-inset-bottom))] right-5 z-30 flex size-[7rem] cursor-pointer items-center justify-center text-white opacity-0 sm:right-8"
      >
        <ChevronsRight className="size-[2.5rem]" strokeWidth={2.5} aria-hidden="true" />
      </button>

      {/* `/?step` authoring control — walk the cinematic one beat at a time. */}
      {stepMode && (
        <div className="fixed bottom-4 left-1/2 z-[999] flex -translate-x-1/2 items-stretch gap-1.5 font-mono text-xs uppercase tracking-widest">
          <Button
            type="button"
            onClick={() => stepGo(-1)}
            className="cursor-pointer rounded bg-black px-3 py-2 text-white"
          >
            ◂ Prev
          </Button>
          <span className="grid place-items-center rounded bg-black/70 px-3 py-2 text-white">
            {`${stepI + 1}/${STEP_NAMES.length} · ${STEP_NAMES[stepI]}`}
          </span>
          <Button
            type="button"
            onClick={() => stepGo(1)}
            className="cursor-pointer rounded bg-black px-3 py-2 text-white"
          >
            Next ▸
          </Button>
        </div>
      )}

      {/* Tibetan name and tagline follow the reference image's proportions. */}
      <div className="hero-rest hero-tibetan pointer-events-none absolute inset-x-0 top-[56%] text-center text-white opacity-0">
        <p lang="bo">གླིང་སྐོར།</p>
      </div>
      <div className="hero-rest hero-tagline absolute inset-x-0 top-[58%] px-6 text-center text-white opacity-0 landscape:top-[80%]">
        <p className="font-display text-[clamp(1.25rem,3.55vw,4rem)] font-normal leading-[1.2] tracking-[0.06em]">
          Rest in the Spirit of Mustang
        </p>
      </div>

      {/* Scroll cue — part of the resting state. */}
      <a
        href="#about"
        aria-label="Scroll to the next section"
        className="hero-rest group absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-space opacity-0"
      >
        <ChevronDown
          aria-hidden="true"
          className="size-5 animate-bounce opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        />
      </a>
    </section>
  );
}
