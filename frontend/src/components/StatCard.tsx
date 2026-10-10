import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import clsx from "clsx";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "blue" | "violet" | "cyan" | "success" | "warning";
  delta?: {
    value: number;
    direction: "up" | "down" | "flat";
    label?: string;
  };
}

const accentBg = {
  blue: "text-accent-blue bg-accent-blue/10",
  violet: "text-accent-violet bg-accent-violet/10",
  cyan: "text-accent-cyan bg-accent-cyan/10",
  success: "text-status-success bg-status-success/10",
  warning: "text-status-warning bg-status-warning/10",
};

const deltaColor = {
  up: "text-status-success",
  down: "text-status-danger",
  flat: "text-text-muted",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "blue",
  delta,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-bg-border bg-bg-surface p-4 transition-colors hover:border-accent-blue/30">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
          {label}
        </span>
        <div
          className={clsx(
            "flex h-7 w-7 items-center justify-center rounded-md",
            accentBg[accent],
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl font-semibold text-text-primary">{value}</div>
        {delta && (
          <div className={clsx("flex items-center gap-0.5 text-xs font-medium", deltaColor[delta.direction])}>
            {delta.direction === "up" && <ArrowUp className="h-3 w-3" />}
            {delta.direction === "down" && <ArrowDown className="h-3 w-3" />}
            {delta.direction === "flat" && <Minus className="h-3 w-3" />}
            <span>{delta.label ?? Math.abs(delta.value)}</span>
          </div>
        )}
      </div>

      {hint && <div className="mt-1 text-xs text-text-muted">{hint}</div>}
    </div>
  );
}