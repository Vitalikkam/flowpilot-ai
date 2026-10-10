import { useLocation } from "react-router-dom";

const titleMap: Record<string, string> = {
  "/": "Overview",
  "/leads": "Leads",
  "/workflow-runs": "Workflow Runs",
};

export function TopBar() {
  const { pathname } = useLocation();
  const title = titleMap[pathname] ?? "FlowPilot AI";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-bg-border bg-bg-base/80 px-6 backdrop-blur">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {/* Placeholder for future actions: search, user menu, filters */}
        <span className="text-xs text-text-muted">Local demo</span>
      </div>
    </header>
  );
}