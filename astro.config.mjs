// @ts-check
import { defineConfig } from 'astro/config';

// Hosted on GitHub Pages at mdbatey.github.io/recipe_rolodex/ (ADR 0001).
// Every internal link and asset must go through `base`; see src/lib/paths.ts.
export default defineConfig({
  site: 'https://mdbatey.github.io',
  base: '/recipe_rolodex',
  trailingSlash: 'ignore',
});
