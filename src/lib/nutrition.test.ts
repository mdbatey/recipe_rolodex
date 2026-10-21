import { describe, expect, it } from 'vitest';
import { nutritionRows, nutritionSchema } from './nutrition';

describe('nutritionSchema', () => {
  it('accepts a full label', () => {
    const result = nutritionSchema.safeParse({
      serving: '2 tacos', calories: 586, carbs: 56.5, protein: 32.5, fat: 26.2, saturatedFat: 4.1, fiber: 4.7, sugar: 9.8,
    });
    expect(result.success).toBe(true);
  });

  it('accepts just calories', () => {
    expect(nutritionSchema.safeParse({ calories: 250 }).success).toBe(true);
  });

  it.each([
    ['a negative amount', { fat: -1 }],
    ['an amount written as text', { protein: '32.5g' }],
  ])('rejects %s', (_, input) => {
    expect(nutritionSchema.safeParse(input).success).toBe(false);
  });
});

describe('nutritionRows', () => {
  it('orders carbs with fiber and sugar under them, then protein, then fat', () => {
    expect(nutritionRows({ calories: 586, carbs: 56.5, protein: 32.5, fat: 26.2, saturatedFat: 4.1, fiber: 4.7, sugar: 9.8 })).toEqual([
      { label: 'Carbohydrates', value: '56.5 g', indent: false },
      { label: 'Fiber', value: '4.7 g', indent: true },
      { label: 'Sugar', value: '9.8 g', indent: true },
      { label: 'Protein', value: '32.5 g', indent: false },
      { label: 'Fat', value: '26.2 g', indent: false },
      { label: 'Saturated fat', value: '4.1 g', indent: true },
    ]);
  });

  it('skips what is not set and shows whole numbers plainly', () => {
    expect(nutritionRows({ protein: 32, fat: 0 })).toEqual([
      { label: 'Protein', value: '32 g', indent: false },
      { label: 'Fat', value: '0 g', indent: false },
    ]);
  });
});
