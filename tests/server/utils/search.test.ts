import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockInnerJoin = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();

vi.stubGlobal("useDb", () => ({
  select: mockSelect,
}));

import {
  searchFeedItems,
  SEARCH_RESULT_LIMIT,
} from "../../../server/utils/search";

const mockFeedItem = {
  id: 1,
  feedId: 10,
  guid: "guid-1",
  title: "Test Article",
  url: "https://example.com/article",
  content: "Article content about testing",
  tags: ["test"],
  publishedAt: null,
  readAt: null,
  starred: false,
  savedAt: null,
  createdAt: null,
  updatedAt: null,
};

describe("searchFeedItems", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockSelect.mockReturnValue({ from: mockFrom });
    mockFrom.mockReturnValue({ innerJoin: mockInnerJoin });
    mockInnerJoin.mockReturnValue({ where: mockWhere });
    mockWhere.mockReturnValue({ orderBy: mockOrderBy });
    mockOrderBy.mockReturnValue({ limit: mockLimit });
    mockLimit.mockResolvedValue([]);
  });

  it("returns matching feed items for a given user and query", async () => {
    mockLimit.mockResolvedValue([mockFeedItem]);

    const results = await searchFeedItems(1, "testing");

    expect(results).toEqual([mockFeedItem]);
  });

  it("returns an empty array when there are no matches", async () => {
    mockLimit.mockResolvedValue([]);

    const results = await searchFeedItems(1, "nonexistent");

    expect(results).toEqual([]);
  });

  it("applies the result limit", async () => {
    mockLimit.mockResolvedValue([]);

    await searchFeedItems(1, "anything");

    expect(mockLimit).toHaveBeenCalledWith(SEARCH_RESULT_LIMIT);
  });

  it("calls select, from, innerJoin, where, orderBy, and limit in order", async () => {
    await searchFeedItems(42, "query");

    expect(mockSelect).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledTimes(1);
    expect(mockInnerJoin).toHaveBeenCalledTimes(1);
    expect(mockWhere).toHaveBeenCalledTimes(1);
    expect(mockOrderBy).toHaveBeenCalledTimes(1);
    expect(mockLimit).toHaveBeenCalledTimes(1);
  });
});
