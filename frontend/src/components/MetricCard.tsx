import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "blue" | "violet" | "cyan" | "success";
}

const accentClasses = {
  blue: "text-accent-blue bg-accent-blue/10",
  violet: "text-accent-violet bg-accent-violet/10",
  cyan: "text-accent-cyan bg-accent-cyan/10",
  success: "text-status-success bg-status-success/10",
};

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "blue",
}: MetricCardProps) {
  return (
    <div className="rounded-lg border border-bg-border bg-bg-surface p-5 transition-colors hover:border-accent-blue/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {label}
        </span>
        <div
          className={clsx(
            "flex h-8 w-8 items-center justify-center rounded-md",
            accentClasses[accent],
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold text-text-primary">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-text-muted">{hint}</div>}
    </div>
  );
}