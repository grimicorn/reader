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
});
