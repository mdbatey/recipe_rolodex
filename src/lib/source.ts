/**
 * How a recipe's Source reads on the page: a link shortens to its site
 * ("ambitiouskitchen.com") and keeps the full URL to link to; free text
 * ("Mor Mor") stays as it is.
 */
export function sourceLabel(source: string): { text: string; href?: string } {
  if (!/^https?:\/\//.test(source)) return { text: source };
  try {
    return { text: new URL(source).hostname.replace(/^www\./, ''), href: source };
  } catch {
    return { text: source };
  }
}
