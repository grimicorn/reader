export default defineEventHandler(async (event) => {
  // event.context.auth is set by @clerk/nuxt's own middleware.
  // Guard in case our middleware runs before Clerk's on some requests.
  if (typeof event.context.auth !== "function") return;

  const { userId } = event.context.auth();
  if (!userId) return;

  event.context.user = await getOrCreateUser(userId);
});
