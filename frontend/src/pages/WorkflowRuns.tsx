import { useMemo, useState } from "react";
import { Workflow } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { ExecutionDrawer } from "@/components/ExecutionDrawer";
import { ExecutionFilters } from "@/components/ExecutionFilters";
import { ExecutionsTable } from "@/components/ExecutionsTable";
import { LoadingState } from "@/components/LoadingState";
import { useExecutions } from "@/hooks/useExecutions";
import type { ExecutionStatus, WorkflowExecution } from "@/types/api";

export function WorkflowRuns() {
  const [filter, setFilter] = useState<ExecutionStatus | "">("");
  const [selected, setSelected] = useState<WorkflowExecution | null>(null);

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
        <ExecutionFilters value={filter} onChange={setFilter} counts={counts} />
      </div>

      <div className="rounded-lg border border-bg-border bg-bg-surface">
        {allQuery.isLoading && <LoadingState message="Loading executions…" />}

        {allQuery.isError && (
          <div className="p-5">
            <ErrorState message={(allQuery.error as Error).message} />
          </div>
        )}

        {allQuery.data && filtered.length === 0 && (
          <EmptyState
            icon={Workflow}
            title="No executions match this filter"
            description="Try a different tab, or trigger a workflow run."
          />
        )}

        {allQuery.data && filtered.length > 0 && (
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