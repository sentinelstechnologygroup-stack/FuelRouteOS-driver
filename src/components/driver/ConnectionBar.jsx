import React from "react";
import { useNavigate } from "react-router-dom";
import { Wifi, WifiOff, WifiLow, RefreshCw, AlertTriangle } from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import { cn } from "@/lib/utils";

const SIGNAL_CONFIG = {
  online: {
    label: "Online",
    icon: Wifi,
    bar: null, // no bar when fully online + nothing pending
  },
  weak: {
    label: "Weak Signal",
    icon: WifiLow,
    bar: "bg-warning text-warning-foreground",
    text: "Weak signal — data will sync when connection improves",
  },
  offline: {
    label: "Offline",
    icon: WifiOff,
    bar: "bg-warning text-warning-foreground",
    text: "Offline Mode — changes saved locally, will sync when reconnected",
  },
};

export default function ConnectionBar() {
  const navigate = useNavigate();
  const { signal, totalUnsynced, failedSyncCount, pendingSyncCount } = useDriver();

  const config = SIGNAL_CONFIG[signal] || SIGNAL_CONFIG.online;
  const Icon = config.icon;

  // Show nothing when fully online and everything synced
  if (signal === "online" && totalUnsynced === 0) return null;

  // Determine bar style
  const hasFailure = failedSyncCount > 0;
  const barClass = hasFailure
    ? "bg-destructive text-destructive-foreground"
    : config.bar || "bg-warning text-warning-foreground";

  let message = config.text || "";
  if (signal === "online" && pendingSyncCount > 0 && !hasFailure) {
    message = `${pendingSyncCount} item${pendingSyncCount > 1 ? "s" : ""} syncing…`;
  }
  if (signal === "online" && hasFailure) {
    message = `${failedSyncCount} sync failure${failedSyncCount > 1 ? "s" : ""} — tap to review`;
  }

  return (
    <button
      onClick={() => navigate("/sync")}
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-2 py-1.5 px-4 text-xs font-semibold",
        barClass
      )}
      style={{ maxWidth: "512px", marginLeft: "auto", marginRight: "auto" }}
    >
      {hasFailure
        ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
        : signal === "online" && pendingSyncCount > 0
        ? <RefreshCw className="w-3 h-3 shrink-0 animate-spin" />
        : <Icon className="w-3.5 h-3.5 shrink-0" />
      }
      <span>{message}</span>
      {totalUnsynced > 0 && (
        <span className="ml-1 bg-black/20 rounded-full px-1.5 py-0.5 text-[10px] font-bold">
          {totalUnsynced}
        </span>
      )}
    </button>
  );
}