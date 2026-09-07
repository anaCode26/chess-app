# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary:** Existing Valby Skakklub members who need to stay informed and act on club activity — especially registering for tournaments.

**Secondary:** Newcomers and visitors deciding whether to come to a Thursday club night; drop-in visitors who pay per visit rather than joining; parents of juniors.

The club is international. Members and visitors do not all read Danish.

## Product Purpose

The public website and tournament management system for **Valby Skakklub**, a chess club in Valby, Copenhagen. It replaces the club's current site at `valbyskakklub.dk`.

It gives members and visitors a single place to see what happens on Thursdays, follow tournaments and standings, and register; and gives club officers a permissioned backoffice to publish that content instead of hand-maintaining pages.

Success means a newcomer can tell in seconds when to show up and that they are welcome without a rating or a membership, and a member can register for a tournament without email or phone.

## Positioning

An international neighbourhood club that teaches every Thursday before it competes: free open teaching for juniors, beginners, and women/girls from 17:30, Elo-rated Dansk Skak Union tournaments the same evening. The site is both the club's public face and the machinery running its tournaments — one record behind the public listing and the admin view.

## Operating Context

**Club night — every Thursday, Høffdingsvej 10, 2500 Valby**

| Time | What happens |
| --- | --- |
| 17:30 | Junior and beginner teaching in the large hall (Steen Guldager Pedersen, Jakob Bank). Adults welcome to join or watch. Ends approx. 18:45. |
| 17:45 | Women's and girls' teaching in Spejlsalen. Ends approx. 18:45, often continues informally. |
| 19:00–23:00 | Tournament rounds on tournament evenings. |

Teaching is free and requires no advance signup.

**Tournament culture**

- Classic seasonal tournaments (e.g. Valby Forårs EMT) — Elo-rated (EMT), Swiss system, typically 7 rounds over consecutive Thursdays, 90 minutes + 30 seconds per move.
- Quick play: lynskak tournaments, including Grand Prix Lyn finals and an open junior lynskak series (3 games per evening, 10 minutes each).
- Club championship (Valbymesterskabet), simultaneous displays against the club champion, and social evenings (grill night, skakbowl).
- Ratings are tied to **Dansk Skak Union**.
- Each club evening has assigned **"Åbnefolk"** — the members rostered to open up and run the evening.

**Membership and payment**

- Membership is paid **per quarter** by bank transfer. Published dues: senior 370 DKK (21–64); student senior 200; passive senior 250; pensioner 265 (65+); passive pensioner 200; junior 200 (15–20); student junior 150; child 150 (under 15).
- **Visitors do not pay.** Coming to a club night, including all teaching, is free and requires no membership and no signup.
- Tournament entry fees are paid by bank transfer to the club's Nordea account (reg. 2111, account 0567185117); entry minus the EMT fee goes to prizes.

**The club was founded in 1935** — chess has been played in Valby under this name for over ninety years.

## Capabilities and Constraints

**Confirmed scope**

| Surface | Capability |
| --- | --- |
| Public | Home, events/calendar, tournaments list + detail with register CTA, gallery, contact |
| Auth | Member login and registration; session required to register for a tournament |
| Backoffice | Permissioned modules: `events`, `tournaments`, `users`, `gallery` |

**First must-ship member workflow:** tournament registration.

**Localization — binding:** Danish is the default language; **English and Spanish must work at launch.** All three locales ship together, so no design may depend on Danish string lengths.

**No payments in the app — binding.** Tournament entry fees and membership dues are paid by bank transfer to the club's Nordea account. The system records registrations and shows the payment details; it never takes money. No payment provider.

**Membership signup happens in the system.** New members register through the app rather than by contacting an officer.

**No photography.** The club has no usable photos. The design must carry itself on typography, colour, geometry, and drawn graphic marks. Do not plan photo-led layouts.

**Out of scope until requested:** in-tournament pairing, match scheduling, Danish-system round management, board assignments.

**Technical constraints:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Prisma 7 + PostgreSQL, Auth.js v5, Zod, Vitest, S3-compatible storage. Server Actions → repositories; components never import repositories.

**Undecided / not yet supplied:**

- Production hosting and domain cutover from the current site
- Whether tournaments present as list/detail or calendar/dashboard (AGENTS.md records this as undecided — do not build both)
- The visual world for the site, and the craft reference and tone it should be measured against

## Brand Commitments

- **Club name:** Valby Skakklub. The earlier "Springeren" / "Chess App" naming in this repo is an error and must be replaced everywhere (including `app/layout.tsx` metadata, which still reads "Chess App", and the root `lang="es-AR"`, which must become Danish).
- **The logo is the only thing kept from the current site.** The knight mark in `public/logoSpringeren.svg`, deep blue `#000098`, is binding. Everything else about the current `valbyskakklub.dk` look is explicitly an anti-reference to be replaced.
- **The visual direction is deliberately open.** No visual world, craft reference, or tone is committed. An earlier pass chose the category standard and set Chess.com and Meetup as the bar; that choice has been withdrawn and must not be treated as a precedent or re-proposed as the default.
- Do not invent club history, membership numbers, awards, or testimonials.

## Evidence on Hand

**Real, usable content (from the current site, confirmed by the club):**

| Item | Detail |
| --- | --- |
| Address | Høffdingsvej 10, 2500 Valby |
| Club night | Thursdays from 17:30 — free, no signup, visitors pay nothing |
| Founded | 1935 |
| Membership | Quarterly dues by category (senior 370 DKK; see kontingent table) |
| Formand | Hans Forchhammer — 30 13 75 71, formand@valbyskakklub.dk |
| Turneringsleder | Stig Syndergaard — 22 71 62 55, stig.syndergaard@gmail.com |
| Redaktion | Erling Nilsson — klubblad@valbyskakklub.dk |
| Kasserer | Martin Skovsø Nielsen; Zoltan Orban |
| Event koordinator | Alex Hansen |
| Juniortræner | Steen Guldager Pedersen (with Jakob Bank) |
| Bank | Nordea reg. 2111, konto 0567185117 |
| Calendar | Real dated events Aug–Oct 2026 with Åbnefolk roster (skakbowl, grill night, Grand Prix Lyn Finale, simultan, Valbymesterskabet rounds, Vinterturnering) |
| Tournament formats | EMT Swiss 7 rounds 90min+30s, entry 150 kr; junior lynskak free with 150/100/50 kr prizes |
| Standings | Real junior lynskak results table exists |

**Absent — must not be fabricated:** photographs, member counts, club history beyond the founding year, awards, testimonials.

## Product Principles

1. **Thursday is the product.** The club's weekly rhythm is the most valuable fact on the site; everything else is scheduling around it.
2. **Teaching before competing.** Free open teaching for juniors, beginners, and women is what makes this club welcoming — not a footnote.
3. **Three languages, one meaning.** Danish leads, English and Spanish are equal citizens at launch; nothing may depend on Danish text length.
4. **Real records, one source.** Public listings, standings, and registration reflect the same records officers manage in the backoffice.
5. **Earn it without photos.** No stock imagery, no invented proof — the design carries the club on type, colour, and chess's own graphic language.

## Accessibility & Inclusion

The club actively welcomes juniors, beginners, and women/girls through dedicated free teaching; the site should read as open to people who have never played in a club. No formal standard confirmed — follow WCAG-oriented defaults via semantic HTML and Radix primitives, and verify contrast against the saturated brand blue.
