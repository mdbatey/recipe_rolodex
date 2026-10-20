/**
 * Prefixes a site path with Astro's `base` (`/recipe_rolodex` on GitHub Pages).
 * Use for every internal link: `withBase('/recipes/mor-mors-chili/')`.
 */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  const trimmedBase = base.replace(/\/+$/, '');
  const trimmedPath = path.replace(/^\/+/, '');
  return `${trimmedBase}/${trimmedPath}`;
}

export function recipePath(slug: string): string {
  return withBase(`/recipes/${slug}/`);
}

export function categoryPath(category: string): string {
  return withBase(`/categories/${category}/`);
}

export function tagPath(tag: string): string {
  return withBase(`/tags/${tag}/`);
}
