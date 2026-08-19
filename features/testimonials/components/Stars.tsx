/**
 * A star rating, tinted the guest's element colour.
 *
 * One `role="img"` with the rating spelled out, and the individual stars hidden —
 * otherwise a screen reader announces five anonymous graphics and the reader has to
 * count them.
 */
export function Stars({ rating, tint }: { rating: number; tint: string }) {
  return (
    <div className="flex gap-1.5" role="img" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          aria-hidden="true"
          fill={i < rating ? tint : "transparent"}
          stroke={tint}
          strokeWidth="1.5"
        >
          <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.45 6.19 20.5 7.3 14.03 2.6 9.45l6.5-.95z" />
        </svg>
      ))}
    </div>
  );
}
