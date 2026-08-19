/**
 * Journal posts, as data rather than a CMS.
 *
 * There is no backend and no editor yet (REQUIREMENTS.md §8), so posts live here as
 * typed objects — a real CMS can replace this module without any page changing, since
 * every route reads through `allPosts` / `postBySlug`.
 *
 * ⚠️ Every post below is DRAFT, written by us to give the section a real shape. None
 * is a statement the hotel has made. See CONTENT.md before publishing.
 */

export type Post = {
  slug: string;
  title: string;
  /** Small label above the title. */
  kicker: string;
  /** ISO date — rendered with `toLocaleDateString` at read time. */
  date: string;
  readingTime: string;
  image: string;
  /** One-line summary for the index. */
  excerpt: string;
  /** Body paragraphs. */
  body: string[];
};

export const POSTS: Post[] = [
  {
    slug: "the-salt-and-the-wool",
    title: "The salt and the wool",
    kicker: "The road",
    date: "2026-05-14",
    readingTime: "4 min",
    image: "/images/extras/Lomanthang.webp",
    excerpt:
      "What actually moved along the Kali Gandaki, in which direction, and why autumn was the only month it could happen.",
    body: [
      "Before the road to Jomsom, before the jeeps, the Kali Gandaki was a trade route rather than a view. It runs between Dhaulagiri and Annapurna — the deepest gorge on earth by some measures — and for centuries it was the most practical way to move goods between the Tibetan plateau and the Nepali middle hills.",
      "The cargo going south was salt. Tibet's lakes produce it in blocks, and the hills below had none. The cargo coming back north was grain and wool. That exchange, salt for barley and wool, is the entire economic logic of the caravans, and it explains the timing: autumn, after the harvest and before the passes closed.",
      "A caravan of yaks moves at about the speed of a walking person, and the animals cannot be hurried. So the journey set its own pace — a few hours in the cool of the morning, a long stop, a few more before dark. Every settlement on the route grew around where the caravans had to stop anyway.",
      "Lingkor is named for the end of that road: the circuit walked around the stupa at Boudha, where the traders arrived, traded, and rested before turning north again.",
    ],
  },
  {
    slug: "what-a-kora-is-for",
    title: "What a kora is actually for",
    kicker: "Boudha",
    date: "2026-06-02",
    readingTime: "3 min",
    image: "/images/boudhanath.webp",
    excerpt:
      "Every morning and evening the same circle forms around the stupa. It is not a queue, and it is not exercise.",
    body: [
      "A kora is a circumambulation: walking clockwise around something sacred. At Boudhanath it happens twice a day without organisation or announcement — before the shops open, and again after they close.",
      "The direction matters. Clockwise keeps the sacred object on your right, which is the respectful side. Walk it the other way and you will be gently corrected by a stranger.",
      "People turn the prayer wheels set into the stupa's base as they pass, and most are reciting — usually the six syllables of the mani mantra. The wheels contain the same words written out many times over, so turning one is understood to release them.",
      "It is also, plainly, a social hour. Neighbours walk it together. Older residents do several circuits. The lamps go on, the light drops, and the whole square moves in one direction for a while.",
      "Lingkor means that circuit. The hotel sits inside it.",
    ],
  },
  {
    slug: "five-elements-five-rooms",
    title: "Why the hotel has five colours",
    kicker: "The house",
    date: "2026-07-08",
    readingTime: "3 min",
    image: "/images/spaces/menthang.webp",
    excerpt:
      "Earth, water, wind, fire, space — and the reason each one ended up attached to a particular room.",
    body: [
      "Tibetan cosmology counts five elements rather than four: earth, water, wind, fire, and space. Space is not an afterthought in that list — it is the one that contains the others, which is why it is usually given the palest colour.",
      "Each room in the hotel carries one of them, and the pairing is not decorative. Netsang, the dining room, takes earth: the element of substance and of the household. Menthang, the spa, takes water. Ghegu, the tea garden, takes wind — it is named for a gate, and gates are where air and talk move through. Luri, the rooftop, takes fire, and is named for a cave gompa painted in reds. Namkha, the hall, takes space.",
      "The colours came before the interiors. Every wall, textile and lamp in a given room was chosen against its element's colour, which is why the building reads as five distinct places rather than one palette repeated.",
    ],
  },
];

export const allPosts = () =>
  [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
