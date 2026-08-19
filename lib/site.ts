/**
 * One source of truth for everything the site repeats across routes: the five
 * spaces, the rooms, and the navigation. Before this existed the space data was
 * pasted into the homepage and again into the navbar, which is how the Ghegu colour
 * ends up right in one place and wrong in the other.
 *
 * Colours and mappings from REQUIREMENTS.md §3.
 */

export type Space = {
  slug: string;
  name: string;
  role: string;
  /** Empty for the two areas the client assigned no element to. */
  element: string;
  hue: string;
  /** One sentence — the client's own, from the page 3–7 comps. */
  line: string;
  /**
   * The name's meaning, as the client sets it: « Mountain of the Nāga », « Plain of
   * Medicinal Herbs ». Verbatim from `LINGKOR- Eric- Dec 2025.pdf`.
   */
  motto?: string;
  /**
   * The name broken into its syllables and glossed, which is how the client's own deck
   * introduces each space before saying anything else about it. Absent where the deck
   * gives no breakdown.
   */
  etymology?: { term: string; gloss: string }[];
  /**
   * Longer body for the space's own page. CLIENT copy for four of the five, transcribed
   * from the Dec-2025 deck; Netsang has no page in that deck, so its body is DRAFT.
   * See CONTENT.md.
   */
  body: string[];
  /**
   * Optional. Mustang Inn and Lingkor Boutique have no render, and the client was
   * explicitly unsure whether they should be shown at all — "just mentioned and
   * discovered later when travellers come". Absent imagery is the faithful answer.
   */
  image?: string;
  /**
   * Further renders of the same space, shown between the paragraphs. Only three of the
   * five have any: the client supplied four restaurant views, two wellness-centre views
   * and three garden views, and nothing at all for the rooftop or the yoga hall.
   */
  gallery?: string[];
  /**
   * A pinned feature run — one image and one caption per feature, cross-fading.
   *
   * Only defined where there are enough photographs to carry it: Luri and Namkha have
   * a single render each, and a one-frame slideshow is a still image with machinery
   * attached. They render without this section until real photography exists.
   */
  features?: { title: string; line: string; photo: string }[];
  field: string;
  displayOnField: "white" | "ink";
  /** True for the two areas with no element colour. Renders on canvas. */
  colourless?: boolean;
};

export const SPACES: Space[] = [
  {
    slug: "netsang",
    name: "Netsang",
    role: "Fine dining",
    element: "Earth",
    hue: "Ocre yellow",
    line: "The warmth of family, or of a best friend's table. Netsang gathers guests the way a household gathers at the end of a day's travel.",
    // ⚠️ DRAFT. The Dec-2025 deck gives a full page to Luri, Menthang, Ghegu and
    // Namkha but none to fine dining — it is the one space with no client copy, and
    // the deck names it "Tsa Khal" rather than Netsang. Everything below is ours.
    motto: "« Family, or the closest of friends »",
    body: [
      "Netsang is the word for the bond between a household and the travellers it takes in — closer than a guest, nearer to family. It is the oldest form of hospitality on this road: the room where the caravan was fed before anything else was discussed.",
      "The kitchen cooks what came in that morning. Thakali plates, Mustangi grain, and the slow dishes that suit a long table more than a small one.",
    ],
    image: "/images/spaces/netsang.webp",
    gallery: [
      "/images/spaces/gallery/netsang-1.webp",
      "/images/spaces/gallery/netsang-2.webp",
      "/images/spaces/gallery/netsang-3.webp",
      "/images/spaces/gallery/netsang-4.webp",
    ],
    // ⚠️ DRAFT — the Dec-2025 deck has no page for fine dining, so all of this is ours.
    features: [
      {
        title: "The long table",
        line: "Food arrives because it is time to eat, not because it was ordered.",
        photo: "/images/spaces/gallery/netsang-3.webp",
      },
      {
        title: "Thakali plates",
        line: "Mustangi grain, and the slow dishes that suit a household rather than a menu.",
        photo: "/images/spaces/gallery/netsang-1.webp",
      },
      {
        title: "The window wall",
        line: "Morning light down the whole length of the room.",
        photo: "/images/spaces/gallery/netsang-2.webp",
      },
      {
        title: "Netsang means kinship",
        line: "Closer than a guest, nearer to family — the oldest form of welcome on this road.",
        photo: "/images/spaces/gallery/netsang-4.webp",
      },
    ],
    field: "var(--color-earth)",
    displayOnField: "white",
  },
  {
    slug: "menthang",
    name: "Menthang",
    role: "Tibetan spa",
    element: "Water",
    hue: "Turquoise blue",
    line: "The plain of medicinal herbs — a place given over to slowness, warm water, and the plants that have long eased Himalayan bodies.",
    motto: "« Plain of Medicinal Herbs »",
    etymology: [
      {
        term: "Men",
        gloss:
          "medicine or healing (refers both to herbal medicine and the broader concept of spiritual or physical healing).",
      },
      { term: "Thang", gloss: "plain, meadow, or open field." },
    ],
    // CLIENT copy, verbatim from LINGKOR- Eric- Dec 2025.pdf p6.
    body: [
      "In Mustang, place names like Menthang indicate areas where medicinal herbs are abundant, or where traditional healers (amchi) gather and collect plants for Tibetan medicine (Sowa Rigpa). A valley or meadow named Menthang likely has a long association with healing energy, medicinal plants, or sacred herbal traditions.",
      "In the symbolic or religious sense, Menthang can also mean a place blessed by healing deities, such as Medicine Buddha. A site associated with restoration, balance, and purification — both of body and mind. A pilgrimage destination for those seeking healing.",
      "So \"Menthang\" can be understood as \"a field of healing energy,\" where nature, medicine, and spirituality converge.",
      "The word also refers to Lo Manthang, the capital of the Kingdom of Lo, built on an open plain. « Lo » means South and the people of Mustang are called Lopa (people of the south). Mustang is a conflation of the capital\u2019s name with the entire kingdom by Nepali speakers, transforming from Manthang to Mustang over time.",
    ],
    image: "/images/spaces/menthang.webp",
    gallery: [
      "/images/spaces/gallery/menthang-1.webp",
      "/images/spaces/gallery/menthang-2.webp",
    ],
    // Drawn from the client's own Menthang page (Dec-2025 deck, p6).
    features: [
      {
        title: "A field of healing energy",
        line: "Where nature, medicine and spirituality converge.",
        photo: "/images/spaces/menthang.webp",
      },
      {
        title: "Sowa Rigpa",
        line: "The plants the amchi have gathered in these valleys for centuries.",
        photo: "/images/spaces/gallery/menthang-1.webp",
      },
      {
        title: "An hour, at minimum",
        line: "Restoration, balance and purification — of body and of mind.",
        photo: "/images/spaces/gallery/menthang-2.webp",
      },
    ],
    field: "var(--color-water)",
    displayOnField: "white",
  },
  {
    slug: "ghegu",
    name: "Ghegu",
    role: "Tea garden",
    element: "Wind",
    // Deviation from the client's own colour doc, which sets Wind/Ghegu as green
    // (#939D2C) — see REQUIREMENTS.md §3. Needs client sign-off.
    hue: "Slate blue",
    line: "Named for the main entrance of Lo Manthang, where people gather and talk. Ghegu is the garden threshold where conversation collects.",
    motto: "The main entrance of Lo Manthang",
    etymology: [
      { term: "Ghegu", gloss: "originally \u201Crgyal sgo\u201D, meaning \u201Croyal gate\u201D." },
    ],
    // CLIENT copy, verbatim from LINGKOR- Eric- Dec 2025.pdf p7.
    body: [
      "Ghegu functions both as a physical access point and a symbolic threshold for the community. The surrounding settlement is designed with a mandala-like layout, with the gate marking one of the outer rings or thresholds of this sacred and fortified town planning.",
      "It forms part of the protective frame of the town: adjacent to the gate is the ritual space Mang Gang (a small room containing a large prayer wheel) and other protective installations like a high mud-wall, watch-towers, and sacred objects around the compound wall.",
      "As the main entrance, Ghegu also marks the threshold between the outer world and the sacred, religious, community-space of the town — entering there is more than passing a gate: it denotes a movement into a space of tradition, ritual, communal memory.",
      "But Ghegu is not just a physical gate — it is a social gathering place where, in their leisure time, people sip tea and gossip, while the elderly folks narrate jokes, folklore, myths and their life experiences to youngsters.",
    ],
    image: "/images/spaces/ghegu.webp",
    gallery: [
      "/images/spaces/gallery/ghegu-1.webp",
      "/images/spaces/gallery/ghegu-2.webp",
      "/images/spaces/gallery/ghegu-3.webp",
    ],
    // Drawn from the client's own Ghegu page (Dec-2025 deck, p7).
    features: [
      {
        title: "The royal gate",
        line: "Rgyal sgo — the one opening in the wall of Lo Manthang.",
        photo: "/images/spaces/ghegu.webp",
      },
      {
        title: "Tea, and gossip",
        line: "Where people sit in their leisure time and the elders tell it again.",
        photo: "/images/spaces/gallery/ghegu-1.webp",
      },
      {
        title: "A threshold",
        line: "More than passing a gate: a movement into tradition and communal memory.",
        photo: "/images/spaces/gallery/ghegu-2.webp",
      },
      {
        title: "The protective frame",
        line: "Beside it the Mang Gang, a small room holding one large prayer wheel.",
        photo: "/images/spaces/gallery/ghegu-3.webp",
      },
    ],
    field: "var(--color-wind)",
    displayOnField: "white",
  },
  {
    slug: "luri",
    name: "Luri",
    role: "Rooftop café",
    element: "Fire",
    hue: "Red",
    line: "For the Mountain of the Nāga, and the cliff caves of Luri in Upper Mustang. A place for open sky, low sun, and the last light on the stupa.",
    motto: "« Mountain of the Nāga »",
    etymology: [
      {
        term: "Lu",
        gloss:
          "Nāga, the serpent or water spirit, guardian of treasures and subterranean realms.",
      },
      { term: "Ri", gloss: "mountain." },
    ],
    // CLIENT copy, verbatim from LINGKOR- Eric- Dec 2025.pdf p5.
    body: [
      "According to local legend, this mountain is home to powerful nāgas and subterranean deities who guard the spiritual treasures hidden by Guru Rinpoche (Padmasambhava).",
      "Hidden among the ochre cliffs above the village of Yara, lies a place that seems carved from myth — the sky cave of Luri Gompa. It sits high on a sandstone cliff, its entrance small and humble. Reaching it is an adventure in itself: a steep climb through wind-carved canyons, across a barren, lunar landscape. From afar, the cave looks almost invisible — a small opening in the ochre rock. Yet for centuries, pilgrims have found their way here, drawn by its mystery and power.",
      "When you step into the dim light of the cave, you find something astonishing — a painted chörten (stupa) built inside the rock chamber itself. It stands about three meters high, its dome and base richly decorated with murals in deep reds, golds, and blues.",
      "The cave walls are covered with 13th–14th century murals, among the finest in the Himalayas. Luri is a spiritual jewel set in Mustang's desert cliffs — a place where art, devotion, and myth converge.",
      "It tells of a time when Mustang was a crossroads of Himalayan wisdom — when the winds carried both salt and prayers, and caves in the mountain became sanctuaries for the sacred imagination.",
    ],
    image: "/images/spaces/luri.webp",
    field: "var(--color-fire)",
    displayOnField: "white",
  },
  {
    slug: "namkha",
    name: "Namkha",
    role: "Yoga & teaching hall",
    element: "Space",
    hue: "Off-white",
    line: "The sky. A celestial hall held open and unhurried, for spiritual teaching and yogic practice — the element that contains all the others.",
    motto: "« The Sky »",
    // The deck gives Namkha one line and no more — the shortest page in it, for the
    // element that is emptiness. The first paragraph below is the client's, verbatim
    // (p8); the second is DRAFT, and the page reads fine without it if they would
    // rather keep the silence.
    body: [
      "A celestial hall for spiritual teachings & yogic practices.",
      "The hall is kept deliberately empty. Yoga in the morning before the kora fills, teachings when a teacher is here, and otherwise a large quiet room with the light coming in.",
    ],
    image: "/images/spaces/namkha.webp",
    field: "var(--color-space)",
    displayOnField: "ink",
  },
];

// The two areas the client listed after the five, "with no specific color".
// Kept in the same list because the client kept them in the same list.
const COLOURLESS: Space[] = [
  {
    slug: "mustang-inn",
    name: "Mustang Inn",
    role: "The welcome room",
    element: "",
    hue: "No colour assigned",
    line: "The room in the front building that meets the traveller in pure Mustang style — butter tea, chang, and a traditional interior.",
    body: [
      "Before the hotel proper, before the key and the stairs, there is a room in the front building whose only purpose is to receive people who have just arrived.",
      "Butter tea and chang, low seating, and an interior built the way a Mustangi house is built. It is the part of the building that most directly repeats what the caravans were given at the end of the road.",
    ],
    field: "var(--color-space)",
    displayOnField: "ink",
    colourless: true,
  },
  {
    slug: "lingkor-boutique",
    name: "Lingkor Boutique",
    role: "The shop",
    element: "",
    hue: "No colour assigned",
    line: "Weaving, wool and the crafts of Lo — the goods that came down this road in the first place.",
    body: [
      "The trade that made this route ran on salt going south and wool coming back north. The shop is the modern end of that exchange.",
      "Weaving, wool and craft from Lo and the valleys below it.",
    ],
    field: "var(--color-space)",
    displayOnField: "ink",
    colourless: true,
  },
];

/** All seven areas the client listed — the five elements, then the two without. */
export const AREAS: Space[] = [...SPACES, ...COLOURLESS];

/**
 * The page ground, as a value the components can compare against.
 *
 * Namkha's field is the same off-white, because Space is the element that contains the
 * others rather than one more colour beside them. Anywhere a panel of that colour meets
 * the ground there is no edge to see, so the panel needs a hairline instead. Comparing
 * to this constant keeps that decision in one place rather than hardcoding "if namkha"
 * across three files.
 */
export const GROUND = "var(--color-space)";

/**
 * True when this space's field is the same colour as the page it sits on.
 *
 * A plain string match now that fields are token references rather than hexes — and
 * that is the point: when `--color-canvas` moves, this keeps telling the truth, whereas
 * the previous `field.toUpperCase() === "#F0EDE6"` was a second copy of the ground
 * colour waiting to disagree with the first.
 */
export const blendsWithGround = (field: string) => field === GROUND;

export function spaceBySlug(slug: string) {
  return AREAS.find((s) => s.slug === slug);
}

// TODO: real names, sizes and rates — none supplied. See CONTENT.md.
export const ROOMS = [
  { id: "room-01", name: "Valley Twin", note: "Two beds, valley side", size: "Two guests" },
  { id: "room-02", name: "Lamp Room", note: "Copper lamps, painted headboard", size: "Two guests" },
  { id: "room-03", name: "Corner Room", note: "Two aspects, morning light", size: "Two guests" },
  { id: "room-04", name: "Lo Suite", note: "Living room and bedroom", size: "Two to three" },
  { id: "room-05", name: "Window Suite", note: "Long window seat", size: "Two to three" },
  { id: "room-06", name: "Top Suite", note: "Top floor, quietest", size: "Two to three" },
  { id: "room-07", name: "Terrace Superior", note: "Terrace, stupa side", size: "Two guests" },
  { id: "room-08", name: "Garden Superior", note: "Facing the garden", size: "Two guests" },
];

/**
 * Secondary navigation.
 *
 * The client's brief lists seven *areas of the hotel* and no page tree at all — see
 * REQUIREMENTS.md §3. Those seven are the menu's primary column; this is only what a
 * hotel site needs on top of them to function.
 *
 * `/about`, `/mustang` and `/boudha` exist as routes but are deliberately not linked
 * here: that story is meant to be felt across the homepage, not filed behind a tab.
 * Journal is a client-side addition with no basis in the brief — flagged in CONTENT.md.
 */
export const NAV = [
  { label: "Rooms", href: "/rooms" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export const CONTACT = {
  // TODO: street address and a dedicated hotel line/address — none supplied.
  // These trace to one person's business card. See CONTENT.md.
  address: "Boudha, Kathmandu, Nepal",
  phone: "+977 9861413633",
  phoneHref: "tel:+9779861413633",
  email: "phuntsokg8808@gmail.com",
};
