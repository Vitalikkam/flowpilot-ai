import { useQuery } from "@tanstack/react-query";
import { Link, Route, Routes } from "react-router-dom";

import { api } from "@/services/api";

function Home() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: () => api.health(),
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-text-primary">
        FlowPilot <span className="text-accent-violet">AI</span>
      </h1>
      <p className="mt-2 text-text-secondary">
        Scaffold is running. Real dashboard comes next.
      </p>

      <div className="mt-6 rounded-lg border border-bg-border bg-bg-surface p-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-text-muted">
          Backend health
        </h2>
        {health.isLoading && (
          <p className="mt-2 text-text-secondary">Checking…</p>
        )}
        {health.isError && (
          <p className="mt-2 text-status-danger">
            Failed: {(health.error as Error).message}
          </p>
        )}
        {health.data && (
          <pre className="mt-2 font-mono text-sm text-status-success">
            {JSON.stringify(health.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

function LeadsPlaceholder() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-text-primary">Leads</h1>
      <p className="mt-2 text-text-secondary">Placeholder page.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-full">
      <nav className="flex gap-4 border-b border-bg-border bg-bg-surface px-8 py-4">
        <Link to="/" className="text-text-secondary hover:text-accent-blue">
          Home
        </Link>
        <Link to="/leads" className="text-text-secondary hover:text-accent-blue">
          Leads
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leads" element={<LeadsPlaceholder />} />
      </Routes>
    </div>
  );
}