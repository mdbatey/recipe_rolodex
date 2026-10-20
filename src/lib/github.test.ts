import { describe, expect, it } from 'vitest';
import { bytesToBase64, editUrl, slugExists, submitRecipe, textToBase64, type Submission } from './github';

type Call = { method: string; url: string; body?: any };

/** A fake GitHub: answers by method and path, records every call. */
function fakeGitHub(routes: Record<string, { status: number; json?: unknown }>) {
  const calls: Call[] = [];
  const fetchImpl = async (url: string, init: RequestInit) => {
    const path = url.replace('https://api.github.com', '');
    calls.push({ method: init.method!, url: path, body: init.body ? JSON.parse(init.body as string) : undefined });
    const key = Object.keys(routes).find((route) => {
      const [method, pattern] = route.split(' ');
      return method === init.method && path.startsWith(pattern!);
    });
    const { status, json } = key ? routes[key]! : { status: 500, json: { message: 'unexpected call' } };
    return new Response(JSON.stringify(json ?? {}), { status });
  };
  return { calls, fetchImpl };
}

const submission: Submission = {
  token: 'github_pat_test',
  slug: 'black-bean-soup',
  title: 'Black Bean Soup',
  markdown: '---\ntitle: "Black Bean Soup"\n---\n',
  photoBase64: 'UklGRg==',
  branchSuffix: '20261020-1500',
};

const happyRoutes = {
  'GET /repos/mdbatey/recipe_rolodex/contents/src/content/recipes/black-bean-soup': { status: 404 },
  'GET /repos/mdbatey/recipe_rolodex/git/ref/heads/main': { status: 200, json: { object: { sha: 'abc123' } } },
  'POST /repos/mdbatey/recipe_rolodex/git/refs': { status: 201 },
  'PUT /repos/mdbatey/recipe_rolodex/contents/': { status: 201 },
  'POST /repos/mdbatey/recipe_rolodex/pulls': { status: 201, json: { html_url: 'https://github.com/mdbatey/recipe_rolodex/pull/99' } },
};

describe('submitRecipe', () => {
  it('branches from main, commits photo then Markdown, and opens a PR', async () => {
    const { calls, fetchImpl } = fakeGitHub(happyRoutes);
    const url = await submitRecipe(submission, fetchImpl);

    expect(url).toBe('https://github.com/mdbatey/recipe_rolodex/pull/99');
    expect(calls.map((c) => `${c.method} ${c.url}`)).toEqual([
      'GET /repos/mdbatey/recipe_rolodex/contents/src/content/recipes/black-bean-soup?ref=main',
      'GET /repos/mdbatey/recipe_rolodex/git/ref/heads/main',
      'POST /repos/mdbatey/recipe_rolodex/git/refs',
      'PUT /repos/mdbatey/recipe_rolodex/contents/src/content/recipes/black-bean-soup/cover.webp',
      'PUT /repos/mdbatey/recipe_rolodex/contents/src/content/recipes/black-bean-soup/index.md',
      'POST /repos/mdbatey/recipe_rolodex/pulls',
    ]);

    const branch = 'add-recipe/black-bean-soup-20261020-1500';
    expect(calls[2]!.body).toEqual({ ref: `refs/heads/${branch}`, sha: 'abc123' });
    expect(calls[3]!.body).toMatchObject({ branch, content: 'UklGRg==' });
    expect(calls[4]!.body).toMatchObject({ branch, content: textToBase64(submission.markdown) });
    expect(calls[5]!.body).toMatchObject({ head: branch, base: 'main', title: 'Add recipe: Black Bean Soup' });
  });

  it('never writes to main', async () => {
    const { calls, fetchImpl } = fakeGitHub(happyRoutes);
    await submitRecipe(submission, fetchImpl);
    for (const call of calls.filter((c) => c.method !== 'GET')) {
      expect(JSON.stringify(call.body)).not.toMatch(/"(branch|ref)":"(refs\/heads\/)?main"/);
    }
  });

  it('refuses a slug that is already in the box, before writing anything', async () => {
    const { calls, fetchImpl } = fakeGitHub({
      ...happyRoutes,
      'GET /repos/mdbatey/recipe_rolodex/contents/src/content/recipes/black-bean-soup': { status: 200, json: [] },
    });
    await expect(submitRecipe(submission, fetchImpl)).rejects.toThrow(/already in the box/);
    expect(calls).toHaveLength(1);
  });

  it('explains a rejected token', async () => {
    const { fetchImpl } = fakeGitHub({ 'GET /repos': { status: 401 } });
    await expect(submitRecipe(submission, fetchImpl)).rejects.toThrow(/did not accept the token/);
  });

  it('explains a missing permission', async () => {
    const { fetchImpl } = fakeGitHub({ ...happyRoutes, 'POST /repos/mdbatey/recipe_rolodex/git/refs': { status: 403 } });
    await expect(submitRecipe(submission, fetchImpl)).rejects.toThrow(/Contents and Pull requests/);
  });

  it("passes on GitHub's message when a step fails", async () => {
    const { fetchImpl } = fakeGitHub({
      ...happyRoutes,
      'POST /repos/mdbatey/recipe_rolodex/pulls': { status: 422, json: { message: 'Validation Failed' } },
    });
    await expect(submitRecipe(submission, fetchImpl)).rejects.toThrow('GitHub refused to open the pull request: Validation Failed (422).');
  });
});

describe('slugExists', () => {
  it('is false on 404 and true on 200', async () => {
    expect(await slugExists('t', 'x', fakeGitHub({ 'GET /repos': { status: 404 } }).fetchImpl)).toBe(false);
    expect(await slugExists('t', 'x', fakeGitHub({ 'GET /repos': { status: 200, json: [] } }).fetchImpl)).toBe(true);
  });
});

describe('base64', () => {
  it('encodes text as UTF-8', () => {
    expect(textToBase64('Sauté')).toBe(Buffer.from('Sauté', 'utf8').toString('base64'));
  });

  it('encodes large byte arrays', () => {
    const bytes = new Uint8Array(200_000).map((_, i) => i % 256);
    expect(bytesToBase64(bytes)).toBe(Buffer.from(bytes).toString('base64'));
  });
});

describe('editUrl', () => {
  it("opens the recipe's Markdown on main in GitHub's editor", () => {
    expect(editUrl('mor-mors-chili')).toBe('https://github.com/mdbatey/recipe_rolodex/edit/main/src/content/recipes/mor-mors-chili/index.md');
  });
});
