import { useMemo, useState } from "react";

import { ExecutionDrawer } from "@/components/ExecutionDrawer";
import { ExecutionFilters } from "@/components/ExecutionFilters";
import { ExecutionsTable } from "@/components/ExecutionsTable";
import { useExecutions } from "@/hooks/useExecutions";
import type { ExecutionStatus, WorkflowExecution } from "@/types/api";

export function WorkflowRuns() {
  const [filter, setFilter] = useState<ExecutionStatus | "">("");
  const [selected, setSelected] = useState<WorkflowExecution | null>(null);

  // Always fetch all executions so we can compute tab counts regardless of the filter.
  const allQuery = useExecutions({ limit: 200 });

  const all = allQuery.data ?? [];

  const counts = useMemo(() => {
    return {
      all: all.length,
      success: all.filter((e) => e.status === "success").length,
      failed: all.filter((e) => e.status === "failed").length,
      running: all.filter((e) => e.status === "running").length,
    };
  }, [all]);

  const filtered = useMemo(() => {
    if (!filter) return all;
    return all.filter((e) => e.status === filter);
  }, [all, filter]);

  return (
    <div className="p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <ExecutionFilters
          value={filter}
          onChange={setFilter}
          counts={counts}
        />
      </div>

      <div className="rounded-lg border border-bg-border bg-bg-surface">
        {allQuery.isLoading && (
          <div className="px-5 py-10 text-center text-sm text-text-secondary">
            Loading executions…
          </div>
        )}

        {allQuery.isError && (
          <div className="px-5 py-10 text-center text-sm text-status-danger">
            Failed to load executions: {(allQuery.error as Error).message}
          </div>
        )}

        {allQuery.data && (
          <ExecutionsTable executions={filtered} onSelect={setSelected} />
        )}
      </div>

      <ExecutionDrawer
        execution={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}