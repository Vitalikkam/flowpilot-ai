import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface SourcesChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];

export function SourcesChart({ data }: SourcesChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const top = data.slice().sort((a, b) => b.value - a.value)[0];
  const topPercent = total > 0 ? Math.round((top.value / total) * 100) : 0;

  if (total === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-xs text-text-muted">
        No data yet
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-32 w-32 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={42}
              outerRadius={60}
              stroke="none"
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xl font-semibold text-text-primary">
            {topPercent}%
          </div>
          <div className="text-[10px] uppercase tracking-wide text-text-muted">
            {top.name}
          </div>
        </div>
      </div>

      <ul className="flex-1 space-y-1.5">
        {data.map((item, i) => {
          const percent =
            total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <li
              key={item.name}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="capitalize text-text-secondary">
                  {item.name}
                </span>
              </div>
              <span className="font-mono text-text-muted">{percent}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}