# Glossary

**Recipe**
One dish, stored as a Markdown file with frontmatter in its own folder under `src/content/recipes/<slug>/`.

**Slug**
The URL- and folder-safe name derived from a recipe's title (`Grandma's Lasagna` becomes `grandmas-lasagna`). Unique; collisions are refused, never overwritten.

**Cover Photo**
The single image attached to a recipe, stored beside its Markdown file as WebP of at most about 400 KB.

**Category**
The one meal-based divider a recipe is filed behind: breakfast, lunch, dinner, sides, desserts, snacks or drinks. Each is a tab with its own page. File a recipe where you'd usually reach for it; tags cover the rest. See ADR 0003.

**Tag**
A free-form label in a recipe's frontmatter (for example `soup`, `beef`, `weeknight`), shown as a stamp. A recipe can have any number. Each tag has its own page, reached from its stamp; tags are not tabs.

**Source**
Where a recipe came from: a URL or free text such as "Grandma".

**Variation**
A cook's own full version of a recipe, with its own ingredients and steps, kept beside the original as `src/content/recipes/<slug>/<version>.md`. It shows as a tab on the recipe's index card (the original's tab is named after its source, like "Mor Mor's"). A variation is not a separate recipe: the box shows one card for both. See ADR 0004.

**Note**
A short dated remark on a recipe or variation (`notes:` in its frontmatter), shown in handwriting under the steps. For a small tweak; a variation is for when you would rather read your version straight through.

**Submission**
A recipe added through the site's form, delivered as a pull request for the owner to review and merge. Not a direct commit to `main`.
