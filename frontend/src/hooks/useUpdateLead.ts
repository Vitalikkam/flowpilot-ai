import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/services/api";
import type { Lead } from "@/types/api";

interface UpdateLeadInput {
  id: string;
  payload: { status?: string; priority?: string };
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation<Lead, Error, UpdateLeadInput>({
    mutationFn: ({ id, payload }) => api.updateLead(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", updated.id] });
    },
  });
}