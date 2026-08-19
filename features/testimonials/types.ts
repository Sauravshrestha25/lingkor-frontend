export type Voice = {
  quote: string;
  name: string;
  /** Where they travelled from — the site is about a journey, so origin matters. */
  from: string;
  /** 1–5. */
  rating: number;
  /** Which of the seven spaces the stay centred on, if any. */
  room?: string;
  /**
   * The card's ground — one of the five element colours, cycled so no two adjacent
   * cards share one.
   */
  tint: string;
  /** Type colour for that ground. Same rule as `Space.displayOnField`. */
  onTint: "white" | "ink";
  /**
   * A real photograph, once one exists and the guest has agreed to it being used.
   * Absent for now, so the card falls back to a wordmark tile.
   */
  image?: string;
};
