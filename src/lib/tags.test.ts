import { describe, expect, it } from 'vitest';
import { allTags, tagLabel } from './tags';

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

describe('tagLabel', () => {
  it.each([
    ['dinner', 'Dinner'],
    ['slow-cooker', 'Slow cooker'],
    ['30-minute', '30 minute'],
  ])('%s -> %s', (tag, label) => {
    expect(tagLabel(tag)).toBe(label);
  });
});
