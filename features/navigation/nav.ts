import { AREAS, NAV as SITE_NAV } from "@/lib/site";

/**
 * The menu lists the five element spaces only.
 *
 * The client's brief names seven areas (REQUIREMENTS.md §3), and Mustang Inn and the
 * Lingkor Boutique are still in `AREAS` — they keep their pages at
 * `/spaces/mustang-inn` and `/spaces/lingkor-boutique`, and anything that links to
 * them still works. They are out of the *menu* only.
 *
 * That is also the reading the brief supports: "Not sure if those should be shown in
 * pictures or just mentioned and discovered later when travellers come." Neither has a
 * render, so both would sit in the menu as names with no preview image beside them.
 */
export const SPACES = AREAS.filter((s) => !s.colourless).map((s, i) => ({
  n: String(i + 1).padStart(2, "0"),
  label: s.name,
  role: s.role,
  element: s.element,
  href: `/spaces/${s.slug}`,
  // Full-size source: next/image picks the width from `sizes`, so hand-picking the
  // -1280 variant here would only fight it — and most sources have no such variant.
  img: s.image,
  /**
   * The element colour, and whether it can actually be *used* as one.
   *
   * Namkha is Space, and Space's colour is `#F0EDE6` — the identical off-white the
   * whole site is built on. It is not a mistake in the palette: Namkha *is* the
   * ground, which is why its panels elsewhere carry a hairline instead of a fill.
   * But it means Namkha has no tint to wash a background with and no accent that
   * would be visible on white, so it is marked `tintable: false` and the menu gives
   * it its photograph and leaves the colour alone. Every other space reacts fully.
   */
  field: s.field,
  /*
   * Compared against the *token*, not a hex. `field` holds `var(--color-space)`, so
   * the first version of this test compared it to "#f0ede6", never matched, and
   * Namkha tinted the menu with a colour that is the background — a wash of nothing,
   * and the one behaviour it was explicitly not supposed to have.
   */
  tintable: s.field !== "var(--color-space)",
}));

/**
 * Type predicate, not a bare `.filter(s => s.img)`. TypeScript cannot narrow
 * `string | undefined` through a plain filter callback, so without this the preview
 * `src` stays possibly-undefined and next/image rejects it.
 */
export const WITH_PREVIEW = SPACES.filter(
  (s): s is (typeof SPACES)[number] & { img: string } => Boolean(s.img),
);

export const NAV = SITE_NAV;
