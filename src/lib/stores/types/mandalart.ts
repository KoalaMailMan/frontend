export type Status = "DONE" | "UNDONE";
export type EditingContext = "main" | "full" | "sub" | null;
export type CancelReason = "blur" | "escape" | "enter";

export type MandalaType<T = string> = {
  core: {
    goalId: T;
    content: string;
    originalId?: number | undefined;
    status: Status;
    mains: MainGoal<T>[];
  };
};
export type MainGoal<T = string> = {
  goalId: T;
  originalId?: number | undefined; // 서버 원본 ID
  position: number;
  content: string;
  status: Status;
  subs: SubGoal<T>[];
};

export type SubGoal<T = string> = {
  goalId: T;
  originalId?: number | undefined; // 서버 원본 ID
  position: number;
  content: string;
  status: Status;
};

export type DataOption = {
  reminderEnabled: boolean;
  remindInterval: string;
  remindScheduledAt: string | null;
};
