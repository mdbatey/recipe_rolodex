/**
 * The original version's tab name: its own `versionLabel`, else its source as
 * a possessive ("Mor Mor" becomes "Mor Mor's"), else "Original".
 * A source that is a link is not a name, so it falls back too.
 */
export function originalLabel(data: { versionLabel?: string; source?: string }): string {
  if (data.versionLabel) return data.versionLabel;
  const source = data.source?.trim();
  if (!source || /^https?:\/\//.test(source)) return 'Original';
  return source.endsWith('s') ? `${source}'` : `${source}'s`;
}

/** Splits a variation's id (`<recipe slug>/<version slug>`) into its parts. */
export function splitVariationId(id: string): { recipe: string; version: string } {
  const [recipe, version] = id.split('/');
  return { recipe: recipe!, version: version! };
}
