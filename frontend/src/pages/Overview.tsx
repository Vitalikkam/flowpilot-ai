import {
  Activity,
  CheckCircle2,
  Flame,
  Users,
} from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useExecutions } from "@/hooks/useExecutions";
import { useLeads } from "@/hooks/useLeads";
import { formatDuration, formatPercent, formatRelative } from "@/utils/format";

export function Overview() {
  const leads = useLeads({ limit: 200 });
  const executions = useExecutions({ limit: 50 });

  const allLeads = leads.data ?? [];
  const totalLeads = allLeads.length;
  const qualified = allLeads.filter((l) => l.status === "qualified").length;
  const highPriority = allLeads.filter((l) => l.priority === "high").length;

  const allExecs = executions.data ?? [];
  const finished = allExecs.filter(
    (e) => e.status === "success" || e.status === "failed",
  );
  const successes = finished.filter((e) => e.status === "success").length;
  const successRate = finished.length === 0 ? 0 : successes / finished.length;
  const recentExecs = allExecs.slice(0, 5);

  const loading = leads.isLoading || executions.isLoading;
  const error = leads.isError || executions.isError;

  return (
    <div className="p-6">
      {error && (
        <div className="mb-6">
          <ErrorState message="Failed to load dashboard data. Is the backend running?" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Leads"
          value={loading ? "—" : totalLeads}
          icon={Users}
          accent="blue"
        />
        <MetricCard
          label="Qualified"
          value={loading ? "—" : qualified}
          icon={CheckCircle2}
          accent="success"
        />
        <MetricCard
          label="High Priority"
          value={loading ? "—" : highPriority}
          icon={Flame}
          accent="violet"
        />
        <MetricCard
          label="Success Rate"
          value={loading ? "—" : formatPercent(successRate)}
          hint={
            finished.length
              ? `${successes}/${finished.length} runs`
              : "no runs yet"
          }
          icon={Activity}
          accent="cyan"
        />
      </div>

      <div className="mt-8 rounded-lg border border-bg-border bg-bg-surface">
        <div className="flex items-center justify-between border-b border-bg-border px-5 py-4">
          <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">
            Recent Executions
          </h2>
        </div>

        {executions.isLoading && (
          <LoadingState message="Loading executions…" />
        )}

        {!executions.isLoading && recentExecs.length === 0 && (
          <EmptyState
            icon={Activity}
            title="No executions yet"
            description="Send a lead to the webhook to see activity here."
          />
        )}

        {recentExecs.length > 0 && (
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
              {recentExecs.map((exec) => (
                <tr
                  key={exec.id}
                  className="border-b border-bg-border/50 text-sm last:border-0"
                >
                  <td className="px-5 py-3 text-text-primary">
                    {exec.workflow_name}
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
                    <ExecutionStatusBadge status={exec.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function ExecutionStatusBadge({ status }: { status: string }) {
  if (status === "success")
    return <StatusBadge variant="success">success</StatusBadge>;
  if (status === "failed")
    return <StatusBadge variant="danger">failed</StatusBadge>;
  if (status === "running")
    return <StatusBadge variant="info">running</StatusBadge>;
  return <StatusBadge variant="muted">{status}</StatusBadge>;
}