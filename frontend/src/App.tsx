import { Link, Route, Routes } from "react-router-dom";

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold text-text-primary">
        FlowPilot <span className="text-accent-violet">AI</span>
      </h1>
      <p className="mt-2 text-text-secondary">
        Scaffold is running. Real dashboard comes next.
      </p>
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