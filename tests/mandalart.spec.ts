import { test, expect } from "@playwright/test";
import {
  deleteCell,
  editCell,
  openFullDashboard,
  openModal,
} from "./helpers/mandalart";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await page.goto("/");
});
test.describe("메인 만다라트", () => {
  test("주요 목표 편집 후 삭제", async ({ page }) => {
    const text = `main-goal-${Date.now()}`;

    await editCell(page, "cell-main-4", text);

    await expect(page.locator('[data-testid="cell-main-4"]')).toContainText(
      text
    );

    await deleteCell(page, "cell-main-4");

    await expect(page.locator('[data-testid="cell-main-4"]')).not.toContainText(
      text
    );
  });
});

test.describe("세부 만다라트 셀 편집", () => {
  test("세부 목표 편집 후 삭제", async ({ page }) => {
    const text = `sub-goal-${Date.now()}`;
    await editCell(page, "cell-main-3", text);
    await openModal(page, "main-3");
    await editCell(page, "modal-cell-sub-3-1", text);
    await expect(
      page.locator('[data-testid="modal-cell-sub-3-1"]')
    ).toContainText(text);

    await deleteCell(page, "modal-cell-sub-3-1");
    await expect(
      page.locator('[data-testid="modal-cell-sub-3-1"]')
    ).not.toContainText(text);
    await page.click(`[data-testid="modal-close"]`);
    await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  });
});

test.describe("전체 만다라트 셀 편집", () => {
  test("전체 목표 편집 후 삭제", async ({ page }) => {
    const text = `full-goal-${Date.now()}`;
    await openFullDashboard(page);
    await editCell(page, "full-cell-main-8", text);
    await expect(
      page.locator('[data-testid="full-cell-main-8"]')
    ).toContainText(text);

    await deleteCell(page, "full-cell-main-8");
    await expect(
      page.locator('[data-testid="full-cell-main-8"]')
    ).not.toContainText(text);
    await page.click(`[data-testid="full-dashboard-close"]`);
    await expect(
      page.locator('[data-testid="full-dashboard"]')
    ).not.toBeVisible();
  });
});
