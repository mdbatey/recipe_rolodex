import { z } from 'astro/zod';

const amount = z.number().nonnegative().optional();

/**
 * Approximate nutrition per serving, as a recipe's source states it.
 * Grams except calories (kcal); every number is optional.
 */
export const nutritionSchema = z.object({
  /** What one serving is, like "2 tacos (with sauce & salsa)". */
  serving: z.string().trim().min(1).optional(),
  calories: amount,
  carbs: amount,
  protein: amount,
  fat: amount,
  saturatedFat: amount,
  fiber: amount,
  sugar: amount,
});

export type Nutrition = z.infer<typeof nutritionSchema>;

const ROWS = [
  { key: 'carbs', label: 'Carbohydrates', indent: false },
  { key: 'fiber', label: 'Fiber', indent: true },
  { key: 'sugar', label: 'Sugar', indent: true },
  { key: 'protein', label: 'Protein', indent: false },
  { key: 'fat', label: 'Fat', indent: false },
  { key: 'saturatedFat', label: 'Saturated fat', indent: true },
] as const;

/** Trims a trailing ".0" so 32.0 reads as 32 but 4.7 stays 4.7. */
function grams(value: number): string {
  return `${Number(value.toFixed(1))} g`;
}

/** The label's rows in display order (carbs with fiber and sugar under them, then protein, then fat), skipping what isn't set. */
export function nutritionRows(nutrition: Nutrition): Array<{ label: string; value: string; indent: boolean }> {
  return ROWS.filter((row) => nutrition[row.key] !== undefined).map((row) => ({
    label: row.label,
    value: grams(nutrition[row.key]!),
    indent: row.indent,
  }));
}
