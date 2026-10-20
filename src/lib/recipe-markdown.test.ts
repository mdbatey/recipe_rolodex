import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { z } from 'astro/zod';
import { parseLines, parseTags, recipeToMarkdown, type RecipeFormFields } from './recipe-markdown';
import { recipeSchema } from './recipe-schema';

const blank: RecipeFormFields = {
  title: '', category: 'dinner', tags: '', servings: '', prepTime: '', cookTime: '', source: '', coverAlt: '', ingredients: '', steps: '',
};
const date = new Date('2026-10-20T15:00:00Z');

/** Splits the Markdown into its frontmatter (parsed as YAML) and body. */
function split(markdown: string) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('no frontmatter');
  return { data: parse(match[1]!), body: match[2]! };
}

describe('parseTags', () => {
  it('slugifies, de-duplicates and drops empties', () => {
    expect(parseTags('Baking, Slow Cooker, , baking')).toEqual(['baking', 'slow-cooker']);
  });
});

describe('parseLines', () => {
  it('drops blank lines and any bullets or numbers typed', () => {
    expect(parseLines('- 2 eggs\n\n* 1 cup flour\n• salt\n1. Mix\n2) Bake\n  plain line  ')).toEqual([
      '2 eggs', '1 cup flour', 'salt', 'Mix', 'Bake', 'plain line',
    ]);
  });

  it('keeps a quantity that only looks like a number', () => {
    expect(parseLines('1 1/2 cups flour\n3.5 oz cheese')).toEqual(['1 1/2 cups flour', '3.5 oz cheese']);
  });
});

describe('recipeToMarkdown', () => {
  const full: RecipeFormFields = {
    title: "Mor Mor's Chili",
    category: 'dinner',
    tags: 'Soup, Beef',
    servings: '8',
    prepTime: '15 min',
    cookTime: '45 min',
    source: 'Mor Mor',
    coverAlt: 'A pot of chili',
    ingredients: '2 pounds ground beef\n2 onions, diced',
    steps: 'Brown the beef.\nSimmer for 30 minutes.',
  };

  it('writes frontmatter that the content schema accepts', () => {
    const { data } = split(recipeToMarkdown(full, date));
    const recipe = recipeSchema(z.string()).parse(data);
    expect(recipe).toMatchObject({
      title: "Mor Mor's Chili",
      category: 'dinner',
      cover: './cover.webp',
      coverAlt: 'A pot of chili',
      tags: ['soup', 'beef'],
      servings: 8,
      prepTime: '15 min',
      cookTime: '45 min',
      source: 'Mor Mor',
    });
    expect(recipe.dateAdded.toISOString().slice(0, 10)).toBe('2026-10-20');
  });

  it('writes the ingredients as a list and the steps numbered', () => {
    const { body } = split(recipeToMarkdown(full, date));
    expect(body).toBe(
      '\n## Ingredients\n\n- 2 pounds ground beef\n- 2 onions, diced\n\n## Steps\n\n1. Brown the beef.\n2. Simmer for 30 minutes.\n',
    );
  });

  it('leaves blank optional fields out', () => {
    const { data } = split(recipeToMarkdown({ ...blank, title: 'Toast' }, date));
    expect(Object.keys(data).sort()).toEqual(['category', 'cover', 'dateAdded', 'title']);
  });

  it('keeps YAML-special characters as plain text', () => {
    const tricky = 'Chili: "the best" #1 - yes, really\\';
    const { data } = split(recipeToMarkdown({ ...blank, title: tricky, source: 'https://example.com/a?b=1#c' }, date));
    expect(data.title).toBe(tricky);
    expect(data.source).toBe('https://example.com/a?b=1#c');
  });

  it('cannot add keys through a field', () => {
    const { data } = split(recipeToMarkdown({ ...blank, title: 'Soup\ntags: [x]', servings: '4\ntitle: Hacked' }, date));
    expect(data.title).toBe('Soup\ntags: [x]');
    expect(data.tags).toBeUndefined();
    expect(data.servings).toBe('4\ntitle: Hacked');
  });

  it('writes servings the schema rejects as they are, so the build catches them', () => {
    const { data } = split(recipeToMarkdown({ ...blank, title: 'Soup', servings: 'lots' }, date));
    expect(recipeSchema(z.string()).safeParse(data).success).toBe(false);
  });
});
