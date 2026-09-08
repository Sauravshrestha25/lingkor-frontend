"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import { gsap, reduced } from "@/lib/gsap";

import { SplitChars, Rise } from "@/components/anim";
import { Button } from "@/components/shared/button";
import { BOUDHA } from "@/lib/photo";
import { claimIntro, finishIntro } from "@/features/preloader/gate";
import { setBellMuted, unlockBell, playResonantBell } from "@/lib/bell";
import {
  enterSilently,
  fadeOutPreloaderSound,
  isSiteSoundMuted,
  prewarmIntroSound,
  setSiteSoundMuted,
  startPreloaderSound,
  transitionToSiteSound,
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
 * The hero then rests on the same Boudhanath frame the film ended on.
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

const SITE_MUSIC_AFTER_BELL_MS = 600; // brief gap before the site loop takes over
const REST_HOLD = 1.0; // solid mark holds before it flies
const HOLD_1 = 0.6; // clean big wordmark holds after the write-on
const BLUR_ONLY = 2.0; // background blurs in; the mark stays solid + still
const WINDOW_FADE = 1.5; // solid mark → window (photo through the letterforms)
const SHRINK = 2.5; // then the window shrinks + drops
const SHRUNK_HOLD = 1.0; // shrunk window holds before the signboard fill
const FLIGHT = 1.6; // mark travels to the navbar slot
const REST_FADE = 2.0; // resting content comes up
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
  "Blur (mark solid)",
  "Window (transparent)",
  "Shrink + drop",
  "BG → signboard, svg fills",
  "Set beat (pre-flight)",
  "Mid-flight",
  "Landed / bg → home",
  "Resting hero",
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
      gsap.set(
        [q(".hero-rest"), q(".hero-scrim"), q(".hero-prompt"), q(".hero-skip")],
        { opacity: 0 },
      );
      applyStartMask();
      layoutFlight();
    };

    const jumpToRest = () => {
      gsap.set(q(".hero-page"), { opacity: 0 });
      gsap.set(q(".hero-page").at(-1) ?? q(".hero-page")[0], { opacity: 1 });
      gsap.set(
        [q(".hero-blur"), q(".hero-mask"), q(".hero-flight"), q(".hero-sign")],
        {
          opacity: 0,
        },
      );
      gsap.set([q(".hero-prompt"), q(".hero-skip")], {
        opacity: 0,
        pointerEvents: "none",
      });
      gsap.set([q(".hero-ground"), q(".hero-scrim"), q(".hero-rest")], {
        opacity: 1,
      });
      sessionStorage.setItem(SESSION_KEY, "1");
      finishIntro();
    };

    if (!stepMode && (reduced() || seenRef.current)) {
      jumpToRest();
      return;
    }

    setStart();
    window.addEventListener("resize", layoutFlight);

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

    const hidePrompt = () => {
      const el = prompt();
      if (el)
        gsap.to(el, {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.4,
          ease: "power2.out",
        });
    };

    // FLIP the flat mark from where it sits to the navbar's own logo slot.
    const flyToNavbar = () => {
      const el = flightEl();
      if (!el) return;
      const nav = document.querySelector(".nav-logo") as HTMLElement | null;
      const from = el.getBoundingClientRect();
      const to = nav?.getBoundingClientRect();
      const target = to
        ? {
            x: to.left + to.width / 2 - (from.left + from.width / 2),
            y: to.top + to.height / 2 - (from.top + from.height / 2),
            scale: to.width / from.width,
          }
        : { x: 0, y: -window.innerHeight * 0.42, scale: 0.16 };
      gsap.to(el, { ...target, duration: FLIGHT, ease: "power2.inOut" });
    };

    const settle = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      if (soundRef.current) {
        fadeOutPreloaderSound();
        transitionToSiteSound(SITE_MUSIC_AFTER_BELL_MS);
      }
      const ground = q(".hero-ground")[0];
      if (ground) {
        gsap.to(ground, {
          scale: 1.08,
          duration: 24,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
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
    const blurAt = bigCleanAt + HOLD_1; // short hold, then the blur-only beat starts
    const windowAt = blurAt + BLUR_ONLY; // 2s blur done; solid mark → window
    const shrinkAt = windowAt + WINDOW_FADE; // window done; THEN it shrinks + drops
    const fillAt = shrinkAt + SHRINK + SHRUNK_HOLD; // bg → signboard, window → solid fill
    const flightAt = fillAt + FILL_BEAT + REST_HOLD;

    // Step 8: the wordmark window shrinks and moves down + right, anchored on its own
    // mask-position point.
    const MASK_SMALL = 0.6;
    const MASK_DOWN = 17; // percentage points added to the mask-position Y
    const MASK_RIGHT = 3; // percentage points added to the mask-position X
    const maskShrink = { k: 1, x: place.xF * 100, y: place.yF * 100 };
    const paintShrink = () => {
      const el = maskEl();
      if (!el) return;
      const size = `min(${place.vw * maskShrink.k}vw, ${place.max * maskShrink.k}px)`;
      const pos = `${maskShrink.x}% ${maskShrink.y}%`;
      el.style.maskSize = size;
      el.style.setProperty("-webkit-mask-size", size);
      el.style.maskPosition = pos;
      el.style.setProperty("-webkit-mask-position", pos);
    };

    // Step 9: the flat white mark takes over from the window at exactly the shrunk
    // window's size and position.
    const shrunkPlace = {
      vw: place.vw * MASK_SMALL,
      max: place.max * MASK_SMALL,
      xF: place.xF + MASK_RIGHT / 100,
      yF: place.yF + MASK_DOWN / 100,
    };
    const layoutFlightShrunk = () => {
      const el = flightEl();
      if (!el) return;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const w = Math.min((shrunkPlace.vw / 100) * W, shrunkPlace.max);
      const h = w / LOGO_RATIO;
      gsap.set(el, {
        width: w,
        height: h,
        left: shrunkPlace.xF * (W - w),
        top: shrunkPlace.yF * (H - h),
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
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
      // the pinnacle downward over the sharp, undimmed frame (no blur, no dim).
      .set(q(".hero-mask"), { opacity: 1 }, glyphAt)
      .call(hidePrompt, [], glyphAt)
      .to(
        q(".hero-skip"),
        {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.4,
          ease: "power2.out",
        },
        glyphAt,
      )
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
      // Step 7 — after a 1s hold, the background blurs in over 2s. The mark stays a
      // solid white fill, big and still.
      .fromTo(
        q(".hero-blur"),
        { opacity: 0 },
        { opacity: 1, duration: BLUR_ONLY, ease: "power2.inOut" },
        blurAt,
      )
      // Step 8 — the solid mark first turns into a window (its Boudha-photo layer
      // fades in so the sharp frame shows through the letterforms)...
      .to(
        q(".hero-flight"),
        { opacity: 0, duration: WINDOW_FADE, ease: "power2.inOut" },
        windowAt,
      )
      .to(
        q(".hero-mask"),
        { opacity: 1, duration: WINDOW_FADE, ease: "power2.inOut" },
        windowAt,
      )
      .to(
        q(".hero-mask-photo"),
        { opacity: 1, duration: WINDOW_FADE, ease: "power2.inOut" },
        windowAt,
      )
      // Step 9 — ...then the window shrinks + drops.
      .to(
        maskShrink,
        {
          k: MASK_SMALL,
          x: place.xF * 100 + MASK_RIGHT,
          y: place.yF * 100 + MASK_DOWN,
          duration: SHRINK,
          ease: "power2.inOut",
          onUpdate: paintShrink,
        },
        shrinkAt,
      )
      // Step 9 — background fades to the signboard wall and the window becomes a
      // solid white mark, at this same shrunk size.
      .call(layoutFlightShrunk, [], fillAt)
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
      .to(
        q(".hero-mask"),
        { opacity: 0, duration: FILL_BEAT * 0.7, ease: "power2.inOut" },
        fillAt,
      )
      .to(
        q(".hero-flight"),
        { opacity: 1, duration: FILL_BEAT, ease: "power2.inOut" },
        fillAt,
      )
      // A small "set" beat before it lifts.
      .to(
        q(".hero-flight"),
        { scale: 1.02, duration: 0.2, ease: "power2.out" },
        flightAt - 0.9,
      )
      .to(
        q(".hero-flight"),
        { scale: 1, duration: 0.35, ease: "power2.inOut" },
        flightAt - 0.7,
      )
      // Phase 3 — the mark flies up to the navbar; the resting content comes up over
      // the wall behind it.
      .call(flyToNavbar, [], flightAt)
      // Release the below-the-fold reveals only as the resting hero actually starts
      // fading up — firing this mid-flight ran the char/line reveals behind a still
      // opacity-0 container, so they were already finished when it appeared ("skipped").
      .call(finishIntro, [], flightAt + FLIGHT + 0.3)
      .to(
        q(".hero-flight"),
        { opacity: 0, duration: 0.4, ease: "power1.out" },
        flightAt + FLIGHT - 0.1,
      )
      .to(
        [q(".hero-ground"), q(".hero-scrim")],
        { opacity: 1, duration: REST_FADE * 1.4, ease: "power2.inOut" },
        flightAt + FLIGHT - 0.9,
      )
      // Long, soft cross-fade off the signboard into the resting homepage — starts
      // while the mark is still in flight so there is no hard cut.
      .to(
        q(".hero-sign"),
        { opacity: 0, duration: REST_FADE * 1.6, ease: "power2.inOut" },
        flightAt + FLIGHT - 0.9,
      )
      .to(
        q(".hero-rest"),
        { opacity: 1, duration: REST_FADE, ease: "power2.out" },
        flightAt + FLIGHT + 0.6,
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
        windowAt, // background blurred; mark still a solid white fill
        shrinkAt, // mark is now a transparent window (photo through the letterforms)
        shrinkAt + SHRINK, // window shrunk + dropped over the blur
        fillAt + FILL_BEAT, // bg → signboard, window → solid white fill at shrunk size
        flightAt - 0.4, // set beat, pre-lift
        flightAt + FLIGHT * 0.55, // mid-flight
        flightAt + FLIGHT + REST_FADE * 0.6, // landed, bg crossfading to home
        tl.duration() - 0.05, // resting hero
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
      const label = el?.querySelector(".hero-prompt-label");
      if (label) label.textContent = nextMuted ? "Play with sound" : "Sound on";
      el?.setAttribute(
        "aria-label",
        nextMuted ? "Play with sound" : "Sound on",
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

      const leaving = [
        ...q(".hero-page"),
        q(".hero-blur"),
        q(".hero-mask"),
        q(".hero-flight"),
        q(".hero-sign"),
      ];
      gsap.killTweensOf([
        ...leaving,
        q(".hero-ground"),
        q(".hero-scrim"),
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
      gsap.to([q(".hero-ground"), q(".hero-scrim")], {
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
      if (soundRef.current) {
        fadeOutPreloaderSound();
        transitionToSiteSound(SITE_MUSIC_AFTER_BELL_MS);
      }
      const ground = q(".hero-ground")[0];
      if (ground) {
        gsap.to(ground, {
          scale: 1.08,
          duration: 24,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
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
      window.removeEventListener("resize", layoutFlight);
      promptEl?.removeEventListener("click", enableSound);
      skipEl?.removeEventListener("click", onSkip);
      tlRef.current?.kill();
    };
  }, [stepMode]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative h-svh w-full overflow-hidden bg-ink"
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

      {/* The branded signboard wall. Fades up as the mark fills to solid — swapping
          the whole background photo — then fades back out to the resting Boudhanath
          frame as the mark flies to the navbar. */}
      <div className="hero-sign absolute inset-0 opacity-0" aria-hidden>
        <Image
          src="/images/signboard-bg.jpg"
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

      {/* Legibility wash for the resting state. */}
      <div
        className="hero-scrim pointer-events-none absolute inset-0 bg-linear-to-t from-ink/55 via-ink/45 to-ink/45 opacity-0"
        aria-hidden
      />

      {/* Quiet "sound on" prompt over the film — starts muted. */}
      <button
        type="button"
        className="hero-prompt absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-5 z-30 flex cursor-pointer items-center gap-2.5 rounded-full border border-space/30 bg-netsang py-2 pl-2 pr-4 text-ink opacity-0 backdrop-blur-md transition-colors hover:bg-[color-mix(in_srgb,var(--color-netsang)_82%,var(--color-ink))] sm:left-8"
        aria-label="Play with sound"
      >
        <span className="grid size-8 place-items-center rounded-full bg-space/15">
          <VolumeX className="hero-prompt-off size-4" aria-hidden />
          <Volume2
            className="hero-prompt-on col-start-1 row-start-1 hidden size-4"
            aria-hidden
          />
        </span>
        <span className="hero-prompt-label text-label uppercase">
          Play with sound
        </span>
      </button>

      {/* Skip the cinematic. */}
      <button
        type="button"
        className="hero-skip absolute bottom-[max(2rem,env(safe-area-inset-bottom))] right-5 z-30 cursor-pointer rounded-full border border-space/30 bg-netsang px-5 py-2.5 text-label uppercase text-ink opacity-0 backdrop-blur-md transition-colors hover:bg-[color-mix(in_srgb,var(--color-netsang)_82%,var(--color-ink))] sm:right-8"
      >
        Skip
      </button>

      {/* `/?step` authoring control — walk the cinematic one beat at a time. */}
      {stepMode && (
        <div className="fixed bottom-4 left-1/2 z-[999] flex -translate-x-1/2 items-stretch gap-1.5 font-mono text-xs uppercase tracking-widest">
          <button
            type="button"
            onClick={() => stepGo(-1)}
            className="cursor-pointer rounded bg-black px-3 py-2 text-white"
          >
            ◂ Prev
          </button>
          <span className="grid place-items-center rounded bg-black/70 px-3 py-2 text-white">
            {`${stepI + 1}/${STEP_NAMES.length} · ${STEP_NAMES[stepI]}`}
          </span>
          <button
            type="button"
            onClick={() => stepGo(1)}
            className="cursor-pointer rounded bg-black px-3 py-2 text-white"
          >
            Next ▸
          </button>
        </div>
      )}

      {/* Resting hero. */}
      <div className="hero-rest absolute inset-0 flex flex-col items-center justify-center space-y-3 px-6 text-center text-space opacity-0">
        <Rise>
          <p className="font-sub text-xl uppercase pb-8">Mustang to Boudha</p>
        </Rise>

        <SplitChars
          lines={["Rest in the Spirit", "of Mustang"]}
          delay={120}
          className="font-display mt-8 text-[clamp(2.75rem,7.5vw,7rem)] uppercase leading-[0.95]"
        />

        <Rise delay={520} className="mt-12">
          <Button asChild hoverScale={1.01} tapScale={0.99}>
            <a
              href="#enquire"
              className="text-label text-ink inline-block border border-space/50 px-8 py-4 uppercase transition-colors duration-500 ease-brand bg-space hover:bg-space/80 hover:text-ink"
            >
              Enquire about a stay
            </a>
          </Button>
        </Rise>
      </div>

      {/* Scroll cue — part of the resting state. */}
      <a
        href="#about"
        aria-label="Scroll to the next section"
        className="hero-rest group absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-space opacity-0"
      >
        <span className="font-sub text-xl uppercase transition-opacity duration-300 group-hover:opacity-100">
          Scroll
        </span>
        <span
          aria-hidden="true"
          className="relative block h-12 w-px overflow-hidden bg-space/25"
        >
          <span className="hero-cue absolute inset-x-0 top-0 block h-4 bg-space/90" />
        </span>
      </a>
    </section>
  );
}
