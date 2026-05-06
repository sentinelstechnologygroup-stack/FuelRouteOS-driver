import React from "react";
import {
  Clock, Navigation, FileText, MapPin, Shield, PenTool,
  CheckCircle2, AlertTriangle, Loader2, Truck, Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp, APPEARANCES } from "@/lib/appContext";

const STATUS_CONFIG = {
  pending:       { label: "Pending",        icon: Clock,        color: "text-muted-foreground", bg: "bg-muted/60",           border: "border-muted-foreground/20" },
  en_route:      { label: "En Route",       icon: Navigation,   color: "text-info",             bg: "bg-info/10",            border: "border-info/25" },
  loading:       { label: "Loading",        icon: Truck,        color: "text-amber-400",        bg: "bg-amber-400/10",       border: "border-amber-400/25" },
  bol_captured:  { label: "BOL Confirmed",  icon: FileText,     color: "text-primary",          bg: "bg-primary/10",         border: "border-primary/25" },
  approaching:   { label: "Approaching",    icon: Navigation,   color: "text-sky-400",          bg: "bg-sky-400/10",         border: "border-sky-400/25" },
  arrived:       { label: "On Site",        icon: MapPin,       color: "text-success",          bg: "bg-success/10",         border: "border-success/25" },
  site_verified: { label: "Site Verified",  icon: Shield,       color: "text-success",          bg: "bg-success/10",         border: "border-success/25" },
  delivering:    { label: "Delivering",     icon: Package,      color: "text-primary",          bg: "bg-primary/10",         border: "border-primary/25" },
  pod_required:  { label: "POD Required",   icon: PenTool,      color: "text-warning",          bg: "bg-warning/10",         border: "border-warning/25" },
  completed:     { label: "Completed",      icon: CheckCircle2, color: "text-success",          bg: "bg-success/10",         border: "border-success/25" },
  exception:     { label: "Exception",      icon: AlertTriangle,color: "text-destructive",      bg: "bg-destructive/10",     border: "border-destructive/25" },
  in_progress:   { label: "In Progress",    icon: Loader2,      color: "text-primary",          bg: "bg-primary/10",         border: "border-primary/25" },
};

export default function StatusChip({ status, size = "sm", className }) {
  const { appearance } = useApp();
  const isCBMode = appearance === APPEARANCES.ACCESSIBLE;

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;

  const isPending = status === "pending";

  if (size === "dot") {
    // Compact dot — used in lists. In CB mode, always show icon+label.
    if (isCBMode) {
      return (
        <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold", cfg.color, className)}>
          <Icon className="w-3 h-3" aria-hidden="true" />
          {cfg.label}
        </span>
      );
    }
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
          cfg.bg, cfg.color, cfg.border, className,
          isPending && "status-pending-stripe"
        )}
        aria-label={cfg.label}
      >
        <Icon className="w-3 h-3" aria-hidden="true" />
        {cfg.label}
      </span>
    );
  }

  // Default / "sm" — full chip
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border",
        cfg.bg, cfg.color, cfg.border, className,
        isPending && "status-pending-stripe"
      )}
      role="status"
      aria-label={`Status: ${cfg.label}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}