import clsx from "clsx";

import type { ExecutionStatus } from "@/types/api";

interface ExecutionFiltersProps {
  value: ExecutionStatus | "";
  onChange: (value: ExecutionStatus | "") => void;
  counts: Record<ExecutionStatus | "all", number>;
}

const tabs: Array<{
  value: ExecutionStatus | "";
  label: string;
  key: ExecutionStatus | "all";
}> = [
  { value: "", label: "All", key: "all" },
  { value: "success", label: "Success", key: "success" },
  { value: "failed", label: "Failed", key: "failed" },
  { value: "running", label: "Running", key: "running" },
];

export function ExecutionFilters({
  value,
  onChange,
  counts,
}: ExecutionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {tabs.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.key}
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
              {counts[tab.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}