# DESIGN.md — Lingkor Boudha

The build spec. What the pages are made of, in numbers.

Companions: **[REQUIREMENTS.md](REQUIREMENTS.md)** — what Lingkor is and what the client asked for.
**[DESIGN-LANGUAGE.md](DESIGN-LANGUAGE.md)** — the six reference sites, measured.

Governing sentence, from the client's brief: *spacious, very simple, off-white, mysterious, minimal text.* When a decision is unclear, pick the emptier, quieter, slower option.

---

## 1. Tokens

```css
/* app/globals.css */
@theme {
  /* ground + ink */
  --color-canvas:  #E1DFDC;  /* page ground — never #fff */
  --color-sand:    #CECAAF;  /* secondary ground: footer, quiet bands */
  --color-ink:     #1C1A17;  /* all body text */
  --color-line:    #1C1A1F1A; /* hairlines — ink @ 10% */

  /* the five elements — section identity only */
  --color-earth:   #CC9636;  /* Netsang  · fine dining */
  --color-water:   #539B8F;  /* Menthang · spa */
  --color-wind:    #6E7F91;  /* Ghegu    · tea garden — deviation, see below */
  --color-fire:    #C66020;  /* Luri     · rooftop café */
  --color-space:   #F0EDE6;  /* Namkha   · yogsala — see REQUIREMENTS.md §3, second conflict */

  /* type */
  --font-display:  var(--font-hasweny);   /* Alex Brush stands in until licensed */
  --font-body:     var(--font-barlow-condensed);
  --font-tibetan:  var(--font-yagpo);
}
```

Sampled exactly from `4. Colors/Colors.psd`, except `--color-space`, which comes from the Namkha panel of `4. Colors/LINGKOR-Colors per area.pdf` — the two sources disagree (`#FFFFFF` vs `#F0EDE6`) and the per-area PDF is authoritative. See REQUIREMENTS.md §3.

**Second deviation — Ghegu.** The client's colour doc sets Wind/Ghegu as green (`#939D2C`).
`--color-wind` is currently `#6E7F91`, a slate blue, at explicit request during build. This is
not sourced from any client document — **it needs client sign-off before this ships**, the same
as any other brand-mapping change. Revert to `#939D2C` if it isn't approved.

Do not eyeball new tints — if a shade is needed, use the element colour at an explicit opacity over canvas.

### Colour law

1. **One element colour owns one section.** Full-bleed, flat, as a field — not as a border, badge, or icon tint.
2. **Never two element colours in one viewport.** Between every coloured section, return to canvas.
3. **Nothing else is coloured.** No coloured links, no coloured buttons, no coloured focus states outside the section's own element colour.
4. On an element field, line art is `--color-space`. Type follows the contrast table below, not this rule.
5. Namkha is off-white on canvas — the near-invisible section. That is correct; it is the element of space. Separate the two with a hairline or the width of the field, not with a darker tint.

Contrast, computed (against pure `#FFFFFF`; `--color-space` `#F0EDE6` lands ~8% lower, so it never rescues a failing pair):

| Field | White on it | Ink on it |
|---|---|---|
| earth `#CC9636` | 2.6 ✗ | 6.6 ✓ |
| wind `#6E7F91` | 4.1 (large only) | 4.2 ✓ |
| water `#539B8F` | 3.3 (large only) | 5.2 ✓ |
| fire `#C66020` | 4.1 (large only) | 4.2 ✓ |

So: **body copy on an element field is ink, always.** White is reserved for display type ≥ 40px, and never on earth. Line art is decorative and exempt. Ink on canvas is ≈ 13:1.

This overrides rule 4 above wherever they conflict — the brand deck sets everything in white, but the deck is print at 300dpi and we are not.

---

## 2. Type

Three roles. There is no fourth.

| Role | Family | Size | Leading | Weight | Tracking | Case |
|---|---|---|---|---|---|---|
| **Display** | Hasweny → **Italiana** | `clamp(2.75rem, 6vw, 6rem)` | 1.02 | 400 | `0.005em` | sentence |
| **Body** | **Jost** Light | `clamp(1.0625rem, 1.15vw, 1.25rem)` | 1.65 | 300 | 0 | sentence |
| **Label** | **Jost** | 11px | 1.2 | 400 | `0.2em` | UPPERCASE |

> ⚠️ **Hasweny is not a script.** Earlier passes assumed it was and stood in Alex Brush, a
> wedding script — which is why the type read cheap. Rendering the supplied
> `public/fonts/Hasweny-XGe69.otf` shows an elegant **high-contrast geometric display
> sans**: wide round bowls, very thin strokes, slightly flared terminals, single-storey
> `g`. A fashion masthead, not handwriting. **Italiana** matches that skeleton and is the
> stand-in until the licence clears.
>
> **Body is a proposal, not the brief.** The client offered "Barlow condensed or Roboto or
> Lato… but you can propose for texts fonts". Jost is proposed because every reference site
> they chose runs this exact class of geometric sans at a light weight — Forestis on Brandon
> Text Light, eriro on karol-sans 300, Primland on Centra, Son Brull on Soleil. **None uses a
> condensed body.** Barlow Condensed made the page read like a listings magazine.

Notes:
- Body at 20px, not 16. Every reference site sets 18–25px. Small text reads as software.
- Display line-height is 1.0 — at 96px, lines nearly touch. Tight display, loose body. That inversion is the whole typographic effect.
- **No bold. Anywhere.** Not in nav, not in buttons, not for emphasis. Emphasis is size, space, or a line break.
- Label is the only third style, and it earns its place doing one job: `EARTH · OCRE YELLOW`, `ARRIVAL`, `THE FIVE SPACES`.
- Tibetan (`ཀུན་`) renders in Yagpo at 1.15× the surrounding size — its x-height runs small. Subset it; the full file is 1.9 MB.
- Measure caps at **62ch**. Headlines cap at **16ch** — if a headline needs more, it is not a headline.

---

## 3. Space

One scale, base 8. Only these values:

`8 · 16 · 24 · 40 · 64 · 104 · 168 · 272`

| Use | Value |
|---|---|
| Page gutter | 24 mobile → 64 desktop |
| Label → headline | 24 |
| Headline → body | 40 |
| Body → link | 40 |
| Between blocks inside a section | 104 |
| **Between sections** | **272** (`min(272px, 22vh)` on mobile) |
| Section top/bottom padding | 168 |

272px between sections is not a typo. eriro scrolls through screens that are entirely empty. If the page feels too sparse in review, it is close to right.

Content column: `max-width: 1280px`, centred, with the gutter outside it. Full-bleed images and element fields ignore it and run edge to edge.

---

## 4. Components

**Rise, SplitLines, SplitChars, RevealParagraph, Parallax** (`components/anim.tsx`) — the GSAP
primitives everything else is built from.

- **Rise** — the house reveal. `opacity 0→1`, `y 28px→0`, 1.1s, `power3.out`, triggered once at
  `top 88%`. Same job the old CSS `.reveal` class did, now on one GSAP/ScrollTrigger timeline so
  it never disagrees with a pinned section about where the scroll actually is.
- **SplitLines** — display headlines only. Each line masked and risen from `yPercent: 118`,
  staggered 90ms, `power4.out`. Used for every big heading on the page (`Arrival`'s "You arrive
  / the way the / caravans did", `Rooms`, `Mustang`, `Boudha`, `Enquire`).
- **SplitChars** — display type revealed one character at a time. Split by word *first*, then by
  character within each word, with the word as the non-breaking unit: splitting a line straight
  into characters lets the browser wrap mid-word the moment the viewport narrows. The whole
  string goes on `aria-label` and the spans are `aria-hidden`, or a screen reader announces the
  line letter by letter.
- **RevealParagraph** — a long passage inking in from 18% to full as it crosses the viewport,
  scrubbed so the reading is tied to the scroll. Words, not characters: at paragraph length,
  per-character takes longer to finish than anyone will wait.
- **Parallax** — a photograph drifting against the scroll, capped at the `strength` prop (default
  8, up to 12 for foreground elements). Scales the image to cover the drift so no edge exposes.

**SpacesCarousel**, **RoomsRail** and **Testimonials** — the three drag rails. Native `overflow-x` + `scroll-snap`
underneath, pointer-drag layered on top, so trackpad, touch flick, keyboard and scrollbar all
keep working and the drag is an addition rather than a replacement. Snap is switched off for the
duration of a drag (it fights the gesture) and restored on release, which settles the rail onto
the nearest card. None of them pins the page.

`Testimonials` adds focus-by-proximity on top. Two implementation notes worth keeping:

- **Measure in viewport space, never `offsetLeft`.** `offsetLeft` is relative to the nearest
  *positioned* ancestor, which these rails are not — mixing it with `rail.scrollLeft` compares
  two coordinate systems and lights the wrong card. `getBoundingClientRect()` on both rail and
  card is correct regardless of ancestry.
- **Don't depend on the `scroll` event alone.** Focus is also driven from the drag handler and
  from a short bounded rAF `settle()` after any programmatic scroll, so a missed or throttled
  scroll event can never strand the highlight on the wrong card.

**Navbar** (`components/Navbar.tsx`) — `Menu` left, **wordmark centred**, `Enquire` right, laid
out as `grid-cols-[1fr_auto_1fr]` rather than a flex row so the mark stays optically centred in
the viewport regardless of how wide the labels either side grow. Bar hides on
scroll-down past 400px and returns on scroll-up (GSAP `yPercent` tween, not CSS, so it shares a
frame budget with everything else). Past the hero it takes `canvas/92` + ink marks; on the hero,
transparent + white marks. `Menu` opens a fullscreen ink panel — GSAP clip-path wipe, then the
five names rise in stagger — with a render preview that swaps on hover/focus. This is where the
five spaces actually live; there is no spaces item in the slim bar.

**Footer** (`components/Footer.tsx`) — sand ground, the panorama drawing full width, a
four-column map (about / spaces / pages / contact), the wordmark, then the fine print.

**KoraCircle** (`components/KoraCircle.tsx`) — the Boudhanath section, owning its own `<section>`.
An SVG ring with the stupa at its centre; scroll rotates a marker around it and steps through
four hours of the day, and each of the four stations rings the bell (§5) when you reach it.
Desktop + no-reduced-motion only for the rotation; below that it is the same four moments as a
plain vertical list. The ring is the flourish, never the content.

**EnquireForm** (`components/EnquireForm.tsx`) — name, email, dates, guests, message. Ink
underline fields, no radius, the one square button from §4's original spec. Submits by building
a `mailto:` from the field values — a real, working path given no backend exists, not a
placeholder pretending to be one.

Line art from `6. Graphics/` (yak caravan, stupa, mountain panorama, endless knot) appears as a
white mark on an element field, or ink at 12–25% as a watermark on canvas/ink grounds.

Explicitly not in the system: cards, shadows, rounded corners, icon sets, badges, breadcrumbs,
tabs, accordions, dot carousels, stat rows, testimonial blocks, pricing tables.

**Measure is set in `rem`, not `ch`.** Barlow Condensed is narrow enough that a `ch` measure
comes out at roughly half the width the type wants.

---

## 5. Motion

Lenis (`components/SmoothScroll.tsx`) owns the scroll itself; GSAP's ticker drives Lenis's rAF,
and every `ScrollTrigger` reads Lenis's position. Two independent scroll authorities is what
makes a pinned section judder — there is exactly one here. Lenis also owns every `href="#…"`
click: `scroll-behavior: smooth` is deliberately **not** set anywhere, because the native
smooth-scroll and Lenis's own easing would run two animations over the same `scrollTop` at once.

**Rise / SplitLines / Parallax** — see §4.

**Nothing pins.** The five-element section used to: it locked the page and converted vertical
wheel into horizontal travel. That is the one interaction pattern guaranteed to feel broken —
the page stops going where the user told it to go. Both rails are drag-and-snap now, and the
page scrolls the way every page scrolls.

**KoraCircle walk** — the one scrubbed timeline left. The circuit draws itself in
(`strokeDashoffset`), then a marker and a short comet-trail arc travel it, `gsap.matchMedia`
gated to desktop + no-reduced-motion.

**Nav hide/reveal** — 500ms `power3.out` on scroll direction change.

**Menu wipe** — `clip-path: inset()` from the bottom, 800ms `power4.inOut`, then the five names
rise 900ms staggered 60ms.

**Preloader** — unchanged: canvas ground, wordmark centred, holds, then flies to its nav
position as the hero fades up beneath. Once per session, `prefers-reduced-motion` skips it.

### Sound

**The bell** (`lib/bell.ts`) — reaching a **station on the kora ring** (`KoraCircle`) rings a
struck bell. It belongs there and nowhere else: the markers are the four points you pass walking
the circuit, and spinning the prayer wheels set into the stupa's base is what your hand actually
does on a kora. Ringing it on ordinary list rows, as a first pass did, made it a UI click sound.

It is **synthesised, not sampled**: five inharmonic partials (ratios 1, 2.02, 2.99, 4.21, 5.43)
each with its own gain and decay, over a 6 ms attack and an asymptotic `setTargetAtTime` tail.
Inharmonicity is the whole point — integer harmonics sound like an organ, offset ones shimmer
like struck metal. No audio file means no licensing question and no extra download on a page
that already carries a 12 MB film.

Rendered offline and measured, one strike peaks at 0.149 and decays 0.064 → 0.028 → 0.006 →
0.0006 across 3.5 s: audible, well short of clipping, and gone before it outstays its welcome.

Three rules keep it from becoming an irritant:

- **Quiet.** Master gain 0.13. It is an accent, not an alert.
- **Throttled.** 260 ms minimum between strikes, so dragging across the ring can't machine-gun it.
- **Muteable, and remembered.** A `Bell — on/off` toggle sits in the menu overlay, persisted to
  `localStorage`. Anything that can make noise unprompted needs its off-switch within reach.

Pitch steps through a pentatonic set (0, 3, 5, 7, 10 semitones) by station index, so walking the
circle sounds like passing four different bells rather than hitting one UI sound repeatedly, and
any two still ring consonant against each other.

Each station also carries its own **hit area** — an invisible `r=22` circle, because the visible
dot is 2.5px and a 2.5px dot is not a target — plus `role="button"`, `tabIndex`, and Enter/Space
handling, so the ring is reachable by keyboard and not only by mouse. Hovering sets a `held`
state distinct from the scroll-driven `active` one, so letting go returns you to whatever hour
the scroll position was already showing rather than stranding you on the last one you touched.

Browsers refuse to start an `AudioContext` before a real user gesture, and **hovering is not
one** — so the first click or keypress anywhere on the page arms it. Until then `playBell()` is
a silent no-op, never an error. In practice the bell is therefore silent for a visitor who
hovers a list before clicking anything; that is a browser rule, not a bug to route around.

**Default is on.** That is a deliberate choice to revisit before launch — unprompted sound
divides people, and defaulting to off with the toggle as an invitation is equally defensible.

Every GSAP tween above is created inside `if (reduced()) return` guards or a `matchMedia` branch
that excludes reduced-motion — nothing here needs the blanket CSS override the old system used,
because there is no CSS animation left to override except the ink-in keyframe.

---

## 6. Imagery

- **Element sections**: the 3D render from `7. 3D views/`, full-bleed above the colour field. These are renders; treat them warm and large, and replace with photography once the hotel is shot.
- **Canvas sections**: Mustang photography from `8. Mustang pictures/`, generously margined with real air around it — never cropped tight to the frame.
- **Named-place photography**: `public/images/extras/` also holds real (non-render) photos of Lo Manthang and Muktinath — more specific than the generic Mustang shoot, used for the Mustang section precisely because they're identifiable places, not just texture.
- **Line art** carries the sections photography cannot yet cover.
- WebP only, via `scripts/webp.sh`, with a `-1280` variant beside the 2560. Hero uses a plain `<img srcset>` so the preloader and hero share one download (`lib/photo.ts`).
- Where a photo has both raw and `-mod`, ship `-mod`.
- Never a full-image dark scrim. If hero text needs contrast, use a bottom-weighted gradient at ≤ 35%, or move the text.

---

## 7. Information architecture

The site is nine routes, not one long page. The homepage is now an overture — it shows
each thing briefly and hands off to the page that covers it properly.

| Route | What it is |
|---|---|
| `/` | Home. Hero, arrival, the caravan story, the five spaces as a carousel, rooms, Mustang, the kora, a day here, getting here, enquire. |
| `/about` | The house. What Lingkor means, the caravan route in full, and the two rooms that carry no element colour (Mustang Inn, Lingkor Boutique). |
| `/rooms` | Every room at once, as a grid — this is the page you come to when you actually want to compare, so nothing is hidden behind a drag. |
| `/spaces` | **All seven areas the client listed**, as full-bleed alternating bands. One element colour per band. The last two — Mustang Inn, Lingkor Boutique — carry no colour and no render, so they sit on canvas with the caravan drawing where a photograph would be. |
| `/spaces/[slug]` | One area. The element field *is* the page header — the colour is the identity. Ends on the next, so the seven form a circuit. |
| `/mustang` | The country. Dark ground, one held frame, then the four named places at real scale — this is the page where showing them is the point. |
| `/boudha` | Where it stands. The kora circle, and what is within walking distance. |
| `/journal` | Notes. A lead post at full width, then the rest two-up. |
| `/journal/[slug]` | One post. A single narrow column, nothing beside it to look at instead. |
| `/contact` | The form, the direct details, and the route in. |

All nineteen pages (including the eight generated from `[slug]`) prerender as static
HTML — there is no server logic on this site yet.

**The menu is the client's seven areas.** The brief lists seven *rooms in a building* and
no page tree at all (REQUIREMENTS.md §6a) — so those seven are the menu's primary column,
and `Rooms` / `Journal` / `Contact` are the short secondary list. An earlier pass had a
generic hotel IA (About / Rooms / Journal / Mustang / Boudha / Contact) with Lingkor names
dropped into it, which is not what the client asked for.

**Navigation.** `lib/site.ts` is the single source for `AREAS`, `NAV`, `ROOMS` and
`CONTACT`. Before it existed the space data was pasted into the homepage *and* the
navbar, which is exactly how one copy ends up with the right Ghegu colour and the
other with the wrong one.

**The menu is real navigation now.** It was a list of `#anchor` links into the
homepage, which is fine for a one-pager and meaningless once routes exist. The
overlay closes on route change — adjusted during render rather than in an effect, so
the new page never paints for a frame with the menu still over it.

**Navbar contrast.** Only the homepage has a dark hero for white marks to sit on.
Every other route opens over canvas, so the bar starts in ink there; `overHero` is
`pathname === "/" && !past`, not just `!past`. Without that the logo is invisible
against its own background on eight of the nine routes.

**The preloader is homepage-only.** In the layout it re-ran on every hard load of
every route, which turns an entry ritual into a toll booth.

---

## 8. Page composition

Homepage, top to bottom. **No two blocks share a layout.**

| # | Block | Ground | What it does |
|---|---|---|---|
| 0 | **Hero** | photograph | The stupa, held still, with the site's premise written over it in a per-character reveal. Was a looping video; the film we had was ordinary drone footage, not the geology→stupa→logo dissolve the brief asks for, and 12 MB of it bought nothing a still doesn't say better. Recedes on scroll — drifts up at half speed and dims. |
| 1 | **Arrival** | canvas | Headline masked and risen line by line, staggered off the left edge. Two parallax images at different scales whose grid columns deliberately collide so they overlap. |
| 2 | **The welcome** | sand | One centred pull-quote — the client's own key-card line — given a whole screen. |
| 3 | **The journey** | canvas | The caravan story inks in word by word as the block crosses the viewport. Two parallax photos above at unequal heights; panorama line art bleeding oversized off the right. |
| 4 | **Five elements lead-in** | canvas | One line introducing the mosaic, immediately above the rail. |
| 5 | **The five spaces** | canvas, cards carry the element colour | `SpacesCarousel` — five cards you drag, each capped with its element field. **No pinning.** The pinned version hijacked the scroll, converting vertical wheel into horizontal travel, which means the page stops going where the user told it to go: clever once, broken every time after. |
| 6 | **The two unlit doors** | canvas | A short rule, a small label, one italic line, centred — Mustang Inn and Lingkor Boutique, named and never shown. |
| 7 | **Rooms** | canvas | Split headline + one sentence, then `RoomsRail` — a drag/scroll gallery of eight room and suite renders with an index counter and Prev/Next. |
| 8 | **Mustang** | ink | Beat 1 — the land, stated once and held. One full-bleed frame rather than a gallery, a scrubbed `RevealParagraph`, and three plain facts as counterweight to the poetry. The caravan drawing walks out of the section toward Boudha. |
| 9 | **Boudhanath** | canvas | Beat 2 — `KoraCircle`. The day drawn as a circle you scroll: dashed ring, stupa line-art at the centre, a marker walking clockwise, and the hour's copy changing as it goes. The site's one literal illustration of its own name. |
| 10 | **Convergence** | sand | Beat 3 — one short screen, on purpose. The single place the site states its own premise: "Mustang's colours. Boudha's door." |
| 11 | **A day here** | canvas | The five spaces placed *in time* — a timetable from the 05:30 kora to Namkha at 19:30 — rather than listed as features. Each row's element label carries its own colour; the rest of the row stays ink, so the §1 colour law holds. |
| 12 | **Voices** | ink | Guest quotes as a drag rail. The focal card is chosen by **distance from the rail's centre**, not by index — a card half-dragged into place is already half-lit, which an `activeIndex` cannot express. Everything else drops to 38% and 0.95 scale. Replaced "Getting here", whose content now lives on `/contact` where someone planning a trip will look for it. |
| 13 | **Enquire** | canvas | Split headline, direct contact links, and `EnquireForm` — a real form (name, email, dates, guests, message) that builds a `mailto:` on submit. No backend exists; this is a working path today, not a simulated one. |
| — | **Footer** | sand | The panorama drawing full width, then a four-column map (about / five spaces / page links / contact), the wordmark, and the fine print. Sand, not ink: the page has just come out of the dark Mustang section, and ending light returns it to the off-white the brief asks the site to live in. |

Grounds alternate ink → canvas → sand → canvas → sand → canvas → ink (footer), so Mustang's dark
distance and the footer's dark close bookend the section without repeating back to back.

Sequence rule inside the rail: no two element fields adjacent — the wash between them is
continuous, so the rule is automatic rather than something each block has to remember.

---

## 9. Responsive

Two states, not three: **desktop** (`≥1024px`, full motion) and **everything else** (stacked,
static). `gsap.matchMedia` gates every pin and most of the parallax to
`(min-width: 1024px) and (prefers-reduced-motion: no-preference)` — below that line, or with
reduced motion on, the same markup simply lays out as a plain vertical stack. The five-space
rail in particular is not "the same pin at a smaller size" below 1024px; hijacking touch scroll
to move a page sideways is the way this pattern usually breaks, so on mobile it is a column of
five full-width panels, in order, no pin, no scrub.

Display type bottoms out at 2.75rem. Full-bleed stays full-bleed at every size.

---

## 10. The three ways this design fails

1. **It gets busy.** A second colour appears in a section, a card creeps in, a section grows a fourth element. Fix: delete until the section is label, headline, sentence, link.
2. **It gets tight.** Spacing drifts to comfortable web defaults and the page turns into a normal hotel site. Fix: 272 between sections, and mean it.
3. **It explains too much.** Copy grows into paragraphs, room inventories, feature lists. Fix: the brief says the story is told *at the hotel*. Cut back to suggestion.

---

## 11. Blocked before this can ship

Carried from REQUIREMENTS.md §8, in build order:

1. **Hasweny webfont licence** — `Alex_Brush` is standing in at `app/layout.tsx`. Every display line on the site is currently the wrong typeface.
2. **Logo as SVG**, plus a white variant for element fields.
3. **Hero film + wind audio** — `public/boudha3.mp4` is a static handoff, not the geology→stupa dissolve the brief describes, and carries no audio track.
4. **Real content** — room count/types/rates, address, hours. All flagged `TODO` in `app/page.tsx` and enumerated in `CONTENT.md`.
5. **Booking path** — `Enquire` currently opens a `mailto:` link. Engine, form, or OTA link undecided.

---

## 12. Stack added for this pass

`gsap` (`ScrollTrigger`, `Draggable`) and `lenis` — both already dependencies, now load-bearing.
`lib/gsap.ts` is the single registration point; every component imports plugins from there
rather than calling `gsap.registerPlugin` itself, so load order isn't a per-file guess.

Nothing else changed in the dependency graph. No animation library beyond GSAP, no carousel
package for `RoomsRail` (native `overflow-x` + `scroll-snap`), no menu/dialog package for the
fullscreen nav (a `clip-path` tween and a `position: fixed` panel).
