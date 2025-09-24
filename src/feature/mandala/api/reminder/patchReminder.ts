import { apiClient } from "@/lib/api/client";

export type ReminderType = {
  data: {
    mandalartId: number;
    reminderEnabled: boolean;
  };
};

export const patchReminderAPI = async (
  accessToken: string,
  reminderOptions: ReminderType
) => {
  const MANDALA_URL = "/api/reminder";
  try {
    const res = await apiClient.patch(MANDALA_URL, reminderOptions, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    return res;
  } catch (error) {
    console.error("getMandalaAPI failed:", error);
  }
};
