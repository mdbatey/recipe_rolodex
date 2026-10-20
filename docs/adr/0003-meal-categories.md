# 0003: Meal-based categories as the tabs

Status: accepted (2026-10-20).

## Context

The first version made every tag a divider tab. With more recipes that becomes a long, unordered row, and a recipe with three tags sits behind three tabs, which is not how a recipe box works.

## Decision

- Each recipe has exactly one **Category**, a required frontmatter field. The categories are by meal, in this tab order: breakfast, lunch, dinner, sides, desserts, snacks, drinks. They are defined once in `src/lib/categories.ts`.
- A recipe is filed where you would usually reach for it. A soup eaten at lunch and dinner goes under one; a `lunch` tag covers the other.
- The tabs are **All** plus every category, always shown in order, each with a page at `/categories/<id>/`. An empty category still has its page.
- **Tags** stay free-form for everything else: dish type (`soup`, `salad`), main ingredient, cuisine, effort, occasion. They show as stamps and keep their pages at `/tags/<tag>/`, but are no longer tabs.
- Ingredients need neither: full-text search already finds "noodle" in any recipe's ingredients.

Sorting by kind of dish (soups, salads, mains, breads...) was considered. Meals were chosen because that is how the owner thinks about cooking, and seven tabs fit a phone better.

## Consequences

- Adding, renaming or reordering a category is a one-line change in `categories.ts`. Renaming or removing one also means updating the recipes filed under it, which the build enforces.
- A second row of tabs by dish type may come later. It would be a separate field and component, leaving `category` as it is.
