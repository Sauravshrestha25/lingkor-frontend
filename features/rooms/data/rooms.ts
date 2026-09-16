// TODO: real names, sizes and rates — none supplied. See CONTENT.md.
export const ROOMS = [
  {
    id: "room-01",
    slug: "guestroom",
    name: "Guestroom",
    headline: "A quiet place to return to.",
    description: "A room for two, on the valley side. Settle in after a day around Boudha, leave the bustle at the door, and make a little time for doing nothing.",
    note: "Two beds, valley side",
    size: "2 guests",
  },

  {
    id: "room-05",
    slug: "studio",
    name: "Studio",
    headline: "Stay a little longer.",
    description: "A long window seat invites a slower start to the morning. The Studio offers a place to pause between days out, with room for two to three guests.",
    note: "Long window seat",
    size: "2 to 3 guests",
  },
  {
    id: "room-06",
    slug: "loft",
    name: "Loft",
    headline: "Above the everyday.",
    description: "Up on the top floor, the Loft is the quietest of our rooms. A retreat for two to four guests, with a little distance from the pace of the day.",
    note: "Top floor, quietest",
    size: "2 to 4 guests",
  },

  {
    id: "room-08",
    slug: "apartment",
    name: "Apartment",
    headline: "Your own rhythm, in Boudha.",
    description: "Facing the garden, the Apartment is a base for two. Unpack, find your favourite corner, and let the days in Boudha unfold at your own pace.",
    note: "Facing the garden",
    size: "2 guests",
  },
];

export type Room = (typeof ROOMS)[number];

export function roomBySlug(slug: string) {
  return ROOMS.find((room) => room.slug === slug);
}
