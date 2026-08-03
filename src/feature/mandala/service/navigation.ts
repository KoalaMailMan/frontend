import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { moveItem } from "../utills/\bindex";

export const getNextMainCellId = (editingCellId: string) => {
  const layout = useMandalaStore.getState().flatData.layout;
  const ids = moveItem(layout.mains, 0, 4);
  const currentIndex = ids.indexOf(editingCellId);
  if (currentIndex === -1) return null;
  return ids[(currentIndex + 1) % ids.length];
};

export const getNextSubCellId = (editingCellId: string) => {
  const layout = useMandalaStore.getState().flatData.layout;
  const chunk = editingCellId.split("-"); // ["sub", "1", "2"]
  const mainPosition = chunk[1];

  const mainId = mainPosition === "0" ? "core-0" : `main-${mainPosition}`;
  const subIds = layout.subs[mainId];
  if (!subIds) return null;

  const reordered = [
    ...subIds.slice(1, 5), // 1~4
    mainId, // center (0번째)
    ...subIds.slice(5), // 5~8
  ];
  let currentIndex = reordered.indexOf(editingCellId);
  if (currentIndex === -1) return null;

  const result = reordered[(currentIndex + 1) % reordered.length];
  return result;
};

export const getNextFullCellId = (editingCellId: string) => {
  const chunk = editingCellId.split("-");
  const currentType = chunk[0]; // "sub" or "main"
  const isCenter = chunk[1].startsWith("center"); // "main-cetner-1"
  const currentMainPos = parseInt(isCenter ? chunk[2] : chunk[1]); // "1"

  // 현재 그룹 내에서의 다음 셀을 일단 가져옴
  const next = getNextSubCellId(editingCellId);

  // 정중앙 목표에서 탈출
  if (currentType === "core") {
    return `main-center-5`;
  }
  if (isCenter) {
    // 정중앙 목표
    if (currentMainPos === 4) {
      return `core-0`;
    }
    // 메인 목표에서 탈출
    if (currentMainPos === 8) {
      return `sub-5-1`;
    }
    return `main-center-${currentMainPos + 1}`;
  }
  // sub-X-8에서 블록 탈출
  if (currentType === "sub" && chunk[2] === "8") {
    const layout = useMandalaStore.getState().flatData.layout;

    // sub-4-8 → core 블록의 main-center-1로
    if (currentMainPos === 4) return "main-center-1";

    // sub-8-8 → sub-1-1로 순환
    if (currentMainPos === 8) return layout.subs["main-1"]?.[1] ?? null;

    return layout.subs[`main-${currentMainPos + 1}`]?.[1] ?? null;
  }

  return next;
};
