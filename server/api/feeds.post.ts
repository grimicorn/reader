import { feeds } from "../db/schema";
import { validateFeedUrl } from "../utils/feedValidator";

function detectSource(url: string): string {
  return /podcast|simplecast|megaphone|\.mp3|audio/i.test(url)
    ? "podcast"
    : "rss";
}

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const { url } = await readBody<{ url: string }>(event);
  if (!url?.trim())
    throw createError({ statusCode: 400, statusMessage: "URL is required" });

  const trimmedUrl = url.trim();

  const isValid = await validateFeedUrl(trimmedUrl);
  if (!isValid)
    throw createError({
      statusCode: 422,
      statusMessage: "URL does not point to a valid RSS or Atom feed",
    });

  const [feed] = await useDb()
    .insert(feeds)
    .values({
      userId: user.id,
      url: trimmedUrl,
      source: detectSource(trimmedUrl),
    })
    .returning();

  return feed;
});
