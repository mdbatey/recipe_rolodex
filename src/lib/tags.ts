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

type TaggedRecipe = { data: { tags: string[] } };
type TaggedVariation = { data: { tags?: string[] } };

/** The stamps one version shows: a variation's own tags if it lists any, else the original's (ADR 0004). */
export function versionTags(recipe: TaggedRecipe, variation?: TaggedVariation): string[] {
  return variation?.data.tags ?? recipe.data.tags;
}

/** Every tag across a recipe's versions, once each, the original's first. The card in the box shows these. */
export function recipeTags(recipe: TaggedRecipe, variations: ReadonlyArray<TaggedVariation>): string[] {
  return [...new Set([recipe.data.tags, ...variations.map((variation) => versionTags(recipe, variation))].flat())];
}

/** The version a tag page should open: the original if it has the tag (undefined), else the first variation that does. */
export function versionForTag<V extends TaggedVariation>(tag: string, recipe: TaggedRecipe, variations: ReadonlyArray<V>): V | undefined {
  if (recipe.data.tags.includes(tag)) return undefined;
  return variations.find((variation) => versionTags(recipe, variation).includes(tag));
}

/** Display text for a tag: `slow-cooker` becomes `Slow cooker`. */
export function tagLabel(tag: string): string {
  const words = tag.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
