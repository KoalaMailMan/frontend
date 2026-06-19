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
  // test("주요 목표 편집", async ({ page }) => {
  //   await editCell(page, "cell-core-0", "핵심 목표");
  //   await expect(page.locator('[data-testid="cell-core-0"]')).toContainText(
  //     "핵심 목표"
  //   );
  // });

  // test("주요 목표 삭제", async ({ page }) => {
  //   await editCell(page, "cell-main-4", "주요 목표");

  //   await deleteCell(page, "cell-main-4");

  //   await expect(
  //     page.locator('[data-testid="cell-main-4"]')
  //   ).not.toContainText("주요 목표");
  // });

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
  // test("세부 목표 모달 열기", async ({ page }) => {
  //   await editCell(page, "cell-main-3", "주요 목표");
  //   await openModal(page, "main-3");
  //   await page.click(`[data-testid="modal-close"]`);
  //   await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  // });

  // test("세부 목표 편집", async ({ page }) => {
  //   await editCell(page, "cell-main-2", "주요 목표");
  //   await openModal(page, "main-2");
  //   await editCell(page, "modal-cell-sub-2-1", "세부 목표");
  //   await expect(
  //     page.locator('[data-testid="modal-cell-sub-2-1"]')
  //   ).toContainText("세부 목표");
  // });

  // test("세부 목표 삭제", async ({ page }) => {
  //   await deleteCell(page, "modal-cell-sub-2-1");
  //   await expect(
  //     page.locator('[data-testid="modal-cell-sub-2-1"]')
  //   ).toContainText("");
  //   await page.click(`[data-testid="modal-close"]`);
  //   await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
  // });
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
  // test("전체 대시보드 열기", async ({ page }) => {
  //   await openFullDashboard(page);
  //   await page.click(`[data-testid="full-dashboard-close"]`);
  // });

  // test("전체 대시보드 셀 편집", async ({ page }) => {
  //   await openFullDashboard(page);
  //   await editCell(page, "full-cell-main-8", "핵심 목표");
  //   await expect(
  //     page.locator('[data-testid="full-cell-main-8"]')
  //   ).toContainText("핵심 목표");
  // });

  // test("전체 목표 삭제", async ({ page }) => {
  //   await deleteCell(page, "full-cell-main-8");
  //   await expect(
  //     page.locator('[data-testid="modal-cell-sub-2-1"]')
  //   ).not.toContainText("핵심 목표");

  //   await page.click(`[data-testid="full-dashboard-close"]`);
  //   await expect(
  //     page.locator('[data-testid="full-dashboard"]')
  //   ).not.toBeVisible();
  // });
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

// test.describe("만다라트 셀 편집", () => {
//   test.describe.configure({ mode: "serial" });
//   test.beforeEach(async ({ page }) => {
//     await page.addInitScript(() => {
//       localStorage.clear();
//       sessionStorage.clear();
//     });

//     await page.goto("/");
//   });

//   test("핵심 목표 편집", async ({ page }) => {
//     await editCell(page, "cell-core-0", "핵심 목표");
//     await expect(page.locator('[data-testid="cell-core-0"]')).toContainText(
//       "핵심 목표"
//     );
//   });

//   test("주요 목표 편집", async ({ page }) => {
//     await editCell(page, "cell-main-4", "주요 목표");
//     await expect(page.locator('[data-testid="cell-main-4"]')).toContainText(
//       "주요 목표"
//     );
//   });

//   test("세부 목표 모달 열기", async ({ page }) => {
//     await editCell(page, "cell-main-3", "주요 목표");
//     await openModal(page, "main-3");
//     await page.click(`[data-testid="modal-close"]`);
//     await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
//   });

//   test("세부 목표 편집", async ({ page }) => {
//     await editCell(page, "cell-main-2", "주요 목표");
//     await openModal(page, "main-2");
//     await editCell(page, "modal-cell-sub-2-1", "세부 목표");
//     await expect(
//       page.locator('[data-testid="modal-cell-sub-2-1"]')
//     ).toContainText("세부 목표");
//     await page.click(`[data-testid="modal-close"]`);
//     await expect(page.locator('[data-testid="modal"]')).not.toBeVisible();
//   });

//   // 3. 전체 대시보드
//   test("전체 대시보드 열기", async ({ page }) => {
//     await openFullDashboard(page);
//     await page.click(`[data-testid="full-dashboard-close"]`);
//   });

//   test("전체 대시보드 셀 편집", async ({ page }) => {
//     await openFullDashboard(page);
//     await editCell(page, "full-cell-main-8", "핵심 목표");
//     await expect(
//       page.locator('[data-testid="full-cell-main-8"]')
//     ).toContainText("핵심 목표");
//     await page.click(`[data-testid="full-dashboard-close"]`);
//   });
// });
