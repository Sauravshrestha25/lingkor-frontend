# Design Language — from the client's reference sites

Six sites, studied in Chrome at 1440–1920px: computed styles pulled from the live DOM, full scroll-throughs screenshotted. Listed in the client's stated priority order.

| # | Site | What it is |
|---|---|---|
| 1 | forestis.it | Dolomites wellness hotel — the one named in the written brief |
| 2 | eriro.at | 9-suite Alpine hideaway, Tyrol |
| 3 | masgirbau.com | Restored Catalan masia, rural luxury |
| 4 | here-away.com | Curated design-stay directory |
| 5 | ownprimland.com | Blue Ridge mountain residences |
| 6 | sonbrull.com | 18th-c. monastery hotel, Mallorca |

---

## 1. Measured tokens

| Site | Ground | Ink | Accent | Typefaces | Body | Display |
|---|---|---|---|---|---|---|
| Forestis | `#F2F1EB` | `#333333` | `#70716C` grey-green | **BrandonTextLight only** | 20 / 32 | 40 / 56, w400, ls 1.5px |
| eriro | `#E4E0DB` | `#211D1D` | — | **karol-sans only, w300** | 25 / 37 | 100 / 90, ls 3px |
| Mas Girbau | `#FFF8EB` | `#242C04` olive | `#FF906D` coral | Editors (serif) + Inter (UI) | 16 / 24 | 128 / 128, w300 |
| Here & Away | `#FFFFFF` / `#EFEEEC` | `#000000` | — | **PP Neue Montreal only** | 18.7 / 20.5 | 32 / 35, w400 |
| Primland | `#FFFBE7` | `#456A4B` green | `#A8611A` bronze, `#EAB279` tan, `#798D73` sage | serif display + Centra (labels) | — | 42 / 46, ls −0.84px |
| Son Brull | `#F9F2EA` / white | `#554640` taupe | `#A39685` sand | NewYork (serif) + Soleil (sans) | 16 / 24 | 64 / 70, w300 |

Read the columns, not the rows. Six sites, six near-identical decisions.

---

## 2. What they all do

**Ground is warm off-white, never pure white.** Five of six sit between `#E4E0DB` and `#FFFBE7`. Only Here & Away — a directory, not a hotel — uses `#FFFFFF`, and it still drops to `#EFEEEC` for content bands. Our `#E1DFDC` is already inside this family. The client's "off white background" instruction is not a preference, it is the entire category convention.

**Ink is never black.** It is a desaturated dark pulled from the property's own landscape: olive `#242C04`, forest `#456A4B`, taupe `#554640`, warm charcoal `#211D1D`. Black-on-white reads as software; these read as printed matter.

**One typeface. Two at the absolute most.** Forestis, eriro and Here & Away each ship a *single* family for the entire site. The other three run exactly two: a serif for display, a quiet sans for labels and UI. Nobody uses three.

**Weight range is 300–400. There is no bold anywhere.** Not in headings, not in nav, not in buttons. Hierarchy comes from size and space, never from weight.

**Body text is large.** 18–25px with 1.4–1.6 leading. eriro sets body at **25/37**. Compare to the 16px default most sites ship. Large + light + airy is the whole effect.

**Display type is huge, light, and tightly led.** 40px to 128px at weight 300, with line-height *at or below* font-size (eriro 100/90, Mas Girbau 128/128). The inverse of normal web typography: big text gets tighter, small text gets looser.

**One extra type style, and only one: the letterspaced uppercase micro-label.** 10–12px, `letter-spacing: 1–3px`, used for eyebrows and section names — `PRÓLOGO`, `MAKING MEMORIES`, `PRIMLAND RESIDENCES`, `SCROLL TO EXPLORE`, `[ Where you stay becomes the story ]`. This is the entire secondary type system.

**No UI chrome.** No cards. No shadows. No rounded corners (Mas Girbau's CTA is `border-radius: 0`). No icon libraries. Links are a thin underline (Forestis "Discover more", Primland "VIEW HOMES AND HOMESITES") or a long arrow `⟶` (Son Brull). Buttons are square ghost outlines or one flat rectangle.

**Photography carries the entire site.** Full-bleed heroes, or generously margined images with real air around them. Landscape and atmosphere over people; where people appear they are small, distant, and unposed. Nothing is cropped tight.

**Vertical rhythm is enormous.** Whole viewports of nothing between blocks. Scrolling eriro passes through screens that are literally empty. Emptiness is the luxury signal — it says the page is not trying to sell you anything in this moment.

**Motion is a slow fade-up, and nothing else.** Every block enters by opacity + small translate, staggered, roughly 800–1500ms. Scrolling fast on Forestis outruns the reveal and you see blank space — the animation is genuinely that slow. Nothing bounces, slides sideways, or scales. Two sites add scroll-linked text reveals (Here & Away greys out unread words; Mas Girbau scatters characters into place).

**The homepage is 5–8 blocks, each one identical in shape:** micro-label → one short headline → one to three sentences → one link. Forestis: manifesto, hosts' quote, Suites, Villa, Spa, Cuisine, social. That is the whole page. No pricing tables, no amenity grids, no testimonial carousels, no FAQ. Detail lives on subpages, reached by that single link.

**Navigation is nearly absent.** Logo centred or top-left, one or two actions at top-right (`Request` / `Book`, `AVAILABILITY` / `INQUIRE`), and a hamburger holding everything else. eriro's entire visible nav is a hamburger and two words.

**Headlines are 3–5 words, poetic, present tense.** "The art of simplicity" · "Peace as a new luxury" · "Rooted in its origins" · "Paz, historia y silencio" · "A Mountain Home For All Seasons" · "Your rural sanctuary" · "The place where time stops".

**Colour accents are rationed to one.** Mas Girbau's coral CTA is the only saturated element on the site. Primland's bronze appears only in micro-labels. Everything else is ground, ink, and photograph.

**Entry is a ritual.** Mas Girbau holds a dark olive screen with the wordmark and a 0→100 counter, then curtain-wipes to the site. Forestis fades up from a full-bleed peak. Son Brull dissolves in. Arriving takes a beat, on purpose.

---

## 3. Where they differ — three dialects

**Quiet-centred** (Forestis, Here & Away). Everything on the centre axis. Symmetric, calm, close to a printed programme. Forestis never breaks the centre line once.

**Editorial-asymmetric** (eriro, Primland). Text in a narrow column pushed hard left or right, images offset and overlapping, vast unequal margins, rotated vertical captions running up the gutter. Looks like a magazine spread.

**Classic-luxury banded** (Mas Girbau, Son Brull). Alternating dark and light full-width bands, serif display with *italic emphasis inside the sentence* ("una **_masia histórica_** donde…", "For **_All_** Seasons"), small icon-and-number fact rows (14 personas · 6 habitaciones · 10 camas).

---

## 4. What this means for Lingkor

**Take directly:**
- Ground `#E1DFDC`, ink `#1C1A17`. Already correct — the current `bg-white` in `app/page.tsx` is the thing that is wrong.
- Hasweny (or its licensed stand-in) fills the display-serif role: 3–5 word headlines, 48–96px, weight 300–400, line-height ≤ 1.05.
- Barlow Condensed Light for body at **20px / 1.6**, not 16.
- Barlow Condensed uppercase, 11px, `letter-spacing: 0.15em` for micro-labels. This is exactly the slot the comps already use for `EARTH · OCRE YELLOW`. It is the only third type style we get.
- Slow fade-up on scroll, ~900ms, staggered. Nothing else moves.
- One block per idea: micro-label, headline, one or two sentences, one underlined link. Five to seven blocks, then the footer.
- Hamburger plus one action. The five spaces live inside the menu, not in a nav bar.
- Whole-viewport breathing room between sections. If it feels too empty, it is close to right.
- The entry ritual is already half-built in `components/Preloader.tsx`, and the brief's geology→stupa→logo film is the same move Forestis and Mas Girbau make. This is the most reference-aligned thing in the whole brief.

**Adapt — this is where Lingkor departs:**

Five saturated element colours is more colour than *any* reference site carries. The reference discipline is one accent, used once. Ours becomes: **one element colour owns one full-bleed section, as a large flat field, and no two element colours ever share a viewport.** That is Mas Girbau's alternating-band model run five times instead of twice. Between every coloured section, return to `#E1DFDC`. The colour is the punctuation, the off-white is the sentence.

Line art (yak caravan, stupa, clouds, mountain panorama) does the work that photography cannot yet do — we have 3D renders, not photographs. White line on flat element colour is already the brand's own idiom from the wall hangings and the deck.

**Avoid, though the references do it:**
- eriro's newsletter modal — it blocked three of our own scroll passes.
- Son Brull's floating icon rail. Wrong register entirely for "mysterious, do not disclose".
- Here & Away's directory grid of stays.
- Any card, shadow, or rounded corner. Mas Girbau ships `border-radius: 0` on its only button; so do we.
- Mas Girbau's stat row (14 personas · 6 habitaciones). The brief explicitly does not want the property inventoried online.

**Where the brief goes further than the references:** all six sites disclose fully — rooms, prices, sqm, availability. eriro puts "from €775/night" on the homepage. Lingkor is asked to withhold. So we borrow the *form* — the restraint, the space, the type, the slowness — and push the *content* further toward suggestion. Fewer words than Forestis, not more.
