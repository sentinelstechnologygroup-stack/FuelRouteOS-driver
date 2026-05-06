import React from "react";
import { CheckCircle2, Clock, AlertCircle, CloudOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small inline badge showing sync state for a single item.
 * status: "synced" | "pending" | "failed" | "offline"
 */
export default function SyncBadge({ status, label, className }) {
  const configs = {
    synced: {
      icon: CheckCircle2,
      text: label || "Synced",
      className: "bg-success/10 text-success border-success/20",
    },
    pending: {
      icon: Clock,
      text: label || "Pending sync",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    failed: {
      icon: AlertCircle,
      text: label || "Sync failed",
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    offline: {
      icon: CloudOff,
      text: label || "Saved offline",
      className: "bg-muted/60 text-muted-foreground border-border",
    },
  };

  const config = configs[status] || configs.offline;
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
      config.className,
      className
    )}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
}