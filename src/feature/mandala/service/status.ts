import type { MainGoal, Status } from "@/lib/stores/mandalaStore";

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
