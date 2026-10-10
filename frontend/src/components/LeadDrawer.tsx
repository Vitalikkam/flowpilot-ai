import { useEffect } from "react";
import { Bot, Building2, Calendar, Mail, User, X } from "lucide-react";

import { useLead, useLeadAnalysis } from "@/hooks/useLead";
import { useUpdateLead } from "@/hooks/useUpdateLead";
import type { Lead, LeadStatus } from "@/types/api";
import { formatRelative } from "@/utils/format";
import { StatusBadge, priorityVariant, statusVariant } from "./StatusBadge";

interface LeadDrawerProps {
  lead: Lead | null;
  onClose: () => void;
}

const statusOptions: LeadStatus[] = [
  "pending",
  "qualified",
  "rejected",
  "needs_review",
];

export function LeadDrawer({ lead, onClose }: LeadDrawerProps) {
  const open = !!lead;
  const leadQuery = useLead(lead?.id ?? null);
  const analysisQuery = useLeadAnalysis(lead?.id ?? null);
  const updateLead = useUpdateLead();

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const current = leadQuery.data ?? lead!;
  const analysis = analysisQuery.data;

  const handleStatusChange = (status: LeadStatus) => {
    updateLead.mutate({ id: current.id, payload: { status } });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative ml-auto flex h-full w-full max-w-xl flex-col border-l border-bg-border bg-bg-surface shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-bg-border px-6 py-5">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-text-primary">
              {current.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge variant={statusVariant(current.status)}>
                {current.status.replace("_", " ")}
              </StatusBadge>
              {current.priority && (
                <StatusBadge variant={priorityVariant(current.priority)}>
                  {current.priority} priority
                </StatusBadge>
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
          {/* Contact */}
          <section className="space-y-3">
            <DrawerRow icon={User} label="Name" value={current.name} />
            <DrawerRow icon={Mail} label="Email" value={current.email} />
            <DrawerRow
              icon={Building2}
              label="Company"
              value={current.company ?? "—"}
            />
            <DrawerRow
              icon={Calendar}
              label="Received"
              value={formatRelative(current.created_at)}
            />
          </section>

          {/* Message */}
          <section className="mt-6">
            <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Message
            </h3>
            <p className="mt-2 whitespace-pre-wrap rounded-md border border-bg-border bg-bg-base p-3 text-sm text-text-secondary">
              {current.message}
            </p>
          </section>

          {/* AI Analysis */}
          <section className="mt-6">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-accent-violet" />
              <h3 className="text-xs font-medium uppercase tracking-wide text-text-muted">
                AI Analysis
              </h3>
            </div>

            {analysisQuery.isLoading && (
              <p className="mt-2 text-sm text-text-secondary">Loading analysis…</p>
            )}

            {!analysisQuery.isLoading && !analysis && (
              <p className="mt-2 text-sm text-text-muted">
                No analysis available yet. The workflow may not have completed.
              </p>
            )}

            {analysis && (
              <div className="mt-2 space-y-3 rounded-md border border-bg-border bg-bg-base p-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-text-muted">
                    Summary
                  </div>
                  <div className="mt-1 text-sm text-text-primary">
                    {analysis.summary}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-text-muted">
                      Category
                    </div>
                    <div className="mt-1 text-sm text-text-secondary">
                      {analysis.category ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-text-muted">
                      Urgency
                    </div>
                    <div className="mt-1 text-sm text-text-secondary">
                      {analysis.urgency ?? "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-text-muted">
                      Budget
                    </div>
                    <div className="mt-1 font-mono text-sm text-text-secondary">
                      {analysis.budget_usd != null
                        ? `$${analysis.budget_usd.toLocaleString()}`
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-text-muted">
                      Model
                    </div>
                    <div className="mt-1 font-mono text-xs text-text-muted">
                      {analysis.model ?? "—"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer — status update */}
        <div className="border-t border-bg-border bg-bg-base px-6 py-4">
          <label className="block text-xs font-medium uppercase tracking-wide text-text-muted">
            Update status
          </label>
          <div className="mt-2 flex gap-2">
            {statusOptions.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={updateLead.isPending || current.status === s}
                className="rounded-md border border-bg-border bg-bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent-blue/40 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
          {updateLead.isError && (
            <p className="mt-2 text-xs text-status-danger">
              Failed to update: {(updateLead.error as Error).message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function DrawerRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-text-muted" />
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-text-muted">
          {label}
        </div>
        <div className="truncate text-sm text-text-primary">{value}</div>
      </div>
    </div>
  );
}