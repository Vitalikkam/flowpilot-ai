import { Search, X } from "lucide-react";

import type { LeadPriority } from "@/types/api";

interface LeadFiltersProps {
  search: string;
  onSearch: (value: string) => void;
  priority: LeadPriority | "";
  onPriority: (value: LeadPriority | "") => void;
}

const priorityOptions: Array<{ value: LeadPriority | ""; label: string }> = [
  { value: "", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export function LeadFilters({
  search,
  onSearch,
  priority,
  onPriority,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[240px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name, email, or company…"
          className="w-full rounded-md border border-bg-border bg-bg-surface py-1.5 pl-9 pr-9 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-blue/50 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-muted hover:text-text-primary"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <select
        value={priority}
        onChange={(e) => onPriority(e.target.value as LeadPriority | "")}
        className="rounded-md border border-bg-border bg-bg-surface px-3 py-1.5 text-sm text-text-primary focus:border-accent-blue/50 focus:outline-none"
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