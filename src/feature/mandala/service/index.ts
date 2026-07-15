// import { useMandalaStore } from "@/lib/stores/mandalaStore";

import { parseCellId } from "./parseCellId";
import type { CellData, ServerMandalaType } from "./type";
import { toFlatStructure } from "./transform";
import type {
  MainGoal,
  MandalaType,
  SubGoal,
} from "@/lib/stores/types/mandalart";

export const serverToUI = (serverData: ServerMandalaType["data"]) => {
  return toFlatStructure(serverData.core); // 신버전
};

// export const handlePrefixDuplication = (id: string) => {
//   const parts = id.split("-");

//   const deduped = parts.filter((p, i, arr) => {
//     if (i === 0) return true;
//     return !(p === arr[i - 1] && (p === "main" || p === "sub"));
//   });

//   // "sub-main-3-0" → ["sub","main","3","0"] → filter → ["sub","3","0"]
//   // "main-main-5"   → ["main","main","5"] → filter → ["main","5"]
//   return deduped.join("-");
// };

export const getDataById = (
  data: MainGoal[],
  cellId: string
): MainGoal | SubGoal | null => {
  const target = parseCellId(cellId);
  if (target.type === "main") return data[target.mainIndex];
  if (target.type === "sub")
    return data[target.mainIndex].subs[target.subIndex];
  return data[0];
};

export const isEqual = (
  a: MandalaType["core"] | MainGoal | SubGoal | CellData,
  b: MandalaType["core"] | MainGoal | SubGoal | CellData
) => {
  return a.content === b.content && a.status === b.status;
};

export const normalizeCellId = (goalId: string): string => {
  if (goalId.startsWith("sub")) return goalId;
  // main-center-1 → main-1
  return goalId.replace("-center-", "-");
};
