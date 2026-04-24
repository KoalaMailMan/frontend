import type { MainGoal, MandalaType } from "@/lib/stores/mandalaStore";
import { getDataById, isEqual, toFlatStructure } from ".";
import { parseCellId } from "./parseCellId";
import type { MandalaMap, ServerMandalaType } from "./type";

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

export const getChangedCellIdFlat = ({
  cellId,
  rawData,
  cells,
}: {
  cellId: string;
  rawData: ServerMandalaType["data"];
  cells: MandalaMap;
}) => {
  const { cells: originalCells } = toFlatStructure(rawData.core);

  const original = originalCells[cellId];
  const next = cells[cellId];
  const isChanged = !isEqual(original, next);

  return isChanged ? cellId : null;
};
