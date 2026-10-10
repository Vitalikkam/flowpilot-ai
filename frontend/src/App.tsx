import { Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/AppShell";
import { Leads } from "@/pages/Leads";
import { NotFound } from "@/pages/NotFound";
import { Overview } from "@/pages/Overview";
import { WorkflowRuns } from "@/pages/WorkflowRuns";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Overview />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/workflow-runs" element={<WorkflowRuns />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}