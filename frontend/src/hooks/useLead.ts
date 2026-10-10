import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api";

export function useLead(id: string | null) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => api.getLead(id as string),
    enabled: !!id,
  });
}

export function useLeadAnalysis(id: string | null) {
  return useQuery({
    queryKey: ["lead-analysis", id],
    queryFn: () => api.getLeadAnalysis(id as string),
    enabled: !!id,
    retry: false, // 404 when analysis doesn't exist — don't retry
  });
}