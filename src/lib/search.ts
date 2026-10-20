/**
 * Reduces a page URL to a comparable form: no origin, query, hash or
 * `index.html`, always a trailing slash. Pagefind reports
 * `/recipe_rolodex/recipes/x/index.html` style URLs; card links are `/recipe_rolodex/recipes/x/`.
 */
export function normalizePagePath(url: string): string {
  const path = url.replace(/^[a-z]+:\/\/[^/]+/i, '').replace(/[?#].*$/, '').replace(/index\.html$/, '');
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * The card links (as written in their `href`) whose page, or one of its
 * variations' pages (`<card>/<version>/`), is among the search results.
 */
export function matchingCards(cardHrefs: string[], resultUrls: string[]): Set<string> {
  const found = resultUrls.map(normalizePagePath);
  return new Set(
    cardHrefs.filter((href) => {
      const card = normalizePagePath(href);
      return found.some((path) => path === card || (path.startsWith(card) && /^[^/]+\/$/.test(path.slice(card.length))));
    }),
  );
}
