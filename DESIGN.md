---
name: Valby Skakklub
description: A daylit club site where one amber-lit window carries the whole Thursday schedule.
colors:
  ground: "#f3f5f8"
  bluehour: "#e2e9f3"
  wet: "#d5dde9"
  card: "#ffffff"
  amber: "#ffb000"
  ultramarine: "#000098"
  chalk: "#0c1520"
  silver: "#5a6b82"
  hairline: "rgba(12, 21, 32, 0.14)"
  destructive: "#ff3b5c"
typography:
  display:
    fontFamily: "Anton, Archivo, sans-serif"
    fontSize: "clamp(2.5rem, 11vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Anton, Archivo, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  title-lg:
    fontFamily: "Anton, Archivo, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.25
  title-md:
    fontFamily: "Anton, Archivo, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.25
  title-sm:
    fontFamily: "Anton, Archivo, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.25
  numeral-lg:
    fontFamily: "Anton, Archivo, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "'tnum'"
  numeral-md:
    fontFamily: "Anton, Archivo, sans-serif"
    fontSize: "clamp(1.75rem, 5vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "'tnum'"
  numeral-sm:
    fontFamily: "Anton, Archivo, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1
    fontFeature: "'tnum'"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  caption:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label-lg:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 87.5"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 87.5"
  label-sm:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 87.5"
rounded:
  sm: "2px"
  md: "2px"
  lg: "2px"
  full: "9999px"
spacing:
  gutter: "20px"
  gutter-lg: "32px"
  section-y: "56px"
  section-y-lg: "64px"
  section-y-xl: "80px"
  container: "1440px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.chalk}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "0.875rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.ground}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ultramarine}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "0.875rem 1.5rem"
  button-ghost-hover:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.ground}"
  nav-link:
    textColor: "{colors.silver}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
  nav-link-hover:
    textColor: "{colors.chalk}"
  schedule-row-lit:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.chalk}"
    padding: "1.5rem 1.25rem"
  schedule-row-unlit:
    backgroundColor: "{colors.card}"
    textColor: "{colors.chalk}"
    padding: "1.5rem 1.25rem"
  page-header:
    backgroundColor: "{colors.bluehour}"
    textColor: "{colors.chalk}"
    typography: "{typography.headline}"
    padding: "80px 32px"
  month-grid-cell:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.chalk}"
    typography: "{typography.numeral-sm}"
    rounded: "0"
    padding: "0.5rem"
  month-grid-cell-today:
    backgroundColor: "{colors.bluehour}"
    textColor: "{colors.chalk}"
  month-grid-cell-outside:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.silver}"
---

# Design System: Valby Skakklub

## Overview

**Creative North Star: "The Lit Window"**

A chess club in Valby is at its best on a dark, wet Thursday in November, when the only thing that matters is that the hall at Høffdingsvej 10 is lit and you can walk in without a rating, a membership, or a signup. This system is built around that single image. One warm rectangle at the end of a cold walk, and everything else — the pale ground, the ink type, the hairlines — is the street around it.

The page itself is daylit: a cool pale field (`#f3f5f8`) carrying dark ink text, not a dark theme. The window metaphor survives the daylight because the light is behaviour, not decoration. The Thursday schedule renders as a stack of panes that actually turn amber when club night is running, and the current time band is marked live from the clock. Nothing else on the page is ever amber, so the eye goes to the light and finds the schedule there. That is the whole idea, and it is also the reason the system can be this quiet everywhere else.

The character is signage, not software. Condensed capitals for anything that labels or directs, a tall compressed grotesque for anything that announces, hairlines instead of boxes, and near-square corners. There are no cards, no shadows, no gradients, and no photography — the club has no usable photographs and the design is required to carry itself on type, colour and geometry. An earlier direction placed this world at night over a full-bleed illustrated street; that direction has been **withdrawn** in favour of the daylit build documented here.

**Key Characteristics:**

- One accent, used as light: amber marks the lit hall and every action, and nothing else.
- Flat by construction — 1px hairlines separate, shadows do not exist.
- Near-square geometry: 2px on anything interactive, 0 on rules, rails and panes.
- Condensed uppercase for chrome, tall display capitals for announcement, neutral sans for reading.
- State is expressed as light changing, on a slow 700ms fade, not as scattered hover effects.
- Three languages ship together; no layout may assume Danish string lengths.

## Colors

A cool, overcast palette — the greys are blue-shifted rather than neutral — interrupted by exactly one warm colour.

### Primary

- **Transit Amber** (`#ffb000`): The hall light and every action. It fills the primary button, lights the schedule panes when club night is running, draws the events rail and its dots, marks the active language, carries section eyebrows, and is the focus ring and the selection highlight. It is never a background for reading, never a text colour on the pale ground at body size, and never decorative.

### Secondary

- **Knight Ultramarine** (`#000098`): The club's one inherited asset, taken from the knight mark, and the only saturated blue in the system. It carries the mark itself, the ghost button's 1px border and label, the club name above the schedule, and the schedule numerals while the window is unlit. It also becomes the hover fill under both buttons, where amber and ultramarine trade places. It is never used as a page or section background.

### Neutral

- **Ground** (`#f3f5f8`): The page. A cool pale field, blue-shifted rather than warm grey, and the default background everywhere including the header and footer.
- **Blue Hour** (`#e2e9f3`): One step down from the ground. Fills the unlit schedule window and, at 40% opacity, the page-header band that sits under every interior page title.
- **Wet** (`#d5dde9`): The deepest of the pale tints, held in reserve as the muted surface. Currently mapped to shadcn's `--muted`.
- **Card White** (`#ffffff`): Pure white, used only for the unlit schedule rows so they read as glass against the Blue Hour frame around them.
- **Chalk** (`#0c1520`): The ink. Near-black with a blue cast, used for all display type, headings, and any text that must be read first.
- **Silver** (`#5a6b82`): Secondary text. Body copy, page intros, dates, addresses, nav in its resting state — the majority of words on the site are this colour, not chalk.
- **Hairline** (`rgba(12, 21, 32, 0.14)`): Chalk at 14%. Every border, divider and rule in the system is this one value at 1px.

### Status

- **Alarm** (`#ff3b5c`): Destructive actions only. No success, warning or info colours have been established; do not invent them — if a status palette becomes necessary, it gets designed, not guessed.

### Named Rules

**The One Light Rule.** Amber is light. It marks the lit hall, the primary action, the events rail, and the live state — and nothing else on any surface is ever amber. Its scarcity is what makes the window read as lit. If a second thing on a screen is amber, one of them is wrong.

**The Two-Colour Trade.** Buttons do not darken or lighten on hover; amber and ultramarine swap places. Primary goes from amber fill to ultramarine fill, ghost goes from ultramarine outline to ultramarine fill. There is no third state colour.

**The Blue-Shifted Grey Rule.** Every neutral in this system leans cool. Never introduce a warm or pure-neutral grey — it reads as a different brand immediately against `#f3f5f8`.

## Typography

**Display Font:** Anton (with Archivo, then `sans-serif`) — one weight only, 400.
**Body Font:** Archivo (with `ui-sans-serif`, `system-ui`, `sans-serif`) — variable, including a width axis.

**Character:** Anton is a tall, tightly-set condensed grotesque that only ever appears in capitals; it does the announcing. Archivo does everything else, and at 600 weight compressed to 87.5% width it becomes the system's second voice — the condensed capitals used for navigation, buttons, times and labels. The pairing reads as transit signage rather than as a publication.

### Hierarchy

- **Display** (Anton 400, `clamp(2.5rem, 11vw, 3.75rem)`, line-height 0.92, tracking -0.01em, uppercase): The home page headline, and nothing else. Always balanced.
- **Headline** (Anton 400, `clamp(2.25rem, 5vw, 4rem)`, line-height 0.95, tracking -0.01em, uppercase): The page title in every interior page's header band.
- **Title, large** (Anton 400, `1.875rem`, line-height 1.25, uppercase): Section headings inside a page body.
- **Title, medium** (Anton 400, `1.5rem`, line-height 1.25, uppercase): The named item in a bordered row — an event, a tournament format.
- **Title, small** (Anton 400, `1.25rem`, line-height 1.25, uppercase): Compact titles in dense arrangements, such as the events rail.
- **Numeral, large** (Anton 400, `2.25rem`, line-height 1, tabular): A single figure carrying weight, like the membership price.
- **Numeral, medium** (Anton 400, `clamp(1.75rem, 5vw, 2.25rem)`, line-height 1, tabular): Schedule times in the window panes. Tabular figures are required so the times stack in a straight column.
- **Numeral, small** (Anton 400, `1.125rem`, line-height 1, tabular): Day figures in the month grid, where a medium numeral would fill the cell and leave no room for the event beneath it. Tabular figures keep the columns of dates true.
- **Body** (Archivo 400, `1rem`, line-height 1.625): Running prose and the paragraph under a display or headline. Silver. Running copy is capped at `max-w-prose`; page-header intros at `max-w-2xl`.
- **Caption** (Archivo 400, `0.875rem`, line-height 1.5): Addresses, dates, email links, supporting detail.
- **Label, large** (Archivo 600, `0.8125rem`, tracking 0.08em, width 87.5%, uppercase): Button labels and the mobile menu.
- **Label** (Archivo 600, `0.75rem`, tracking 0.08em, width 87.5%, uppercase): The workhorse — desktop nav, section eyebrows, roles, dates in list rows, the skip link.
- **Label, small** (Archivo 600, `0.6875rem`, tracking 0.08em, width 87.5%, uppercase): Meta text under a component, and the language switcher.

The three label steps share one implementation, the `.label-caps` class: `text-transform: uppercase`, `letter-spacing: 0.08em`, `font-weight: 600`, `font-stretch: 87.5%`. `Label` applies that class; call sites do not.

### Typography components (`@components/ui/text`)

The type scale is implemented as named React components. The component name is the role. There is no generic `<Text variant="…">`. Size lives on the component (inline `fontSize`, including `clamp()` on Display, Headline and Numeral medium) so a stray `text-lg` on the caller cannot restyle a Title. Spacing and measure stay on the caller via `className`.

`color` accepts `chalk` | `silver` | `amber` | `ultramarine`, mapped to the CSS variables in `globals.css`. Omit `color` to use the role default. Pass `color="inherit"` when the parent already sets the ink (lit schedule panes, hover on a nav link). Do not invent a second colour map in TypeScript.

| Component | Default tag | Face / recipe | Size | Default colour |
| --- | --- | --- | --- | --- |
| `Display` | `h1` | Anton, uppercase, balanced, tracking `-0.01em`, lh `0.92` | `clamp(2.5rem, 11vw, 3.75rem)` | chalk |
| `Headline` | `h1` | same, lh `0.95` | `clamp(2.25rem, 5vw, 4rem)` | chalk |
| `Title` | `h2` | Anton, uppercase, lh `1.25`; `size`: `lg` / `md` / `sm` | `1.875rem` / `1.5rem` / `1.25rem` | chalk |
| `Numeral` | `span` | Anton, uppercase, tabular, lh `1`; `size`: `lg` / `md` / `sm` | `2.25rem` / `clamp(1.75rem, 5vw, 2.25rem)` / `1.125rem` | chalk |
| `Body` | `p` | Archivo, lh `1.625` | `1rem` | silver |
| `Caption` | `p` | Archivo, lh `1.5` | `0.875rem` | silver |
| `Label` | `span` | `.label-caps`; `size`: `lg` / `md` (default) / `sm` | `0.8125rem` / `0.75rem` / `0.6875rem` | silver |

Constrained `as` on Title, Body, Caption and Label keeps the outline honest when a visual role is not the default tag (`Label as="h2"` for a section eyebrow, `Title as="dt"` in a record row). Display and Headline stay `<h1>`.

`ActionLink` is button chrome, not a text role. It keeps `.label-caps` on the `<a>` in unlayered CSS so the amber fill still beats the `a { background }` reset. Do not wrap `Label` inside it.

There is no `Lede` component. One reading size: `Body`.

### Named Rules

**The Signage Rule.** If text labels, directs, or marks a state, it is condensed capitals. If text announces, it is Anton capitals. If text is meant to be read in sentences, it is Archivo sentence case in silver. There is no fourth voice.

**The No-Danish-Assumption Rule.** Danish is the default language, but English and Spanish ship with it and run materially longer. Display and headline sizes are therefore always `clamp()`, never fixed; headline-level type carries `text-balance`; and no label may sit in a fixed-width container. A layout that only survives Danish is broken.

**The Uppercase-In-CSS Rule.** Capitals are produced by `text-transform`, never typed into the message catalogs. Translators receive sentence case in all three locales.

## Layout

A single centred column, `max-width: 1440px` (`max-w-[90rem]`), with gutters that step from 20px to 32px at the `sm` breakpoint. Every full-bleed band — header, hero, sections, footer — repeats that same container inside itself, so content aligns down the page while backgrounds and hairlines run edge to edge.

Vertical rhythm is coarse and consistent: 56px of section padding on compact bands, 64px on interior page bodies, 80px on the page-header band and on the hero at desktop. Bands are separated by a 1px hairline rather than by extra space.

The system is mobile-first and uses only three breakpoints: `sm` (640px), `md` (768px), `lg` (1024px). The hero is a single column that becomes two equal columns at `md`, with the copy left and the schedule window right, gapped 48px rising to 80px. The events rail is one column, two at `sm`, four at `lg`, with its connecting amber rule appearing only at `lg` where the row is actually horizontal. Navigation is a `lg`-and-up horizontal list; below that it collapses into a disclosure menu.

Lists of records — officers, events, tournament formats — are not grids. They are full-width rows separated by hairlines, using a `first:border-t` so the run of rows is closed at both ends, with the label column fixed and the content column fluid so long translations wrap rather than push.

**The one exception is the month grid**, and it is an exception because a month is genuinely two-dimensional: the fact that an event falls on a Thursday, or in the same week as another, is information the row list cannot carry. It earns its columns by representing the calendar itself, not by arranging records into tiles. Nothing else may take a grid on that argument — if a set of records could be understood as a list, it is a list. The grid never replaces the row list either; the two appear together, the grid to show the shape of the month and the rows to carry the detail.

### Named Rules

**The One Container Rule.** Everything aligns to the same 1440px container and the same 20/32px gutters. A section that invents its own width breaks the vertical alignment that the hairlines make visible.

**The Hairline-Not-Gap Rule.** Sections are divided by a 1px hairline, not by doubled whitespace. Whitespace sets rhythm inside a band; the hairline ends it.

## Elevation & Depth

**This system is flat.** There are no elevation levels, no card shadows, no layered surfaces, and no `z`-based depth vocabulary. Separation is done entirely by 1px hairlines and by tonal steps between `ground`, `bluehour`, `wet` and white.

Exactly one shadow exists in the entire codebase, and it is not elevation — it is light. When club night is running, the schedule window casts an amber bloom:

### Shadow Vocabulary

- **Hall glow** (`box-shadow: 0 0 2.5rem -0.5rem color-mix(in srgb, var(--amber) 40%, transparent)`): Applied only to the schedule window, only while lit. It has no offset because it is emission, not a light source above the page casting an object down.

### Named Rules

**The Light-Not-Shadow Rule.** Nothing in this system is raised. If something needs to stand apart, give it a hairline, a tonal step, or amber. The single glow that exists belongs to the lit window and may not be reused as a hover effect, a card treatment, or a focus style.

## Shapes

Near-square, following the geometry of a chessboard and of the knight mark.

The radius scale has one value: **2px** (`--radius-sm`, `--radius-md`, `--radius-lg` are all `2px`). It applies to buttons, links that take a focus ring, and the disclosure menu. Rules, rails, schedule panes, the page-header band, the month grid, and all full-bleed sections are square — 0 radius. The only round thing in the system is the 12px amber dot that marks an event, on the rail and in the month grid.

Borders are always 1px and almost always `hairline` (`rgba(12, 21, 32, 0.14)`). Two exceptions, both deliberate: the ghost button's border is 1px solid ultramarine, and the "become a member" section opens with a 1px amber rule at 45% opacity. Borders are structural — they divide bands and rows — rather than decorative outlines around objects.

### Named Rules

**The No-Card Rule.** This system has no card component and must not grow one. A group of records is a run of hairline-separated full-width rows. If something feels like it needs a box, it needs a rule above it.

## Components

### Buttons

Implemented as `ActionLink`, styled by unlayered `a.action-link` rules in `globals.css` — deliberately outside Tailwind's layers so a bare `a { background-color: transparent }` reset cannot strip the amber fill. Do not migrate these to utility classes without re-solving that conflict.

- **Shape:** Near-square (2px radius), inline-flex, padding `0.875rem 1.5rem`.
- **Label:** Condensed capitals at `0.8125rem`, tracking 0.08em.
- **Primary:** Amber fill, chalk label.
- **Ghost:** Transparent, 1px ultramarine border, ultramarine label.
- **Hover:** Both variants fill ultramarine with a ground-coloured label, over 200ms ease on background, colour and border together. No lift, no scale, no shadow.
- **Focus:** The global 2px amber outline at 2px offset.

### Navigation

- **Style:** A horizontal list at `lg` and up, condensed capitals at `0.75rem`, silver at rest, chalk on hover, 200ms ease. Separated from the login link by a 1px hairline and 16px of padding.
- **Brand:** The knight mark at 48px tall beside the club name in condensed capitals. The mark is `public/logoSpringeren.svg` in ultramarine and is decorative in markup (`alt=""`), because the club name sits next to it as real text.
- **Mobile:** Below `lg`, a native `<details>` disclosure opening a 256px panel bordered in hairline on the ground colour, with the same items one size up at `0.8125rem`.
- **Skip link:** Visually hidden until focused, then an amber block with a chalk label at the top left.

### Language switcher

Three submit buttons — `da`, `en`, `es` — in a form, because switching locale writes a cookie and revalidates rather than navigating. Condensed capitals at `0.6875rem`; the active locale is amber, the others silver going chalk on hover. The locale never appears in the URL, so this must never render as links.

### The schedule window (signature component)

The system's one distinctive component and the reason the world holds together. A framed stack of three rows, one per Thursday time band, that changes state with the actual clock.

- **Unlit:** Blue Hour frame with a hairline border; rows are white with chalk text; the time numerals are ultramarine.
- **Lit:** The frame goes chalk, rows fill amber with chalk text, and the hall glow appears behind the frame.
- **Rows** are separated by a 1px gap rather than a border, so the frame colour shows through as a mullion.
- **Per-row state:** a finished band drops to 40% opacity; an upcoming band sits at 85% while lit. The running band is at full strength — that is the whole signal.
- **Transitions** run 700ms ease-out on colour, deliberately slower than every other transition in the system, so the change reads as light rather than as a UI response.
- Row state is also announced to screen readers with visually hidden text; the amber is never the only carrier of meaning.

### Events rail

A horizontal run of upcoming evenings on a 1px amber rule at 55% opacity, each marked by a 12px amber dot with the title in Anton beneath it and the date in silver caption. The rule is drawn only at `lg`, where the items actually form a row; below that the rail collapses to stacked centred items and the line is hidden.

### Page header

The band under the site header on every interior page: Blue Hour at 40% opacity, closed with a hairline, 80px of vertical padding, holding a `Headline` title and an optional `Body` intro capped at `max-w-2xl`.

### Record rows

The repeating pattern for officers, events and tournament formats. Full-width rows divided by hairlines with `first:border-t`, stacking vertically on mobile and becoming a baseline-aligned label/content split at `sm` or `md`. The label column is condensed amber capitals at a fixed width; the content column is fluid.

### Month grid

The one permitted grid in the system, and only because a month is two-dimensional. It sits on `/calendar` (and the backoffice events screen) above the record-row list for that month — never instead of it.

- **Geometry:** seven columns, Monday first as Denmark counts weeks. Cells are square (0 radius). A `gap-px bg-hairline` wrapper with `bg-ground` cells draws the 1px rules as mullions, the same trick as the schedule window. `aspect-square` below `sm`; a fixed min-height from `sm` up so titles have room.
- **Day figure:** `Numeral` small, tabular, chalk. Outside-month padding days are silver at reduced opacity and show no events.
- **Today** is a Blue Hour tonal step with a chalk figure — not amber. Amber inside the grid means "there is an event here" and nothing else, so the two signals never compete in one cell.
- **Events:** the same 12px amber dot as the events rail. On mobile, dots only, up to four, with a `+N` overflow. From `sm` up, the dot sits beside the title in `Label` small, clamped to two lines. Each event is a link to its row in the list below (`#event-<id>`). No dialog, no colour per event.
- **Navigation:** previous / today / next as plain links that write `?month=YYYY-MM`. The month is not React state. The grid is a client island so the backoffice can attach click handlers; it receives the month as serializable props from the server.

### Fields and forms

The first inputs (login, event create/edit) set the pattern membership signup and tournament registration will follow. They are not a second accent and they are not a card.

- **Shape:** 2px radius, 1px hairline border, white fill so the field reads against the pale ground. Height 44px for single-line inputs; textarea starts at 90px and grows.
- **Type:** Field labels are `Label` condensed capitals in chalk. The value is Archivo at body size in chalk; placeholder and supporting hint are silver Caption.
- **Focus:** the global 2px amber outline at 2px offset. Do not add a second ring.
- **Error:** Alarm (`#ff3b5c`) on the border (`aria-invalid`) and as a Caption under the field. No other status colour.
- **Buttons:** the same chrome as `ActionLink` — primary amber, ghost ultramarine, hover the two-colour trade — implemented as `button.action-button` so a submit is not a link. Destructive actions use Alarm as a ghost outline, never as a fill for a primary action.
- **Checkbox:** native, 2px radius, `accent-color` amber — publishing is the action on that screen.
- **Dialogs:** a chalk scrim at 40% and a ground pane with a hairline. No shadow, no blur, no 8/12px radius. Escape and the scrim both dismiss.

## Do's and Don'ts

### Do:

- **Do** treat amber (`#ffb000`) as light. One amber thing per screen region, marking either the lit state or the primary action.
- **Do** separate with a 1px hairline (`rgba(12, 21, 32, 0.14)`) rather than a box, a shadow, or extra whitespace.
- **Do** use `Label` from `@components/ui/text` for anything that labels, navigates, or marks state, at one of the three established sizes. Use `Body`, `Title`, `Headline` and the rest of that module for every other type role — do not reassemble the recipes with Tailwind.
- **Do** keep every band inside the 1440px container with 20px / 32px gutters.
- **Do** clamp display and headline type, and balance it, so Spanish and English headlines do not break the layout.
- **Do** carry state in something other than colour as well — the schedule window pairs its amber with visually hidden status text.
- **Do** put capitals in CSS via `text-transform`, and keep the message catalogs in sentence case.

### Don't:

- **Don't** add a card component, a shadow, or a gradient. The one glow in the system belongs to the lit window.
- **Don't** introduce a second accent, a board-green, or a warm grey. The refused reference for this project is the standard club-site look: centred hero, three cards, board-green accent on white, soft shadows.
- **Don't** put ultramarine behind large areas. It is the mark, the ghost outline, the unlit numerals, and the hover fill — never a section background.
- **Don't** add photography or stock imagery. The club has none, and the design is required to carry itself on type, colour and geometry.
- **Don't** put text inside images or SVGs. The knight is a mark, not a wordmark, and everything typographic must be translatable.
- **Don't** use a radius other than 2px, or round anything that is a rule, a rail, or a pane.
- **Don't** animate on hover beyond a 200ms colour change. No lifts, no scales, no springs.
- **Don't** revive the withdrawn night direction. `.impeccable/brief-body.md`, `.impeccable/mocks/home-comp-a.*` and `.impeccable/quality-bar/*` describe a near-black page over a full-bleed illustrated street; they predate this build and are kept only as history.

---

**A note on token names.** `bluehour`, `wet` and `chalk` are inherited from the withdrawn night direction and now describe pale daylight tints and dark ink. The names are kept because they are load-bearing across every component; read them as vocabulary, not as descriptions of hue.

**Superseded artifacts.** The night world's source art was removed from the app in the same pass that produced this document (`public/scene/*`, `scripts/scene-build.mjs`). The originals remain under `.impeccable/assets/` as part of the build archive.
