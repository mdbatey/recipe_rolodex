/** Longest side of an uploaded cover photo, in pixels (ADR 0001). */
export const MAX_PHOTO_SIDE = 1600;
/** Target size of an uploaded cover photo, in bytes (about 400 KB). */
export const MAX_PHOTO_BYTES = 400 * 1024;
/** WebP qualities to try in turn until the photo fits. */
export const PHOTO_QUALITIES = [0.8, 0.7, 0.6] as const;

/** Scales `width` x `height` down so neither side passes `max`; never scales up. */
export function fitWithin(width: number, height: number, max: number = MAX_PHOTO_SIDE): { width: number; height: number } {
  const scale = Math.min(1, max / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export type Encoded<T> = { photo: T; quality: number; bytes: number; fits: boolean };

/**
 * Encodes at each quality in turn until the result is at most `maxBytes`.
 * When none fits, returns the last (smallest) attempt with `fits: false`,
 * so the caller can warn and still let the person submit it.
 */
export async function encodeUnderLimit<T extends { size: number }>(
  encode: (quality: number) => Promise<T>,
  maxBytes: number = MAX_PHOTO_BYTES,
  qualities: readonly number[] = PHOTO_QUALITIES,
): Promise<Encoded<T>> {
  let last: Encoded<T> | undefined;
  for (const quality of qualities) {
    const photo = await encode(quality);
    last = { photo, quality, bytes: photo.size, fits: photo.size <= maxBytes };
    if (last.fits) return last;
  }
  if (!last) throw new Error('No qualities to try');
  return last;
}

/**
 * Resizes and re-encodes a picked image as WebP in the browser (canvas).
 * Rejects if the browser cannot encode WebP, rather than uploading another format.
 */
export async function compressPhoto(file: Blob): Promise<Encoded<Blob>> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const { width, height } = fitWithin(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return encodeUnderLimit(
    (quality) =>
      new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (blob) =>
            blob?.type === 'image/webp'
              ? resolve(blob)
              : reject(new Error('This browser cannot save WebP images. Try another browser.')),
          'image/webp',
          quality,
        ),
      ),
  );
}
