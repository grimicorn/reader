// Configurable so tests can point feed fetches at a local mock server.
// When FEED_FETCH_PROXY_URL is set the original URL is forwarded as the
// `url` query parameter so the mock can return a canned response without
// making real network requests.
export const FEED_FETCH_PROXY_URL = process.env.FEED_FETCH_PROXY_URL ?? "";

const RSS_ATOM_PATTERN = /<(rss|feed|rdf:RDF)[^>]*>/i;

export function looksLikeValidFeed(body: string): boolean {
  return RSS_ATOM_PATTERN.test(body);
}

function resolveTargetUrl(url: string): string {
  if (!FEED_FETCH_PROXY_URL) return url;
  const proxyUrl = new URL(FEED_FETCH_PROXY_URL);
  proxyUrl.searchParams.set("url", url);
  return proxyUrl.toString();
}

export async function fetchFeedBody(
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string> {
  const response = await fetchImpl(resolveTargetUrl(url));
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
