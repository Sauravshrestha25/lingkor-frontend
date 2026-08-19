/** One of the five element spaces. Shape shared by the carousel and /spaces/[slug]. */
export type Space = {
  id: string;
  name: string;
  role: string;
  element: string;
  hue: string;
  line: string;
  image: string;
  /** The element's colour, used as the card's ground. */
  field: string;
  displayOnField: "white" | "ink";
};
