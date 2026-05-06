import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, CalendarDays, Map, ScanLine, RefreshCw } from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home",  icon: Home,         path: "/home"       },
  { label: "Today", icon: CalendarDays, path: "/today-shift" },
  { label: "Route", icon: Map,          path: "/route"       },
  { label: "Scan",  icon: ScanLine,     path: "/scan"        },
  { label: "Sync",  icon: RefreshCw,    path: "/sync"        },
];

export default function DriverBottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { totalUnsynced, failedSyncCount } = useDriver();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border flex safe-area-inset-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
        const active =
          pathname === path ||
          (path === "/today-shift" && (pathname === "/today")) ||
          (path === "/home" && pathname === "/");
        const badge = path === "/sync" && totalUnsynced > 0 ? totalUnsynced : null;

        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-3 gap-0.5 relative transition-colors min-h-[52px]",
              active ? "text-primary" : "text-muted-foreground active:text-foreground"
            )}
          >
            <div className="relative">
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              {badge && (
                <span
                  className={cn(
                    "absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-bold px-1",
                    failedSyncCount > 0 ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"
                  )}
                  aria-label={`${badge} items pending sync`}
                >
                  {badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold leading-tight">{label}</span>
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}