import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { recipeSchema } from './recipe-schema';

// A plain string stands in for Astro's image() helper.
const schema = recipeSchema(z.string());

const minimal = { title: 'Black Bean Soup', category: 'dinner', cover: './cover.webp', dateAdded: '2026-10-20' };

describe('recipeSchema', () => {
  it('accepts a minimal recipe and fills defaults', () => {
    const recipe = schema.parse(minimal);
    expect(recipe.tags).toEqual([]);
    expect(recipe.dateAdded).toBeInstanceOf(Date);
  });

  it('accepts every optional field', () => {
    const result = schema.safeParse({
      ...minimal,
      coverAlt: 'A bowl of soup',
      tags: ['soup', 'slow-cooker'],
      servings: 6,
      prepTime: '15 min',
      cookTime: '45 min',
      source: 'https://example.com/soup',
    });
    expect(result.success).toBe(true);
  });

  it.each([
    ['a missing title', { ...minimal, title: undefined }],
    ['a blank title', { ...minimal, title: '   ' }],
    ['a missing category', { ...minimal, category: undefined }],
    ['an unknown category', { ...minimal, category: 'brunch' }],
    ['a category with capitals', { ...minimal, category: 'Dinner' }],
    ['a missing cover photo', { ...minimal, cover: undefined }],
    ['a missing date', { ...minimal, dateAdded: undefined }],
    ['a tag with capitals', { ...minimal, tags: ['Dinner'] }],
    ['a tag with spaces', { ...minimal, tags: ['slow cooker'] }],
    ['fractional servings', { ...minimal, servings: 2.5 }],
    ['zero servings', { ...minimal, servings: 0 }],
  ])('rejects %s', (_, input) => {
    expect(schema.safeParse(input).success).toBe(false);
  });
});
