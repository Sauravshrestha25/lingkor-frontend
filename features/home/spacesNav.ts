"use client";

/**
 * While the homepage spaces circuit is pinned, each panel is its own full-bleed
 * colour — the navbar sitting transparently on top of it needs to swap its own
 * text/logo colour to match, panel by panel. `SpacesSection` is the only writer;
 * `Navbar` is the only reader. A tiny external store rather than context because the
 * two are siblings with no shared ancestor worth threading this through.
 */
export type SpacesNavState = {
  /** The pinned circuit currently owns the frame. */
  active: boolean;
  /** True when the current panel needs light (white) navbar text/logo. */
  dark: boolean;
};

let state: SpacesNavState = { active: false, dark: false };
const listeners = new Set<() => void>();

export function setSpacesNav(next: SpacesNavState) {
  state = next;
  listeners.forEach((cb) => cb());
}

export function subscribeSpacesNav(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getSpacesNav() {
  return state;
}

export function getSpacesNavServer(): SpacesNavState {
  return { active: false, dark: false };
}
