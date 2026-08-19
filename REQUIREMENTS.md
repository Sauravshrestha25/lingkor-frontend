# Lingkor Boudha — Website Requirements

What the client gave us, what it means, and the direction we are building in.

Source of truth for everything below: `public/images/Lingkor elements for website/` — 583 MB of
client-supplied brand material (gitignored, reference only, never shipped). If this document and
that folder disagree, the folder wins for *facts*, this document wins for *decisions*.

---

## 1. What Lingkor is

A hotel in Boudha, Kathmandu. **Lingkor** is Tibetan for "circumambulation of the sacred
enclosure" — both a pilgrimage route and the act of walking around a sacred site.

The whole property is built on one story: the old caravan route from **Mustang to Boudha**.
Each autumn, traders of Lo gathered yaks and mules, carried salt from Tibet and barley from
their own valleys, descended the Kali Gandaki through Kagbeni, Jomsom and Thak Khola, traded at
the great stupa for wool, and climbed home before winter.

The hotel is the caravan's resting place. The website is the beginning of that journey.

Owner contact (from the business card): Phuntsok Sangpo · 9861413633 · phuntsokg8808@gmail.com
Tagline in use on signage: **"Rest in the Spirit of Mustang"**

---

## 2. The client's brief for the website

Taken verbatim in intent from `1. Lingkor concept/Lingkor concept guidelines.docx`. These are
constraints, not suggestions.

- **Spacious. Nothing tight.** Real, deliberate emptiness.
- **Very simple design**, off-white background.
- **Mysterious — do not disclose everything.** The site creates suspense. The full story is told
  at the hotel, not online. "Like a dream, mysterious, cosy."
- **Text is minimal.** Short lines. No paragraphs of marketing.
- Warm, comfortable, cosy — the feeling of arriving after a mountain journey.
- Use the **Tibetan cloud** motif (as painted on the hotel cabinets), plus the drawings and
  patterns from the brand kit.
- "Kind of mosaic with the 5 elements."
- **Homepage:** large photos of Mustang geology slowly transforming into the Boudha stupa, then
  the logo appears. Video. **With the sound of wind.**
- Reference sites given by client, in priority order: [forestis.it](https://www.forestis.it/en/), [eriro.at](https://www.eriro.at/en/), [masgirbau.com](https://www.masgirbau.com/), [here-away.com](https://www.here-away.com/), [ownprimland.com](https://ownprimland.com/), [sonbrull.com](https://sonbrull.com/). Studied in detail — see **[DESIGN-LANGUAGE.md](DESIGN-LANGUAGE.md)** for measured tokens and the rules we take from them.
- Type: titles in Hasweny; body in Barlow Condensed / Roboto / Lato — we may propose.

### What that means for us

Restraint is the deliverable. Every instinct to add a section, a card grid, a testimonial strip,
a stats row is wrong here. Big photography, huge negative space, one sentence at a time, slow
motion. Closer to a gallery than to a hotel site.

---

## 3. The five spaces

Five Tibetan elements, one per venue. This is the site's primary content structure — the
"mosaic of 5 elements" the brief asks for.

| Space | Name | Meaning | Element | Colour |
|---|---|---|---|---|
| Fine dining | **Netsang** | family / best-friend bond | Earth | `#CC9636` ocre yellow |
| Tibetan spa | **Menthang** | plain of medicinal herbs | Water | `#539B8F` turquoise |
| Tea garden | **Ghegu** | main entrance of Lo Manthang, where people gather and chat | Wind | `#939D2C` green |
| Rooftop café | **Luri** | mountain of the Nāga; the Luri caves of Upper Mustang | Fire | `#C66020` red |
| Yoga / teaching hall | **Namkha** | the sky | Space | `#F0EDE6` off-white |

Two further areas, **no colour assigned**:

- **Mustang Inn** — front-building room welcoming travellers in pure Mustang style (butter tea,
  chang), traditional interior.
- **Lingkor Boutique**

The client is undecided whether these two are shown at all, or only discovered on arrival.
Default: mention by name, no gallery — consistent with the "don't disclose" rule.

> **Homepage section removed (Aug 2026).** `LINGKOR- Eric- Dec 2025.pdf` covers **five spaces
> and no others** — cover, the meaning of *lingkor*, the caravan story, the five-element grid,
> then one page each for Luri, Menthang, Ghegu, Namkha. Neither the Inn nor the Boutique
> appears anywhere in its 8 pages, so the "Two more rooms" block on the homepage is gone.
>
> ⚠️ **This is not settled.** The brief quoted in §7 says, in the client's own words, *"we need
> to add with no specific color: Mustang Inn … and Lingkor Boutique"* — an instruction that
> post-dates this deck. So absence from the Dec-2025 deck is not the same as the client
> dropping them. They are still in `lib/site.ts` (`COLOURLESS`), still in the seven-area menu,
> and `/spaces/mustang-inn` and `/spaces/lingkor-boutique` still render. **Confirm with the
> client before removing those too** — see open question 6.

> ✅ **Conflict resolved.** The Dec-2025 deck (`5. Brand identity first proposal`) uses an older,
> wrong mapping: it names fine dining "Tsa Khal" and swaps Luri (Wind/green) with Ghegu
> (Fire/red). Both the May-2026 `4. Colors/LINGKOR-Colors per area.pdf` **and** the concept
> brainstorm brief agree against it — Netsang for fine dining, Ghegu as Wind, Luri as Fire. Two
> independent sources beat one superseded deck. **Build against the table above**, which is what
> the live site does.

> ⚠️ **Second conflict — Namkha.** The `Colors.psd` swatch strip gives Space as pure `#FFFFFF`;
> the Namkha panel in `LINGKOR-Colors per area.pdf` measures `#F0EDE6`. The per-area PDF wins
> (same document that settles the mapping above), and `#F0EDE6` is what the brief's phrase "off
> white" actually describes. Treat the PSD's `#FFFFFF` as a placeholder swatch. Worth confirming
> with the client, since Namkha sits very close to the canvas ground either way — which is
> arguably the point for the element of space.

> ⚠️ **Implementation deviation — Ghegu.** The table above is the client's documented fact:
> Wind/Ghegu is `#939D2C` green. The live build currently renders Ghegu at `#6E7F91` (slate
> blue) instead, per an explicit request made during build rather than anything in the source
> material.
>
> **Now confirmed twice.** The concept brainstorm brief states it in the client's own words —
> *"Tea counter in the garden : Ghegu - Tea Garden … Color : Green (Wind element)"* — agreeing
> with the May-2026 per-area PDF. Two independent client sources, one build overriding both. This is **not** a corrected conflict like the two above — it's a design choice
> overriding a confirmed client colour, and it needs the client's sign-off before launch. If it
> isn't approved, revert `--color-wind` and the Ghegu `field`/`hue` values to `#939D2C` green.

---

## 4. Design system

### Colour

The five element colours above, plus:

| Token | Hex | Use |
|---|---|---|
| canvas | `#E1DFDC` | off-white page ground |
| sand | `#CECAAF` | khaki secondary ground (posters, footers) |
| ink | `#1C1A17` | text |

Sampled exactly from `4. Colors/Colors.psd`. Element colours are for **section identity** — one
colour owns one space, full-bleed or as a wide block. Never mix two element colours in one view;
that breaks the mosaic logic.

### Type

- **Titles: Hasweny** (script, Brandsemut, ©2024, all rights reserved).
  ⚠️ **Blocked on license.** Web embedding rights unverified. `Alex_Brush` from Google Fonts is
  currently standing in (`app/layout.tsx`, `--font-logo`). Either buy the webfont license or keep
  a licensed stand-in — do not self-host the supplied `.otf` until this is resolved.
- **Body: Barlow Condensed** Light + Regular (OFL, safe to self-host).
- **Tibetan script: Yagpo Tibetan Uni** — 1.9 MB, subset it or render Tibetan lines as SVG.
  Hasweny has no Tibetan glyphs.

### Motifs

From `6. Graphics/`. White line art on solid element colour:

- **Yak caravan train** — the signature mark; the journey itself
- **Boudha stupa** line drawing
- **Mountain panorama with monastery** (Lo Manthang silhouette)
- **Om Mani Padme Hum** vertical Tibetan
- **Tibetan clouds** — hand-painted on weathered wood; explicitly requested
- **Endless-knot pattern** — ghosted watermark / copper cut-out texture
- **Striped painted-wall texture** — ochre/red/grey/white vertical bands from Mustang monastery
  walls; recurs as signage and key-card art

Treatment across the brand: torn / dry-brush edges on colour blocks, never hard rectangles.

---

## 5. Imagery

| Set | Count | Use |
|---|---|---|
| `8. Mustang pictures` | 55 | Landscape and texture. Canyon walls, striated badlands, cave cliffs, chortens, prayer wheels, mani stones, painted doorways. Hero and atmosphere. |
| `7. 3D views` | 25 | The only imagery of the hotel that exists. Lobby ×3, restaurant ×4, spa ×2, rooms, suites, superior rooms, garden ×3, aerial exterior. |
| `6. Graphics` | 17 | Motifs, signage, print collateral. |

Rules:

- Where a photo has both a raw and a `-mod` version, use `-mod` (retouched).
- Everything ships as WebP via `scripts/webp.sh`, with a `-1280` variant beside the 2560 one.
- Converted sets already live in `public/images/mustang/` and `public/images/extras/`.
- The 3D renders are renders. Use them large and warm; replace with photography once the hotel
  is shot.

---

## 6a. What the client actually specified as structure

Worth stating plainly, because it is easy to drift from: **the brief contains no page
tree.** It lists seven *areas of the hotel*, and nothing else:

> **5 tibetan elements, each one for one area** — Netsang (restaurant), Menthang (spa),
> Ghegu (tea counter in the garden), Luri (roof top terrace), Namkha (yoga/teachings/
> conference hall).
>
> **And we need to add with no specific color:** "Mustang Inn" — the room in the front
> building to welcome the traveler in pure Mustang style (butter tea, chang) — and
> "Lingkor Boutique".

Everything else in the brief is *tone*: spacious, off-white, "mysterious, not disclosing
everything", "text is minimal", "kind of mosaic with the 5 elements", the geology→stupa→
logo film with wind sound, forestis.it as reference.

So the menu is those seven areas. **Rooms** and **Contact** are ours — a hotel that
sells rooms needs both, and the brief simply doesn't address it. **Journal** is a
client-side addition with no basis in the brief, kept at the client's explicit request;
note that it sits awkwardly against *"not need to disclose the full story on the website"*.

`/about`, `/mustang` and `/boudha` exist as routes but are deliberately **not** in the
menu — that story is meant to be felt across the homepage, not filed behind a tab. Delete
them if the client doesn't want them; nothing links to them.

---

## 6. Page direction

The client supplied comps in `9. Website pages ideas/` — pages 2–7. **Page 1, the hero, does not
exist**, which is exactly the piece the brief describes in most detail. That is ours to design.

- **Hero (to design).** Mustang geology → dissolve → Boudha stupa → logo. Video, with wind
  sound. Sound must be opt-in / muted by default; the video needs a static poster fallback and a
  `prefers-reduced-motion` path.
- **Arrival** (comp exists, page 2). Off-white ground, terracotta line art, letterspaced eyebrow,
  one sentence: *"You arrive the way the old caravans did — tired from travel, and met like
  family the moment you're through the door."* Asymmetric image / drawing pairing.
- **The Five Spaces** (comps exist, pages 3–7). One full screen per space: colour bar with logo,
  full-bleed render, colour block with name, role, `EARTH · OCRE YELLOW` label, one sentence.
- **Rooms** — no comp, no content yet.
- **Mustang / Boudhanath / Getting here** — no comps. Built as an original three-beat closing
  arc; see DESIGN.md §7.
- **Visit / Enquire** — address, hours, phone. All placeholder today; a real form now exists,
  submitting by `mailto:` until there's a backend.
- **Booking** — no engine. `EnquireForm` is the interim path.

The comps are work-in-progress screenshots, not final art: page 5's copy breaks mid-sentence
("…where conversation collects. bodies.") and pages 4/5/7 have ghost text bleeding at the top
edge. Treat them as direction, not specification.

---

## 7. Technical constraints

- Next.js App Router. Read `node_modules/next/dist/docs/` before writing Next-specific code —
  this version differs from training data (see `AGENTS.md`).
- **Client asset folder is gitignored.** Next serves everything under `public/`; the raw
  `.psd` / `.ai` / `.indd` (313 MB) must never reach the build.
- Hero photo is served as a plain `<img>` with `srcSet`, not `next/image`, so the preloader and
  the hero share one URL and one download (`lib/photo.ts`).
- Wind audio and video autoplay: muted by default, user-gestured sound, reduced-motion fallback.

---

## 8. Open — blocked on the client

1. **Hero video + wind audio.** No source footage supplied. Shoot, license, or build from stills?
2. **Hasweny webfont license.** Blocking real brand typography.
3. **Logo as SVG**, plus light / inverted variants. Only `.ai` / `.psd` / raster today.
4. **Real content**: rooms and rates, menus, address, hours, phone. All `TODO` in `app/page.tsx`.
5. **Booking path** — direct engine, enquiry form, or OTA link?
6. **Mustang Inn and Lingkor Boutique** — shown on the site, or discovered on arrival?
7. **Netsang page** missing from the brand deck; no comps for the two colourless spaces.
8. English only, or Nepali / Tibetan too?

---

## 9. Current state vs. this document

The full homepage is built against this document and **[DESIGN.md](DESIGN.md)**, on GSAP +
Lenis rather than the CSS-only system the first pass used: video hero, Arrival, the welcome
quote, the caravan story, the five spaces as a pinned horizontal rail, the two named-only
spaces, Rooms with a drag rail, a three-beat closing arc (Mustang → Boudhanath → Convergence),
Experiences, Getting here, an Enquire section with a real form, and a full editorial footer.
Tokens, type scale, spacing and every animation primitive live in `app/globals.css` and
`components/{anim,ScrollText}.tsx`; the page composes `components/{Hero,Navbar,Footer,
SpacesRail,RoomsRail,HoverRevealList,KoraCircle,EnquireForm,ui}`.

Copy is live but not all of it is the client's — **[CONTENT.md](CONTENT.md)** marks every
line as CLIENT, DRAFT or PLACEHOLDER and lists what the client still needs to send.

Now built as a nine-route site (see DESIGN.md §7): home, /about, /rooms, /spaces and the five /spaces/[slug] pages, /mustang, /boudha, /journal + posts, /contact. Nineteen pages, all prerendered.

Not built yet: a CMS for the journal, and any booking system. The blockers in §8
above all still stand, plus §3's Ghegu-colour deviation and CONTENT.md's newer open items
(Experiences offerings, walking distance, a real address for the map).
