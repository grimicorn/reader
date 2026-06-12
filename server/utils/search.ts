import { sql, eq } from "drizzle-orm";
import { feedItems, feeds } from "../db/schema";

export const SEARCH_RESULT_LIMIT = 20;

// Maps the feed-level source value (stored in the feeds table) to the
// item type key used by the front-end SOURCES map (icons.js).
const FEED_SOURCE_TO_ITEM_TYPE: Record<string, string> = {
  rss: "article",
  podcast: "podcast",
  video: "video",
  tweet: "tweet",
  photo: "photo",
};

export interface SearchResult {
  id: number;
  feedId: number;
  guid: string;
  // Derived from the parent feed's source column — matches SOURCES keys in icons.js
  type: string;
  // Human-readable feed title for display in the search results
  source: string;
  title: string;
  url: string | null;
  content: string | null;
  tags: string[] | null;
  publishedAt: Date | null;
  readAt: Date | null;
  starred: boolean | null;
  savedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export async function searchFeedItems(
  userId: number,
  query: string,
): Promise<SearchResult[]> {
  const db = useDb();

  const rows = await db
    .select({
      id: feedItems.id,
      feedId: feedItems.feedId,
      feedSource: feeds.source,
      feedTitle: feeds.title,
      guid: feedItems.guid,
      title: feedItems.title,
      url: feedItems.url,
      content: feedItems.content,
      tags: feedItems.tags,
      publishedAt: feedItems.publishedAt,
      readAt: feedItems.readAt,
      starred: feedItems.starred,
      savedAt: feedItems.savedAt,
      createdAt: feedItems.createdAt,
      updatedAt: feedItems.updatedAt,
    })
    .from(feedItems)
    .innerJoin(feeds, eq(feedItems.feedId, feeds.id))
    .where(
      sql`${feeds.userId} = ${userId} AND ${feedItems.searchVector} @@ plainto_tsquery('english', ${query})`,
    )
    .orderBy(
      sql`ts_rank(${feedItems.searchVector}, plainto_tsquery('english', ${query})) DESC`,
    )
    .limit(SEARCH_RESULT_LIMIT);

  return rows.map(({ feedSource, feedTitle, ...item }) => ({
    ...item,
    type: FEED_SOURCE_TO_ITEM_TYPE[feedSource] ?? feedSource,
    source: feedTitle?.trim() || feedSource,
  }));
}
