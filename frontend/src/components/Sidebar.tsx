import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Workflow, Zap } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/leads", label: "Leads", icon: Users, end: false },
  { to: "/workflow-runs", label: "Workflow Runs", icon: Workflow, end: false },
];

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-bg-border bg-bg-surface">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent-blue to-accent-violet shadow-glow">
          <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-base font-semibold tracking-tight text-text-primary">
          FlowPilot <span className="text-accent-violet">AI</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-blue/10 text-accent-blue shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={clsx(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-accent-blue"
                      : "text-text-muted group-hover:text-text-secondary",
                  )}
                  strokeWidth={2}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-5 py-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-status-success shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
          <span>System online</span>
        </div>
      </div>
    </aside>
  );
}