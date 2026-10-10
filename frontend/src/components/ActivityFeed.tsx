import { AlertCircle, CheckCircle2, Mail, Loader2 } from "lucide-react";

import type { Lead, WorkflowExecution } from "@/types/api";
import { formatRelative } from "@/utils/format";

interface ActivityFeedProps {
  executions: WorkflowExecution[];
  leads: Lead[];
}

type Item = {
  key: string;
  at: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
};

export function ActivityFeed({ executions, leads }: ActivityFeedProps) {
  const items: Item[] = [];

  for (const exec of executions.slice(0, 8)) {
    items.push({
      key: `exec-${exec.id}`,
      at: exec.started_at,
      icon:
        exec.status === "success" ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-status-success" />
        ) : exec.status === "failed" ? (
          <AlertCircle className="h-3.5 w-3.5 text-status-danger" />
        ) : (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-blue" />
        ),
      title:
        exec.status === "success"
          ? "Workflow completed"
          : exec.status === "failed"
            ? `Workflow failed${exec.stage ? ` at ${exec.stage}` : ""}`
            : "Workflow running",
      subtitle: exec.workflow_name,
    });
  }

  for (const lead of leads.slice(0, 8)) {
    items.push({
      key: `lead-${lead.id}`,
      at: lead.created_at,
      icon: <Mail className="h-3.5 w-3.5 text-accent-blue" />,
      title: `New lead from ${lead.name}`,
      subtitle: lead.company ?? lead.email,
    });
  }

  items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const top = items.slice(0, 8);

  if (top.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-text-muted">
        No activity yet
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {top.map((item) => (
        <li key={item.key} className="flex items-start gap-3 text-sm">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-elevated">
            {item.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-text-primary">{item.title}</div>
            {item.subtitle && (
              <div className="truncate text-xs text-text-muted">
                {item.subtitle}
              </div>
            )}
          </div>
          <span className="shrink-0 text-[10px] text-text-muted">
            {formatRelative(item.at)}
          </span>
        </li>
      ))}
    </ul>
  );
}