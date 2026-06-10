import { describe, it, expect, vi } from "vitest";
import {
  looksLikeValidFeed,
  fetchFeedBody,
  validateFeedUrl,
} from "../../../server/utils/feedValidator";

describe("looksLikeValidFeed", () => {
  it("returns true for an RSS 2.0 document", () => {
    const body = `<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>`;
    expect(looksLikeValidFeed(body)).toBe(true);
  });

  it("returns true for an Atom feed document", () => {
    const body = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"></feed>`;
    expect(looksLikeValidFeed(body)).toBe(true);
  });

  it("returns true for an RDF/RSS 1.0 document", () => {
    const body = `<?xml version="1.0"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"></rdf:RDF>`;
    expect(looksLikeValidFeed(body)).toBe(true);
  });

  it("returns false for a plain HTML page", () => {
    const body = `<!DOCTYPE html><html><head><title>Not a feed</title></head><body></body></html>`;
    expect(looksLikeValidFeed(body)).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(looksLikeValidFeed("")).toBe(false);
  });

  it("returns false for arbitrary JSON", () => {
    const body = JSON.stringify({ items: [{ title: "Post" }] });
    expect(looksLikeValidFeed(body)).toBe(false);
  });
});

describe("fetchFeedBody", () => {
  it("fetches the URL and returns the response text", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve("<rss version='2.0'/>"),
    });

    const body = await fetchFeedBody(
      "https://example.com/feed.xml",
      mockFetch as unknown as typeof fetch,
    );

    expect(body).toBe("<rss version='2.0'/>");
    expect(mockFetch).toHaveBeenCalledWith("https://example.com/feed.xml");
  });

  it("propagates fetch errors to the caller", async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValue(new Error("Network unreachable"));

    await expect(
      fetchFeedBody(
        "https://example.com/feed.xml",
        mockFetch as unknown as typeof fetch,
      ),
    ).rejects.toThrow("Network unreachable");
  });
});

describe("validateFeedUrl", () => {
  it("returns true when the URL resolves to a valid RSS feed", async () => {
    const rssBody = `<?xml version="1.0"?><rss version="2.0"><channel></channel></rss>`;
    const mockFetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(rssBody),
    });

    const result = await validateFeedUrl(
      "https://example.com/feed.xml",
      mockFetch as unknown as typeof fetch,
    );

    expect(result).toBe(true);
  });

  it("returns true when the URL resolves to a valid Atom feed", async () => {
    const atomBody = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"></feed>`;
    const mockFetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(atomBody),
    });

    const result = await validateFeedUrl(
      "https://example.com/atom.xml",
      mockFetch as unknown as typeof fetch,
    );

    expect(result).toBe(true);
  });

  it("returns false when the URL resolves to a non-feed HTML page", async () => {
    const htmlBody = `<!DOCTYPE html><html><body><p>Not a feed</p></body></html>`;
    const mockFetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(htmlBody),
    });

    const result = await validateFeedUrl(
      "https://example.com/",
      mockFetch as unknown as typeof fetch,
    );

    expect(result).toBe(false);
  });

  it("returns false when the fetch throws a network error", async () => {
    const mockFetch = vi
      .fn()
      .mockRejectedValue(new Error("Network unreachable"));

    const result = await validateFeedUrl(
      "https://unreachable.example.com/feed.xml",
      mockFetch as unknown as typeof fetch,
    );

    expect(result).toBe(false);
  });

  it("returns false when the URL is unreachable and returns no body", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(""),
    });

    const result = await validateFeedUrl(
      "https://example.com/404",
      mockFetch as unknown as typeof fetch,
    );

    expect(result).toBe(false);
  });
});
