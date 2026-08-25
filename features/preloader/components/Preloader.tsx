"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { playBell, setBellMuted, unlockBell } from "@/lib/bell";
import {
  BOUDHA_HOLD,
  FADE,
  FAILSAFE_MS,
  FILL_BEAT,
  HOLD,
  BLUR_IN,
  LOGO_ONLY,
  LOGO_SRC,
  MAX_MS,
  MIN_MS,
  PHOTOS,
  ONCE_PER_SESSION,
  REVEAL_BEAT,
  SESSION_KEY,
  SHARP_BEAT,
  WRITE_LEAD,
  lockScroll,
  unlockScroll,
} from "../preloader";
import {
  enterSilently,
  fadeOutPreloaderSound,
  setSiteSoundMuted,
  startPreloaderSound,
  transitionToSiteSound,
} from "../audio";
import { flightTo } from "../flight";
import { claimIntro, finishIntro } from "../gate";
import { EntryStage } from "./EntryStage";
import { IntroStage } from "./IntroStage";

type EntryMode = "sound" | "silent";
const PRELOADER_BELL_DECAY_SCALE = 0.42;
const SITE_MUSIC_AFTER_BELL_MS = 2500;
const EXTRA_PRELOADER_HOLD = 1;
const ENTRY_FADE_MS = 1000;

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [entryMode, setEntryMode] = useState<EntryMode | null>(null);
  const [entryLeaving, setEntryLeaving] = useState(false);
  const [showEntry, setShowEntry] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const soundEnabled = useRef(false);
  const bellPlayed = useRef(false);

  // Skip: bail out via the Skip button or Escape. Deliberately NOT click-anywhere —
  // a stray click should not cost you the intro.
  const skipIntro = useCallback(() => {
    timeline.current?.kill();
    document
      .querySelector<HTMLElement>(".nav-logo")
      ?.style.setProperty("opacity", "1");
    if (soundEnabled.current && !bellPlayed.current) {
      bellPlayed.current = true;
      fadeOutPreloaderSound(700);
      playBell(0, PRELOADER_BELL_DECAY_SCALE);
      transitionToSiteSound(SITE_MUSIC_AFTER_BELL_MS);
    }
    unlockScroll(); // never leave the page unscrollable, whatever else fails
    finishIntro(); // ...and never leave the page unanimated either
    sessionStorage.setItem(SESSION_KEY, "1");
    gsap.to(root.current, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.out",
      onComplete: () => {
        setDone(true);
      },
    });
  }, []);

  useLayoutEffect(() => {
    const navLogo = document.querySelector<HTMLElement>(".nav-logo");
    unlockBell();

    // Claimed in a layout effect so it lands before any passive effect in the tree —
    // the entrance primitives ask the gate from `useEffect`, which runs later.
    claimIntro();

    const skip =
      (ONCE_PER_SESSION && sessionStorage.getItem(SESSION_KEY) === "1") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) {
      // Hide before paint, then unmount async so the photos are never fetched.
      finishIntro();
      document
        .querySelector<HTMLElement>("[data-entry-stage]")
        ?.style.setProperty("display", "none");
      const id = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(id);
    }

    lockScroll();
    // The navbar logo is the flight's destination, so it stays hidden until it lands.
    if (navLogo) navLogo.style.opacity = "0";

    return () => {
      unlockScroll();
      if (navLogo) navLogo.style.opacity = "1";
    };
  }, []);

  useLayoutEffect(() => {
    if (!entryMode) return;

    const navLogo = document.querySelector<HTMLElement>(".nav-logo");
    const start = performance.now();
    let killed = false;

    const revealNav = () => {
      if (navLogo) navLogo.style.opacity = "1";
    };
    // Whatever happens to the timeline, the navbar logo cannot stay hidden.
    const failsafe = window.setTimeout(() => {
      revealNav();
      if (entryMode === "sound" && !bellPlayed.current) {
        bellPlayed.current = true;
        fadeOutPreloaderSound(700);
        playBell(0, PRELOADER_BELL_DECAY_SCALE);
        transitionToSiteSound(SITE_MUSIC_AFTER_BELL_MS);
      }
      unlockScroll();
      finishIntro();
    }, FAILSAFE_MS);

    const ctx = gsap.context(() => {
      const pages = gsap.utils.toArray<HTMLElement>(".pl-page");
      const imgs = gsap.utils.toArray<HTMLElement>(".pl-page img");
      gsap.set(pages, { opacity: 0 });
      gsap.set(pages[0], { opacity: 1 });

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(SESSION_KEY, "1");
          revealNav();
          unlockScroll();
          finishIntro();
          setDone(true);
        },
      });
      timeline.current = tl;
      if (process.env.NODE_ENV === "development") {
        // Dev-only handle so the intro can be scrubbed from the console/tests:
        // __plTl.pause(); __plTl.time(5.6)
        (window as unknown as { __plTl?: gsap.core.Timeline }).__plTl = tl;
      }

      // No zoom on the frames: they sit at natural cover size, which also keeps the
      // masked copy in register with the frame behind it for free.
      gsap.set(imgs, { scale: 1 });

      // Phase 1: long cross-dissolves. Each frame is still fading up as the next starts.
      pages.forEach((page, i) => {
        if (i === 0) return;
        tl.to(
          page,
          { opacity: 1, duration: FADE, ease: "power1.inOut" },
          i * HOLD,
        );
      });

      // Quotes: fade in once their frame has settled, out before the next one starts.
      gsap.utils.toArray<HTMLElement>(".pl-quote").forEach((q, i) => {
        tl.fromTo(
          q,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" },
          // The first frame is already on screen when the timeline starts, so its
          // quote leads immediately — the others wait for their dissolve to settle.
          i === 0 ? 0 : i * HOLD + FADE * 0.55,
        ).to(
          q,
          { opacity: 0, y: -10, duration: 0.45, ease: "power2.in" },
          (i + 1) * HOLD - 0.2,
        );
      });

      // Mustang frames get HOLD each; Boudha gets its own, longer beat.
      const boudhaAt = (PHOTOS.length - 1) * HOLD;
      const lockAt = boudhaAt + BOUDHA_HOLD;
      const flightAt = lockAt + EXTRA_PRELOADER_HOLD;

      // Phase 2, in three beats over BOUDHA_HOLD:
      //   1. Boudha lands sharp and alone.
      //   2. The blur comes up, and the glyph is there from its first moment — the
      //      blur reads as revealing the logo rather than the logo arriving.
      //   3. White dissolves in over the clear cut-out until the mark is solid.
      const glyphAt = boudhaAt + SHARP_BEAT;
      const fillAt = glyphAt + REVEAL_BEAT;

      // mask-position is a two-layer list, so it is written wholesale each frame
      // rather than tweened — GSAP has no notion of "the second layer's x".
      const wipe = { x: 100 };
      const paintWipe = () => {
        const el = root.current?.querySelector<HTMLElement>(".pl-mask-wrap");
        if (!el) return;
        const pos = `center, ${wipe.x}% center`;
        el.style.setProperty("-webkit-mask-position", pos);
        el.style.maskPosition = pos;
      };

      // Once the pen has crossed, the wipe layer has no more work to do — and its soft
      // edge would leave the tail of the mark a few percent translucent forever.
      const dropWipe = () => {
        const el = root.current?.querySelector<HTMLElement>(".pl-mask-wrap");
        if (!el) return;
        Object.assign(el.style, {
          maskImage: LOGO_ONLY.maskImage,
          maskPosition: LOGO_ONLY.maskPosition,
          maskSize: LOGO_ONLY.maskSize,
        } as CSSStyleDeclaration);
        el.style.setProperty("-webkit-mask-image", `url(${LOGO_SRC})`);
        el.style.setProperty("-webkit-mask-position", "center");
        el.style.setProperty("-webkit-mask-size", String(LOGO_ONLY.maskSize));
      };

      tl.fromTo(
        // Blur rides in as a backdrop-filter over the whole stack: a filter on the
        // frame itself goes transparent at the edges and lets the sharp frame
        // underneath show through.
        ".pl-blur",
        { opacity: 0 },
        { opacity: 1, duration: BLUR_IN, ease: "power1.inOut" },
        glyphAt,
      )
        .set(".pl-mask-wrap", { opacity: 1 }, glyphAt)
        .to(".pl-bar", { opacity: 0, duration: 0.4 }, boudhaAt)
        // The mark writes itself on: the wipe layer of the mask slides across, so the
        // letterforms fill with the sharp frame left to right. No stroke is ever drawn
        // — the interior arriving IS the drawing.
        .to(
          wipe,
          {
            x: 0,
            duration: REVEAL_BEAT - WRITE_LEAD,
            ease: "power1.inOut",
            onUpdate: paintWipe,
            onComplete: dropWipe,
          },
          glyphAt + WRITE_LEAD,
        )
        // The dissolve happens INSIDE the mask — a white sheet over the photo, both
        // clipped by one glyph. Two separately masked layers cross-fading is what
        // looked glitched: mid-way the letterforms went translucent and the blurred
        // backdrop showed through them.
        .to(
          ".pl-white",
          { opacity: 1, duration: FILL_BEAT, ease: "power2.inOut" },
          fillAt,
        )
        .call(
          () => {
            if (entryMode === "sound") fadeOutPreloaderSound();
          },
          [],
          flightAt - 0.7,
        )
        // Hand off to a real <img> at identical size/position so the flight can move
        // a normal element. Visually a no-op.
        .set(".pl-flat", { opacity: 1 }, flightAt)
        .set(".pl-mask-wrap", { opacity: 0 }, flightAt)
        .call(
          () => {
            if (entryMode !== "sound" || bellPlayed.current) return;
            bellPlayed.current = true;
            playBell(0, PRELOADER_BELL_DECAY_SCALE);
            transitionToSiteSound(SITE_MUSIC_AFTER_BELL_MS);
          },
          [],
          flightAt,
        )
        // Phase 3: photos fade to the hero while the logo flies into the navbar slot.
        .to(
          ".pl-bg, .pl-stack, .pl-blur",
          { opacity: 0, duration: 1.1, ease: "power2.inOut" },
          flightAt,
        )
        .to(
          ".pl-flat",
          {
            duration: 1.2,
            ease: "power3.inOut",
            ...flightTo(navLogo),
            onComplete: () => {
              if (navLogo) navLogo.style.opacity = "1";
            },
          },
          "<",
        );

      tl.pause();

      const release = () => {
        if (killed || tl.isActive()) return;
        const wait = Math.max(0, MIN_MS - (performance.now() - start));
        gsap.delayedCall(wait / 1000, () => !killed && tl.play());
      };

      // Readiness is read off the images the DOM has already rendered, rather than
      // from a parallel `new Image()` probe.
      //
      // The probe used to mirror the markup's `srcset` by hand so that both asked for
      // the same file. That is no longer possible: next/image serves through
      // `/_next/image?url=…&w=…&q=…`, and the width in that URL is chosen by the
      // browser from `sizes` at layout time. Any URL guessed here would miss, and a
      // miss means every intro photo is downloaded twice.
      //
      // Reading `complete` off the real elements cannot drift, because they are the
      // same requests. `decode()` then waits for pixels rather than bytes — an
      // undecoded mask image paints unmasked for a frame and snaps to the glyph, which
      // was the pop at the start of the lock.
      const probes = Array.from(
        root.current?.querySelectorAll("img") ?? [],
      ) as HTMLImageElement[];

      const total = Math.max(1, probes.length);
      let loaded = 0;
      const advance = (el: HTMLImageElement) => {
        loaded += 1;
        gsap.to(".pl-bar-fill", {
          scaleX: loaded / total,
          duration: 0.4,
          ease: "power2.out",
        });
        // Only the first stack frame gates the start — waiting for all of them meant a
        // slow connection paid the wait AND the full runtime.
        if (el.closest(".pl-page")?.previousElementSibling === null) release();
      };

      probes.forEach((el) => {
        const hit = () => advance(el);
        const ready = () => (el.decode ? el.decode().then(hit, hit) : hit());
        if (el.complete) ready();
        else {
          el.addEventListener("load", ready, { once: true });
          // A broken file must not strand the visitor.
          el.addEventListener("error", hit, { once: true });
        }
      });

      gsap.delayedCall(
        MAX_MS / 1000,
        () => !killed && !tl.isActive() && tl.play(),
      );
    }, root);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipIntro();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      killed = true;
      ctx.revert();
      window.clearTimeout(failsafe);
      window.removeEventListener("keydown", onKey);
      unlockScroll();
      revealNav();
    };
  }, [entryMode, skipIntro]);

  if (done) return null;

  const enter = (mode: EntryMode) => {
    if (entryLeaving || entryMode) return;
    soundEnabled.current = mode === "sound";
    if (mode === "sound") {
      // `startPreloaderSound` first: it is what flips `audioEnabled` on and creates
      // the tracks. `setSiteSoundMuted` now bootstraps the whole graph itself when
      // called while `audioEnabled` is still false (the master-control path — see
      // its doc in audio.ts) — called in the other order, this "just unmute" call
      // would have raced ahead and started the site-ambient track immediately,
      // stepping on the preloader's own bell-timed handoff to it.
      startPreloaderSound();
      setSiteSoundMuted(false);
      setBellMuted(false);
    } else {
      // The graph never turns on for a silent entry, so nothing is actually playing
      // — but the mute flag defaults to whatever localStorage/module state already
      // held, which could read as "on". Setting it explicitly is what makes the
      // master toggle read correctly the instant the door closes, not just once
      // someone touches it.
      setSiteSoundMuted(true);
      setBellMuted(true);
      enterSilently();
    }
    setEntryMode(mode);
    setEntryLeaving(true);
    window.setTimeout(() => setShowEntry(false), ENTRY_FADE_MS);
  };

  if (!entryMode) {
    return (
      <EntryStage
        leaving={entryLeaving}
        onSound={() => enter("sound")}
        onSilent={() => enter("silent")}
      />
    );
  }

  return (
    <>
      <IntroStage
        root={root}
        onSkip={skipIntro}
      />
      {showEntry ? (
        <EntryStage
          leaving={entryLeaving}
          onSound={() => enter("sound")}
          onSilent={() => enter("silent")}
        />
      ) : null}
    </>
  );
}
