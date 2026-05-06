import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CalendarDays, Route, MessageCircle, RefreshCw, User } from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/today",   label: "Today",   icon: CalendarDays },
  { path: "/route",   label: "Route",   icon: Route },
  { path: "/chat",    label: "Chat",    icon: MessageCircle, badge: "chat" },
  { path: "/sync",    label: "Sync",    icon: RefreshCw,     badge: "sync" },
  { path: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const location = useLocation();
  const { syncs, unreadCount } = useDriver();
  const pendingCount = syncs.filter(s => s.status === "pending" || s.status === "failed").length;

  const getBadge = (badge) => {
    if (badge === "sync") return pendingCount;
    if (badge === "chat") return unreadCount;
    return 0;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/98 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {navItems.map(({ path, label, icon: Icon, badge }) => {
          const isActive = location.pathname.startsWith(path);
          const badgeCount = badge ? getBadge(badge) : 0;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-14 rounded-xl transition-all relative",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary rounded-full" />
              )}
              <div className={cn(
                "relative flex items-center justify-center w-9 h-7 rounded-lg transition-colors",
                isActive ? "bg-primary/15" : ""
              )}>
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-warning text-warning-foreground text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] leading-none",
                isActive ? "font-bold" : "font-medium"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}