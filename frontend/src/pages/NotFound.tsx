import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated">
        <Compass className="h-6 w-6 text-text-muted" />
      </div>
      <h1 className="text-2xl font-semibold text-text-primary">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        The page you're looking for doesn't exist, or it was moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-accent-blue/10 px-4 py-2 text-sm font-medium text-accent-blue transition-colors hover:bg-accent-blue/20"
      >
        Back to Overview
      </Link>
    </div>
  );
}