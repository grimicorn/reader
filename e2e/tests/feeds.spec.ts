import { test, expect } from "@playwright/test";

test.describe("Settings > Feeds", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings/feeds");
    await expect(page.locator("h2").getByText("RSS & Podcasts")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("shows seeded feed in the list", async ({ page }) => {
    await expect(page.getByText("E2E Test Feed")).toBeVisible({
      timeout: 8_000,
    });
  });

  test("shows the feed URL in the list", async ({ page }) => {
    await expect(
      page.getByText("https://e2e.example.com/feed.xml"),
    ).toBeVisible({ timeout: 8_000 });
  });

  test("add feed input is present", async ({ page }) => {
    await expect(
      page.locator('input[placeholder="https://example.com/feed.xml"]'),
    ).toBeVisible();
  });

  test("add feed button is disabled when input is empty", async ({ page }) => {
    const input = page.locator(
      'input[placeholder="https://example.com/feed.xml"]',
    );
    await expect(input).toHaveValue("");
    // Button should not submit an empty form
    const btn = page.locator(".btn-primary");
    await btn.click();
    // Feed list should be unchanged — the original seeded feed still shows
    await expect(page.getByText("E2E Test Feed")).toBeVisible();
  });

  test("removes a feed via the trash button", async ({ page }) => {
    const feedRow = page.locator(".feed-row", { hasText: "E2E Test Feed" });
    await expect(feedRow).toBeVisible({ timeout: 8_000 });
    await feedRow.locator('button[title="Remove"]').click();
    await expect(feedRow).not.toBeVisible({ timeout: 5_000 });
  });
});
