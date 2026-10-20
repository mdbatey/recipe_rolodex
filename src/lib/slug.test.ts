import { describe, expect, it } from 'vitest';
import { slugify } from './slug';

describe('slugify', () => {
  it.each([
    ["Grandma's Lasagna", 'grandmas-lasagna'],
    ["Mor Mor's Chili", 'mor-mors-chili'],
    ['Mor Mor’s Chili', 'mor-mors-chili'],
    ['Crème Brûlée', 'creme-brulee'],
    ['  Mac & Cheese!!  ', 'mac-cheese'],
    ['Pad Thai (Weeknight)', 'pad-thai-weeknight'],
    ['7-Layer Dip', '7-layer-dip'],
  ])('%s -> %s', (title, slug) => {
    expect(slugify(title)).toBe(slug);
  });

  it('returns an empty string when nothing usable is left', () => {
    expect(slugify('!!! ???')).toBe('');
  });
});
