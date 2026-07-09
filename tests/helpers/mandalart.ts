import { Page, expect } from "@playwright/test";

export const editCell = async (page: Page, testId: string, text: string) => {
  // await page.waitForSelector(`[data-testid="${testId}"]`);
  const cell = page.locator(`[data-testid="${testId}"]`);
  await cell.waitFor({ state: "visible" });
  await cell.click();
  // await page.click(`[data-testid="${testId}"]`);
  await page.screenshot({ path: `debug-after-click.png` });
  const textarea = page.locator("textarea");
  await textarea.waitFor({ state: "visible", timeout: 15000 });
  // await expect(textarea).toBeVisible();
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

export const pressKeyboardForCell = async (
  page: Page,
  locator: string,
  keys: string[]
) => {
  const cell = page.locator(locator);

  await cell.click();

  for (const key of keys) {
    await cell.press(key);
  }
};

// export const fillEmptyString = async (page: Page, locator: string) => {
//   const cell = page.locator(locator);
//   cell.fill("");
// };

export const deleteCell = async (page: Page, testId: string) => {
  const modifier = process.platform === "darwin" ? "Meta" : "Control";
  await pressKeyboardForCell(page, `[data-testid="${testId}"]`, [
    `${modifier}+A`,
    "Backspace",
  ]);

  await page.keyboard.press("Enter");
};
