# Recipe Rolodex

A personal recipe box, built with Astro and hosted on GitHub Pages at https://mdbatey.github.io/recipe_rolodex/.

## Adding a recipe

Use **Add a recipe** on the site (`/add/`). The first time on a device it asks for a GitHub fine-grained token limited to this repository, with **Contents** and **Pull requests** set to read and write; the page links to GitHub's token page and walks through it. The token is kept only in that browser. Filing a card shrinks the photo, opens a pull request with the recipe, and links to it. Merge the pull request and the site updates about a minute later.

The form only adds recipes. Edit or delete them in git or on github.com.

## Adding a recipe by hand

1. Make a folder under `src/content/recipes/` named after the recipe's Slug: its title in lowercase with hyphens, so `Grandma's Lasagna` becomes `grandmas-lasagna`.
2. Put the cover photo in it as `cover.webp`. A WebP of at most about 1600px on the long side, and under about 400 KB, is ideal.
3. Add `index.md`:

   ```markdown
   ---
   title: Grandma's Lasagna
   cover: ./cover.webp
   coverAlt: A slice of lasagna on a blue plate   # optional, describes the photo
   tags: [pasta, dinner]                            # optional, lowercase-with-hyphens
   servings: 6                                      # optional
   prepTime: 40 min                                 # optional
   cookTime: 1 hr                                   # optional
   source: Grandma                                  # optional, a name or a URL
   dateAdded: 2026-10-20
   ---

   ## Ingredients

   - 1 pound ground beef
   - ...

   ## Steps

   1. Brown the beef.
   2. ...
   ```

4. Open a pull request. The check builds the site and fails if the frontmatter is wrong. Merging deploys it.

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
