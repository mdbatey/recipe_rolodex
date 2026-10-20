# 0001: Initial architecture

Status: accepted (2026-10-19), from a design grilling session.

## Product

- A personal, read-mostly recipe site with no user accounts.
- Only the owner (and anyone granted repo access) can add recipes.
- The repo is public, so all recipes and photos are world-readable. Private recipes are out of scope; they would need a different hosting setup.

## Stack and hosting

- Static Astro site with TypeScript, plain CSS (no Tailwind or UI framework), and npm.
- No React. The only client-side JavaScript is the add-recipe form (vanilla JS or an Astro island).
- Hosted on GitHub Pages at `mdbatey.github.io/recipe_rolodex/`, with no custom domain for now. Configure Astro `site` and `base` from the start; every internal link and asset must respect `base`.
- No server or database.

## Content model

- One Markdown file per recipe, in a folder per recipe: `src/content/recipes/<slug>/`.
- Frontmatter: title, tags, servings, prep time, cook time, source (URL or free text like "Grandma"), cover photo, date added.
- The body is freeform Markdown with `## Ingredients` and `## Steps` headings by convention. No structured ingredient lists (revisit if scaling or shopping lists are wanted).
- An Astro content collection with a typed schema validates frontmatter at build time, so a malformed recipe fails the build.
- Each recipe has one cover photo, stored next to its Markdown file. Galleries and step photos are a later feature; the folder-per-recipe layout allows them without migration.

## Browsing

- Card grid, tag-filter pages, and client-side full-text search with Pagefind.
- No literal flip-through rolodex animation. The metaphor can inform styling later.

## Adding recipes

- A form on the site creates a branch, commits the Markdown and photo, and opens a pull request for review. It never commits directly to `main`.
- It authenticates with a fine-grained personal access token scoped to this repo (contents and pull-request write), pasted once and kept in localStorage. Trade-off: the token lives in the browser, so rotate it if a device is lost.
- The slug is generated from the title (`Grandma's Lasagna` becomes `grandmas-lasagna`). If the slug already exists, the form refuses and asks for a rename; it never overwrites or auto-suffixes.
- The form only adds recipes. Editing and deleting happen in git (or on github.com).

## Photos

- The browser resizes to at most 1600px on the long side and re-encodes as WebP at quality 0.8 before upload.
- Hard cap of about 400 KB per photo. If the first encode is over, step quality down (0.7, then 0.6) and re-encode; warn if it still cannot fit.
- Base64 is only the transport encoding the GitHub contents API requires. It adds about 33% and saves nothing; the savings come from resizing and re-encoding.
- Astro generates display sizes at build time, including AVIF. Browsers cannot reliably encode AVIF from canvas, so the upload format stays WebP.

## Delivery

- `setup-agent-skills` is merged into `main` via PR, then `main` becomes the default branch (the remote's default is currently `setup-agent-skills`).
- A GitHub Action builds every PR, so malformed recipes fail the check, and deploys to Pages from `main`.
- Vitest unit tests cover the logic that can break quietly: slug generation, frontmatter-to-Markdown serialization in the form, and the content schema. No browser end-to-end tests for now.
- First vertical slice: one hand-written recipe rendered on the Pages site and deployed by the Action. Search, tags, and the add-recipe form follow as separate issues.
