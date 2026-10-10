import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-text-secondary">
      <Loader2 className="h-4 w-4 animate-spin text-accent-blue" />
      <span>{message}</span>
    </div>
  );
}