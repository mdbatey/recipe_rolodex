import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { slugify } from '../lib/slug';

// Each recipe's folder name is its Slug, so it must match its title (GLOSSARY.md).
const recipesDir = join(import.meta.dirname, 'recipes');
const folders = readdirSync(recipesDir, { withFileTypes: true }).filter((d) => d.isDirectory());

describe('recipe folders', () => {
  it.each(folders.map((d) => d.name))('%s is named after its title', (folder) => {
    const markdown = readFileSync(join(recipesDir, folder, 'index.md'), 'utf8');
    const title = markdown.match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^(['"])(.*)\1$/, '$2');
    expect(title, 'frontmatter has a title').toBeTruthy();
    expect(folder).toBe(slugify(title!));
  });

  // A variation's file name is its URL segment (/recipes/<slug>/<version>/), so keep it slug-shaped.
  const variationFiles = folders.flatMap((d) =>
    readdirSync(join(recipesDir, d.name))
      .filter((file) => file.endsWith('.md') && file !== 'index.md')
      .map((file) => `${d.name}/${file}`),
  );
  it.each(variationFiles.length > 0 ? variationFiles : ['(none)'])('variation %s has a slug-shaped name', (path) => {
    if (path === '(none)') return;
    const name = path.split('/')[1]!.replace(/\.md$/, '');
    expect(name).toBe(slugify(name));
  });
});
