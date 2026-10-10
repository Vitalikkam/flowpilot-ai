import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Loader2,
} from "lucide-react";

import type { WorkflowExecution } from "@/types/api";
import { formatDuration, formatRelative } from "@/utils/format";
import { StatusBadge } from "./StatusBadge";

interface ExecutionsTableProps {
  executions: WorkflowExecution[];
  onSelect: (execution: WorkflowExecution) => void;
}

function StatusIcon({ status }: { status: string }) {
  if (status === "success")
    return <CheckCircle2 className="h-3.5 w-3.5 text-status-success" />;
  if (status === "failed")
    return <AlertCircle className="h-3.5 w-3.5 text-status-danger" />;
  if (status === "running")
    return <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-blue" />;
  return <CircleDot className="h-3.5 w-3.5 text-text-muted" />;
}

function statusVariant(status: string) {
  if (status === "success") return "success" as const;
  if (status === "failed") return "danger" as const;
  if (status === "running") return "info" as const;
  return "muted" as const;
}

export function ExecutionsTable({
  executions,
  onSelect,
}: ExecutionsTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-bg-border text-left text-[11px] uppercase tracking-wide text-text-muted">
          <th className="px-5 py-3 font-medium">Workflow</th>
          <th className="px-5 py-3 font-medium">Stage</th>
          <th className="px-5 py-3 font-medium">Started</th>
          <th className="px-5 py-3 font-medium">Duration</th>
          <th className="px-5 py-3 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {executions.map((exec) => (
          <tr
            key={exec.id}
            onClick={() => onSelect(exec)}
            className="cursor-pointer border-b border-bg-border/40 text-sm transition-colors last:border-0 hover:bg-bg-elevated"
          >
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-bg-border bg-bg-base">
                  <StatusIcon status={exec.status} />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium text-text-primary">
                    {exec.workflow_name}
                  </div>
                  <div className="truncate font-mono text-[11px] text-text-muted">
                    {exec.id.slice(0, 8)}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-5 py-3">
              {exec.stage ? (
                <span className="inline-flex items-center rounded-md border border-bg-border bg-bg-base px-2 py-0.5 font-mono text-[11px] text-text-secondary">
                  {exec.stage}
                </span>
              ) : (
                <span className="text-xs text-text-muted">—</span>
              )}
            </td>
            <td className="px-5 py-3 text-text-secondary">
              {formatRelative(exec.started_at)}
            </td>
            <td className="px-5 py-3 font-mono text-xs text-text-secondary">
              {formatDuration(exec.started_at, exec.finished_at)}
            </td>
            <td className="px-5 py-3">
              <StatusBadge variant={statusVariant(exec.status)}>
                {exec.status}
              </StatusBadge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}