import { useMemo, useState } from "react";
import { Users } from "lucide-react";

import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LeadDrawer } from "@/components/LeadDrawer";
import { LeadFilters } from "@/components/LeadFilters";
import { LeadTabs } from "@/components/LeadTabs";
import { LeadsTable } from "@/components/LeadsTable";
import { LoadingState } from "@/components/LoadingState";
import { useLeads } from "@/hooks/useLeads";
import type { Lead, LeadPriority, LeadStatus } from "@/types/api";

const ALL_STATUSES: LeadStatus[] = [
  "pending",
  "qualified",
  "rejected",
  "needs_review",
];

export function Leads() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [priority, setPriority] = useState<LeadPriority | "">("");
  const [selected, setSelected] = useState<Lead | null>(null);

  const query = useLeads({ limit: 200 });

  const allLeads = query.data ?? [];

  const counts = useMemo(() => {
    const c: Record<LeadStatus | "all", number> = {
      all: allLeads.length,
      pending: 0,
      qualified: 0,
      rejected: 0,
      needs_review: 0,
    };
    for (const lead of allLeads) {
      if (ALL_STATUSES.includes(lead.status)) {
        c[lead.status] += 1;
      }
    }
    return c;
  }, [allLeads]);

  const filtered = useMemo(() => {
    let result = allLeads;

    if (status !== "all") {
      result = result.filter((l) => l.status === status);
    }

    if (priority) {
      result = result.filter((l) => l.priority === priority);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          (l.company ?? "").toLowerCase().includes(q),
      );
    }

    return result;
  }, [allLeads, status, priority, search]);

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="mb-5">
        <LeadTabs value={status} onChange={setStatus} counts={counts} />
      </div>

      {/* Filters */}
      <div className="mb-4">
        <LeadFilters
          search={search}
          onSearch={setSearch}
          priority={priority}
          onPriority={setPriority}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-bg-border bg-bg-surface">
        {query.isLoading && <LoadingState message="Loading leads…" />}

        {query.isError && (
          <div className="p-5">
            <ErrorState message={(query.error as Error).message} />
          </div>
        )}

        {query.data && filtered.length === 0 && (
          <EmptyState
            icon={Users}
            title="No leads match the current filters"
            description="Try a different tab, or clear the search."
          />
        )}

        {query.data && filtered.length > 0 && (
          <LeadsTable leads={filtered} onSelect={setSelected} />
        )}
      </div>

      <LeadDrawer lead={selected} onClose={() => setSelected(null)} />
    </div>
  );
}