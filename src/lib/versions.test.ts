import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { originalLabel, splitVariationId } from './versions';
import { variationSchema } from './variation-schema';

describe('originalLabel', () => {
  it.each([
    [{ source: 'Mor Mor' }, "Mor Mor's"],
    [{ source: 'Grandma' }, "Grandma's"],
    [{ source: 'Uncle Les' }, "Uncle Les'"],
    [{ source: 'https://example.com/chili' }, 'Original'],
    [{}, 'Original'],
    [{ source: 'Mor Mor', versionLabel: 'Classic' }, 'Classic'],
  ])('%j -> %s', (data, label) => {
    expect(originalLabel(data)).toBe(label);
  });
});

describe('splitVariationId', () => {
  it('splits the recipe slug from the version slug', () => {
    expect(splitVariationId('mor-mors-chili/mine')).toEqual({ recipe: 'mor-mors-chili', version: 'mine' });
  });
});

describe('variationSchema', () => {
  const schema = variationSchema(z.string());

  it('needs only a label and a date', () => {
    const variation = schema.parse({ label: 'Mine', dateAdded: '2026-10-20' });
    expect(variation.cover).toBeUndefined();
    expect(variation.notes).toEqual([]);
  });

  it.each([
    ['a missing label', { dateAdded: '2026-10-20' }],
    ['a blank label', { label: ' ', dateAdded: '2026-10-20' }],
    ['a label too long for a tab', { label: 'My extra spicy weeknight version', dateAdded: '2026-10-20' }],
    ['a missing date', { label: 'Mine' }],
  ])('rejects %s', (_, input) => {
    expect(schema.safeParse(input).success).toBe(false);
  });
});
