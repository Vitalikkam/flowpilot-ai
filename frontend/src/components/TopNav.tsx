import { NavLink } from "react-router-dom";
import {
  Bell,
  LayoutDashboard,
  Search,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import clsx from "clsx";

const items = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/leads", label: "Leads", icon: Users, end: false },
  { to: "/workflow-runs", label: "Runs", icon: Workflow, end: false },
];

export function TopNav() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-6 border-b border-bg-border bg-bg-surface px-5">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-accent-blue to-accent-violet shadow-glow">
          <Zap className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-sm font-semibold tracking-tight text-text-primary">
          FlowPilot <span className="text-accent-violet">AI</span>
        </span>
      </div>

      {/* Primary navigation */}
      <nav className="flex items-center gap-1">
        {items.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-blue/10 text-accent-blue"
                  : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary",
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search…"
            className="w-56 rounded-md border border-bg-border bg-bg-base py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-blue/50 focus:outline-none"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative rounded-md p-2 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 rounded-full border border-bg-border bg-bg-base py-0.5 pl-1 pr-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-violet text-[10px] font-semibold text-white">
                VK
            </div>
            <span className="hidden text-xs font-medium text-text-secondary sm:inline">
                Vitalii
            </span>
            </div>
      </div>
    </header>
  );
}