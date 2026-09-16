"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { ChevronDown, ChevronsRight, Volume2, VolumeX } from "lucide-react";
import { gsap, reduced } from "@/lib/gsap";

import { Button } from "@/components/shared/button";
import { BOUDHA } from "@/lib/photo";
import { claimIntro, finishIntro } from "@/features/preloader/gate";
import { setBellMuted, unlockBell, playResonantBell } from "@/lib/bell";
import {
  enterSilently,
  isSiteSoundMuted,
  prewarmIntroSound,
  setSiteSoundMuted,
  startPreloaderSound,
} from "@/features/preloader/audio";
import {
  FADE,
  FILL_BEAT,
  HOLD,
  LOGO_BIG,
  LOGO_MASK,
  LOGO_RATIO,
  LOGO_SRC,
  logoOnlyFor,
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

// Module scope evaluates once per document load. A hard refresh / fresh navigation
// re-evaluates this file, so `freshLoad` is true again and the film replays; a
// client-nav remount back to `/` reuses the module, finds it false, and honours the
// once-per-tab `SESSION_KEY` stamp instead of replaying the ~25s cinematic.
let freshLoad = true;

// `/?step` authoring mode — read once on the client, `false` during SSR + hydration
// so the step UI never causes a mismatch.
const noopSubscribe = () => () => {};
const readStepMode = () =>
  new URLSearchParams(window.location.search).has("step");
const stepModeServer = () => false;

const REST_HOLD = 2.5; // shrunk mark holds before the resting state fades in
const HOLD_1 = 0.4; // clean big wordmark holds after the write-on
const BLUR_ONLY = 1.6; // background blurs in; the mark stays solid + still
const SHRINK = 2.5; // then the window shrinks + drops
const SHRUNK_HOLD = 0.7; // shrunk window holds before the signboard fill
const REST_FADE = 1.5; // resting content comes up
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
  "Blur + shrink (filled)",
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

  // The client wants the film on every arrival at `/` — refresh and client-nav back
  // from another route (which remounts this component). So this is `false` unless
  // `ONCE_PER_SESSION` is flipped on, in which case a `sessionStorage` stamp makes it
  // play once per tab. Read once, at render, before any effect claims the intro gate.
  const seenRef = useRef(
    typeof window !== "undefined" &&
      ONCE_PER_SESSION &&
      !freshLoad &&
      window.sessionStorage.getItem(SESSION_KEY) === "1",
  );

  // On a real page load, drop any prior stamp so the film runs; later SPA remounts
  // keep this false and fall back to the stamp check above. `seenRef` above is read
  // before this effect clears the flag, so the first mount still plays.
  useLayoutEffect(() => {
    if (freshLoad) {
      window.sessionStorage.removeItem(SESSION_KEY);
      freshLoad = false;
    }
  }, []);

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

    // Portrait phones crop the Boudha frame hard, so the mark needs a different
    // width and offset there. Picked once on mount.
    const place = LOGO_BIG;

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

    // Where the mark rests permanently once the film reaches its final state — same
    // placement math the write-on's shrink step uses, shared here so the "jump
    // straight to rest" and "skip mid-film" paths can put it there directly too.
    // Match the supplied 1180 × 660 composition; keep the mark readable on phones.
    const restingLogoBounds = () => {
      const W = section.clientWidth;
      const H = section.clientHeight;
      const w = Math.min(W * (W < 640 ? 0.68 : 0.38), H * 0.7);
      return {
        width: w,
        height: w / LOGO_RATIO,
        left: W * 0.485 - w / 2,
        top: H * 0.17,
      };
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
      if (resting) layoutFlightRest();
      else layoutFlight();
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
    const dropWipe = () => {
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

    const tl = gsap.timeline({ onComplete: settle });
    tlRef.current = tl;
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __heroTl?: gsap.core.Timeline }).__heroTl = tl;
    }

    // Phase 1 — the Mustang frames, long cross-dissolves.
    q(".hero-page").forEach((page, i) => {
      if (i === 0) return;
      tl.to(
        page,
        { opacity: 1, duration: FADE, ease: "power1.inOut" },
        i * HOLD,
      );
    });

    const boudhaAt = (PHOTOS.length - 1) * HOLD;
    const glyphAt = boudhaAt + SHARP_BEAT;
    const solidAt = glyphAt + REVEAL_BEAT;
    const bigCleanAt = solidAt + FILL_BEAT; // big wordmark solid + clean over sharp Boudha
    const blurShrinkAt = bigCleanAt + HOLD_1; // short hold, then blur + shrink together
    const fillAt = blurShrinkAt + BLUR_ONLY + SHRUNK_HOLD; // bg → signboard (mark stays filled)
    const restAt = fillAt + FILL_BEAT + REST_HOLD; // final resting state begins here

    // Step 7: the solid mark moves into the reference composition.
    const shrinkFlight = () => {
      const el = flightEl();
      if (!el) return;
      resting = true;
      gsap.to(el, {
        ...restingLogoBounds(),
        duration: SHRINK,
        ease: "power2.inOut",
      });
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
      .call(
        () => {
          if (soundRef.current) playResonantBell();
        },
        [],
        glyphAt,
      )
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
      // Step 7 — after a short hold, the background blurs in AND the mark shrinks +
      // drops to its resting size, together. It stays a solid white fill throughout.
      .fromTo(
        q(".hero-blur"),
        { opacity: 0 },
        { opacity: 1, duration: BLUR_ONLY, ease: "power2.inOut" },
        blurShrinkAt,
      )
      .call(shrinkFlight, [], blurShrinkAt)
      // Step 8 — background fades to the signboard wall; the mark is already filled
      // and shrunk, so it just sits there while the wall arrives and the blur lifts.
      .to(
        q(".hero-sign"),
        { opacity: 1, duration: FILL_BEAT, ease: "power2.inOut" },
        fillAt,
      )
      .to(
        q(".hero-blur"),
        { opacity: 0, duration: FILL_BEAT, ease: "power2.inOut" },
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
      .call(finishIntro, [], restAt + 0.3)
      .to(
        q(".hero-rest"),
        { opacity: 1, duration: REST_FADE, ease: "power2.out" },
        restAt + 0.5,
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
        blurShrinkAt + Math.max(BLUR_ONLY, SHRINK), // blurred + shrunk, still filled
        fillAt + FILL_BEAT, // bg → signboard, mark stays filled at its shrunk size — final state
        tl.duration() - 0.05, // resting hero: text + scroll cue in
      ].map((t) => Math.max(0, t));
      stopsRef.current = stops;
      tl.pause(stops[0]);
    }

    // Turn sound on mid-film: build the graph, unmute, let the bell fire if its beat
    // has not passed yet.
    // Toggles: first press builds the audio graph and unmutes; every press after
    // flips mute on/off, updating the prompt's label + icon to match.
    const enableSound = () => {
      if (!soundRef.current) {
        soundRef.current = true;
        startPreloaderSound();
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

      finishIntro();
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
          sizes="80vw"
          className="object-contain"
        />
      </div>

      {/* The supplied wall texture behind the final brand composition. */}
      <div className="hero-sign absolute inset-0 opacity-0" aria-hidden>
        <Image
          src="/hero_final_image"
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
        className="hero-prompt absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-5 z-30 flex size-11 cursor-pointer items-center justify-center border border-space/30 bg-netsang text-ink opacity-0 backdrop-blur-md transition-colors hover:bg-[color-mix(in_srgb,var(--color-netsang)_82%,var(--color-ink))] sm:left-8"
        aria-label="Play with sound"
      >
        <span className="grid size-5 place-items-center">
          <VolumeX className="hero-prompt-off col-start-1 row-start-1 size-4" aria-hidden />
          <Volume2
            className="hero-prompt-on col-start-1 row-start-1 hidden size-4"
            aria-hidden
          />
        </span>
      </button>

      {/* Skip the cinematic. */}
      <button
        type="button"
        aria-label="Skip intro"
        className="hero-skip absolute bottom-[max(2rem,env(safe-area-inset-bottom))] right-5 z-30 flex size-11 cursor-pointer items-center justify-center border border-space/30 bg-netsang text-ink opacity-0 backdrop-blur-md transition-colors hover:bg-[color-mix(in_srgb,var(--color-netsang)_82%,var(--color-ink))] sm:right-8"
      >
        <ChevronsRight className="size-5" aria-hidden="true" />
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
      <div className="hero-rest absolute inset-x-0 top-[80%] px-6 text-center text-white opacity-0">
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
