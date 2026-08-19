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
  href: `/spaces/${s.slug}`,
  // Full-size source: next/image picks the width from `sizes`, so hand-picking the
  // -1280 variant here would only fight it — and most sources have no such variant.
  img: s.image,
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
