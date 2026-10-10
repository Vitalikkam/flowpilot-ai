import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api";
import type { LeadListParams } from "@/types/api";

export function useLeads(params: LeadListParams = {}) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: () => api.listLeads(params),
  });
}