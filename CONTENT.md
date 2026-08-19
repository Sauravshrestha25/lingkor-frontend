# CONTENT.md — every word on the site, and where it came from

The site is live with copy. Not all of it is the client's. This file marks which is which,
so nothing drafted goes to print unapproved.

Three states:

- **CLIENT** — the client's own words, from the source material. Ship as is.
- **DRAFT** — written by us in brand voice, from the concept doc. Needs approval.
- **PLACEHOLDER** — invented to hold a shape. Must be replaced before launch.

---

## Hero

| Line | State | Source / note |
|---|---|---|
| "Rest in the spirit of Mustang" | **CLIENT** | Signboard, `6. Graphics/Color signboard.jpg` |
| "Sound" / "Scroll" | DRAFT | UI labels |
| ~~"Under development by [WebX]"~~ | MOVED | The agency watermark now sits in the footer as "Designed and developed by", where it doesn't compete with the brand line. |

The film is `public/boudha3.mp4`. **It is not the film the brief describes** — the brief wants
Mustang geology dissolving into the stupa and then the logo, with wind sound. The preloader does
a stills version of that idea; the hero holds Boudha footage and recedes (drifts up, dims) as
you scroll past it. `Sound` unmutes this video's own audio; a wind track does not exist.

## Arrival

| Line | State | Source / note |
|---|---|---|
| "Arrival" | **CLIENT** | Comp `9. Website pages ideas/Lingkor — Page 2.jpg` |
| "You arrive / the way the / caravans did" | DRAFT | Split out of the client's single comp sentence to make a three-line headline |
| "Tired from travel, and met like family the moment you're through the door." | **CLIENT** | Same comp, second half of that sentence |

The comp reads as one line: *"You arrive the way the old caravans did — tired from travel,
and met like family the moment you're through the door."* We cut it at the dash so the first
half is the headline and the second is the body. Dropping "old" was ours. Restore the single
sentence if the client prefers it.

## The welcome

| Line | State | Source / note |
|---|---|---|
| "Lingkor welcomes you in pure Mustang style and homely Himalayan hospitality. You will feel at home and maybe… you will not want to leave." | **CLIENT** | Key card, `6. Graphics/Key card side 2.jpg`. We capitalised "Himalayan" — the card has it lower case. |
| "The house" | DRAFT | Attribution line under the quote. Forestis credits its hosts by name here; if the owners want their names on it, say so. |

## The journey

| Line | State | Source / note |
|---|---|---|
| "The journey" | DRAFT | Section label |
| The caravan paragraph (word-by-word reveal) | DRAFT | Compressed from the caravan story in `1. Lingkor concept/Lingkor concept guidelines.docx`. Every fact — autumn, Lo, yaks and mules, salt from Tibet, barley from Mustang, Kali Gandaki, Kagbeni, Jomsom, Thak Khola, wool, winter — is the client's. The sentence is ours. |
| "Lingkor is where that road rests." | DRAFT | Ours. The line that makes the story land on the hotel. |

## Five elements lead-in

| Line | State | Note |
|---|---|---|
| "Five elements, five rooms" | DRAFT | Ours, one line above the rail. |
| "The hotel is laid out as a circuit. Each room carries one of the five Tibetan elements — its colour, its name, and the piece of Mustang it is named for." | DRAFT | Ours. Introduces the pinned-rail mosaic the brief asks for — the client's comps jump straight into the spaces with no lead-in. |

## The five spaces

All five sentences are the client's, from the comps `Lingkor — page 3` to `page 7`. Names,
roles and element labels are from `4. Colors/LINGKOR-Colors per area.pdf`. Used on the homepage carousel, the `/spaces` index and each `/spaces/[slug]` page.

| Space | State | Note |
|---|---|---|
| Netsang · Fine dining | **CLIENT** | Verbatim from comp page 3 |
| Menthang · Tibetan spa | **CLIENT** | Verbatim from comp page 4 |
| Ghegu · Tea garden | **CLIENT**, repaired | The comp's sentence ends *"…where conversation collects. bodies."* — a broken paste. We cut the stray word and closed the sentence at "collects." **Confirm this is what was meant.** |
| Luri · Rooftop café | **CLIENT** | Verbatim from comp page 6 |
| Namkha · Yoga & teaching hall | **CLIENT** | Verbatim from comp page 7 |

**Tibetan script is missing.** The brand deck sets each name in Tibetan beneath the Latin, but
the PDFs carry no text layer, so the Unicode strings could not be extracted — and guessing at
Tibetan spelling is not something to do silently. The Yagpo font is loaded and unused.
**Please send the five names as Tibetan text.**

## Mustang Inn / Lingkor Boutique

Now full entries in the seven-area list (`/spaces/mustang-inn`, `/spaces/lingkor-boutique`)
rather than a coy line on the homepage. Both descriptions are the client's own; the longer
`body` paragraphs are DRAFT. **Neither has a render** — deliberately, since the client wrote
*"Not sure if those should be shown in pictures or just mentioned and discovered later."*


| Line | State | Note |
|---|---|---|
| "Not shown" | DRAFT | Section label. Says out loud that the omission is deliberate. |
| "Two more doors — the Mustang Inn, and the Lingkor Boutique — are left to find on arrival." | DRAFT | Ours. Per REQUIREMENTS.md §3 these two are named and never shown. |

## Rooms

| Line | State | Note |
|---|---|---|
| "Rooms" / "Twenty-odd ways to sleep in Mustang" | DRAFT | Holds the block. "Twenty-odd" is vaguer than a hard number on purpose — we do not have a real count. Replace with the true figure once known. |
| "Each one carries a piece of Mustang: hand-woven runners, clouds painted on the cabinets, and windows that hold the stupa." | **PLACEHOLDER** | The details are real — the allo/hemp wall hangings and the painted cloud cabinets are both in the graphics folder — but no room types, sizes or rates were supplied, so the sentence says nothing a guest can act on. |
| Room names and captions (`lib/site.ts`) | **PLACEHOLDER** | Invented from what each render shows. Replace with real names once rooms are finalised. |

## Mustang

This section was rebuilt entirely for the "below Rooms" redo — see DESIGN.md §7 for why (it's
now Beat 1 of a three-part closing arc, not a standalone photo essay).

| Line | State | Note |
|---|---|---|
| "The country it comes from" / "Where the colours come from" | DRAFT | Ours. |
| The two-paragraph body ("Nine hundred kilometres from Kathmandu…" / "We didn't try to move Mustang here…") | DRAFT | Original prose. Geographic facts (Kali Gandaki, Lo Manthang's walls, prayer flags, chörtens) are real and public; the sentences are ours. Ends by pointing at Boudha, which the next section picks up. |
| The four place rows — Lo Manthang "The walled capital", Kali Gandaki "The canyon road", Muktinath "The pilgrim's turn", Luri caves "Painted into the cliff" | DRAFT, fact-checked | All four are real places on the Mustang route, described accurately. Lo Manthang is genuinely the walled capital of Lo; Muktinath is a major pilgrimage site; the Luri caves hold painted cave shrines. |

⚠️ **Why the essay captions were rewritten once already.** `Some descriptions about Mustang.docx`
is explicitly headed *"excerpts from Maya's Heritage Inn leaflet, Tsarang, Upper Mustang"* —
another hotel's marketing copy, shared by the client purely as a mood reference. An earlier
draft paraphrased it closely enough to be a problem. The current copy is original; don't
"restore" a closer version from history without knowing why it changed.

## Boudhanath

Also rebuilt — Beat 2 of the arc, now concrete rather than atmospheric.

| Line | State | Note |
|---|---|---|
| "Where it stands" / "The kora begins outside our door" | DRAFT | Ours. Replaces the previous "A few steps from the stupa" headline with something that names the actual ritual. |
| "Every morning before the shops open… It is called a kora. Ours is called Lingkor." | DRAFT | The kora description (clockwise circuit, prayer wheels, six syllables) is real, well-documented Boudhanath practice, not invented. The specific sentence is ours. |
| "The stupa itself, still lit after dark" / "Monasteries in the surrounding streets…" / "A market built around pilgrimage…" | DRAFT | Generic, true-in-general Boudhanath facts — deliberately not naming specific businesses we haven't verified. |
| ⚠️ Exact walk time from the hotel to the stupa | **PLACEHOLDER**, not written | No distance confirmed. The copy avoids stating one; don't add a specific minute count without confirming it. |
| The four hours in `KoraCircle` — "05:30 First kora", "11:00 Ghegu", "17:45 Luri", "19:30 Evening kora" | **PLACEHOLDER** | ⚠️ **The times are invented.** Morning and evening kora are real, daily Boudhanath practice; the specific clock times are not confirmed, and the Ghegu/Luri hours assume service times the hotel hasn't published. Replace with real hours or drop the times and keep the labels. |

## Convergence

| Line | State | Note |
|---|---|---|
| "Mustang's colours. Boudha's door." | DRAFT | Ours — the closest the site gets to stating its own premise outright. |
| "Lingkor is the caravan's last stop, still standing" | DRAFT | Ours. |

## Experiences

All five lines are DRAFT, reusing the five spaces' names to describe what a guest actually does
rather than what the room looks like.

| Space | Line | Note |
|---|---|---|
| Netsang | "Dinner built around whatever came in that morning, served the way a family serves its own table." | DRAFT |
| Menthang | "A slow, warm-water ritual timed to Sowa Rigpa's medicinal-herb tradition — an hour, minimum, with nowhere to be after." | DRAFT |
| Ghegu | "Afternoon tea in the garden, the way Lo Manthang's own gate once gathered the whole town to talk." | DRAFT |
| Luri | "Sunset on the roof. The stupa catches the last light before the valley does." | DRAFT |
| Namkha | "A teaching or a yoga session in the celestial hall, early, before the kora starts." | DRAFT |

⚠️ None of these are confirmed hotel offerings — they're written as plausible extensions of the
five spaces' own descriptions. Confirm which are real before launch; cut any that aren't.

## The five space pages (/spaces/[slug])

**Four of the five are now the client's own words**, transcribed from
`5. Brand identity first proposal/LINGKOR- Eric- Dec 2025.pdf`. That PDF has no text
layer — every page is a flat 200 ppi JPEG — so the copy was read off the rendered pages
and typed out by hand. Worth a proofread against the original before launch, for exactly
that reason.

| Space | Source | Deck page |
|---|---|---|
| Luri | CLIENT, verbatim | p5 |
| Menthang | CLIENT, verbatim | p6 |
| Ghegu | CLIENT, verbatim | p7 |
| Namkha | CLIENT — but only one line | p8 |
| **Netsang** | **DRAFT — ours** | *none* |

⚠️ **Netsang has no client copy at all.** The deck gives a full page to the other four and
none to fine dining — and where it does name the restaurant, it calls it *"Tsa Khal"*, the
superseded name. Its `motto` and `body` in `lib/site.ts` are written by us and should be
either replaced by the client or approved as ours.

⚠️ **Namkha is one sentence in the deck** — "A celestial hall for spiritual teachings &
yogic practices." — and nothing more. That is plausibly deliberate: it is the page for the
element that *is* emptiness, and it is the shortest in the deck. A second, DRAFT paragraph
follows it in the build; delete that paragraph if the client would rather keep the silence.

Each space now carries three fields rather than one: `motto` (the meaning in guillemets),
`etymology` (the name broken into syllables and glossed), and `body`. That structure is the
deck's own — it introduces every space by its meaning, then its syllables, then the story.

## ⚠️ Blocking the homepage from being a working hotel site

Everything below is missing content, not missing code. The page cannot do the one job a
hotel homepage has until these land.

| Needed | Where it goes | Currently |
|---|---|---|
| Room names, sizes, rates | `lib/site.ts` `ROOMS` | invented placeholders |
| Street address | `lib/site.ts` `CONTACT.address` | TODO |
| A hotel phone + email | `lib/site.ts` `CONTACT` | one person's business card |
| Booking route (engine / OTA / enquiry only?) | hero CTA + `/contact` | enquiry form only |
| Real testimonials | `features/testimonials/data/voices.ts` | fabricated — see below |
| Luri + Namkha renders | `features/spaces` | those two pages have no feature run |

The hero CTA reads **"Enquire about a stay"** rather than "Book" on purpose: there is no
engine, no rates and no availability behind it, and a button that cannot do what it says
is worse than no button. Change the label the day a booking path exists.

## Voices (testimonials)

🚨 **EVERY QUOTE IS FABRICATED. DO NOT SHIP.**

The hotel has not opened. There are no guests, no stays, and no reviews — so there is no
such thing as a genuine Lingkor testimonial yet. The five quotes in `VOICES`
(`app/page.tsx`) exist only so the section could be built and reviewed.

Publishing invented guest quotes is not a style problem, it is a legal one: fabricated
testimonials are deceptive advertising under the FTC's endorsement rules in the US and
equivalent consumer-protection law in the UK, EU and elsewhere. Attribution is therefore
deliberately left as "Sample Name / Sample city, Sample country" rather than invented
names, so this cannot go live by accident and read as real. The star ratings are dummy
values for the same reason.

**Portraits.** The cards carry a portrait block, and there is no guest photography. Two
things were deliberately *not* done: inventing a face, and reusing the client's Mustang
photographs of real residents. Those are documentary photographs of identifiable people;
presenting them as paying guests endorsing a hotel would use someone's likeness in
advertising without their consent — a worse problem than the fabricated quote it would
illustrate. The fallback is a wordmark tile on the space's element colour, marked
"Portrait to come".

**Before launch:** replace `VOICES` wholesale with real, attributable quotes gathered with
the guest's permission — or delete the section. Real quotes drop into the same shape
(`quote`, `name`, `from`, `rating`, `tint`, optional `room` + `image`); set `image` to a
photo path and the portrait replaces the tile with no other change.

## Space feature runs (the pinned slideshow)

Added to `/spaces/[slug]` after hillbrookestate.co.nz/the-house. One image and one
caption per feature, cross-fading inside a pinned frame.

| Space | Features | Source |
|---|---|---|
| Netsang | 4 | **DRAFT — ours.** The Dec-2025 deck has no fine-dining page at all. |
| Menthang | 3 | Drawn from the client's Menthang page (deck p6) |
| Ghegu | 4 | Drawn from the client's Ghegu page (deck p7) |
| Luri | — | **No section.** One render exists; a one-frame slideshow is a still image with machinery attached. |
| Namkha | — | **No section.** Same. |

⚠️ **Netsang's four features are entirely ours** and need approval or replacement.
Menthang's and Ghegu's are compressions of the client's own deck text — the *facts* are
theirs (Sowa Rigpa, amchi, rgyal sgo, the Mang Gang prayer wheel), the phrasing is ours.

**To fill the two gaps:** the client needs to supply rooftop (Luri) and yoga-hall
(Namkha) renders. Two images each is the minimum for the section to appear.

## Getting here (now on /contact only)

Real logistics. The homepage section was replaced by Voices; the route content lives on
`/contact`, where someone actually planning a trip will look for it.

| Line | State | Note |
|---|---|---|
| "Closer than it looks on a map" | DRAFT | Ours. |
| "A short drive from Tribhuvan International Airport — Kathmandu's traffic decides exactly how short." | DRAFT, fact-checked | Boudhanath is genuinely a short drive from the airport; deliberately no minute count, since actual time varies with Kathmandu traffic. |
| "A taxi ride across town from Thamel or Durbar Square, most of it along the ring road." | DRAFT, fact-checked | Same caution — real route, no invented time. |
| "The stupa and its kora are within walking distance of every room in the hotel." | **PLACEHOLDER** | ⚠️ Asserts something about every room without a floor plan to check it against. Confirm before shipping. |
| Address — "Boudha, Kathmandu, Nepal" | **PLACEHOLDER** | ⚠️ Same gap as everywhere else on the site — no street address supplied. |

**No airport-transfer offer is claimed.** It would be easy to add "we can arrange your pickup"
here; that's not written because it isn't confirmed the hotel offers it.

## Enquire

Rebuilt with a real form (`components/EnquireForm.tsx`) alongside the direct contact links.

| Line | State | Note |
|---|---|---|
| "Enquire" / "Write to us, and we will hold a room" | DRAFT | Kept from the previous draft. |
| "Tell us when you would like to come and how long you can stay. Or write us directly:" | DRAFT | Softened from the earlier "We answer every message ourselves" claim — that line now lives only in the form's own footnote (below), where it's less prominent. |
| "Opens as an email. We answer every one ourselves." | **PLACEHOLDER** | ⚠️ Same assumption as before, now scoped to the form's submit confirmation. Confirm or soften before shipping. |
| Form field labels (Name / Email / Dates / Guests / Message) | DRAFT | Standard hotel-enquiry fields; not tied to any client document. |
| phuntsokg8808@gmail.com / +977 9861413633 | **CLIENT**, but check | Phuntsok Sangpo's number and address from the business card — may be a personal line rather than the hotel's. A dedicated `@lingkor…` address and a front-desk number would be better before launch. |

⚠️ **The form has no backend.** Submitting builds a `mailto:` link with the fields pre-filled
into the body and hands the visitor to their own mail client — a real, working path today, not a
placeholder. Swap in a real POST once there's a booking system or a form-handling service; see
REQUIREMENTS.md §8.

## Footer

| Line | State | Note |
|---|---|---|
| "A hotel beneath the stupa, carrying the pace and the quiet of Mustang down to the valley." | DRAFT | Ours, restating the brief's own framing. |
| Boudha, Kathmandu, Nepal | **PLACEHOLDER** | ⚠️ No street address supplied |


## Journal (`/journal`)

⚠️ **Every post is DRAFT — written by us, not by the hotel.** They exist so the section
has a real shape rather than lorem text, and each is built from publicly verifiable
material (the salt-for-wool trade, how a kora works, the five-element scheme). None is
a statement the hotel has made, and none should publish under the hotel's name without
being rewritten or approved.

| Post | State | Note |
|---|---|---|
| "The salt and the wool" | DRAFT | The trade goods, direction and seasonality are drawn from the client's own caravan story plus general Himalayan trade history. |
| "What a kora is actually for" | DRAFT | Clockwise direction, prayer wheels, the mani mantra, the twice-daily rhythm — all standard, well-documented Boudhanath practice. |
| "Why the hotel has five colours" | DRAFT | The five-element scheme and each pairing come from `Lingkor concept guidelines.docx`. |

Posts live in `lib/journal.ts` as typed objects. There is no CMS; every route reads
through `allPosts` / `postBySlug`, so a real editor can replace that module without a
single page changing.

**Dates are invented** (May–July 2026) to give the index a plausible order. Replace them
with real publication dates.

## Page copy (`/about`, `/rooms`, `/spaces`, `/mustang`, `/boudha`, `/contact`)

| Page | State | Note |
|---|---|---|
| `/about` — "A caravan's last stop" + the four-paragraph road story | **CLIENT**, lightly edited | The road story is the client's own text from `Lingkor concept guidelines.docx`, trimmed for line length. The Lingkor definition is theirs verbatim. |
| `/about` — Mustang Inn / Lingkor Boutique | **CLIENT** | Both descriptions come from the client doc (butter tea and chang, traditional interior). |
| `/spaces/[slug]` — the longer `body` paragraphs | DRAFT | Two paragraphs per space, expanding the client's one-line description. Netsang's "closer than a guest", Menthang's Sowa Rigpa/amchi reference, Ghegu as royal gate, Luri's 13th-century murals — all consistent with the brand deck, but written by us. |
| `/rooms` — room names and notes | **PLACEHOLDER** | Invented from what each render shows. ⚠️ No real names, sizes, bed configurations or rates supplied. |
| `/rooms` — "Rates depend on the season…" | **PLACEHOLDER** | Written to avoid stating a price we don't have. |
| `/mustang` — the four places | DRAFT, fact-checked | Lo Manthang's walls and altitude, the Kali Gandaki gorge, Muktinath as a pilgrimage site, the Luri cave gompa — all real and verifiable. |
| `/boudha` — "A few steps away" list | DRAFT | Deliberately generic: no specific business named, because none is verified. |
| `/contact` — "We answer every message ourselves" | **PLACEHOLDER** | ⚠️ Still an assumption about how enquiries are handled. Confirm or cut. |

---

## What the client needs to send

1. **Tibetan text** for the five space names.
2. **Rooms** — real count, types, sizes, rates, and names for the eight renders in the rail.
3. **Address, hours, and a dedicated public phone/email** — the ones live now trace to one
   person's personal contact on a business card.
4. **Confirm the Ghegu sentence** repair, **and confirm the Ghegu colour** — it currently
   renders as slate blue `#6E7F91` instead of the documented green `#939D2C`. See
   REQUIREMENTS.md §3, "Implementation deviation — Ghegu."
5. **Approve or rewrite** every DRAFT line above, especially the Mustang and Boudhanath sections'
   longer paragraphs.
6. **Hero film + wind audio**, if the geology→stupa sequence in the brief is still wanted.
7. **How enquiries get answered** — confirm or cut "we answer every message ourselves" (now in
   the Enquire form's footnote).
8. **Confirm the Experiences list** — five activities extrapolated from the five spaces, none
   confirmed as real hotel offerings.
9. **Confirm walking distance to the stupa** — stated vaguely on purpose in Getting Here and
   Boudhanath; needs a real figure or a decision to keep it vague.
10. **A real street address.**
11. **Real hours for the kora circle** — the four clock times in `KoraCircle` are invented. Either
    supply real ones (first kora, tea service, rooftop sunset, evening kora) or we drop the times
    and keep only the labels.
12. **Journal** — approve, rewrite or replace the three drafted posts, and give them real
    publication dates. Decide who writes this going forward, and whether it needs a CMS.
13. **Room names and rates** — the eight names on `/rooms` are invented from the renders.
14. 🚨 **Real testimonials, or delete the Voices section.** All five quotes are fabricated
    placeholders. This is the one item on this list that is a legal exposure, not just an
    unfinished one.
