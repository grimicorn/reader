import { sql, eq } from "drizzle-orm";
import { feedItems, feeds } from "../db/schema";

export const SEARCH_RESULT_LIMIT = 20;

export interface SearchResult {
  id: number;
  feedId: number;
  guid: string;
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

  return db
    .select({
      id: feedItems.id,
      feedId: feedItems.feedId,
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
}
