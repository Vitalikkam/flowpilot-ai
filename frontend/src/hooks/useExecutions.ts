import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api";
import type { ExecutionListParams } from "@/types/api";

export function useExecutions(params: ExecutionListParams = {}) {
  return useQuery({
    queryKey: ["executions", params],
    queryFn: () => api.listExecutions(params),
  });
}