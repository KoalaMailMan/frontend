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
