import type { MainGoal, MandalaType } from "@/lib/stores/mandalaStore";
import { getDataById, isEqual } from ".";
import { parseCellId } from "./parseCellId";

type GetChangedCellId = {
  cellId: string;
  rawData: MandalaType;
  updatedData: MainGoal[];
};

export const getChangedCellId = ({
  cellId,
  rawData,
  updatedData,
}: GetChangedCellId): string | null => {
  if (!rawData) return null;
  const original = getDataById(rawData.core.mains, cellId) ?? rawData.core;

  const next = getDataById(updatedData, cellId)! ?? updatedData[0];

  const isChanged = !isEqual(original, next);
  console.log(original, next, isChanged);

  if (!isChanged) return null;
  return normalizeToTrackId(cellId);
};

export const normalizeToTrackId = (cellId: string) => {
  const parsed = parseCellId(cellId);

  if (parsed.type === "core") return "core-0";
  if (parsed.type === "main") return `main-${parsed.mainIndex}`;
  if (parsed.type === "sub")
    return `sub-${parsed.mainIndex}-${parsed.subIndex}`;
  return null;
};
