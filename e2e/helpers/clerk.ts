import { createClerkClient } from "@clerk/backend";

const TEST_USER_EMAIL = "e2e-test@reader-app.dev";

function clerkClient() {
  return createClerkClient({
    secretKey: process.env.NUXT_CLERK_SECRET_KEY!,
  });
}

export async function getOrCreateTestClerkUser() {
  const clerk = clerkClient();

  const { data: existing } = await clerk.users.getUserList({
    emailAddress: [TEST_USER_EMAIL],
  });

  if (existing.length > 0) {
    return existing[0];
  }

  return clerk.users.createUser({
    emailAddress: [TEST_USER_EMAIL],
    password: "E2eTestPass1!",
    firstName: "E2E",
    lastName: "Test",
    skipPasswordChecks: true,
  });
}
