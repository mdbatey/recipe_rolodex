# Design system: vintage index cards

The Recipe Rolodex looks like a well-used recipe box: cream index cards with a red header line and pale blue rules, typewritten labels, handwritten titles, snapshots held on with tape, colored divider tabs, and red rubber-stamp tags, all sitting on kraft paper.

Read this before building any page or component. The decision is recorded in `docs/adr/0002-vintage-index-card-style.md`.

## Files

| File | What it is |
|---|---|
| `docs/design/tokens.css` | Every color, font, size, spacing, shadow and tilt as CSS custom properties. Copy it into the site (for example `src/styles/tokens.css`) and import it once in the base layout. Use tokens, never raw hex values. |
| `docs/design/mockups/index.html` | Home: the recipe box (search, tag tabs, card grid). |
| `docs/design/mockups/recipe.html` | A recipe page. |
| `docs/design/mockups/add.html` | The add-recipe form. |
| `docs/design/mockups/mockup.css` | Reference styles for the mockups. Rebuild these as Astro components with scoped styles rather than copying the file wholesale. |
| `docs/design/mockups/screenshots/` | PNGs of each mockup at desktop (1280px) and phone (390px) widths. |

Open the mockups straight from disk in a browser. They are static HTML with sample content; the recipes in them are placeholders, not real content.

## The feel, in one line per rule

1. **Everything is paper.** The page is kraft (`--color-kraft` with a faint speckle). Content sits on index-card stock (`--color-card`), which casts a soft shadow.
2. **Three hands, each with one job.**
   - Typewriter display (`--font-display`, Special Elite): the site title, uppercase labels, section headings, buttons, tabs and stamps.
   - Typewriter body (`--font-body`, Courier Prime): all running text, ingredients and steps.
   - Handwriting (`--font-hand`, Caveat): recipe titles, photo captions, notes and small asides. Never for anything longer than a sentence or for form labels.
3. **One accent.** Faded red (`--color-accent`) for buttons, links, stamps, section headings and step numbers. Titles are blue-black pen (`--color-pen`). Nothing else gets color except the divider tabs.
4. **Ruled lines are real lines.** Body text on a card sits on blue rules, so text line-height must equal the rule spacing (`--rule-step-card` 28px on grid cards, `--rule-step-page` 32px on the recipe page, `--rule-step-field` 30px in textareas). The `.ruled` pattern in `mockup.css` shows how. A red line (`--color-rule-red`) runs under every card's title.
5. **Slightly imperfect, never messy.** Cards tilt by at most 1.5deg (use `--tilt-1` to `--tilt-6` in turn); tape and photo mats may tilt up to 8deg. Hovering a card straightens and lifts it. Text inputs, buttons and the recipe page's main card stay straight.
6. **No literal rolodex animation** (ADR 0001). The metaphor shows up in styling only.

## Components

Class names refer to `mockup.css`.

| Component | Look | Notes |
|---|---|---|
| Recipe card (`.recipe-card`) | Index card, tape strip at top center, cover photo in a white 6px mat, handwritten title, red rule, then ruled lines with servings and times, source, and stamps. | The whole card is one link to the recipe. The grid is `repeat(auto-fill, minmax(260px, 1fr))`. |
| Divider tabs (`.tabs`, `.tab`) | Rounded-top tabs in the six tab colors, sitting on a wood-colored line. The active tab is card-colored and taller. | These are the tag filter links. Mark the current one with `aria-current="page"`. On phones they become one horizontally scrolling row. |
| Stamp (`.stamp`) | Uppercase typewriter text in a red 2px box, slightly rotated. | Used for tags. On the recipe page each stamp links to its tag page. |
| Button (`.btn`) | Red with cream text, typewriter font, a darker red bottom edge that "presses" on click. | One primary button per screen at most. |
| Search box (`.search__box`) | Card-colored field with a 2px ink border and a hard offset shadow. | Pagefind search UI should be restyled to match, not left at its defaults. |
| Snapshot (`.snapshot`) | The recipe page's cover photo: white border, thicker at the bottom like a print, two strips of tape, handwritten caption, tilted -1.5deg. | Caption is optional. |
| Stats strip (`.stats`) | Three cells (Serves, Prep, Cook) with dashed dividers, ink border and hard shadow. | A `<dl>`. |
| Index card (`.index-card`) | The recipe page's main card: big handwritten title, date added, red rule, ruled body with "Ingredients" and "Steps" in red uppercase typewriter. | Ingredients are checkboxes that strike through when ticked. Steps are numbered in red handwriting. |
| Form fields (`.input`, `.textarea`) | White fields with 2px ink borders. The title field is handwriting on a single underline, like writing on a card. Textareas are ruled. | Each field has a visible `<label>` in the uppercase label style. Under the title, show the slug it will be saved as. |
| Photo drop zone (`.dropzone`) | Dashed wood-colored border on a sunk card background, with a tilted thumbnail. | After choosing a photo, show its preview and final size here. |
| Photo placeholder (`.photo-placeholder`) | Tan diagonal stripes with "Cover photo". | Mockup only. Real recipes always have a cover photo. |

## Copy voice

Plain and warm, in the recipe-box metaphor without overdoing it: "Search the box", "Back to the box", "A new card for the box", "File this card", "6 cards in the box". Buttons say what happens. The add form says plainly that it creates a pull request that goes live once merged.

## Accessibility

- Text colors pass WCAG AA (4.5:1) on both card and kraft backgrounds. `--color-rule-*`, `--color-wood` and `--color-tape` are decoration only and must never carry text.
- `--color-ink-faint` is for placeholders only.
- Touch targets are at least 44px (`--touch-min`).
- Focus is a 3px blue-black (`--color-pen`) outline, visible on every surface.
- Decorative tape and SVG icons are `aria-hidden="true"`.
- Handwriting is for short text only, since it is harder to read.
- Tilts are static. Under `prefers-reduced-motion`, hover transitions are turned off (`--transition: none`).

## Fonts

All three are on Google Fonts under the SIL Open Font License. For the real site, prefer self-hosting with Fontsource (`@fontsource/special-elite`, `@fontsource/courier-prime`, `@fontsource/caveat`) over the Google Fonts `@import` the mockups use: it avoids a third-party request and works with the `base` path. Load only the weights in use: Special Elite 400, Courier Prime 400/700 (plus italic 400), and Caveat 600/700.

## Printing

A recipe page should print as a clean card: no kraft background, shadows, tilt, tape, rules or navigation. The `@media print` block in `mockup.css` is the starting point.

## Out of scope for now

- Dark mode. The look is paper by design, and dark mode would need its own design pass.
- Any other theme. A clean, modern alternative was considered and not chosen.

## Source mockups

The original design canvas (private to the repo owner) is at https://claude.ai/artifact/UNamimKZLDss9CNvnknWUN. The HTML mockups in this folder are the reference to build from.
