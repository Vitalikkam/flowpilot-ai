import type { Lead } from "@/types/api";
import { formatRelative } from "@/utils/format";
import { StatusBadge, priorityVariant, statusVariant } from "./StatusBadge";

interface LeadsTableProps {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
}

export function LeadsTable({ leads, onSelect }: LeadsTableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-bg-border text-left text-[11px] uppercase tracking-wide text-text-muted">
          <th className="px-5 py-3 font-medium">Name</th>
          <th className="px-5 py-3 font-medium">Company</th>
          <th className="px-5 py-3 font-medium">Source</th>
          <th className="px-5 py-3 font-medium">Priority</th>
          <th className="px-5 py-3 font-medium">Status</th>
          <th className="px-5 py-3 font-medium">Received</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr
            key={lead.id}
            onClick={() => onSelect(lead)}
            className="cursor-pointer border-b border-bg-border/40 text-sm transition-colors last:border-0 hover:bg-bg-elevated"
          >
            <td className="px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-violet/30 text-[11px] font-semibold text-text-primary">
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
              <span className="inline-flex items-center rounded-md border border-bg-border bg-bg-base px-2 py-0.5 text-[11px] capitalize text-text-secondary">
                {lead.source}
              </span>
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
            <td className="px-5 py-3">
              <StatusBadge variant={statusVariant(lead.status)}>
                {lead.status.replace("_", " ")}
              </StatusBadge>
            </td>
            <td className="px-5 py-3 text-text-secondary">
              {formatRelative(lead.created_at)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}