import { useMemo } from "react";
import {
  Activity,
  CheckCircle2,
  Flame,
  TrendingUp,
  Users,
} from "lucide-react";

import { ActivityFeed } from "@/components/ActivityFeed";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { HotLeadsPanel } from "@/components/HotLeadsPanel";
import { LoadingState } from "@/components/LoadingState";
import { RecentLeadsPreview } from "@/components/RecentLeadsPreview";
import { SourcesChart } from "@/components/SourcesChart";
import { StatCard } from "@/components/StatCard";
import { useExecutions } from "@/hooks/useExecutions";
import { useLeads } from "@/hooks/useLeads";
import { formatPercent } from "@/utils/format";

function computeDelta(current: number, previous: number) {
  const diff = current - previous;
  if (diff === 0) return { value: 0, direction: "flat" as const, label: "0" };
  return {
    value: diff,
    direction: diff > 0 ? ("up" as const) : ("down" as const),
    label: `${diff > 0 ? "+" : ""}${diff}`,
  };
}

export function Overview() {
  const leads = useLeads({ limit: 200 });
  const executions = useExecutions({ limit: 50 });

  const allLeads = leads.data ?? [];
  const allExecs = executions.data ?? [];

  const stats = useMemo(() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const lastWeek = allLeads.filter(
      (l) => now - new Date(l.created_at).getTime() < 7 * day,
    );
    const priorWeek = allLeads.filter((l) => {
      const age = now - new Date(l.created_at).getTime();
      return age >= 7 * day && age < 14 * day;
    });

    const qualified = allLeads.filter((l) => l.status === "qualified").length;
    const highPriority = allLeads.filter((l) => l.priority === "high").length;

    const finished = allExecs.filter(
      (e) => e.status === "success" || e.status === "failed",
    );
    const successes = finished.filter((e) => e.status === "success").length;
    const successRate = finished.length === 0 ? 0 : successes / finished.length;

    return {
      total: allLeads.length,
      newThisWeek: lastWeek.length,
      newDelta: computeDelta(lastWeek.length, priorWeek.length),
      qualified,
      qualifiedShare:
        allLeads.length > 0
          ? Math.round((qualified / allLeads.length) * 100)
          : 0,
      highPriority,
      successRate,
      runs: finished.length,
    };
  }, [allLeads, allExecs]);

  const sourcesData = useMemo(() => {
    const map = new Map<string, number>();
    for (const lead of allLeads) {
      const key = lead.source || "other";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allLeads]);

  const hotLeads = useMemo(
    () => allLeads.filter((l) => l.priority === "high"),
    [allLeads],
  );

  const recentLeads = useMemo(
    () =>
      allLeads
        .slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        ),
    [allLeads],
  );

  const loading = leads.isLoading || executions.isLoading;
  const error = leads.isError || executions.isError;

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState message="Loading dashboard…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message="Failed to load dashboard data. Is the backend running?" />
      </div>
    );
  }

  if (allLeads.length === 0 && allExecs.length === 0) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-bg-border bg-bg-surface">
          <EmptyState
            icon={Users}
            title="No data yet"
            description="Send a lead through the n8n webhook to see the dashboard in action."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Leads"
          value={stats.total}
          icon={Users}
          accent="blue"
        />
        <StatCard
          label="New This Week"
          value={stats.newThisWeek}
          icon={TrendingUp}
          accent="cyan"
          delta={stats.newDelta}
        />
        <StatCard
          label="Qualified"
          value={stats.qualified}
          hint={
            stats.total > 0
              ? `${stats.qualifiedShare}% of all leads`
              : undefined
          }
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard
          label="High Priority"
          value={stats.highPriority}
          icon={Flame}
          accent="violet"
        />
        <StatCard
          label="Workflow Success"
          value={formatPercent(stats.successRate)}
          hint={`${stats.runs} finished runs`}
          icon={Activity}
          accent="blue"
        />
      </div>

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column (2/3) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="rounded-lg border border-bg-border bg-bg-surface">
            <div className="flex items-center justify-between border-b border-bg-border px-5 py-3.5">
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Recent Leads
              </h2>
            </div>
            <RecentLeadsPreview leads={recentLeads} />
          </section>

          <section className="rounded-lg border border-bg-border bg-bg-surface">
            <div className="flex items-center justify-between border-b border-bg-border px-5 py-3.5">
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Activity
              </h2>
            </div>
            <div className="px-5 py-4">
              <ActivityFeed executions={allExecs} leads={allLeads} />
            </div>
          </section>
        </div>

        {/* Right column (1/3) */}
        <div className="flex flex-col gap-6">
          <section className="rounded-lg border border-bg-border bg-bg-surface">
            <div className="flex items-center justify-between border-b border-bg-border px-5 py-3.5">
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Lead Sources
              </h2>
            </div>
            <div className="px-5 py-4">
              <SourcesChart data={sourcesData} />
            </div>
          </section>

          <section className="rounded-lg border border-bg-border bg-bg-surface">
            <div className="flex items-center justify-between border-b border-bg-border px-5 py-3.5">
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-muted">
                Hot Leads
              </h2>
            </div>
            <div className="px-5 py-4">
              <HotLeadsPanel leads={hotLeads} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}