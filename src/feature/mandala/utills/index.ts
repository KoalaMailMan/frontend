import type { MainGoal } from "@/lib/stores/mandalaStore";
import { IntervalType } from "../const";

export const findKeyByValue = (type: string) => {
  for (const [key, value] of Object.entries(IntervalType)) {
    if (value === type) return key;
  }
  return null;
};

export const moveItem = <T>(arr: T[], from: number, to: number): T[] => {
  const newArr = [...arr];
  const [moved] = newArr.splice(from, 1);

  newArr.splice(to, 0, moved);
  return newArr;
};

export const findIdIndex = (data: MainGoal[], targetId: string) => {
  for (let i = 0; i < data.length; i++) {
    const main = data[i];

    if (main.goalId === targetId) {
      return { mainIndex: i, subIndex: null };
    }

    const subIndex = main.subs.findIndex((sub) => sub.goalId === targetId);
    if (subIndex !== -1) {
      return { mainIndex: i, subIndex };
    }
  }
  return { mainIndex: -1, subIndex: -1 };
};
