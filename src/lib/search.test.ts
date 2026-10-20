import { describe, expect, it } from 'vitest';
import { matchingCards, normalizePagePath } from './search';

describe('normalizePagePath', () => {
  it.each([
    ['/recipe_rolodex/recipes/chili/', '/recipe_rolodex/recipes/chili/'],
    ['/recipe_rolodex/recipes/chili', '/recipe_rolodex/recipes/chili/'],
    ['/recipe_rolodex/recipes/chili/index.html', '/recipe_rolodex/recipes/chili/'],
    ['https://mdbatey.github.io/recipe_rolodex/recipes/chili/#steps', '/recipe_rolodex/recipes/chili/'],
    ['/recipe_rolodex/recipes/chili/?q=beans', '/recipe_rolodex/recipes/chili/'],
  ])('%s -> %s', (url, path) => {
    expect(normalizePagePath(url)).toBe(path);
  });
});

describe('matchingCards', () => {
  const cards = ['/recipe_rolodex/recipes/chili/', '/recipe_rolodex/recipes/soup/', '/recipe_rolodex/recipes/bread/'];

  it('keeps the cards whose pages were found', () => {
    const results = ['/recipe_rolodex/recipes/soup/index.html', '/recipe_rolodex/recipes/chili/'];
    expect(matchingCards(cards, results)).toEqual(new Set(['/recipe_rolodex/recipes/chili/', '/recipe_rolodex/recipes/soup/']));
  });

  it('ignores results that are not cards on this page', () => {
    expect(matchingCards(cards, ['/recipe_rolodex/recipes/lasagna/'])).toEqual(new Set());
  });
});
