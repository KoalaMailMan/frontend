import type { ServerMandalaType } from "./type";

export const createMandalaIdManager = (
  serverData: ServerMandalaType["data"]
) => {
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
