import { test, expect } from "@playwright/test";

test("verification lookup and protected console work on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/verify");
  await expect(page.getByRole("heading", { name: /A document\.\s*A trusted source\./ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Verify document" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(hasOverflow).toBe(false);

  await page.goto("/verify/manage");
  await expect(page.getByRole("heading", { name: "Document console" })).toBeVisible();
  await expect(page.getByLabel("Admin password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Issue invoice" })).toHaveCount(0);

  const response = await page.goto("/verify/not-a-valid-code");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Document not found" })).toBeVisible();
});
