import { test, expect } from "@playwright/test";

test.describe("Settings > Connections", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings/connections");
    await expect(
      page.locator("h2").getByText("Connected accounts"),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("shows the connections grid", async ({ page }) => {
    await expect(page.locator(".conn-grid")).toBeVisible();
  });

  test("YouTube connection card is shown", async ({ page }) => {
    await expect(page.locator(".conn", { hasText: "YouTube" })).toBeVisible();
  });

  test("YouTube shows as not connected (no seed integration)", async ({
    page,
  }) => {
    const youtubeCard = page.locator(".conn", { hasText: "YouTube" });
    // No connected indicator since we didn't seed an integration
    await expect(youtubeCard.locator(".live")).not.toBeVisible();
    // Connect button should be the primary style
    await expect(youtubeCard.locator(".btn-primary")).toBeVisible();
  });

  // The connect test navigates through the OAuth flow (mocked via page.route +
  // the local mock server started in globalSetup). The disconnect test depends
  // on this test having run first — it expects the integration to be in the DB.
  test("can connect YouTube via OAuth", async ({ page }) => {
    // Intercept the browser's redirect to accounts.google.com and bounce it
    // straight to our callback with a fake code and the real state token.
    await page.route(
      "https://accounts.google.com/**",
      async (route) => {
        const state = new URL(route.request().url()).searchParams.get("state");
        await route.fulfill({
          status: 302,
          headers: {
            location: `http://localhost:3000/api/auth/youtube/callback?code=mock_code&state=${state}`,
          },
        });
      },
      { times: 1 },
    );

    const youtubeCard = page.locator(".conn", { hasText: "YouTube" });
    await youtubeCard.locator(".btn-primary").click();

    // OAuth completes → server saves integration → redirects back to this page
    await expect(page).toHaveURL(/\/settings\/connections/, {
      timeout: 15_000,
    });
    await page.waitForLoadState("networkidle");

    await expect(youtubeCard.locator(".live")).toBeVisible({ timeout: 8_000 });
    await expect(youtubeCard).toContainText("@e2etestchannel");
  });

  test("can disconnect YouTube", async ({ page }) => {
    const youtubeCard = page.locator(".conn", { hasText: "YouTube" });
    // Integration was created by the previous test and persists in the DB
    await expect(youtubeCard.locator(".live")).toBeVisible({ timeout: 8_000 });

    await youtubeCard.getByRole("button", { name: "Disconnect" }).click();

    await expect(youtubeCard.locator(".live")).not.toBeVisible({
      timeout: 5_000,
    });
    await expect(youtubeCard.locator(".btn-primary")).toBeVisible();
  });
});
