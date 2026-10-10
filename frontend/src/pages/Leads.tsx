import { useMemo, useState } from "react";

import { LeadDrawer } from "@/components/LeadDrawer";
import { LeadFilters } from "@/components/LeadFilters";
import { LeadsTable } from "@/components/LeadsTable";
import { useLeads } from "@/hooks/useLeads";
import type { Lead, LeadPriority, LeadStatus } from "@/types/api";

export function Leads() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [priority, setPriority] = useState<LeadPriority | "">("");
  const [selected, setSelected] = useState<Lead | null>(null);

  const query = useLeads({
    status: status || undefined,
    priority: priority || undefined,
    limit: 200,
  });

  const filtered = useMemo(() => {
    const all = query.data ?? [];
    if (!search.trim()) return all;
    const q = search.trim().toLowerCase();
    return all.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.company ?? "").toLowerCase().includes(q),
    );
  }, [query.data, search]);

  return (
    <div className="p-6">
      <div className="mb-5">
        <LeadFilters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          priority={priority}
          onPriority={setPriority}
        />
      </div>

      <div className="rounded-lg border border-bg-border bg-bg-surface">
        {query.isLoading && (
          <div className="px-5 py-10 text-center text-sm text-text-secondary">
            Loading leads…
          </div>
        )}

        {query.isError && (
          <div className="px-5 py-10 text-center text-sm text-status-danger">
            Failed to load leads: {(query.error as Error).message}
          </div>
        )}

        {query.data && (
          <LeadsTable leads={filtered} onSelect={(lead) => setSelected(lead)} />
        )}
      </div>

      <LeadDrawer lead={selected} onClose={() => setSelected(null)} />
    </div>
  );
}