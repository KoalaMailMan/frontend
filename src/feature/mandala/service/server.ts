import type { MandalaType } from "@/lib/stores/types/mandalart";
import type {
  MandalaLayout,
  MandalaMap,
  ServerMandalaType,
  ServerMandalaTypeWithoutReminder,
} from "./type";
import { parseCellId } from "./parseCellId";

type UIToServerType = {
  currentData: MandalaType<string>;
  changedCells: Set<string>;
  serverData?: ServerMandalaType["data"];
  id?: number | null;
};

// 서버에 만다라트 대시보드 생성 & 수정
export const uiToServer = ({
  id,
  currentData,
  changedCells,
  serverData,
}: UIToServerType) => {
  let result: ServerMandalaTypeWithoutReminder = {
    data: { core: {} },
  };

  if (id && serverData) {
    result.data = applyChangesToServer(
      id,
      currentData,
      changedCells,
      serverData
    );
  } else {
    result = buildFromScratch(currentData);
  }

  return result;
};

export const buildFromScratch = (currentData: MandalaType<string>) => {
  const mains = currentData.core.mains
    .slice(1)
    .filter((main) => main.content !== "")
    .map((main) => ({
      position: main.position,
      content: main.content,
      status: main.status,
      subs: main.subs
        .slice(1)
        .filter((sub) => sub.content !== "")
        .map((sub) => ({
          position: sub.position,
          content: sub.content,
          status: sub.status,
        })),
    }));

  return {
    data: {
      core: {
        content: currentData.core.content,
        status: currentData.core.status,
        mains,
      },
    },
  };
};

export const flatToServer = (cells: MandalaMap, layout: MandalaLayout) => {
  return {
    core: {
      goalId: cells["core-0"].originalId,
      content: cells["core-0"].content,
      status: cells["core-0"].status,
      mains: layout.mains.slice(1).map((mainId) => {
        const main = cells[mainId];
        const subs = layout.subs[mainId];

        return {
          ...(main.position && { position: main.position }),
          ...(main.originalId && { goalId: main.originalId }),
          ...(main.content && { content: main.content }),
          ...(main.content && { status: main.status }),
          subs: subs.slice(1).map((subId) => ({
            ...(cells[subId].position && { position: cells[subId].position }),
            ...(cells[subId].originalId && { goalId: cells[subId].originalId }),
            ...(cells[subId].content && { content: cells[subId].content }),
            ...(cells[subId].status && { status: cells[subId].status }),
          })),
        };
      }),
    },
  };
};
export const applyChangesToServer = (
  id: number,
  currentData: MandalaType<string>,
  changedCells: Set<string>,
  serverData: ServerMandalaType["data"]
) => {
  const { reminderOption, ...restData } = serverData;
  const result = structuredClone(restData);

  result.mandalartId = id;

  changedCells.forEach((cell) => {
    const cellId = parseCellId(cell);

    if (cellId.type === "core") {
      const serverTarget = result.core;
      const currentTarget = currentData.core;
      serverTarget.content = currentTarget.content;
      if (currentTarget.originalId) {
        serverTarget.goalId = currentTarget.originalId;
      }
      serverTarget.status = currentTarget.status;
    }
    const serverMains = result.core.mains;
    if (!serverMains) return;

    // main 타입
    // → main 있음 → 수정
    // → main 없음 → 생성
    if (cellId.type === "main") {
      const mainIndex = cellId.mainIndex;
      const serverTarget = serverMains.find(
        (main) => main.position === mainIndex
      );
      const currentTarget = currentData.core.mains[mainIndex];

      if (serverTarget) {
        serverTarget.content = currentTarget.content;
        if (currentTarget.originalId) {
          serverTarget.goalId = currentTarget.originalId;
        }
        serverTarget.position = currentTarget.position;
        serverTarget.status = currentTarget.status;
      } else {
        serverMains.push({
          content: currentTarget.content,
          position: currentTarget.position,
          status: currentTarget.status,
          ...(currentTarget.originalId && { goalId: currentTarget.originalId }),
          subs: [],
        });
      }
    }

    if (cellId.type === "sub") {
      // sub 타입
      const mainIndex = cellId.mainIndex;
      const subIndex = cellId.subIndex;
      const serverMain = serverMains.find(
        (main) => main.position === mainIndex
      );
      const currentTarget = currentData.core.mains[mainIndex].subs[subIndex];
      if (serverMain) {
        const serverSub = serverMain.subs.find(
          (sub) => sub.position === subIndex
        );
        if (serverSub) {
          // → main 있음, sub 있음 → sub 수정
          serverSub.content = currentTarget.content;
          if (currentTarget.originalId) {
            serverSub.goalId = currentTarget.originalId;
          }
          serverSub.position = currentTarget.position;
          serverSub.status = currentTarget.status;
        } else {
          // → main 있음, sub 없음 → sub 생성
          serverMain.subs.push({
            content: currentTarget.content,
            position: currentTarget.position,
            status: currentTarget.status,
            ...(currentTarget.originalId && {
              goalId: currentTarget.originalId,
            }),
          });
        }
      } else {
        // → main 없음 → main + sub 둘 다 생성
        serverMains.push({
          position: cellId.mainIndex,
          subs: [
            {
              content: currentTarget.content,
              position: cellId.subIndex,
              status: currentTarget.status,
              ...(currentTarget.originalId && {
                goalId: currentTarget.originalId,
              }),
            },
          ],
        });
      }
    }
  });

  return result;
};
