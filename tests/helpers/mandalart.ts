import { Page, expect } from "@playwright/test";

export const editCell = async (page: Page, testId: string, text: string) => {
  // await page.waitForSelector(`[data-testid="${testId}"]`);
  await page.click(`[data-testid="${testId}"]`);
  const textarea = page.locator("textarea");

  await expect(textarea).toBeVisible();
  await expect(textarea).toBeEditable();
  // await page.waitForSelector("textarea");
  await textarea.fill(text);
  await page.keyboard.press("Enter");
};

export const openModal = async (page: Page, mainId: string) => {
  await page.click(`[data-testid="cell-${mainId}-arrow"]`);
  await expect(page.locator('[data-testid="modal"]')).toBeVisible();
};

export const openFullDashboard = async (page: Page) => {
  // await page.waitForSelector('[data-testid="full-open-button"]');
  await page.click('[data-testid="full-open-button"]');
  // await page.waitForSelector('[data-testid="full-dashboard"]');
  await expect(page.locator('[data-testid="full-dashboard"]')).toBeVisible();
};
