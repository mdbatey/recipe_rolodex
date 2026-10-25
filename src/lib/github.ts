/**
 * The few GitHub REST calls the add-recipe form makes (ADR 0001): check the
 * slug is free on main, make a branch, commit the photo and Markdown to it,
 * and open a pull request. Never writes to main.
 */

export const REPO = 'mdbatey/recipe_rolodex';
export const BASE_BRANCH = 'main';
export const RECIPES_DIR = 'src/content/recipes';

/** GitHub's web editor for a recipe's Markdown on main, or one of its variations'. */
export function editUrl(slug: string, version?: string): string {
  return `https://github.com/${REPO}/edit/${BASE_BRANCH}/${RECIPES_DIR}/${slug}/${version ?? 'index'}.md`;
}
const API = 'https://api.github.com';

export type Submission = {
  token: string;
  slug: string;
  title: string;
  markdown: string;
  /** The cover photo's WebP bytes, base64-encoded (the contents API's transport). Absent when there's no photo. */
  photoBase64?: string;
  /** Unique per submission, so resubmitting never collides with an earlier branch. */
  branchSuffix: string;
};

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

/** Base64 of raw bytes, in chunks so large photos don't overflow the call stack. */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

export function textToBase64(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text));
}

type Fetch = (url: string, init: RequestInit) => Promise<Response>;

export function createClient(token: string, fetchImpl: Fetch = fetch) {
  async function call(method: string, path: string, body?: unknown): Promise<Response> {
    const response = await fetchImpl(`${API}${path}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.status === 401) throw new GitHubError('GitHub did not accept the token. It may have expired; paste a new one.', 401);
    if (response.status === 403) throw new GitHubError('The token is missing a permission. It needs Contents and Pull requests set to "Read and write" on this repository.', 403);
    return response;
  }

  async function expectOk(response: Response, doing: string): Promise<any> {
    if (response.ok) return response.json();
    const detail = await response.json().then((json: { message?: string }) => json.message).catch(() => undefined);
    throw new GitHubError(`GitHub refused to ${doing}${detail ? `: ${detail}` : ''} (${response.status}).`, response.status);
  }

  return { call, expectOk };
}

/** True when a recipe folder with this slug already exists on main. */
export async function slugExists(token: string, slug: string, fetchImpl?: Fetch): Promise<boolean> {
  const { call, expectOk } = createClient(token, fetchImpl);
  const response = await call('GET', `/repos/${REPO}/contents/${RECIPES_DIR}/${slug}?ref=${BASE_BRANCH}`);
  if (response.status === 404) return false;
  await expectOk(response, 'look up existing recipes');
  return true;
}

/** Makes the branch, commits the photo (if any) then the Markdown, and opens the PR. Returns the PR's URL. */
export async function submitRecipe(submission: Submission, fetchImpl?: Fetch): Promise<string> {
  const { token, slug, title, markdown, photoBase64, branchSuffix } = submission;
  const { call, expectOk } = createClient(token, fetchImpl);

  if (await slugExists(token, slug, fetchImpl)) {
    throw new GitHubError(`A recipe called "${slug}" is already in the box. Give this one a different title.`, 409);
  }

  const base = await expectOk(await call('GET', `/repos/${REPO}/git/ref/heads/${BASE_BRANCH}`), 'read the main branch');
  const branch = `add-recipe/${slug}-${branchSuffix}`;
  await expectOk(
    await call('POST', `/repos/${REPO}/git/refs`, { ref: `refs/heads/${branch}`, sha: base.object.sha }),
    'create a branch',
  );

  const folder = `${RECIPES_DIR}/${slug}`;
  if (photoBase64) {
    await expectOk(
      await call('PUT', `/repos/${REPO}/contents/${folder}/cover.webp`, {
        message: `Add cover photo for ${title}`,
        content: photoBase64,
        branch,
      }),
      'upload the photo',
    );
  }
  await expectOk(
    await call('PUT', `/repos/${REPO}/contents/${folder}/index.md`, {
      message: `Add recipe: ${title}`,
      content: textToBase64(markdown),
      branch,
    }),
    'save the recipe',
  );

  const pull = await expectOk(
    await call('POST', `/repos/${REPO}/pulls`, {
      title: `Add recipe: ${title}`,
      head: branch,
      base: BASE_BRANCH,
      body: `Added from the site's "Add a recipe" form.\n\nMerge to put **${title}** in the box; the site redeploys in about a minute.`,
    }),
    'open the pull request',
  );
  return pull.html_url;
}
