import { z } from 'astro/zod';
import { CATEGORY_IDS } from './categories';

/** Tags become URL segments for their filter pages, so keep them simple. */
export const tagSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Tags are lowercase words joined by hyphens, like "weeknight" or "slow-cooker"');

/**
 * Frontmatter for one Recipe (ADR 0001). Takes the cover-photo schema as a
 * parameter so tests can run it without Astro's `image()` helper.
 */
export function recipeSchema<TCover extends z.ZodType>(cover: TCover) {
  return z.object({
    title: z.string().trim().min(1),
    category: z.enum(CATEGORY_IDS),
    cover,
    coverAlt: z.string().trim().min(1).optional(),
    tags: z.array(tagSchema).default([]),
    servings: z.number().int().positive().optional(),
    prepTime: z.string().trim().min(1).optional(),
    cookTime: z.string().trim().min(1).optional(),
    source: z.string().trim().min(1).optional(),
    /** The original's tab name when the recipe has variations; defaults to the source ("Mor Mor's"). */
    versionLabel: z.string().trim().min(1).max(24).optional(),
    dateAdded: z.coerce.date(),
    /** The cook's own dated additions, shown in handwriting under the recipe. */
    notes: z.array(z.object({ date: z.coerce.date(), text: z.string().trim().min(1) })).default([]),
  });
}
