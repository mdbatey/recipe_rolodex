/**
 * Turns a recipe title into its Slug: the URL- and folder-safe name
 * (`Grandma's Lasagna` becomes `grandmas-lasagna`). See GLOSSARY.md.
 * Returns an empty string when the title has no letters or digits;
 * callers must refuse that rather than save it.
 */
export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // drop accents: crème -> creme
    .toLowerCase()
    .replace(/['‘’]/g, '') // apostrophes join words: grandma's -> grandmas
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
