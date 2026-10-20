/** Every distinct tag across the given recipes, sorted alphabetically. */
export function allTags(recipes: ReadonlyArray<{ data: { tags: string[] } }>): string[] {
  return [...new Set(recipes.flatMap((recipe) => recipe.data.tags))].sort();
}

/** Display text for a tag: `slow-cooker` becomes `Slow cooker`. */
export function tagLabel(tag: string): string {
  const words = tag.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
