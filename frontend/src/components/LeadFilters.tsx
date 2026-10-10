import { Search, X } from "lucide-react";

import type { LeadPriority, LeadStatus } from "@/types/api";

interface LeadFiltersProps {
  search: string;
  onSearch: (value: string) => void;
  status: LeadStatus | "";
  onStatus: (value: LeadStatus | "") => void;
  priority: LeadPriority | "";
  onPriority: (value: LeadPriority | "") => void;
}

const statusOptions: Array<{ value: LeadStatus | ""; label: string }> = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "qualified", label: "Qualified" },
  { value: "rejected", label: "Rejected" },
  { value: "needs_review", label: "Needs Review" },
];

const priorityOptions: Array<{ value: LeadPriority | ""; label: string }> = [
  { value: "", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function LeadFilters({
  search,
  onSearch,
  status,
  onStatus,
  priority,
  onPriority,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name, email, or company…"
          className="w-full rounded-md border border-bg-border bg-bg-surface py-2 pl-9 pr-9 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-blue/50 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted hover:text-text-primary"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <select
        value={status}
        onChange={(e) => onStatus(e.target.value as LeadStatus | "")}
        className="rounded-md border border-bg-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-blue/50 focus:outline-none"
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => onPriority(e.target.value as LeadPriority | "")}
        className="rounded-md border border-bg-border bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-accent-blue/50 focus:outline-none"
      >
        {priorityOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}