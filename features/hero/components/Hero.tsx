"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { VolumeX } from "lucide-react";
import { gsap, reduced } from "@/lib/gsap";

import { SplitChars, Rise } from "@/components/anim";
import { Button } from "@/components/shared/button";
import { BOUDHA, WALL } from "@/lib/photo";
import { claimIntro, finishIntro } from "@/features/preloader/gate";
import { setBellMuted, unlockBell, playResonantBell } from "@/lib/bell";
import {
  enterSilently,
  fadeOutPreloaderSound,
  prewarmIntroSound,
  setSiteSoundMuted,
  startPreloaderSound,
  transitionToSiteSound,
} from "@/features/preloader/audio";
import {
  BLUR_IN,
  EMBLEM_SRC,
  FADE,
  FILL_BEAT,
  HOLD,
  LOGO_MASK,
  LOGO_RATIO,
  LOGO_SRC,
  logoOnlyFor,
  logoX,
  logoY,
  ONCE_PER_SESSION,
  PHOTOS,
  pickEmblem,
  pickLogo,
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

const SITE_MUSIC_AFTER_BELL_MS = 600; // brief gap before the site loop takes over
const REST_HOLD = 1.4; // solid mark holds before it flies
const FLIGHT = 1.6; // mark travels to the navbar slot
const REST_FADE = 2.0; // resting content comes up
const SKIP_IN_AT = 0.9; // when the skip button fades in
const PROMPT_IN_AT = 1.6; // when the sound prompt fades in

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const soundRef = useRef(false);

  // The client wants the film on every arrival at `/` — refresh and client-nav back
  // from another route (which remounts this component). So this is `false` unless
  // `ONCE_PER_SESSION` is flipped on, in which case a `sessionStorage` stamp makes it
  // play once per tab. Read once, at render, before any effect claims the intro gate.
  const seenRef = useRef(
    typeof window !== "undefined" &&
      ONCE_PER_SESSION &&
      window.sessionStorage.getItem(SESSION_KEY) === "1",
  );

  // Before paint, so the below-the-fold reveals and the floating sound toggle stay
  // held until the film ends (see `afterIntro` / `isIntroActive`). Only skipped when
  // `ONCE_PER_SESSION` is on and the film has already run this tab.
  useLayoutEffect(() => {
    if (seenRef.current) return;
    claimIntro();
    unlockBell();
    enterSilently(); // muted by default; makes the mute flags read correctly
    prewarmIntroSound(); // buffer the audio so the click's play() lands on a ready element
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const q = gsap.utils.selector(section);
    const prompt = () => q(".hero-prompt")[0] as HTMLElement | undefined;
    const flightEl = () => q(".hero-flight")[0] as HTMLElement | undefined;
    const maskEl = () => q(".hero-mask")[0] as HTMLElement | undefined;

    // Portrait phones crop the Boudha frame hard, so both marks need a different
    // width and offset there. Picked once on mount.
    const place = pickLogo(window.innerWidth);
    const emblemPlace = pickEmblem(window.innerWidth);

    // The write-on mask is the EMBLEM alone, sat on the gold spire (the React inline
    // `style={LOGO_MASK}` is the desktop emblem default).
    const applyStartMask = () => {
      const el = maskEl();
      if (el)
        Object.assign(
          el.style,
          wipeMaskFor(emblemPlace, WIPE_HIDDEN, EMBLEM_SRC),
        );
    };

    // The flat mark that flies to the navbar is the FULL "Lingkor" lockup, and it
    // assembles CENTRED on the plaster wall (upper third), not on the spire.
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
        left: (W - w) / 2,
        top: (H - h) * 0.36,
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
          q(".hero-ground"),
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
      gsap.set([q(".hero-blur"), q(".hero-mask"), q(".hero-flight")], {
        opacity: 0,
      });
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

    if (reduced() || seenRef.current) {
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
      const pos = `${logoX(emblemPlace)} ${logoY(emblemPlace)}, ${logoX(
        emblemPlace,
      )} ${wipe.y}%`;
      el.style.setProperty("-webkit-mask-position", pos);
      el.style.maskPosition = pos;
    };
    const dropWipe = () => {
      const el = maskEl();
      if (!el) return;
      const only = logoOnlyFor(emblemPlace, EMBLEM_SRC);
      el.style.maskImage = String(only.maskImage);
      el.style.maskPosition = String(only.maskPosition);
      el.style.maskSize = String(only.maskSize);
      el.style.setProperty("-webkit-mask-image", `url(${EMBLEM_SRC})`);
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
      gsap.to(el, { ...target, duration: FLIGHT, ease: "power3.inOut" });
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
    const flightAt = solidAt + FILL_BEAT + REST_HOLD;

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
      // Phase 2 — Boudhanath settles, blur lifts, the mark writes itself on from the
      // pinnacle downward, then cross-fades into the flat white mark.
      .fromTo(
        q(".hero-blur"),
        { opacity: 0 },
        { opacity: 1, duration: BLUR_IN, ease: "power1.inOut" },
        glyphAt,
      )
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
          ease: "power1.inOut",
          onUpdate: paintWipe,
          onComplete: dropWipe,
        },
        glyphAt + WRITE_LEAD,
      )
      .call(layoutFlight, [], solidAt)
      // The emblem on Boudhanath cross-fades into the full "Lingkor" lockup centred
      // on the plaster wall: wall comes up, Boudha stack + emblem mask go out, the
      // flat mark fades in.
      .to(
        [q(".hero-ground")],
        { opacity: 1, duration: FILL_BEAT + REST_HOLD, ease: "power1.inOut" },
        solidAt + FILL_BEAT * 0.3,
      )
      .to(
        q(".hero-flight"),
        { opacity: 1, duration: FILL_BEAT, ease: "power2.inOut" },
        solidAt + FILL_BEAT * 0.35,
      )
      .to(
        [q(".hero-mask"), q(".hero-blur"), ...q(".hero-page")],
        { opacity: 0, duration: FILL_BEAT, ease: "power2.inOut" },
        solidAt + FILL_BEAT * 0.45,
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
      // Phase 3 — the mark flies to the navbar; the resting hero comes up over the
      // hero come up behind it.
      .call(flyToNavbar, [], flightAt)
      .call(finishIntro, [], flightAt + FLIGHT * 0.65)
      .to(
        q(".hero-flight"),
        { opacity: 0, duration: 0.4, ease: "power1.out" },
        flightAt + FLIGHT - 0.1,
      )
      .to(
        q(".hero-scrim"),
        { opacity: 1, duration: REST_FADE, ease: "power2.inOut" },
        flightAt + FLIGHT - 0.4,
      )
      .to(
        q(".hero-rest"),
        { opacity: 1, duration: REST_FADE * 0.8, ease: "power2.out" },
        flightAt + FLIGHT,
      );

    // Turn sound on mid-film: build the graph, unmute, let the bell fire if its beat
    // has not passed yet.
    const enableSound = () => {
      if (soundRef.current) return;
      soundRef.current = true;
      startPreloaderSound();
      setSiteSoundMuted(false);
      setBellMuted(false);
      hidePrompt();
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
    (["wheel", "scroll", "keydown"] as const).forEach((ev) => {
      const h = () => skipToRest();
      window.addEventListener(ev, h, once);
      ff.push(() => window.removeEventListener(ev, h));
    });

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
  }, []);

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
          backdropFilter: "blur(18px) brightness(0.6)",
          WebkitBackdropFilter: "blur(18px) brightness(0.6)",
        }}
        aria-hidden
      />

      {/* The write-on: the sharp Boudhanath frame, clipped by the glyph, revealed
          top→down by the sliding wipe layer. */}
      <div
        className="hero-mask absolute inset-0 opacity-0"
        style={LOGO_MASK}
        aria-hidden
      >
        <Image
          src={BOUDHA}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="object-cover"
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

      {/* What the film cross-fades into and the hero rests on — the prayer-flag
          plaster wall, its own layer so it can breathe under the resting content. */}
      <div className="hero-ground absolute inset-0 opacity-0" aria-hidden>
        <Image
          src={WALL}
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
        className="hero-prompt absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-5 z-30 flex cursor-pointer items-center gap-2.5 rounded-full border border-space/30 bg-netsang py-2 pl-2 pr-4 text-ink opacity-0 backdrop-blur-md transition-colors hover:bg-netsang/80 sm:left-8"
        aria-label="Play with sound"
      >
        <span className="grid size-8 place-items-center rounded-full border ">
          <VolumeX className="size-4" aria-hidden />
        </span>
        <span className="text-label uppercase">Play with sound</span>
      </button>

      {/* Skip the cinematic. */}
      <button
        type="button"
        className="hero-skip absolute bottom-[max(2rem,env(safe-area-inset-bottom))] right-5 z-30 cursor-pointer rounded-full border border-space/30 bg-netsang/80 px-5 py-2.5 text-label uppercase text-ink opacity-0 backdrop-blur-md transition-colors hover:bg-netsang sm:right-8"
      >
        Skip
      </button>

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
          <Button asChild hoverScale={1.03} tapScale={0.97}>
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
