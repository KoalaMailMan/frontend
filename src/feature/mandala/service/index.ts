import { useAuthStore } from "@/lib/stores/authStore";
import { getMandalaAPI } from "../api/mandalart/getMandala";
import {
  useMandalaStore,
  type DataOption,
  type MainGoal,
  type MandalaType,
} from "@/lib/stores/mandalaStore";
import { apiClient } from "@/lib/api/client";
import { createMandalaAPI } from "../api/mandalart/createMandala";
import { toast } from "sonner";

export const handleMandalaData = async () => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) return;
  try {
    const mandalart: ServerMandalaType = await getMandalaAPI(accessToken);
    if (mandalart) {
      if (
        mandalart.data &&
        mandalart.data.mandalartId !== undefined &&
        mandalart.data.reminderOption !== undefined
      ) {
        useMandalaStore.getState().setData(mandalart.data);
        useMandalaStore.getState().setMandalartId(mandalart.data.mandalartId);
        const reminderOptions = mandalart.data.reminderOption;
        if (reminderOptions.reminderEnabled) {
          useMandalaStore
            .getState()
            .setReminderOption(mandalart.data.reminderOption);
        }
      }
    } else {
      useMandalaStore.getState().setEmptyState(true);
    }
  } finally {
  }
};

export const handleUpdateMandala = async (
  data: MandalaType,
  changedCells: Set<string>,
  callback?: () => void
) => {
  const accessToken = useAuthStore.getState().accessToken;
  const mandalartId = useMandalaStore.getState().mandalartId;
  const resetChangedCells = useMandalaStore.getState().resetChangedCells;
  if (accessToken) {
    // 인증 성공
    try {
      if (callback !== undefined) {
        callback();
      }

      if (mandalartId != null) {
        const mandalaData = uiToServer(data, changedCells, mandalartId);
        const mandalartRes: ServerMandalaType = await createMandalaAPI(
          accessToken,
          mandalaData
        );
        resetChangedCells();
        return mandalartRes;
      } else {
        const mandalaData = uiToServer(data, changedCells);
        const mandalartRes = await createMandalaAPI(accessToken, mandalaData);
        resetChangedCells();
        return mandalartRes;
      }
    } catch (error: any) {
      console.error(error);
      toast.warning("만다라트 저장에 실패했습니다. 다시 시도해주세요.");
    }
  }
};

export const withNoContentInterceptor = async () => {
  const interceptorId = apiClient.addResponseInterceptor({
    onSuccess: async (res: Response) => {
      if (res.status === 204) {
        useMandalaStore.getState().setEmptyState(true);
        return emptyDummyData;
      }
      const contentLength = res.headers.get("content-length");
      if (contentLength === "0") {
        useMandalaStore.getState().setEmptyState(true);
        return emptyDummyData;
      }
      try {
        useMandalaStore.getState().setEmptyState(false);
        return await res.json();
      } catch (error) {
        useMandalaStore.getState().setEmptyState(true);
        console.error("JSON parsing failed:", error);
        throw new Error("Invalid JSON response");
      }
    },
  });
  return interceptorId;
};

/**
 * 빈 데이터 구조 임시 생성 로직
 *
 */
export const emptyDummyData = {
  data: {
    core: {
      goalId: 0,
      content: "",
      mains: Array.from({ length: 8 }, (_, i) => ({
        goalId: 0,
        position: i + 1,
        content: "",
        subs: Array.from({ length: 8 }, (_, j) => ({
          goalId: 0,
          position: j + 1,
          content: "",
        })),
      })),
    },
  },
};

// 서버 데이터용 타입
export type ServerMandalaType = {
  data: {
    core: {
      goalId: number;
      content: string;
      mains: ServerMainGoal[];
    };
    mandalartId?: number;
    reminderOption?: DataOption;
  };
};

export type ServerMainGoal = {
  goalId: number;
  position: number;
  content: string;
  subs: ServerSubGoal[];
};

export type ServerSubGoal = {
  goalId: number;
  position: number;
  content: string;
};
/**
 * 서버 데이터를 UI 데이터로 변환
 * core를 0번 main으로, 서버 mains는 그대로 1~8번
 * core의 subs도 추가 생성
 */
export const serverToUI = (
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
    subs: [],
  };

  // subs 배열 생성 - position 기준으로 배치
  const coreSubsArray = new Array(9).fill(null);
  coreSubsArray[0] = {
    goalId: `sub-0-0`,
    originalId: getOriginalId(serverData.core?.goalId),
    position: 0,
    content: serverData.core?.content || "",
  };

  serverData.core.mains?.forEach((main) => {
    const targetPosition = main.position;
    if (targetPosition >= 1 && targetPosition <= 8) {
      coreSubsArray[targetPosition] = {
        goalId: idManager.generateSubId(
          coreAsMain.goalId,
          main.goalId,
          targetPosition
        ),
        originalId: getOriginalId(main.goalId),
        position: main.position,
        content: main.content || "",
      };
    }
  });

  // core의 subs 생성 - 빈 자리는 기본값으로 채우기
  for (let i = 1; i <= 8; i++) {
    if (!coreSubsArray[i]) {
      coreSubsArray[i] = {
        goalId: idManager.generateSubId(coreAsMain.goalId, undefined, i),
        originalId: undefined, // 빈 데이터는 originalId 없음
        position: i,
        content: "",
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
        goalId: idManager.generateMainId(main.goalId, targetPosition),
        originalId: getOriginalId(main.goalId),
        position: targetPosition,
        content: main.content || "",
        subs: [],
      };

      // 해당 main의 subs 생성
      const subsArray = new Array(9).fill(null);

      subsArray[0] = {
        goalId: idManager.generateSubId(uiMain.goalId, undefined, 0),
        originalId: getOriginalId(main.goalId),
        position: 0,
        content: main.content || "",
      };

      // subs를 position 기준 배치
      main.subs?.forEach((sub) => {
        const subTargetPosition = sub.position;
        if (subTargetPosition >= 1 && subTargetPosition <= 8) {
          subsArray[subTargetPosition] = {
            goalId: idManager.generateSubId(
              uiMain.goalId,
              sub.goalId,
              subTargetPosition
            ),
            originalId: getOriginalId(sub.goalId),
            position: subTargetPosition,
            content: sub.content || "",
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
        subs: [],
      };

      // 빈 subs 배열 생성
      const subsArray = new Array(9).fill(null).map((_, idx) => ({
        goalId: idManager.generateSubId(uiMain.goalId, undefined, idx),
        originalId: undefined, // 빈 데이터는 originalId 없음
        position: idx,
        content: "",
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

    serverData.core.mains.forEach((main) => {
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

// 서버에 만다라트 대시보드 생성 & 수정
export const uiToServer = (
  currentData: MandalaType<string>,
  changedCells: Set<string>,
  id?: number
) => {
  const result: {
    data: { core: Partial<ServerMandalaType["data"]["core"]> };
    mandalartId?: number;
  } = {
    data: { core: {} },
  };

  // Core 초기 처리 (originalId가 있고 content가 있는 경우)
  if (
    currentData.core.mains[0].originalId &&
    currentData.core.mains[0].content.trim() !== ""
  ) {
    result.data.core.content = currentData.core.mains[0].content;
    result.data.core.goalId = currentData.core.mains[0].originalId;
  }

  if (id !== undefined) {
    result.mandalartId = id;
  }

  // 변경된 셀들을 직접 순회하면서 처리
  const processedMains = new Map<number, any>(); // mainIndex -> mainObj
  const directlyChangedMains = new Set<number>(); // 직접 변경된 main들을 추적

  changedCells.forEach((cellId) => {
    if (cellId.startsWith("core")) {
      const core = currentData.core.mains[0];
      if (core.originalId) {
        result.data.core.goalId = core.originalId;
      }
      if (core.content && core.content.trim() !== "") {
        result.data.core.content = core.content;
      }
    } else if (cellId.startsWith("main")) {
      const mainIndex = currentData.core.mains.findIndex(
        (item) => item.goalId === cellId
      );
      if (mainIndex === -1) {
        console.log("main 인덱스 추출 실패: ", cellId);
        return;
      }

      const mainData = currentData.core.mains[mainIndex];
      directlyChangedMains.add(mainIndex); // 직접 변경된 main 추적

      let mainObj = processedMains.get(mainIndex);
      if (!mainObj) {
        mainObj = { subs: [] };
        processedMains.set(mainIndex, mainObj);
      }

      // Main이 직접 변경된 경우: 모든 정보 포함
      if (mainData.originalId) {
        mainObj.goalId = mainData.originalId;
      }
      if (mainData.position) {
        mainObj.position = mainData.position;
      }
      if (mainData.content && mainData.content.trim() !== "") {
        mainObj.content = mainData.content;
      }
    } else if (cellId.startsWith("sub")) {
      // sub-{mainIndex}-{subIndex} | sub-0-{subIndex} | sub-center-{mainIndex}
      let mainIndex;
      let subIndex;
      const parts = cellId.split("-");

      if (parts[1] === "0" || parts[1] === "center") {
        mainIndex = 0;
        subIndex = parseInt(parts[2]);
      } else {
        // parts[1]이 숫자인지 확인
        const parsedMainId = parseInt(parts[1]);

        if (!isNaN(parsedMainId)) {
          // 숫자라면 배열 인덱스가 아닌 goalId로 찾기
          mainIndex = currentData.core.mains.findIndex(
            (item) => item.goalId === `main-${parts[1]}`
          );
        } else {
          // 숫자가 아니라면 goalId로 찾기
          mainIndex = currentData.core.mains.findIndex(
            (item) => item.goalId === `main-${parts[1]}`
          );
        }

        if (mainIndex !== -1) {
          subIndex = currentData.core.mains[mainIndex].subs.findIndex(
            (item) => item.goalId === cellId
          );
        } else {
          subIndex = -1;
        }
      }

      if (mainIndex === -1) {
        console.log("sub: main 인덱스 추출 실패: ", cellId);
        return;
      }
      if (subIndex === -1) {
        console.log("sub: sub 인덱스 추출 실패: ", cellId);
        return;
      }

      const mainData = currentData.core.mains[mainIndex];
      const subData = mainData.subs[subIndex];

      let mainObj = processedMains.get(mainIndex);
      if (!mainObj) {
        mainObj = { subs: [] };
        processedMains.set(mainIndex, mainObj);
      }

      if (mainData.originalId) {
        mainObj.goalId = mainData.originalId;
      }

      if (mainData.position !== undefined) {
        mainObj.position = mainData.position;
      }

      if (mainData.content && mainData.content.trim() !== "") {
        mainObj.content = mainData.content;
      }

      if (subData.position === 0) {
        return;
      }

      // Sub 객체 생성
      const subObj: any = {};

      if (subData.originalId) {
        subObj.goalId = subData.originalId;
      }
      if (subData.position !== undefined && subData.content) {
        subObj.position = subData.position;
      }
      if (subData.content && subData.content.trim() !== "") {
        subObj.content = subData.content;
      }

      // 중복 제거 (같은 sub가 이미 추가되었는지 확인)
      const existingSubIndex = mainObj.subs.findIndex(
        (s: any) => s.position === subObj.position
      );

      if (existingSubIndex !== -1) {
        // 기존 sub 업데이트
        mainObj.subs[existingSubIndex] = {
          ...mainObj.subs[existingSubIndex],
          ...subObj,
        };
      } else {
        // 새로운 sub 추가
        mainObj.subs.push(subObj);
      }
    }
  });

  result.data.core.mains = Array.from(processedMains.values()).filter(
    (mainObj) => {
      return (
        mainObj.goalId ||
        mainObj.content ||
        (mainObj.subs && mainObj.subs.length > 0)
      );
    }
  );

  return result;
};
