import type { WorkflowExecution } from "@/types/api";
import { formatDuration, formatRelative } from "@/utils/format";
import { StatusBadge } from "./StatusBadge";

interface ExecutionsTableProps {
  executions: WorkflowExecution[];
  onSelect: (execution: WorkflowExecution) => void;
}

function executionStatusVariant(status: string) {
  switch (status) {
    case "success":
      return "success" as const;
    case "failed":
      return "danger" as const;
    case "running":
      return "info" as const;
    default:
      return "muted" as const;
  }
}

export function ExecutionsTable({
  executions,
  onSelect,
}: ExecutionsTableProps) {
  if (executions.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-sm text-text-muted">
        No executions match this filter.
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-bg-border text-left text-xs uppercase tracking-wide text-text-muted">
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
            className="cursor-pointer border-b border-bg-border/50 text-sm transition-colors last:border-0 hover:bg-bg-elevated"
          >
            <td className="px-5 py-3">
              <div className="font-medium text-text-primary">
                {exec.workflow_name}
              </div>
              <div className="font-mono text-[11px] text-text-muted">
                {exec.id.slice(0, 8)}
              </div>
            </td>
            <td className="px-5 py-3 text-text-secondary">
              {exec.stage ?? "—"}
            </td>
            <td className="px-5 py-3 text-text-secondary">
              {formatRelative(exec.started_at)}
            </td>
            <td className="px-5 py-3 font-mono text-xs text-text-secondary">
              {formatDuration(exec.started_at, exec.finished_at)}
            </td>
            <td className="px-5 py-3">
              <StatusBadge variant={executionStatusVariant(exec.status)}>
                {exec.status}
              </StatusBadge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}