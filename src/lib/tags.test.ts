import { describe, expect, it } from 'vitest';
import { allTags, recipeTags, tagLabel, tagsByUse, versionForTag, versionTags } from './tags';

describe('allTags', () => {
  it('returns each tag once, sorted', () => {
    const recipes = [
      { data: { tags: ['dinner', 'beef'] } },
      { data: { tags: [] } },
      { data: { tags: ['dinner', 'soup'] } },
    ];
    expect(allTags(recipes)).toEqual(['beef', 'dinner', 'soup']);
  });

  it('returns nothing when no recipe has tags', () => {
    expect(allTags([{ data: { tags: [] } }])).toEqual([]);
  });
});

describe('tagsByUse', () => {
  it('puts the most-used tags first, ties alphabetically', () => {
    const recipes = [
      { data: { tags: ['soup', 'beef'] } },
      { data: { tags: ['chicken', 'soup'] } },
      { data: { tags: ['chicken', 'curry'] } },
      { data: { tags: [] } },
    ];
    expect(tagsByUse(recipes)).toEqual(['chicken', 'soup', 'beef', 'curry']);
  });

  it('returns nothing when no recipe has tags', () => {
    expect(tagsByUse([{ data: { tags: [] } }])).toEqual([]);
  });
});

const chili = { data: { tags: ['soup', 'beef'] } };
const turkey = { id: 'mor-mors-chili/mine', data: { tags: ['soup', 'turkey'] } };
const sameStamps = { id: 'mor-mors-chili/spicy', data: {} };

describe('versionTags', () => {
  it("is the original's tags for the original", () => {
    expect(versionTags(chili)).toEqual(['soup', 'beef']);
  });

  it("is a variation's own tags when it lists them", () => {
    expect(versionTags(chili, turkey)).toEqual(['soup', 'turkey']);
  });

  it("falls back to the original's tags when a variation lists none", () => {
    expect(versionTags(chili, sameStamps)).toEqual(['soup', 'beef']);
  });
});

describe('recipeTags', () => {
  it('is every tag from every version, once, original first', () => {
    expect(recipeTags(chili, [turkey, sameStamps])).toEqual(['soup', 'beef', 'turkey']);
  });

  it("is just the original's tags without variations", () => {
    expect(recipeTags(chili, [])).toEqual(['soup', 'beef']);
  });
});

describe('versionForTag', () => {
  it('picks the original when it has the tag', () => {
    expect(versionForTag('soup', chili, [turkey])).toBeUndefined();
    expect(versionForTag('beef', chili, [turkey])).toBeUndefined();
  });

  it('picks the first variation with the tag when the original lacks it', () => {
    expect(versionForTag('turkey', chili, [sameStamps, turkey])).toBe(turkey);
  });
});

describe('tagLabel', () => {
  it.each([
    ['dinner', 'Dinner'],
    ['slow-cooker', 'Slow cooker'],
    ['30-minute', '30 minute'],
  ])('%s -> %s', (tag, label) => {
    expect(tagLabel(tag)).toBe(label);
  });
});
