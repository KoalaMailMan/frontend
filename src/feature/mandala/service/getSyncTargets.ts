type ParsedCellId =
  | { type: "core" }
  | { type: "main"; mainIndex: number }
  | { type: "sub"; mainIndex: number; subIndex: number }
  | { type: "unknown" };

type ArrayPosition = { mainIndex: number; subIndex?: number };

export const getSyncTargets = (
  cellId: ParsedCellId
): ArrayPosition[] | null => {
  if (cellId.type === "unknown") return null;

  if (cellId.type === "core") {
    const target = { mainIndex: 0 };
    return [target];
  }

  if (cellId.type === "main") {
    const mainIndex = cellId.mainIndex;
    if (mainIndex <= -1 || mainIndex >= 9) return null;
    const target = {
      mainIndex: cellId.mainIndex,
    };
    const target_1 = {
      mainIndex: cellId.mainIndex,
      subIndex: 0,
    };
    const target_2 = {
      mainIndex: 0,
      subIndex: cellId.mainIndex,
    };
    return [target, target_1, target_2];
  }

  if (cellId.type === "sub") {
    const mainIndex = cellId.mainIndex;
    const subIndex = cellId.subIndex;
    console.log(mainIndex, subIndex);

    if (mainIndex <= -1 || mainIndex >= 9) return null;
    if (subIndex <= -1 || subIndex >= 9) return null;

    const target_1 = {
      mainIndex: cellId.mainIndex,
      subIndex: cellId.subIndex,
    };
    if (subIndex === 0) {
      const target = {
        mainIndex: cellId.mainIndex,
      };

      return [target, target_1];
    }
    return [target_1];
  }
  return null;
};
