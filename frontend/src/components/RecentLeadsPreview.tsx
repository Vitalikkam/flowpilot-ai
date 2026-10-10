import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Lead } from "@/types/api";
import { formatRelative } from "@/utils/format";
import { StatusBadge, priorityVariant, statusVariant } from "./StatusBadge";

interface RecentLeadsPreviewProps {
  leads: Lead[];
}

export function RecentLeadsPreview({ leads }: RecentLeadsPreviewProps) {
  if (leads.length === 0) {
    return (
      <div className="px-5 py-8 text-center text-xs text-text-muted">
        No leads yet. Send one through the n8n webhook.
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-bg-border text-left text-[11px] uppercase tracking-wide text-text-muted">
            <th className="px-5 py-2.5 font-medium">Name</th>
            <th className="px-5 py-2.5 font-medium">Company</th>
            <th className="px-5 py-2.5 font-medium">Status</th>
            <th className="px-5 py-2.5 font-medium">Priority</th>
            <th className="px-5 py-2.5 font-medium">Received</th>
          </tr>
        </thead>
        <tbody>
          {leads.slice(0, 6).map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-bg-border/40 text-sm last:border-0"
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-violet/30 text-[10px] font-semibold text-text-primary">
                    {lead.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-text-primary">
                      {lead.name}
                    </div>
                    <div className="truncate text-[11px] text-text-muted">
                      {lead.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-text-secondary">
                {lead.company ?? "—"}
              </td>
              <td className="px-5 py-3">
                <StatusBadge variant={statusVariant(lead.status)}>
                  {lead.status.replace("_", " ")}
                </StatusBadge>
              </td>
              <td className="px-5 py-3">
                {lead.priority ? (
                  <StatusBadge variant={priorityVariant(lead.priority)}>
                    {lead.priority}
                  </StatusBadge>
                ) : (
                  <span className="text-xs text-text-muted">—</span>
                )}
              </td>
              <td className="px-5 py-3 text-text-secondary">
                {formatRelative(lead.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end border-t border-bg-border/60 px-5 py-2.5">
        <Link
          to="/leads"
          className="inline-flex items-center gap-1 text-xs font-medium text-accent-blue hover:text-accent-violet"
        >
          View all leads
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}