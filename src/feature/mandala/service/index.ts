import {
  useMandalaStore,
  type MainGoal,
  type MandalaType,
  type SubGoal,
  type Status,
} from "@/lib/stores/mandalaStore";
import { moveItem } from "../utills/\bindex";
import { parseCellId } from "./parseCellId";
import type {
  CellData,
  MandalaLayout,
  MandalaMap,
  ServerMandalaType,
  ServerMandalaTypeWithoutReminder,
} from "./type";

/**
 * 빈 데이터 구조 임시 생성 로직
 *
 */
export const emptyDummyData = {
  data: {
    core: {
      goalId: 0,
      content: "",
      status: "UNDONE" as Status,
      mains: Array.from({ length: 8 }, (_, i) => ({
        goalId: 0,
        position: i + 1,
        content: "",
        status: "UNDONE" as Status,
        subs: Array.from({ length: 8 }, (_, j) => ({
          goalId: 0,
          position: j + 1,
          content: "",
          status: "UNDONE" as Status,
        })),
      })),
    },
  },
};

export const serverToUI = (serverData: ServerMandalaType["data"]) => {
  return toFlatStructure(serverData.core); // 신버전
};

/**
 * 서버 데이터를 UI 데이터로 변환
 * core를 0번 main으로, 서버 mains는 그대로 1~8번
 * core의 subs도 추가 생성
 */
export const toLegacyStructure = (
  serverData: ServerMandalaType["data"]
): MandalaType => {
  const uiMains: MainGoal[] = [];
  const idManager = createMandalaIdManager(serverData);

  // originalId를 설정할 조건을 확인하는 함수
  // goalId가 있다면, 기존 데이터가 있다고 판단.
  const getOriginalId = (
    goalId: number | null | undefined
  ): number | undefined => {
    if (typeof goalId === "number" && goalId > 0) {
      return goalId;
    }
    return undefined;
  };

  // 1단계: 0번 main (core) 생성
  const coreAsMain: MainGoal = {
    goalId: `core-0`,
    originalId: getOriginalId(serverData.core?.goalId),
    position: 0,
    content: serverData.core?.content || "",
    status: serverData.core.status || "UNDONE",
    subs: [],
  };

  // subs 배열 생성 - position 기준으로 배치
  const coreSubsArray = new Array(9).fill(null);
  coreSubsArray[0] = {
    goalId: `sub-0-0`,
    originalId: getOriginalId(serverData.core?.goalId),
    position: 0,
    content: serverData.core?.content || "",
    status: serverData.core.status || "UNDONE",
  };

  serverData.core.mains?.forEach((main) => {
    const targetPosition = main.position;
    if (targetPosition >= 1 && targetPosition <= 8) {
      coreSubsArray[targetPosition] = {
        goalId: `sub-0-${targetPosition}`,
        originalId: getOriginalId(main.goalId),
        position: main.position,
        content: main.content || "",
        status: main.status || "UNDONE",
      };
    }
  });

  // core의 subs 생성 - 빈 자리는 기본값으로 채우기
  for (let i = 1; i <= 8; i++) {
    if (!coreSubsArray[i]) {
      coreSubsArray[i] = {
        goalId: `sub-0-${i}`,
        originalId: undefined, // 빈 데이터는 originalId 없음
        position: i,
        content: "",
        status: "UNDONE",
      };
    }
  }
  coreAsMain.subs = coreSubsArray;
  uiMains[0] = coreAsMain;

  // 2단계: 1~8번 main들 생성 - position 기준 배치
  const uiMainsArray = new Array(9).fill(null);
  uiMainsArray[0] = coreAsMain; // 0번 설정

  serverData.core.mains?.forEach((main) => {
    const targetPosition = main.position;

    if (targetPosition >= 1 && targetPosition <= 8) {
      const uiMain: MainGoal = {
        goalId: `main-${targetPosition}`,
        originalId: getOriginalId(main.goalId),
        position: targetPosition,
        content: main.content || "",
        status: main.status || "UNDONE",
        subs: [],
      };

      // 해당 main의 subs 생성
      const subsArray = new Array(9).fill(null);

      subsArray[0] = {
        goalId: `sub-${targetPosition}-0`,
        originalId: getOriginalId(main.goalId),
        position: 0,
        content: main.content || "",
        status: main.status || "UNDONE",
      };

      // subs를 position 기준 배치
      main.subs?.forEach((sub) => {
        const subTargetPosition = sub.position;
        if (subTargetPosition >= 1 && subTargetPosition <= 8) {
          subsArray[subTargetPosition] = {
            goalId: `sub-${targetPosition}-${subTargetPosition}`,
            originalId: getOriginalId(sub.goalId),
            position: subTargetPosition,
            content: sub.content || "",
            status: sub.status || "UNDONE",
          };
        }
      });

      // subs 빈 자리는 기본 값으로 채우기
      for (let j = 1; j <= 8; j++) {
        if (!subsArray[j]) {
          subsArray[j] = {
            goalId: idManager.generateSubId(uiMain.goalId, undefined, j),
            originalId: undefined, // 빈 데이터는 originalId 없음
            position: j,
            content: "",
            status: "UNDONE",
          };
        }
      }

      uiMain.subs = subsArray;
      uiMainsArray[targetPosition] = uiMain;
    }
  });

  // 빈 main 자리를 빈 값으로 채우기
  for (let k = 1; k <= 8; k++) {
    if (!uiMainsArray[k]) {
      const uiMain: MainGoal = {
        goalId: idManager.generateMainId(undefined, k),
        originalId: undefined, // 빈 데이터는 originalId 없음
        position: k,
        content: "",
        status: "UNDONE",
        subs: [],
      };

      // 빈 subs 배열 생성
      const subsArray = new Array(9).fill(null).map((_, idx) => ({
        goalId: idManager.generateSubId(uiMain.goalId, undefined, idx),
        originalId: undefined, // 빈 데이터는 originalId 없음
        position: idx,
        content: "",
        status: "UNDONE" as const,
      }));

      uiMain.subs = subsArray;
      uiMainsArray[k] = uiMain;
    }
  }

  return {
    core: {
      goalId: coreAsMain.goalId,
      content: coreAsMain.content,
      mains: uiMainsArray,
      status: coreAsMain.status,
    },
  };
};

const createMandalaIdManager = (serverData: ServerMandalaType["data"]) => {
  const usedMainIds = new Set<string>();
  const usedSubIds = new Set<string>();
  const resgisterExistingIds = () => {
    if (serverData.core?.goalId) {
      usedMainIds.add(`core-${serverData.core.goalId}`);
    }

    serverData?.core?.mains?.forEach((main) => {
      if (main.goalId) {
        usedMainIds.add(`main-${main.goalId}`);
      }

      main.subs.forEach((sub) => {
        if (sub.goalId) {
          usedSubIds.add(`sub-${main.goalId || main.position}-${sub.goalId}`);
        }
      });
    });
  };

  resgisterExistingIds();

  const generateCoreId = (originalId?: number) => {
    if (originalId) {
      return `core-${serverData.core.goalId}`;
    }
    return `core-0`;
  };

  const generateMainId = (originalId?: number, position?: number) => {
    if (originalId) {
      return `main-${originalId}`;
    }

    let candidateId = `main-${position}`;
    let counter = 1000;

    while (usedMainIds.has(candidateId)) {
      candidateId = `main-${counter}`;
      counter++;
    }

    usedMainIds.add(candidateId);
    return candidateId;
  };

  const generateSubId = (
    mainId: string,
    originalId?: number,
    position?: number
  ) => {
    if (originalId) {
      return `sub-${mainId.replace("main-", "")}-${originalId}`;
    }

    let candidateId = `sub-${mainId.replace("main-", "")}-${position}`;
    let counter = 1000;

    while (usedSubIds.has(candidateId)) {
      candidateId = `sub-${mainId.replace("main-", "")}-${counter}`;
      counter++;
    }

    usedSubIds.add(candidateId);
    return candidateId;
  };

  return {
    generateCoreId,
    generateMainId,
    generateSubId,
    getUsedMainId: () => Array.from(usedMainIds),
    getUsedMSubId: () => Array.from(usedSubIds),
  };
};

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

export const toggleStatus = (
  status: Status,
  mains: MainGoal[],
  mainIndex: number
) => {
  const mainId = mains[mainIndex].goalId;
  const newMain = mains.map((main, i) => {
    if (i === mainIndex && main.content) {
      return {
        ...main,
        status,
        subs: main.subs.map((sub, j) => (j === 0 ? { ...sub, status } : sub)),
      };
    }
    return main;
  });
  return { mainId, newMain };
};

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

export const flatToServer = () => {
  const { cells, layout } = useMandalaStore.getState().flatData;

  return {
    core: {
      goalId: "core-0",
      originalId: cells["core-0"].originalId,
      content: cells["core-0"].content,
      status: cells["core-0"].status,
      mains: layout.mains.map((mainId) => {
        const main = cells[mainId];
        const subs = layout.subs[mainId];

        return {
          goalId: mainId,
          originalId: main.originalId,
          content: main.content,
          status: main.status,
          position: main.position,
          subs: subs.map((subId) => ({
            goalId: subId,
            content: cells[subId].content,
            status: cells[subId].status,
            originalId: cells[subId].originalId,
            position: cells[subId].position,
          })),
        };
      }),
    },
  };
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
          position: currentTarget.position,
          ...(currentTarget.originalId && { goalId: currentTarget.originalId }),
          subs: [
            {
              content: currentTarget.content,
              position: currentTarget.position,
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

export const toFlatStructure = (
  core: ServerMandalaType["data"]["core"]
): { layout: MandalaLayout; cells: MandalaMap } => {
  const cells: MandalaMap = {};
  const mains: MandalaLayout["mains"] = ["core-0"];
  const subs: MandalaLayout["subs"] = {};
  const grid: MandalaLayout["grid"] = [];

  cells["core-0"] = {
    goalId: "core-0",
    content: core.content || "",
    status: core.status || "UNDONE",
    originalId: core.goalId || undefined,
  };

  for (let i = 0; i <= 8; i++) {
    const mainId = `main-${i}`;
    const mainData = core.mains?.find((m) => m.position === i);
    if (i !== 0) {
      mains.push(mainId);

      cells[mainId] = {
        goalId: mainId,
        content: mainData?.content || "",
        status: mainData?.status || "UNDONE",
        position: i,
        originalId: mainData?.goalId || undefined,
      };
    }

    const subIds: string[] = [];

    for (let j = 0; j <= 8; j++) {
      if (i === 0 && j === 0) {
        const subId = `core-0`;
        subIds.push(subId);
        continue;
      }
      if (i === 0) {
        const subId = `main-center-${j}`;
        subIds.push(subId);
        continue;
      }
      if (j === 0) {
        const subId = `main-${i}`;
        subIds.push(subId);
        continue;
      }

      const subId = `sub-${i}-${j}`;

      subIds.push(subId);
      const subData = mainData?.subs?.find((s) => s.position === j);

      cells[subId] = {
        goalId: subId,
        content: subData?.content || "",
        status: subData?.status || "UNDONE",
        position: j,
        originalId: subData?.goalId || undefined,
      };
    }
    subs[mainId] = subIds;

    grid.push(subIds);
  }

  return { layout: { mains, subs, grid }, cells };
};
export const normalizeCellId = (goalId: string): string => {
  if (goalId.startsWith("sub")) return goalId;
  // main-center-1 → main-1
  return goalId.replace("-center-", "-");
};
