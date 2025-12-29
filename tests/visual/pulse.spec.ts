import { test, expect } from "@playwright/test";

test.describe("Pulse visual", () => {
  test("desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/pulse?snapshot=1", { waitUntil: "networkidle" });

    // give fonts a moment
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot("pulse-desktop.png", {
      animations: "disabled",
      maxDiffPixels: 25000 // strict-ish, adjust once stable
    });
  });

  test("mobile-320", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/pulse?snapshot=1", { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot("pulse-320.png", {
      animations: "disabled",
      maxDiffPixels: 200,
    });
  });
});
