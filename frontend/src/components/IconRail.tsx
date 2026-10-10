import { useState } from "react";
import {
  ChevronsLeft,
  ChevronsRight,
  Github,
  HelpCircle,
  Plus,
  Star,
} from "lucide-react";
import clsx from "clsx";

import { useHealth } from "@/hooks/useHealth";

export function IconRail() {
  const [collapsed, setCollapsed] = useState(false);
  const health = useHealth();
  const online = health.isSuccess && health.data?.status === "ok";

  return (
    <aside
      className={clsx(
        "flex shrink-0 flex-col items-center border-r border-bg-border bg-bg-surface py-3 transition-all duration-200",
        collapsed ? "w-10" : "w-12",
      )}
    >
      {/* Collapse toggle */}
      <RailButton
        title={collapsed ? "Expand" : "Collapse"}
        onClick={() => setCollapsed((c) => !c)}
      >
        {collapsed ? (
          <ChevronsRight className="h-4 w-4" />
        ) : (
          <ChevronsLeft className="h-4 w-4" />
        )}
      </RailButton>

      <div className="my-2 h-px w-6 bg-bg-border" />

      {/* Quick actions */}
      <div className="flex flex-col items-center gap-1">
        <RailButton title="Starred leads">
          <Star className="h-4 w-4" />
        </RailButton>
        <RailButton title="New lead">
          <Plus className="h-4 w-4" />
        </RailButton>
        <RailButton title="Docs">
          <HelpCircle className="h-4 w-4" />
        </RailButton>
        <RailButton
          title="GitHub repository"
          onClick={() =>
            window.open(
              "https://github.com/Vitalikkam/flowpilot-ai",
              "_blank",
              "noopener,noreferrer",
            )
          }
        >
          <Github className="h-4 w-4" />
        </RailButton>
      </div>

      {/* Status indicator */}
      <div className="mt-auto flex flex-col items-center pb-2">
        <div
          className={clsx(
            "h-2 w-2 rounded-full",
            online
              ? "bg-status-success shadow-[0_0_6px_rgba(16,185,129,0.7)]"
              : "bg-status-danger shadow-[0_0_6px_rgba(239,68,68,0.7)]",
          )}
          title={online ? "System online" : "System offline"}
        />
      </div>
    </aside>
  );
}

function RailButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary"
    >
      {children}
    </button>
  );
}