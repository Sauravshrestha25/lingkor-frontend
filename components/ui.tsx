import Link from "next/link";

// Two primitives left standing after the GSAP rebuild (components/anim.tsx now owns
// reveals, split headlines and parallax). Both are one-line type treatments that
// don't need their own file.

/** The only third type style: 11px, 0.18em, uppercase. Eyebrows and section names. */
export function Label({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  /** Only for the one case that needs it: tinting a label its element's colour. */
  style?: React.CSSProperties;
}) {
  return (
    <p className={` ${className}`} style={style}>
      {children}
    </p>
  );
}

/**
 * The entire link treatment: 1px underline, offset 6, fading to 40% on hover.
 * No arrows, no colour change, no background.
 */
export function TextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`text-label inline-block uppercase underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-current/40 ${className}`}
    >
      {children}
    </Link>
  );
}
