# 0004: Variations as tabs on a recipe card

Status: accepted (2026-10-20).

## Context

Notes (dated remarks under a recipe) work for small tweaks. But once the cook's version changes several ingredients and steps (no onions, turkey instead of beef, potatoes and a bell pepper), reading the original and applying notes in your head is error-prone. Adding it as a separate recipe would put two near-identical cards in the box.

## Decision

- A **Variation** is a Markdown file beside the recipe's `index.md`: `src/content/recipes/<slug>/<version>.md`, its own `variations` content collection with id `<slug>/<version>`.
- Its body has its own `## Ingredients` and `## Steps`. Its frontmatter needs only `label` (the tab's name) and `dateAdded`. It may override `cover`, `coverAlt`, `servings`, `prepTime`, `cookTime`, `notes` and `tags`; otherwise the original's photo, servings, times and stamps show. Title, category and source stay the recipe's.
- The recipe page shows small tabs along the top of the index card when a recipe has variations. The original's tab is named by its optional `versionLabel`, else after its source ("Mor Mor's"), else "Original". Each version has its own page at `/recipes/<slug>/<version>/` and its own "Edit this card on GitHub" link.
- The box still shows one card per recipe, marked "2 versions". Search indexes every version and maps a variation's matches to its recipe's card.
- **Tags on a variation** (added 2026-10-25) list all of that version's stamps and replace the original's on its tab (`soup, turkey` instead of `soup, beef`), rather than listing only the differences. The card in the box shows every stamp across its versions. On a tag page the card shows the matching version: its label in place of "2 versions", its own stamps, and a link straight to its tab. The original wins when it has the tag.
- Variations are added by hand (or on GitHub) for now; an "Add my version" form is a separate change.

## Consequences

- The original stays exactly as written, which matters for family recipes.
- A variation duplicates the ingredients and steps it keeps. That is deliberate: each version reads on its own, like a rewritten card.
- Deleting a recipe means deleting its folder, variations included.
