import { slugify } from './slug';
import type { CategoryId } from './categories';

/** What the add-recipe form collects, as typed. */
export type RecipeFormFields = {
  title: string;
  category: CategoryId;
  /** Comma-separated, as typed: `"Baking, slow cooker"`. */
  tags: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  source: string;
  coverAlt: string;
  /** One ingredient per line. */
  ingredients: string;
  /** One step per line. */
  steps: string;
};

/** `"Baking, Slow Cooker, baking"` becomes `["baking", "slow-cooker"]`. */
export function parseTags(text: string): string[] {
  return [...new Set(text.split(',').map(slugify).filter(Boolean))];
}

/** Non-empty lines, with any bullet or step number the person typed removed. */
export function parseLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^(?:[-*•]|\d+[.)])\s+/, '').trim())
    .filter(Boolean);
}

/** A YAML double-quoted scalar; JSON string syntax is valid YAML. */
function quote(value: string): string {
  return JSON.stringify(value);
}

/**
 * Builds a recipe's `index.md`: frontmatter matching the content schema
 * (src/lib/recipe-schema.ts), then `## Ingredients` and `## Steps`.
 * Blank optional fields are left out. The cover is always `./cover.webp`.
 */
export function recipeToMarkdown(fields: RecipeFormFields, dateAdded: Date): string {
  const tags = parseTags(fields.tags);
  const servings = fields.servings.trim();
  const optional: Array<[string, string]> = [
    ['coverAlt', fields.coverAlt.trim()],
    ['prepTime', fields.prepTime.trim()],
    ['cookTime', fields.cookTime.trim()],
    ['source', fields.source.trim()],
  ];

  const frontmatter = [
    `title: ${quote(fields.title.trim())}`,
    `category: ${fields.category}`,
    'cover: ./cover.webp',
    ...optional.filter(([, value]) => value).map(([key, value]) => `${key}: ${quote(value)}`),
    ...(tags.length > 0 ? [`tags: [${tags.join(', ')}]`] : []),
    // A whole number as a YAML number; anything else quoted, so it can't inject keys and the schema rejects it
    ...(servings ? [`servings: ${/^\d+$/.test(servings) ? servings : quote(servings)}`] : []),
    `dateAdded: ${dateAdded.toISOString().slice(0, 10)}`,
  ];

  const ingredients = parseLines(fields.ingredients).map((line) => `- ${line}`);
  const steps = parseLines(fields.steps).map((line, i) => `${i + 1}. ${line}`);

  return ['---', ...frontmatter, '---', '', '## Ingredients', '', ...ingredients, '', '## Steps', '', ...steps, ''].join('\n');
}
