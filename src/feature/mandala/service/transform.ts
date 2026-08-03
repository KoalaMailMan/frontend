import { createMandalaIdManager } from "./idManager";
import type { MandalaLayout, MandalaMap, ServerMandalaType } from "./type";
import type {
  Status,
  MandalaType,
  MainGoal,
} from "@/lib/stores/types/mandalart";

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

/**
 * 서버 데이터를 UI 데이터로 변환
 * core를 0번 main으로, 서버 mains는 그대로 1~8번
 * core의 subs도 추가 생성
 */
export const toLegacyStructure = (
  serverData: ServerMandalaType["data"]
): MandalaType => {
  console.log("1");
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
