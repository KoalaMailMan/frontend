import { queryClient } from "@/lib/utils";

export const cleanQuery = (queryKey?: string | string[]) => {
  if (typeof queryKey === "string") {
    return queryClient.removeQueries({ queryKey: [queryKey] });
  }
  if (Array.isArray(queryKey)) {
    return queryClient.removeQueries({ queryKey });
  }

  return queryClient.clear();
};
