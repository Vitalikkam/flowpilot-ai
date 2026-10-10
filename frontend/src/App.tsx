import { Route, Routes } from "react-router-dom";

import { Layout } from "@/components/Layout";
import { Leads } from "@/pages/Leads";
import { Overview } from "@/pages/Overview";
import { WorkflowRuns } from "@/pages/WorkflowRuns";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/workflow-runs" element={<WorkflowRuns />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}