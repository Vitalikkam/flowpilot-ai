import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
      {Icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated">
          <Icon className="h-5 w-5 text-text-muted" />
        </div>
      )}
      <div className="text-sm font-medium text-text-primary">{title}</div>
      {description && (
        <div className="mt-1 max-w-sm text-xs text-text-muted">
          {description}
        </div>
      )}
    </div>
  );
}