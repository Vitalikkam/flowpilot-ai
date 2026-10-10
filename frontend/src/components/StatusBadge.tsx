import clsx from "clsx";

type Variant = "success" | "danger" | "warning" | "info" | "muted";

const variantClasses: Record<Variant, string> = {
  success: "bg-status-success/10 text-status-success border-status-success/30",
  danger: "bg-status-danger/10 text-status-danger border-status-danger/30",
  warning: "bg-status-warning/10 text-status-warning border-status-warning/30",
  info: "bg-accent-blue/10 text-accent-blue border-accent-blue/30",
  muted: "bg-bg-elevated text-text-muted border-bg-border",
};

interface StatusBadgeProps {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}