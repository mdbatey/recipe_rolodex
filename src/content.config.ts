import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { recipeSchema } from './lib/recipe-schema';
import { variationSchema } from './lib/variation-schema';

// One folder per recipe: src/content/recipes/<slug>/index.md plus its cover photo.
// The folder name is the recipe's id and URL slug.
const recipes = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './src/content/recipes',
    generateId: ({ entry }) => entry.split('/')[0]!,
  }),
  schema: ({ image }) => recipeSchema(image()),
});

// A recipe's variations sit beside its index.md: src/content/recipes/<slug>/<version>.md.
// Their id is "<slug>/<version>".
const variations = defineCollection({
  loader: glob({
    pattern: ['*/*.md', '!*/index.md'],
    base: './src/content/recipes',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: ({ image }) => variationSchema(image()),
});

export const collections = { recipes, variations };
