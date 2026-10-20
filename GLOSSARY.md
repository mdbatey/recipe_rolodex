# Glossary

**Recipe**
One dish, stored as a Markdown file with frontmatter in its own folder under `src/content/recipes/<slug>/`.

**Slug**
The URL- and folder-safe name derived from a recipe's title (`Grandma's Lasagna` becomes `grandmas-lasagna`). Unique; collisions are refused, never overwritten.

**Cover Photo**
The single image attached to a recipe, stored beside its Markdown file as WebP of at most about 400 KB.

**Tag**
A label in a recipe's frontmatter (for example `dessert`, `weeknight`). Each tag has its own filter page.

**Source**
Where a recipe came from: a URL or free text such as "Grandma".

**Submission**
A recipe added through the site's form, delivered as a pull request for the owner to review and merge. Not a direct commit to `main`.
