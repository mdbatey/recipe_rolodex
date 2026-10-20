import { describe, expect, it } from 'vitest';
import { encodeUnderLimit, fitWithin } from './photo';

describe('fitWithin', () => {
  it.each([
    [4032, 3024, 1600, 1200],
    [3024, 4032, 1200, 1600],
    [1600, 900, 1600, 900],
    [800, 600, 800, 600],
    [5000, 10, 1600, 3],
  ])('%ix%i -> %ix%i', (w, h, fw, fh) => {
    expect(fitWithin(w, h)).toEqual({ width: fw, height: fh });
  });
});

describe('encodeUnderLimit', () => {
  // Fake encoder: size shrinks with quality.
  const encoderWith = (sizes: Record<number, number>) => {
    const tried: number[] = [];
    const encode = async (quality: number) => {
      tried.push(quality);
      return { size: sizes[quality]! };
    };
    return { encode, tried };
  };

  it('stops at the first quality that fits', async () => {
    const { encode, tried } = encoderWith({ 0.8: 300_000, 0.7: 200_000, 0.6: 100_000 });
    const result = await encodeUnderLimit(encode, 400_000);
    expect(result).toMatchObject({ quality: 0.8, bytes: 300_000, fits: true });
    expect(tried).toEqual([0.8]);
  });

  it('steps down to 0.7, then 0.6', async () => {
    const { encode, tried } = encoderWith({ 0.8: 600_000, 0.7: 500_000, 0.6: 390_000 });
    const result = await encodeUnderLimit(encode, 400_000);
    expect(result).toMatchObject({ quality: 0.6, fits: true });
    expect(tried).toEqual([0.8, 0.7, 0.6]);
  });

  it('returns the smallest attempt, marked as not fitting, when nothing fits', async () => {
    const { encode } = encoderWith({ 0.8: 900_000, 0.7: 800_000, 0.6: 700_000 });
    expect(await encodeUnderLimit(encode, 400_000)).toMatchObject({ quality: 0.6, bytes: 700_000, fits: false });
  });
});
