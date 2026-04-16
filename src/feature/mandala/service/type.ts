import type { DataOption, Status } from "@/lib/stores/mandalaStore";

// 서버 데이터용 타입
export type ServerMandalaType = {
  data: {
    core: {
      goalId?: number;
      content?: string;
      status?: "DONE" | "UNDONE";
      mains?: ServerMainGoal[];
    };
    mandalartId?: number | undefined;
    reminderOption?: DataOption;
  };
};

export type ServerMainGoal = {
  goalId?: number;
  position: number;
  content?: string;
  status?: "DONE" | "UNDONE";
  subs: ServerSubGoal[];
};

export type ServerSubGoal = {
  goalId?: number;
  position: number;
  content: string;
  status: "DONE" | "UNDONE";
};

type ServerMandalaData = Omit<ServerMandalaType["data"], "reminderOption">;

export type ServerMandalaTypeWithoutReminder = {
  data: ServerMandalaData;
};

export type CellData = {
  goalId: string;
  content: string;
  position?: number;
  status: Status;
  originalId?: number | undefined;
  subs?: Omit<CellData, "subs">;
};

export type MandalaMap = Record<string, CellData>;

export type MandalaLayout = {
  core: string;
  mains: string[];
  subs: Record<string, string[]>;
  grid: string[][];
};

export type MandalaFlatType = {
  layout: MandalaLayout;
  cells: MandalaMap;
};
