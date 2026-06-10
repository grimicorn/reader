// Configurable so tests can point this at a local mock server.
// Set FEED_FETCH_URL_OVERRIDE in the environment to replace the URL entirely,
// or leave it unset to fetch the real URL passed to validateFeedUrl.
export const FEED_FETCH_BASE_URL = process.env.FEED_FETCH_BASE_URL ?? "";

const RSS_ATOM_PATTERN = /<(rss|feed|rdf:RDF)[^>]*>/i;

export function looksLikeValidFeed(body: string): boolean {
  return RSS_ATOM_PATTERN.test(body);
}

export async function fetchFeedBody(
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const targetUrl = FEED_FETCH_BASE_URL ? FEED_FETCH_BASE_URL + url : url;
  const response = await fetchImpl(targetUrl);
  return response.text();
}

export async function validateFeedUrl(
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const body = await fetchFeedBody(url, fetchImpl);
    return looksLikeValidFeed(body);
  } catch {
    return false;
  }
}
