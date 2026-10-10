import { Outlet } from "react-router-dom";

import { IconRail } from "./IconRail";
import { TopNav } from "./TopNav";

export function AppShell() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg-base">
      <TopNav />
      <div className="flex min-h-0 flex-1">
        <IconRail />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}