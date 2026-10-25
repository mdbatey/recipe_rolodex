/** Every distinct tag across the given recipes, sorted alphabetically. */
export function allTags(recipes: ReadonlyArray<{ data: { tags: string[] } }>): string[] {
  return [...new Set(recipes.flatMap((recipe) => recipe.data.tags))].sort();
}

/** Every distinct tag, the ones on the most recipes first; ties alphabetically. */
export function tagsByUse(recipes: ReadonlyArray<{ data: { tags: string[] } }>): string[] {
  const counts = new Map<string, number>();
  for (const tag of recipes.flatMap((recipe) => recipe.data.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)! || a.localeCompare(b));
}

/** Display text for a tag: `slow-cooker` becomes `Slow cooker`. */
export function tagLabel(tag: string): string {
  const words = tag.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
