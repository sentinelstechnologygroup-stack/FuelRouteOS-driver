import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Clock, Droplets, AlertTriangle, StickyNote,
  CheckCircle2, Navigation, Play, ArrowRight
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";
import {
  getJobProduct, getJobRequestedGallons, getJobHasNotes, getJobProductColor,
  STATUS_NEXT_LABEL, STATUS_NEXT_ROUTE
} from "@/lib/jobHelpers";

const ACTIVE_STATUSES = ["en_route", "loading", "bol_captured", "approaching", "arrived", "site_verified", "delivering", "pod_required"];

const STEP_ICONS = {
  pending:      Play,
  en_route:     Navigation,
  loading:      ArrowRight,
  bol_captured: Navigation,
  approaching:  Navigation,
  arrived:      ArrowRight,
  site_verified:ArrowRight,
  delivering:   ArrowRight,
  pod_required: ArrowRight,
  completed:    CheckCircle2,
  exception:    AlertTriangle,
};

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const isActive = ACTIVE_STATUSES.includes(job.status);
  const isCompleted = job.status === "completed";

  const productName = getJobProduct(job);
  const gallons = getJobRequestedGallons(job);
  const productColor = getJobProductColor(job);
  const hasNotes = getJobHasNotes(job);

  const StepIcon = STEP_ICONS[job.status] || Play;
  const stepLabel = STATUS_NEXT_LABEL[job.status] || "Start Delivery";

  const handleAction = (e) => {
    e.stopPropagation();
    const route = STATUS_NEXT_ROUTE[job.status]?.(job.id) ?? `/stop/${job.id}`;
    navigate(route);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl transition-all overflow-hidden",
        isActive
          ? "bg-primary/8 border-2 border-primary/35 shadow-md shadow-primary/10"
          : isCompleted
          ? "bg-card/60 border border-border/40 opacity-75"
          : "bg-card border border-border"
      )}
    >
      <button
        onClick={() => navigate(`/stop/${job.id}`)}
        className="w-full text-left px-4 pt-4 pb-3 active:opacity-80 transition-opacity"
      >
        {/* Header row */}
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                isActive && "bg-primary text-primary-foreground",
                isCompleted && "bg-success/20 text-success",
                !isActive && !isCompleted && "bg-secondary text-muted-foreground"
              )}
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : job.stopNumber}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight truncate">{job.customer?.name || "Unknown Customer"}</p>
              <p className="text-xs text-muted-foreground truncate">{job.site?.name || job.stopName || ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {job.priority === "high" && <AlertTriangle className="w-4 h-4 text-warning" />}
            <StatusBadge status={job.status} />
          </div>
        </div>

        {/* Address + time */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3 pl-12">
          {job.site?.address && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[140px]">{job.site.address.split(",")[0]}</span>
            </span>
          )}
          {job.plannedTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 shrink-0" />
              {job.plannedTime}
            </span>
          )}
        </div>

        {/* Product + gallons */}
        <div className="flex items-center gap-3 pl-12 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: productColor }} />
            <span className="text-xs font-semibold truncate max-w-[120px]">{productName}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-info">
            <Droplets className="w-3.5 h-3.5" />
            {gallons.toLocaleString()} gal
          </span>
          {job.deliveredGallons && (
            <span className="text-xs text-success font-semibold">
              ✓ {job.deliveredGallons.toLocaleString()} delivered
            </span>
          )}
          {hasNotes && <StickyNote className="w-3.5 h-3.5 text-warning" />}
        </div>
      </button>

      {/* Action button */}
      {!isCompleted && (
        <div className="px-4 pb-4">
          <button
            onClick={handleAction}
            className={cn(
              "w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all active:scale-[0.97]",
              job.status === "exception"
                ? "bg-destructive/15 text-destructive border border-destructive/30"
                : isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "bg-secondary text-foreground"
            )}
          >
            <StepIcon className="w-4 h-4" />
            {stepLabel}
          </button>
        </div>
      )}
    </div>
  );
}