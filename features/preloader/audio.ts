"use client";

const PRELOADER_MUSIC_SRC = "/music/preloader_music.mp3";
const SITE_MUSIC_SRC = "/music/site_music.mp3";

const PRELOADER_VOLUME = 0.34;
const SITE_VOLUME = 0.28;
const FADE_STEP_MS = 50;
const FADE_DURATION_MS = 1400;
const PRELOADER_FADE_OUT_MS = 700;
const STORAGE_KEY = "lb-site-sound-muted";

let preloaderMusic: HTMLAudioElement | null = null;
let siteMusic: HTMLAudioElement | null = null;
let audioEnabled = false;
let hasEnteredSiteSound = false;
let muted = false;
let siteFadeId: number | null = null;
let siteDucked = false;

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

export function setSiteSoundMuted(next: boolean) {
  muted = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
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

function fade(audio: HTMLAudioElement, target: number, duration = FADE_DURATION_MS) {
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
  siteMusic ??= makeLoop(SITE_MUSIC_SRC, 0);

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
    siteMusic ??= makeLoop(SITE_MUSIC_SRC, 0);
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
  siteMusic ??= makeLoop(SITE_MUSIC_SRC, 0);
  if (!siteMusic) return;

  void play(siteMusic);
  fadeSiteMusic(SITE_VOLUME, duration);
}

export function stopAllIntroSound() {
  preloaderMusic?.pause();
  if (preloaderMusic) preloaderMusic.currentTime = 0;
}
