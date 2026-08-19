import Image from "next/image";

/**
 * A photograph in a frame, through next/image.
 *
 * Every photo on the site is a crop into a frame whose shape the layout decides — an
 * aspect ratio, a viewport height, a grid cell — not an image drawn at its own size.
 * That is exactly the case `fill` exists for, and it is why these do not carry
 * `width`/`height`: the frame owns the box, `object-cover` owns the crop.
 *
 * `fill` positions the image absolutely, so its parent must be positioned. The frame
 * here is `relative` for that reason — passing an unpositioned parent is the single
 * most common way to make `fill` render at the size of the page.
 *
 * `sizes` is required rather than optional on purpose. Without it Next assumes `100vw`
 * and serves an image sized for the whole viewport into a frame that may be a third of
 * it, which quietly cancels most of the benefit of using the component at all.
 */
export type PhotoProps = {
  src: string;
  /** Empty string marks the image as decorative; it is then also `aria-hidden`. */
  alt: string;
  /** Rendered width at each breakpoint, e.g. "(max-width: 1024px) 100vw, 40vw". */
  sizes: string;
  /** Classes for the frame — aspect ratio, grid placement, height. */
  className?: string;
  /** Classes for the image itself — object-position, hover transforms. */
  imgClassName?: string;
  /**
   * Preload via a `<link>` in the head. Next 16 deprecated `priority` in favour of
   * this. Only ever for an LCP candidate — the docs are explicit that using it on
   * several images makes it useless, since preloading everything prioritises nothing.
   */
  preload?: boolean;
  /** Defaults to lazy. `eager` for anything just below the fold. */
  loading?: "eager" | "lazy";
};

export function Photo({
  src,
  alt,
  sizes,
  className = "",
  imgClassName = "",
  preload = false,
  loading,
}: PhotoProps) {
  const decorative = alt === "";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      aria-hidden={decorative || undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        // `preload` and `loading` are mutually exclusive per the Next 16 docs — set
        // one or the other, never both.
        loading={preload ? undefined : loading}
        draggable={false}
        className={`select-none object-cover ${imgClassName}`}
      />
    </div>
  );
}

/**
 * The commissioned line drawings — caravan, panorama, stupa, knot.
 *
 * Unlike the photographs these are drawn at their own aspect ratio and flow in the
 * layout, so they take intrinsic `width`/`height` instead of `fill`. The numbers below
 * are the real pixel dimensions of the source PNGs; Next only uses them to reserve the
 * right box before the file arrives, so the rendered size still comes from CSS.
 *
 * All of it is decorative: the drawings repeat what the adjacent heading already says,
 * so they carry an empty alt and are hidden from assistive tech.
 */
const ART_SIZES = {
  caravan: { width: 592, height: 1600 },
  stupa: { width: 594, height: 1599 },
  panorama: { width: 1600, height: 512 },
  knot: { width: 1515, height: 550 },
} as const;

export type ArtName = keyof typeof ART_SIZES;
export type ArtTone = "ink" | "terracotta" | "white";

export function LineArt({
  name,
  tone,
  className = "",
}: {
  name: ArtName;
  tone: ArtTone;
  className?: string;
}) {
  return (
    <Image
      src={`/images/art/${name}-${tone}.png`}
      alt=""
      aria-hidden="true"
      width={ART_SIZES[name].width}
      height={ART_SIZES[name].height}
      loading="lazy"
      className={className}
    />
  );
}
