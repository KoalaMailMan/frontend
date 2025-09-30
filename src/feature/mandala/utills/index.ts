import { IntervalType } from "../const";

export const findKeyByValue = (type: string) => {
  for (const [key, value] of Object.entries(IntervalType)) {
    if (value === type) return key;
  }
  return null;
};
