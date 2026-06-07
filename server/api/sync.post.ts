import { eq } from "drizzle-orm";
import { feedItems } from "../db/schema";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  const { action, payload } = await readBody<{
    action: string;
    payload: Record<string, unknown>;
  }>(event);

  const db = useDb();

  switch (action) {
    case "markRead":
      await db
        .update(feedItems)
        .set({
          readAt: payload.readAt
            ? new Date(payload.readAt as string)
            : new Date(),
        })
        .where(eq(feedItems.guid, payload.guid as string));
      break;

    case "star":
      await db
        .update(feedItems)
        .set({ starred: payload.starred as boolean })
        .where(eq(feedItems.guid, payload.guid as string));
      break;

    case "save":
      await db
        .update(feedItems)
        .set({
          savedAt: payload.savedAt ? new Date(payload.savedAt as string) : null,
        })
        .where(eq(feedItems.guid, payload.guid as string));
      break;

    default:
      throw createError({
        statusCode: 400,
        statusMessage: `Unknown sync action: ${action}`,
      });
  }

  return { ok: true };
});
