import { Flame } from "lucide-react";

import type { Lead } from "@/types/api";
import { formatRelative } from "@/utils/format";
import { StatusBadge, priorityVariant } from "./StatusBadge";

interface HotLeadsPanelProps {
  leads: Lead[];
}

export function HotLeadsPanel({ leads }: HotLeadsPanelProps) {
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center py-6 text-center text-xs text-text-muted">
        <Flame className="mb-2 h-5 w-5 opacity-40" />
        No high-priority leads yet
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {leads.slice(0, 6).map((lead) => (
        <li
          key={lead.id}
          className="flex items-center justify-between gap-3 text-sm"
        >
          <div className="min-w-0">
            <div className="truncate font-medium text-text-primary">
              {lead.name}
            </div>
            <div className="truncate text-xs text-text-muted">
              {lead.company ?? lead.email}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <StatusBadge variant={priorityVariant(lead.priority)}>
              {lead.priority}
            </StatusBadge>
            <span className="text-[10px] text-text-muted">
              {formatRelative(lead.created_at)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}