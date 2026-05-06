import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown, ChevronUp, MapPin, Phone, Star, Cloud,
  AlertTriangle, Menu, Fuel, Navigation
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import HamburgerMenu from "@/components/driver/HamburgerMenu";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import StatusChip from "@/components/driver/StatusChip";
import { cn } from "@/lib/utils";
import { getJobProduct, getJobRequestedGallons, STATUS_NEXT_LABEL, STATUS_NEXT_ROUTE } from "@/lib/jobHelpers";

function StopCard({ job }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const isActive   = ["en_route","loading","bol_captured","approaching","arrived","site_verified","delivering","pod_required"].includes(job.status);
  const isComplete = job.status === "completed";
  const isException = job.status === "exception";
  const product    = getJobProduct(job);
  const gallons    = getJobRequestedGallons(job);
  const nextLabel  = STATUS_NEXT_LABEL[job.status] || "Open Stop";
  const nextRoute  = STATUS_NEXT_ROUTE[job.status]?.(job.id) || `/stop/${job.id}`;

  return (
    <div className={cn(
      "bg-card border rounded-2xl overflow-hidden transition-all",
      isActive   && "border-primary/30 shadow-sm shadow-primary/10",
      isException && "border-destructive/30",
      isComplete  && "border-success/20 opacity-80",
      !isActive && !isException && !isComplete && "border-border"
    )}>
      {/* Active indicator bar */}
      {isActive && (
        <div className="h-0.5 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
      )}

      {/* Header row */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-secondary/40 transition-colors"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-label={`Stop ${job.stopNumber}: ${job.customer?.name}`}
      >
        {/* Stop number */}
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-black border",
          isActive   && "bg-primary/10 border-primary/30 text-primary",
          isComplete  && "bg-success/10 border-success/25 text-success",
          isException && "bg-destructive/10 border-destructive/25 text-destructive",
          !isActive && !isComplete && !isException && "bg-secondary border-border text-muted-foreground"
        )}>
          {job.stopNumber}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-foreground truncate">{job.customer?.name || job.stopName}</p>
            {job.priority === "high" && (
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-destructive" aria-label="High priority" />
            )}
            {job.weatherSensitive && (
              <Cloud className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-label="Weather sensitive" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {job.orderNumber} · {job.plannedTime || "—"}
          </p>
        </div>

        {/* Status chip */}
        <StatusChip status={job.status} size="dot" className="shrink-0" />

        <div className="shrink-0 ml-1">
          {expanded
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          }
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border">
          {/* Address */}
          <div className="px-4 py-3 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Delivery Site</p>
              <p className="text-sm font-semibold text-foreground">{job.site?.name || job.stopName}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{job.site?.address}</p>
            </div>
            <div className="flex gap-2 shrink-0 mt-4">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(job.site?.address || "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open in maps"
                className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-info"
              >
                <MapPin className="w-4 h-4" />
              </a>
              {job.customer?.phone && (
                <a
                  href={`tel:${job.customer.phone}`}
                  aria-label={`Call ${job.customer.name}`}
                  className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-success"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Products */}
          {job.products?.length > 0 && (
            <div className="px-4 py-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Products Ordered</p>
              <div className="space-y-1.5">
                {job.products.map((p, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color || "#60a5fa" }} aria-hidden="true" />
                    <p className="text-sm text-foreground">{p.quantity?.toLocaleString()} gal</p>
                    <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions snippet */}
          {job.instructions && (
            <div className="px-4 py-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Site Instructions</p>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{job.instructions}</p>
            </div>
          )}

          {/* CTA */}
          <div className="px-4 py-3 border-t border-border">
            <button
              onClick={() => navigate(nextRoute)}
              className={cn(
                "w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                isActive   ? "bg-primary text-primary-foreground" :
                isComplete  ? "bg-success/10 text-success border border-success/25" :
                isException ? "bg-destructive/10 text-destructive border border-destructive/25" :
                              "bg-secondary text-foreground"
              )}
            >
              {isActive && <Navigation className="w-4 h-4" />}
              {nextLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TodayShift() {
  const { driver, jobs } = useDriver();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeJobs   = jobs.filter(j => !["completed","exception"].includes(j.status));
  const doneJobs     = jobs.filter(j => j.status === "completed");
  const todayDate    = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="bg-background min-h-screen pb-28">

      {/* Branded header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-secondary active:bg-secondary/70"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <p className="text-xs font-black tracking-wide text-foreground uppercase">
              FuelRouteOS
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground">{todayDate}</p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="text-xs font-black text-primary" aria-label={`Driver initials: ${driver.initials}`}>
            {driver.initials}
          </span>
        </div>
      </header>

      <div className="px-3 py-3 space-y-2 max-w-lg mx-auto">

        {/* Shift summary strip */}
        <div className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Route Command</p>
            <p className="text-sm font-black text-foreground">
              {jobs.length} Active Stop{jobs.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-sm font-black text-success">
              {doneJobs.length} / {jobs.length}
            </p>
          </div>
          {jobs.some(j => j.priority === "high") && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-destructive bg-destructive/10 border border-destructive/25 rounded-lg px-2 py-1">
              <AlertTriangle className="w-3 h-3" aria-hidden="true" /> Priority
            </span>
          )}
        </div>

        {/* Pre-Shift */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3.5 active:bg-secondary/40 transition-colors"
            onClick={() => navigate("/pre-trip")}
            aria-label="Pre-shift activities: Pre-trip inspection"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-muted-foreground">↑</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Shift Start Activities</p>
                <p className="text-xs text-muted-foreground">Pre-trip inspection &amp; vehicle check</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>

        {/* Active stops */}
        {activeJobs.map((job) => (
          <StopCard key={job.id} job={job} />
        ))}

        {/* Completed stops */}
        {doneJobs.length > 0 && (
          <>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-1 pt-2">
              Completed Stops
            </p>
            {doneJobs.map((job) => (
              <StopCard key={job.id} job={job} />
            ))}
          </>
        )}

        {/* Post-Shift */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3.5 active:bg-secondary/40 transition-colors"
            onClick={() => navigate("/post-trip")}
            aria-label="Post-shift activities: Post-trip inspection"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-muted-foreground">↓</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Shift End Activities</p>
                <p className="text-xs text-muted-foreground">Post-trip inspection &amp; sign-off</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </div>

      </div>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <DriverBottomNav />
    </div>
  );
}