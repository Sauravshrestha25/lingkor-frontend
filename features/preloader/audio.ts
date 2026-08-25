"use client";

const PRELOADER_MUSIC_SRC = "/music/preloader_music.mp3";
const SITE_MUSIC_SRC = "/music/site_music_3.mp3";

const PRELOADER_VOLUME = 0.34;
const SITE_VOLUME = 0.28;
const FADE_STEP_MS = 50;
const FADE_DURATION_MS = 1400;
const PRELOADER_FADE_OUT_MS = 700;
const STORAGE_KEY = "lb-site-sound-muted";

/**
 * `siteMusic.loop = true` is a hard cut: the instant `currentTime` reaches `duration`
 * the browser snaps it back to 0 with no crossfade, which is audible as a click or a
 * seam if the track doesn't loop seamlessly at the sample level. Rather than require
 * a perfectly-looping master, duck the volume through the seam — fade down approaching
 * the end, let the native loop restart underneath the silence, fade back up once it
 * has. See `attachLoopFade` below.
 */
const LOOP_TAIL_MS = 1600;
const LOOP_FADE_OUT_MS = 1100;
const LOOP_FADE_IN_MS = 900;

let preloaderMusic: HTMLAudioElement | null = null;
let siteMusic: HTMLAudioElement | null = null;
let audioEnabled = false;
let hasEnteredSiteSound = false;
let muted = false;
let siteFadeId: number | null = null;
let siteDucked = false;
let loopFading = false;

if (typeof window !== "undefined") {
  muted = window.localStorage.getItem(STORAGE_KEY) === "1";
}

const listeners = new Set<() => void>();

export function subscribeSiteSound(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function isSiteSoundMuted() {
  return muted;
}

export function isSiteSoundMutedOnServer() {
  return false;
}

/**
 * The master switch for site sound — not just a volume flag.
 *
 * A Silent Entry at the door calls `enterSilently()`, which sets `audioEnabled = false`
 * and never creates `siteMusic` at all: every other function in this file bails on
 * `!audioEnabled`, by design, so nothing plays until something turns the graph on.
 * Before this, turning the button back on later only ever flipped `.muted` on an
 * element that had never been made — a dead switch. Bootstrapping the graph is what
 * makes this the *master* control rather than a mute that only works if you happened
 * to say yes to sound at the door.
 */
export function setSiteSoundMuted(next: boolean) {
  muted = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }

  if (!next && !audioEnabled) {
    audioEnabled = true;
    hasEnteredSiteSound = true;
    ensureSiteMusic();
    if (siteMusic) {
      siteMusic.muted = false;
      siteMusic.currentTime = 0;
      siteMusic.volume = 0;
      void play(siteMusic);
      window.setTimeout(() => fade(siteMusic!, SITE_VOLUME, 1200), 60);
    }
    listeners.forEach((cb) => cb());
    return;
  }

  if (preloaderMusic) preloaderMusic.muted = next;
  if (siteMusic) siteMusic.muted = next;
  listeners.forEach((cb) => cb());
}

function makeLoop(src: string, volume: number) {
  if (!src || typeof Audio === "undefined") return null;
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = volume;
  audio.muted = muted;
  audio.load();
  return audio;
}

function fade(
  audio: HTMLAudioElement,
  target: number,
  duration = FADE_DURATION_MS,
) {
  const start = audio.volume;
  const steps = Math.max(1, Math.round(duration / FADE_STEP_MS));
  let current = 0;

  const id = window.setInterval(() => {
    current += 1;
    audio.volume = start + (target - start) * (current / steps);
    if (current >= steps) {
      audio.volume = target;
      window.clearInterval(id);
    }
  }, FADE_STEP_MS);
}

/**
 * Watches the track's own clock and ducks it through every loop point, not just the
 * first. `timeupdate` rather than a timer keyed off `duration`, because a fixed timer
 * drifts from the real playback clock (pause/resume, a slow tab, whatever) and would
 * eventually fade at the wrong moment instead of at the seam.
 */
function attachLoopFade(audio: HTMLAudioElement) {
  audio.addEventListener("timeupdate", () => {
    // A section-driven duck (features/kora's fadeOutSiteSound) already owns the
    // volume; fighting it over the shared fade interval would cut the duck short.
    if (siteDucked || !hasEnteredSiteSound) return;
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const remainingMs = (audio.duration - audio.currentTime) * 1000;

    if (!loopFading && remainingMs > 0 && remainingMs <= LOOP_TAIL_MS) {
      loopFading = true;
      fadeSiteMusic(0, Math.min(LOOP_FADE_OUT_MS, remainingMs));
    }

    // The native loop restart shows up here as `remainingMs` jumping back up to
    // (near) the full track length — there is no 'looped' event to listen for
    // directly, so the wrap is inferred from the clock going backwards relative to
    // where the tail fade started it.
    if (loopFading && remainingMs > LOOP_TAIL_MS) {
      loopFading = false;
      fadeSiteMusic(SITE_VOLUME, LOOP_FADE_IN_MS);
    }
  });
}

/** The one place `siteMusic` is constructed, so the loop-fade listener is attached
 *  exactly once no matter which entry point (preloader, first scroll, un-ducking)
 *  gets there first. */
function ensureSiteMusic() {
  if (!siteMusic) {
    siteMusic = makeLoop(SITE_MUSIC_SRC, 0);
    if (siteMusic) attachLoopFade(siteMusic);
  }
  return siteMusic;
}

function clearSiteFade() {
  if (siteFadeId === null) return;
  window.clearInterval(siteFadeId);
  siteFadeId = null;
}

function fadeSiteMusic(
  target: number,
  duration: number,
  onComplete?: () => void,
) {
  if (!siteMusic) return;

  clearSiteFade();

  const start = siteMusic.volume;
  const steps = Math.max(1, Math.round(duration / FADE_STEP_MS));
  let current = 0;

  siteFadeId = window.setInterval(() => {
    if (!siteMusic) {
      clearSiteFade();
      return;
    }

    current += 1;
    siteMusic.volume = start + (target - start) * (current / steps);

    if (current >= steps) {
      siteMusic.volume = target;
      clearSiteFade();
      onComplete?.();
    }
  }, FADE_STEP_MS);
}

function play(audio: HTMLAudioElement | null) {
  if (!audio) return Promise.resolve();
  return audio.play().catch(() => {
    // Placeholder or blocked audio should never break the visual entry.
  });
}

export function startPreloaderSound() {
  audioEnabled = true;
  hasEnteredSiteSound = false;
  preloaderMusic ??= makeLoop(PRELOADER_MUSIC_SRC, PRELOADER_VOLUME);
  ensureSiteMusic();

  if (preloaderMusic) {
    preloaderMusic.currentTime = 0;
    preloaderMusic.volume = PRELOADER_VOLUME;
  }
  if (siteMusic) {
    siteMusic.currentTime = 0;
    siteMusic.volume = 0;
  }

  play(preloaderMusic);
  void play(siteMusic).then(() => {
    if (!siteMusic || hasEnteredSiteSound) return;
    siteMusic.pause();
    siteMusic.currentTime = 0;
  });
}

export function enterSilently() {
  audioEnabled = false;
  stopAllIntroSound();
}

export function fadeOutPreloaderSound(duration = PRELOADER_FADE_OUT_MS) {
  if (!audioEnabled || !preloaderMusic) return;
  fade(preloaderMusic, 0, duration);
  window.setTimeout(() => preloaderMusic?.pause(), duration + 50);
}

export function transitionToSiteSound(delay = 0) {
  if (!audioEnabled || hasEnteredSiteSound) return;
  hasEnteredSiteSound = true;

  window.setTimeout(() => {
    ensureSiteMusic();
    if (siteMusic) {
      siteMusic.volume = 0;
      play(siteMusic);
      window.setTimeout(() => fade(siteMusic!, SITE_VOLUME, 1600), 220);
    }
  }, delay);
}

export function fadeOutSiteSound(duration = 1200) {
  if (!audioEnabled || !hasEnteredSiteSound || !siteMusic) return;

  siteDucked = true;
  fadeSiteMusic(0, duration, () => {
    if (siteDucked) siteMusic?.pause();
  });
}

export function restoreSiteSound(duration = 1600) {
  if (!audioEnabled || !hasEnteredSiteSound || !siteDucked) return;

  siteDucked = false;
  ensureSiteMusic();
  if (!siteMusic) return;

  void play(siteMusic);
  fadeSiteMusic(SITE_VOLUME, duration);
}

export function stopAllIntroSound() {
  preloaderMusic?.pause();
  if (preloaderMusic) preloaderMusic.currentTime = 0;
}
