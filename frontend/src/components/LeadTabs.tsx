import clsx from "clsx";

import type { LeadStatus } from "@/types/api";

interface LeadTabsProps {
  value: LeadStatus | "all";
  onChange: (value: LeadStatus | "all") => void;
  counts: Record<LeadStatus | "all", number>;
}

const tabs: Array<{ value: LeadStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "qualified", label: "Qualified" },
  { value: "needs_review", label: "Needs Review" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
];

export function LeadTabs({ value, onChange, counts }: LeadTabsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {tabs.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={clsx(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-accent-blue/40 bg-accent-blue/10 text-accent-blue"
                : "border-bg-border bg-bg-surface text-text-secondary hover:border-accent-blue/30 hover:text-text-primary",
            )}
          >
            <span>{tab.label}</span>
            <span
              className={clsx(
                "rounded-full px-1.5 py-0.5 text-[10px] font-mono",
                active
                  ? "bg-accent-blue/20 text-accent-blue"
                  : "bg-bg-elevated text-text-muted",
              )}
            >
              {counts[tab.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}