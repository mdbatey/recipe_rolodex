import { z } from 'astro/zod';
import { nutritionSchema } from './nutrition';

/**
 * Frontmatter for a Variation (ADR 0004): a cook's own version of a recipe,
 * in `src/content/recipes/<slug>/<version>.md` beside the original's `index.md`.
 * Its body has its own `## Ingredients` and `## Steps`. Anything it leaves out
 * (cover photo, servings, times) comes from the original.
 */
export function variationSchema<TCover extends z.ZodType>(cover: TCover) {
  return z.object({
    /** The version's tab name, like "Mine". */
    label: z.string().trim().min(1).max(24),
    cover: cover.optional(),
    coverAlt: z.string().trim().min(1).optional(),
    servings: z.number().int().positive().optional(),
    prepTime: z.string().trim().min(1).optional(),
    cookTime: z.string().trim().min(1).optional(),
    dateAdded: z.coerce.date(),
    /** Its own nutrition; never the original's, since the ingredients differ. */
    nutrition: nutritionSchema.optional(),
    notes: z.array(z.object({ date: z.coerce.date(), text: z.string().trim().min(1) })).default([]),
  });
}
