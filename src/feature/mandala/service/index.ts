import { useAuthStore } from "@/lib/stores/authStore";
import { getMandalaAPI } from "../api/mandalart/getMandala";
import {
  useMandalaStore,
  type DataOption,
  type MainGoal,
  type MandalaType,
} from "@/lib/stores/mandalaStore";
import { apiClient } from "@/lib/api/client";
import { updateMandalaAPI } from "../api/mandalart/updateMandala";

export const handleMandalaData = async () => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) return;
  const interceptorId = await withNoContentInterceptor();
  try {
    const mandalart: ServerMandalaType = await getMandalaAPI(accessToken);
    useMandalaStore.getState().setData(mandalart.data);
    if (
      mandalart.data.mandalartId !== undefined &&
      mandalart.data.reminderOption !== undefined
    ) {
      useMandalaStore.getState().setMandalartId(mandalart.data.mandalartId);
      const reminderOptions = mandalart.data.reminderOption;
      if (
        reminderOptions.reminderEnabled &&
        reminderOptions.remindScheduledAt
      ) {
        useMandalaStore
          .getState()
          .setReminderOption(mandalart.data.reminderOption);
        useMandalaStore.getState().setReminderSetting(true);
      } else {
        useMandalaStore.getState().setReminderSetting(false);
      }
    }
  } finally {
    apiClient.removeResponseInterceptor(interceptorId);
  }
};

export const handleUpdateMandala = async (
  data: MandalaType,
  changedCells: Set<string>,
  callback?: () => void
) => {
  const accessToken = useAuthStore.getState().accessToken;
  const mandalartId = useMandalaStore.getState().mandalartId;
  if (!accessToken && !mandalartId) return;
  if (accessToken) {
    // 인증 성공
    try {
      const mandalaData = uiToServer(data, changedCells);
      const newData = {
        data: {
          mandalartId,
          ...mandalaData.data,
        },
      };
      const mandalartRes = await updateMandalaAPI(accessToken, newData);
      if (callback !== undefined) {
        callback();
      }
      if (mandalartRes?.message) alert(mandalartRes.message);
      else alert("만다라트 생성 성공.");

      return mandalartRes;
    } catch (error: any) {
      console.error(error);

      if (error.status === 401) {
        console.log("토큰 만료, 갱신 후 재시도...");
        // 토큰 갱신 로직 추가
      }
      alert(`저장 실패: ${error.message}`);
    }
  }
};

// 조회 후 데이터가 없을 시 임시 데이터 생성
// 조회 후, 데이터 변환 필요
// 저장 전, 데이터 변환 필요

export const withNoContentInterceptor = async () => {
  const interceptorId = apiClient.addResponseInterceptor({
    onSuccess: async (res: Response) => {
      if (res.status === 204) {
        useMandalaStore.getState().setEmptyState(true);
        const emptyData = {
          mandalartId: 0,
          ...emptyDummyData.data,
        };
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
        goalId: i + 1,
        position: i + 1,
        content: "",
        subs: Array.from({ length: 8 }, (_, j) => ({
          goalId: j + 1,
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
  // 1단계: 0번 main (core) 생성
  const coreAsMain: MainGoal = {
    goalId: `core-${serverData.core?.goalId}`,
    originalId: serverData.core?.goalId,
    position: 0,
    content: serverData.core?.content || "",
    subs: [],
  };

  // core의 subs 생성
  for (let j = 0; j < 9; j++) {
    if (j === 0) {
      coreAsMain.subs.push({
        goalId: `sub-${serverData.core.goalId}-${serverData.core.goalId}`,
        originalId: serverData.core.goalId,
        position: 0,
        content: serverData.core.content || "",
      });
    } else {
      const mainIndex = j - 1;
      const serverMain = serverData.core.mains?.[mainIndex];

      coreAsMain.subs.push({
        goalId: serverMain
          ? `sub-${serverData.core.goalId}-${serverMain.goalId}`
          : `sub-${serverData.core.goalId}-${j}`,
        originalId: serverMain?.goalId,
        position: j,
        content: serverMain?.content || "",
      });
    }
  }

  uiMains[0] = coreAsMain;

  // 2단계: 1~8번 main들 생성
  for (let i = 0; i < 8; i++) {
    const serverMain = serverData.core.mains[i];

    const uiMain: MainGoal = {
      goalId: serverMain ? `main-${serverMain.goalId}` : `main-${i + 1}`,
      originalId: serverMain?.goalId,
      position: i + 1,
      content: serverMain?.content || "",
      subs: [],
    };
    const mainId = uiMain.goalId.split("-")[1];
    for (let j = 0; j < 9; j++) {
      if (j === 0) {
        uiMain.subs.push({
          goalId: serverMain
            ? `sub-${serverMain.goalId}-${serverMain.goalId}`
            : `sub-${mainId}-${i + 1}`,
          originalId: serverMain?.goalId,
          position: 0,
          content: serverMain?.content || "",
        });
      } else {
        const matchingSub = serverMain?.subs?.find(
          (sub) => sub.position === j - 1
        );

        uiMain.subs.push({
          goalId: matchingSub
            ? `sub-${serverMain.goalId}-${matchingSub.goalId}`
            : `sub-${mainId}-${j}`,
          originalId: matchingSub?.goalId,
          position: j,
          content: matchingSub?.content || "",
        });
      }
    }

    uiMains[i + 1] = uiMain;
  }

  return {
    core: {
      goalId: coreAsMain.goalId,
      content: coreAsMain.content,
      mains: uiMains,
    },
  };
};

// 생성할 때
export const uiToServer = (
  currentData: MandalaType<string>,
  changedCells: Set<string>
) => {
  const result: { data: { core: Partial<ServerMandalaType["data"]["core"]> } } =
    {
      data: { core: {} },
    };

  // 변경된 셀들을 직접 순회하면서 처리
  const processedMains = new Map<number, any>(); // mainIndex -> mainObj

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
      if (mainIndex === -1) return console.log("인덱스 추출 실패, ", cellId);
      const mainData = currentData.core.mains[mainIndex];

      let mainObj = processedMains.get(mainIndex);
      if (!mainObj) {
        mainObj = {};
        processedMains.set(mainIndex, mainObj);
      }

      if (mainData.originalId) {
        mainObj.goalId = mainData.originalId;
      }

      if (mainData.position !== undefined && mainData.position > 0) {
        mainObj.position = mainData.position;
      }

      if (mainData.content && mainData.content.trim() !== "") {
        mainObj.content = mainData.content;
      }
    } else if (cellId.startsWith("sub")) {
      // sub-{mainIndex}-{subIndex} | sub-0-{subIndex} |  sub-center-{mainIndex}
      let mainIndex;
      let subIndex;
      const parts = cellId.split("-");
      if (parts[1] === "0") {
        mainIndex = 0;
        subIndex = parseInt(parts[2]);
      } else if (parts[1] === "center") {
        mainIndex = 0;
        subIndex = parseInt(parts[2]);
      } else {
        mainIndex = parseInt(parts[1]);
        subIndex = parseInt(parts[2]);
        if (currentData.core.mains[mainIndex] === undefined) {
          mainIndex = currentData.core.mains.findIndex(
            (item) => item.goalId === `main-${parts[1]}`
          );
          subIndex = currentData.core.mains[mainIndex].subs.findIndex(
            (item) => item.goalId === `sub-${parts[1]}-${parts[2]}`
          );
        }
      }

      if (mainIndex === -1)
        return console.log("sub: main 인덱스 추출 실패, ", cellId);

      if (subIndex === -1)
        return console.log("sub: sub 인덱스 추출 실패, ", cellId);

      const mainData = currentData.core.mains[mainIndex];
      const subData = mainData.subs[subIndex];

      let mainObj = processedMains.get(mainIndex);
      if (!mainObj) {
        mainObj = {};
        processedMains.set(mainIndex, mainObj);

        // Main의 기본 정보 설정
        if (mainData.originalId) {
          mainObj.goalId = mainData.originalId;
        }
        if (mainData.position !== undefined) {
          mainObj.position = mainData.position;
        }
      }

      // Subs 배열 초기화
      if (!mainObj.subs) {
        mainObj.subs = [];
      }

      // Sub 객체 생성
      const subObj: any = {};

      if (subData.originalId) {
        subObj.goalId = subData.originalId;
      }

      if (subData.position !== undefined) {
        subObj.position = subData.position;
      }

      if (subData.content) {
        subObj.content = subData.content;
      }

      // 중복 제거 (같은 sub가 이미 추가되었는지 확인)
      const existingSubIndex = mainObj.subs.findIndex(
        (s: any) => s.goalId === subObj.goalId || s.position === subObj.position
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

  // // 처리된 mains를 결과에 추가
  result.data.core.mains = Array.from(processedMains.values()).filter(
    (mainObj) => {
      // 유효한 데이터가 있는 main만 포함
      return (
        mainObj.content ||
        mainObj.originalId ||
        (mainObj.subs && mainObj.subs.length > 0)
      );
    }
  );
  return result;
};
