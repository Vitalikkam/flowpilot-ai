import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
}: ErrorStateProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-status-danger/30 bg-status-danger/5 px-4 py-3 text-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-danger" />
      <div>
        <div className="font-medium text-status-danger">{title}</div>
        <div className="mt-0.5 text-text-secondary">{message}</div>
      </div>
    </div>
  );
}