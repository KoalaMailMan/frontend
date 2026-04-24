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

// export const handleMandalaData = async () => {
//   const accessToken = useAuthStore.getState().accessToken;
//   if (!accessToken) return;
//   try {
//     const mandalart: ServerMandalaType = await getMandalaAPI();
//     if (mandalart) {
//       if (
//         mandalart.data &&
//         mandalart.data.mandalartId !== undefined &&
//         mandalart.data.reminderOption !== undefined
//       ) {
//         useMandalaStore.getState().setData(mandalart.data);
//         useMandalaStore.getState().setMandalartId(mandalart.data.mandalartId);
//         const reminderOptions = mandalart.data.reminderOption;
//         if (reminderOptions.reminderEnabled) {
//           useMandalaStore
//             .getState()
//             .setReminderOption(mandalart.data.reminderOption);
//         }
//       }
//     } else {
//       useMandalaStore.getState().setEmptyState(true);
//     }
//   } finally {
//   }
// };

// export const handleUpdateMandala = async (
//   data: MandalaType,
//   changedCells: Set<string>,
//   callback?: () => void
// ) => {
//   const accessToken = useAuthStore.getState().accessToken;
//   const mandalartId = useMandalaStore.getState().mandalartId;
//   const resetChangedCells = useMandalaStore.getState().resetChangedCells;
//   if (accessToken) {
//     // 인증 성공
//     try {
//       if (callback !== undefined) {
//         callback();
//       }

//       if (mandalartId != null) {
//         const mandalaData: ServerMandalaType = uiToServer(
//           data,
//           changedCells,
//           mandalartId
//         );
//         const mandalartRes: ServerMandalaType = await createMandalaAPI(
//           mandalaData
//         );
//         resetChangedCells();
//         return mandalartRes;
//       } else {
//         const mandalaData = uiToServer(data, changedCells);
//         const mandalartRes = await createMandalaAPI(mandalaData);
//         resetChangedCells();
//         return mandalartRes;
//       }
//     } catch (error: any) {
//       console.error(error);
//       toast.warning("만다라트 저장에 실패했습니다. 다시 시도해주세요.");
//     }
//   }
// };

// export const withNoContentInterceptor = async () => {
//   const interceptorId = apiClient.addResponseInterceptor({
//     onSuccess: async (res: Response) => {
//       if (res.status === 204) {
//         useMandalaStore.getState().setEmptyState(true);
//         return emptyDummyData;
//       }
//       const contentLength = res.headers.get("content-length");
//       if (contentLength === "0") {
//         useMandalaStore.getState().setEmptyState(true);
//         return emptyDummyData;
//       }
//       try {
//         useMandalaStore.getState().setEmptyState(false);
//         return await res.json();
//       } catch (error) {
//         useMandalaStore.getState().setEmptyState(true);
//         console.error("JSON parsing failed:", error);
//         throw new Error("Invalid JSON response");
//       }
//     },
//   });
//   return interceptorId;
// };

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

const USE_FLAT_STRUCTURE = false;

export const serverToUI = (serverData: ServerMandalaType["data"]) => {
  if (USE_FLAT_STRUCTURE) {
    return toFlatStructure(serverData.core); // 신버전
  }
  return toLegacyStructure(serverData); // 기존 로직 그대로
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

  // if (id != null) {
  //   result.data.mandalartId = id;
  // }
  // // Core 초기 처리 (originalId가 있고 content가 있는 경우)
  // if (currentData.core.mains[0].originalId) {
  //   result.data.core.goalId = currentData.core.mains[0].originalId;
  // }
  // if (currentData.core.mains[0].content.trim() !== "") {
  //   result.data.core.content = currentData.core.mains[0].content;
  // }
  // result.data.core.status = currentData.core.mains[0].status;

  // // 변경된 셀들을 직접 순회하면서 처리
  // const processedMains = new Map<number, any>(); // mainIndex -> mainObj
  // const directlyChangedMains = new Set<number>(); // 직접 변경된 main들을 추적

  // changedCells.forEach((cellId) => {
  //   if (cellId.startsWith("core")) {
  //     const core = currentData.core.mains[0];
  //     result.data.core.status = core.status;
  //     if (core.originalId) {
  //       result.data.core.goalId = core.originalId;
  //     }
  //     // if (core.content && core.content.trim() !== "") {
  //     result.data.core.content = core.content;
  //     // }
  //   } else if (cellId.startsWith("main")) {
  //     const mainIndex = currentData.core.mains.findIndex(
  //       (item) => item.goalId === cellId
  //     );
  //     if (mainIndex === -1) {
  //       console.log("main 인덱스 추출 실패: ", cellId);
  //       return;
  //     }

  //     const mainData = currentData.core.mains[mainIndex];
  //     directlyChangedMains.add(mainIndex); // 직접 변경된 main 추적

  //     let mainObj = processedMains.get(mainIndex);
  //     if (!mainObj) {
  //       mainObj = { subs: [] };
  //       processedMains.set(mainIndex, mainObj);
  //     }

  //     // Main이 직접 변경된 경우: 모든 정보 포함
  //     if (mainData.originalId) {
  //       mainObj.goalId = mainData.originalId;
  //     }
  //     if (mainData.position) {
  //       mainObj.position = mainData.position;
  //     }
  //     // if (mainData.content && mainData.content.trim() !== "") {
  //     mainObj.content = mainData.content;
  //     // }
  //     mainObj.status = mainData.status;
  //   } else if (cellId.startsWith("sub")) {
  //     // sub-{mainIndex}-{subIndex} | sub-0-{subIndex} | sub-center-{mainIndex}
  //     let mainIndex;
  //     let subIndex;
  //     const parts = cellId.split("-");

  //     if (parts[1] === "0" || parts[1] === "center") {
  //       mainIndex = 0;
  //       subIndex = parseInt(parts[2]);
  //     } else {
  //       // parts[1]이 숫자인지 확인
  //       const parsedMainId = parseInt(parts[1]);

  //       if (!isNaN(parsedMainId)) {
  //         // 숫자라면 배열 인덱스가 아닌 goalId로 찾기
  //         mainIndex = currentData.core.mains.findIndex(
  //           (item) => item.goalId === `main-${parts[1]}`
  //         );
  //       } else {
  //         // 숫자가 아니라면 goalId로 찾기
  //         mainIndex = currentData.core.mains.findIndex(
  //           (item) => item.goalId === `main-${parts[1]}`
  //         );
  //       }

  //       if (mainIndex !== -1) {
  //         subIndex = currentData.core.mains[mainIndex].subs.findIndex(
  //           (item) => item.goalId === cellId
  //         );
  //       } else {
  //         subIndex = -1;
  //       }
  //     }

  //     if (mainIndex === -1) {
  //       console.log("sub: main 인덱스 추출 실패: ", cellId);
  //       return;
  //     }
  //     if (subIndex === -1) {
  //       console.log("sub: sub 인덱스 추출 실패: ", cellId);
  //       return;
  //     }

  //     const mainData = currentData.core.mains[mainIndex];
  //     const subData = mainData.subs[subIndex];

  //     let mainObj = processedMains.get(mainIndex);
  //     if (!mainObj) {
  //       mainObj = { subs: [] };
  //       processedMains.set(mainIndex, mainObj);
  //     }

  //     if (mainData.originalId) {
  //       mainObj.goalId = mainData.originalId;
  //     }

  //     if (mainData.position !== undefined) {
  //       mainObj.position = mainData.position;
  //     }

  //     // if (mainData.content && mainData.content.trim() !== "") {
  //     mainObj.content = mainData.content;
  //     // }

  //     mainObj.status = mainData.status;

  //     if (subData.position === 0) {
  //       return;
  //     }

  //     // Sub 객체 생성
  //     const subObj: any = {};

  //     if (subData.originalId) {
  //       subObj.goalId = subData.originalId;
  //     }
  //     // if (subData.position !== undefined && subData.content) {
  //     subObj.position = subData.position;
  //     // }
  //     if (subData.content && subData.content.trim() !== "") {
  //       subObj.content = subData.content;
  //     }
  //     subObj.status = subData.status;

  //     // 중복 제거 (같은 sub가 이미 추가되었는지 확인)
  //     const existingSubIndex = mainObj.subs.findIndex(
  //       (s: any) => s.position === subObj.position
  //     );

  //     if (existingSubIndex !== -1) {
  //       // 기존 sub 업데이트
  //       mainObj.subs[existingSubIndex] = {
  //         ...mainObj.subs[existingSubIndex],
  //         ...subObj,
  //       };
  //     } else {
  //       // 새로운 sub 추가
  //       mainObj.subs.push(subObj);
  //     }
  //   }
  // });

  // // 기존에 저장된 모든 데이터 추가 (originalId가 있는 것들)
  // currentData.core.mains.forEach((mainData, idx) => {
  //   // idx 0은 core이므로 스킵
  //   if (idx === 0) return;

  //   // originalId가 있으면 기존 저장된 데이터
  //   if (mainData.originalId) {
  //     let mainObj = processedMains.get(idx);

  //     if (!mainObj) {
  //       // 아직 처리되지 않은 기존 데이터라면 새로 추가
  //       mainObj = { subs: [] };
  //       processedMains.set(idx, mainObj);
  //     }

  //     // 기존 데이터: goalId, position, content 모두 포함
  //     mainObj.goalId = mainData.originalId;
  //     mainObj.position = mainData.position;
  //     mainObj.status = mainData.status;
  //     // if (mainData.content && mainData.content.trim() !== "") {
  //     mainObj.content = mainData.content;
  //     // }

  //     // 해당 main의 모든 기존 subs도 포함 (position 0 제외)
  //     mainData.subs.forEach((subData) => {
  //       // position 0인 sub는 제외 (main의 중복)
  //       if (subData.position === 0) {
  //         return;
  //       }

  //       if (subData.originalId) {
  //         const existingSubIndex = mainObj.subs.findIndex(
  //           (s: any) => s.position === subData.position
  //         );

  //         const subObj: any = {
  //           goalId: subData.originalId,
  //           position: subData.position,
  //           status: subData.status,
  //         };

  //         // if (subData.content && subData.content.trim() !== "") {
  //         subObj.content = subData.content;
  //         // }

  //         if (existingSubIndex !== -1) {
  //           // 이미 처리된 sub라면 병합 (변경된 데이터 우선)
  //           mainObj.subs[existingSubIndex] = {
  //             ...subObj,
  //             ...mainObj.subs[existingSubIndex],
  //           };
  //         } else {
  //           // 새로 추가
  //           mainObj.subs.push(subObj);
  //         }
  //       }
  //     });
  //   }
  // });

  // // 처리된 mains를 결과에 추가
  // result.data.core.mains = Array.from(processedMains.values()).filter(
  //   (mainObj) => {
  //     // 유효한 데이터가 있는 main만 포함
  //     return (
  //       mainObj.goalId ||
  //       mainObj.content ||
  //       (mainObj.subs && mainObj.subs.length > 0)
  //     );
  //   }
  // );

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
