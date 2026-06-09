import { test as setup } from "@playwright/test";
import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { mkdirSync } from "node:fs";

const AUTH_STATE_FILE = "e2e/.auth/user.json";
const TEST_USER_EMAIL = "e2e-test@reader-app.dev";

setup("authenticate", async ({ page }) => {
  // clerkSetup() is called here (not in globalSetup) so that CLERK_TESTING_TOKEN
  // is NOT set before the webServer process starts. If it were inherited by the
  // Nuxt dev server, Clerk's server-side middleware would authenticate every
  // request — including "unauthenticated" test contexts.
  await clerkSetup();

  // Navigate to the app so Clerk JS can initialize, then sign in via the
  // @clerk/testing helper. It handles setupClerkTestingToken internally,
  // uses a backend-created sign-in token (ticket strategy), and waits for
  // window.Clerk.user to be non-null — no accounts.dev redirect dance needed.
  await page.goto("/login");

  await clerk.signIn({
    page,
    emailAddress: TEST_USER_EMAIL,
  });

  // Navigate to a protected page to confirm the session is fully established
  // and let any client-side redirects settle before capturing state.
  await page.goto("/dashboard");
  await page.waitForURL(/\/dashboard/, { timeout: 30_000 });
  await page.waitForLoadState("networkidle");

  mkdirSync("e2e/.auth", { recursive: true });
  await page.context().storageState({ path: AUTH_STATE_FILE });
});
