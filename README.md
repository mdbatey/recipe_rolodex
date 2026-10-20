# Recipe Rolodex

A personal recipe box, built with Astro and hosted on GitHub Pages at https://mdbatey.github.io/recipe_rolodex/.

## Adding a recipe

Use **Add a recipe** on the site (`/add/`). The first time on a device it asks for a GitHub fine-grained token limited to this repository, with **Contents** and **Pull requests** set to read and write; the page links to GitHub's token page and walks through it. The token is kept only in that browser. Filing a card shrinks the photo, opens a pull request with the recipe, and links to it. Merge the pull request and the site updates about a minute later.

The form only adds recipes. To change one, use **Edit this card on GitHub** on its page: it opens the recipe's `index.md` in GitHub's editor. Fix typos there, or add your own dated additions under `notes:` (see the example below) so the original recipe stays as written. Deleting a recipe means deleting its folder in git or on github.com.

## Adding a recipe by hand

1. Make a folder under `src/content/recipes/` named after the recipe's Slug: its title in lowercase with hyphens, so `Grandma's Lasagna` becomes `grandmas-lasagna`.
2. Put the cover photo in it as `cover.webp`. A WebP of at most about 1600px on the long side, and under about 400 KB, is ideal.
3. Add `index.md`:

   ```markdown
   ---
   title: Grandma's Lasagna
   category: dinner                                 # breakfast, lunch, dinner, sides, desserts, snacks or drinks
   cover: ./cover.webp
   coverAlt: A slice of lasagna on a blue plate   # optional, describes the photo
   tags: [pasta, dinner]                            # optional, lowercase-with-hyphens
   servings: 6                                      # optional
   prepTime: 40 min                                 # optional
   cookTime: 1 hr                                   # optional
   source: Grandma                                  # optional, a name or a URL
   dateAdded: 2026-10-20
   notes:                                           # optional, your own additions, shown in handwriting
     - date: 2026-11-02
       text: I like to add a can of corn with the beans.
   ---

   ## Ingredients

   - 1 pound ground beef
   - ...

   ## Steps

   1. Brown the beef.
   2. ...
   ```

4. Open a pull request. The check builds the site and fails if the frontmatter is wrong. Merging deploys it.

## Adding your own version of a recipe

Put a Markdown file beside the recipe's `index.md`, named for the version (`src/content/recipes/mor-mors-chili/mine.md`), with its own ingredients and steps:

```markdown
---
label: Mine              # the tab's name
dateAdded: 2026-10-20
# optional: cover, coverAlt, servings, prepTime, cookTime, notes (otherwise the original's photo, servings and times are shown)
---

## Ingredients

- 2 pounds ground turkey
- ...

## Steps

1. ...
```

The recipe page then shows tabs on the card: the original's (named after its source, or `versionLabel:` in the original's frontmatter) and one per version. Each version has its own address, like `/recipes/mor-mors-chili/mine/`.

## Development

Requires Node 22.22 or later.

```sh
npm install
npm run dev     # local server at http://localhost:4321/recipe_rolodex/
npm test        # unit tests (Vitest)
npm run check   # type checks
npm run build   # production build into dist/, plus the Pagefind search index
npm run preview # serve the build; search only works here, not under `npm run dev`
```

Design rules, tokens and mockups are in `docs/design/`. Decisions are in `docs/adr/`.
