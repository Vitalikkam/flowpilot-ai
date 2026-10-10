import { useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  X,
} from "lucide-react";

import { useLead } from "@/hooks/useLead";
import type { WorkflowExecution } from "@/types/api";
import { formatDuration, formatRelative } from "@/utils/format";
import { StatusBadge } from "./StatusBadge";

interface ExecutionDrawerProps {
  execution: WorkflowExecution | null;
  onClose: () => void;
}

function statusIcon(status: string) {
  if (status === "success")
    return <CheckCircle2 className="h-4 w-4 text-status-success" />;
  if (status === "failed")
    return <AlertCircle className="h-4 w-4 text-status-danger" />;
  if (status === "running")
    return <Loader2 className="h-4 w-4 animate-spin text-accent-blue" />;
  return <Clock className="h-4 w-4 text-text-muted" />;
}

function statusVariant(status: string) {
  if (status === "success") return "success" as const;
  if (status === "failed") return "danger" as const;
  if (status === "running") return "info" as const;
  return "muted" as const;
}

export function ExecutionDrawer({ execution, onClose }: ExecutionDrawerProps) {
  const open = !!execution;
  const leadQuery = useLead(execution?.lead_id ?? null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  const exec = execution!;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative ml-auto flex h-full w-full max-w-lg flex-col border-l border-bg-border bg-bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-bg-border px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {statusIcon(exec.status)}
              <h2 className="truncate text-base font-semibold text-text-primary">
                {exec.workflow_name}
              </h2>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge variant={statusVariant(exec.status)}>
                {exec.status}
              </StatusBadge>
              {exec.stage && (
                <span className="font-mono text-xs text-text-muted">
                  stage: {exec.stage}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-text-muted hover:bg-bg-elevated hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Timestamps */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Timing
            </h3>
            <div className="mt-3 space-y-3">
              <InfoRow
                label="Started"
                value={new Date(exec.started_at).toLocaleString()}
              />
              <InfoRow
                label="Finished"
                value={
                  exec.finished_at
                    ? new Date(exec.finished_at).toLocaleString()
                    : "—"
                }
              />
              <InfoRow
                label="Duration"
                value={formatDuration(exec.started_at, exec.finished_at)}
                mono
              />
              <InfoRow
                label="Relative"
                value={formatRelative(exec.started_at)}
              />
            </div>
          </section>

          {/* Error */}
          {exec.error_message && (
            <section className="mt-6">
              <h3 className="text-xs font-medium uppercase tracking-wide text-status-danger">
                Error
              </h3>
              <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-status-danger/30 bg-status-danger/5 p-3 font-mono text-xs text-status-danger">
                {exec.error_message}
              </pre>
            </section>
          )}

          {/* Linked lead */}
          {exec.lead_id && (
            <section className="mt-6">
              <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Linked Lead
              </h3>
              {leadQuery.isLoading && (
                <p className="mt-2 text-sm text-text-secondary">Loading…</p>
              )}
              {leadQuery.isError && (
                <p className="mt-2 text-sm text-status-danger">
                  Failed to load lead.
                </p>
              )}
              {leadQuery.data && (
                <div className="mt-3 rounded-md border border-bg-border bg-bg-base p-3">
                  <div className="text-sm font-medium text-text-primary">
                    {leadQuery.data.name}
                  </div>
                  <div className="text-xs text-text-muted">
                    {leadQuery.data.email}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <StatusBadge
                      variant={
                        leadQuery.data.status === "qualified"
                          ? "success"
                          : leadQuery.data.status === "rejected"
                            ? "danger"
                            : leadQuery.data.status === "needs_review"
                              ? "warning"
                              : "muted"
                      }
                    >
                      {leadQuery.data.status.replace("_", " ")}
                    </StatusBadge>
                    {leadQuery.data.priority && (
                      <StatusBadge variant="info">
                        {leadQuery.data.priority}
                      </StatusBadge>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* IDs */}
          <section className="mt-6">
            <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
              IDs
            </h3>
            <div className="mt-3 space-y-2 font-mono text-xs text-text-muted">
              <div>execution: {exec.id}</div>
              {exec.lead_id && <div>lead: {exec.lead_id}</div>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-muted">{label}</span>
      <span
        className={
          mono ? "font-mono text-xs text-text-secondary" : "text-text-primary"
        }
      >
        {value}
      </span>
    </div>
  );
}