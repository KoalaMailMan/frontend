import { useAuthStore } from "@/lib/stores/authStore";
import { getMandalaAPI } from "../api/getMandala";
import {
  useMandalaStore,
  type MainGoal,
  type MandalaType,
  type SubGoal,
} from "@/lib/stores/mandalaStore";

export const handleMandalaData = async () => {
  const accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) return;
  // const setWasLoggedIn = useAuthStore.getState().setWasLoggedIn;
  const mandalart = await getMandalaAPI(accessToken);
  useMandalaStore.getState().setData(mandalart);
};

// 조회 후 데이터가 없을 시 임시 데이터 생성
// 조회 후, 데이터 변환 필요
// 저장 전, 데이터 변환 필요

/**
 * 서버 데이터를 UI 데이터로 변환
 * core를 0번 main으로, 서버 mains는 그대로 1~8번
 * core의 subs도 추가 생성
 */
export const serverToUI = (serverData: MandalaType): UIMandalaData => {
  const uiMains: MainGoal[] = [];

  // 1단계: 0번 main (core) 생성
  const coreAsMain: MainGoal = {
    goalId: serverData.core.goalId || "main-0",
    position: 0,
    content: serverData.core.content,
    subs: [],
  };

  // core의 subs 생성: 서버의 8개 main들의 content + 중앙에 core
  for (let j = 0; j < 9; j++) {
    if (j === 0) {
      // 0번 위치에 core 자체
      coreAsMain.subs.push({
        goalId: serverData.core.goalId || "sub-0-0",
        position: 0,
        content: serverData.core.content,
      });
    } else {
      // 1~8번 위치에 server mains의 content
      const mainIndex = j - 1; // j=1→0, j=2→1, ..., j=8→7
      const serverMain = serverData.core.mains[mainIndex];

      coreAsMain.subs.push({
        goalId: serverMain?.goalId || `sub-0-${j}`,
        position: j,
        content: serverMain?.content || "",
      });
    }
  }

  uiMains[0] = coreAsMain;

  // 2단계: 1~8번 main들 생성 (서버의 mains를 기반으로)
  for (let i = 0; i < 8; i++) {
    const serverMain = serverData.core.mains[i];

    if (serverMain) {
      const uiMain: MainGoal = {
        goalId: serverMain.goalId || `main-${i + 1}`,
        position: i + 1, // UI에서는 1~8 position
        content: serverMain.content,
        subs: [],
      };

      // 각 main의 subs 생성: 서버 subs + 중앙에 main content
      for (let j = 0; j < 9; j++) {
        if (j === 0) {
          // 0번 위치에 main 자체
          uiMain.subs.push({
            goalId: serverMain.goalId || `sub-${i + 1}-0`,
            position: 0,
            content: serverMain.content,
          });
        } else {
          // 1~8번 위치에 server subs
          const subIndex = j - 1; // j=1→0, j=2→1, ..., j=8→7
          const serverSub = serverMain.subs[subIndex];

          uiMain.subs.push({
            goalId: serverSub?.goalId || `sub-${i + 1}-${j}`,
            position: j,
            content: serverSub?.content || "",
          });
        }
      }

      uiMains[i + 1] = uiMain;
    } else {
      // 서버에 데이터가 없으면 빈 main 생성
      uiMains[i + 1] = {
        goalId: `main-${i + 1}`,
        position: i + 1,
        content: "",
        subs: Array.from({ length: 9 }, (_, j) => ({
          goalId: `sub-${i + 1}-${j}`,
          position: j,
          content: "",
        })),
      };
    }
  }

  return {
    core: {
      mains: uiMains,
    },
  };
};
