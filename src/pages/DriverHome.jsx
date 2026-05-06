import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Fuel, CalendarDays, ScanLine, MessageSquare, Wrench,
  RefreshCw, Play, Truck, Container, Wifi, WifiOff,
  AlertTriangle, CheckCircle2, Clock, Menu, ChevronRight
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import HamburgerMenu from "@/components/driver/HamburgerMenu";
import StatusChip from "@/components/driver/StatusChip";
import { getTenantName } from "@/lib/branding";
import { cn } from "@/lib/utils";

function QuickAction({ icon: Icon, label, onClick, variant = "default", badge }) {
  const styles = {
    default:  "bg-card border border-border text-foreground",
    primary:  "bg-primary text-primary-foreground border border-primary",
    success:  "bg-success/10 border border-success/30 text-success",
    warning:  "bg-warning/10 border border-warning/30 text-warning-foreground",
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-2xl p-4 min-h-[80px] active:scale-[0.97] transition-all relative",
        styles[variant]
      )}
    >
      {badge && (
        <span className="absolute top-2 right-2 min-w-[18px] h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-1">
          {badge}
        </span>
      )}
      <Icon className="w-6 h-6" />
      <span className="text-[11px] font-bold text-center leading-tight">{label}</span>
    </button>
  );
}

export default function DriverHome() {
  const navigate = useNavigate();
  const { driver, truck, trailer, jobs, signal, totalUnsynced, failedSyncCount } = useDriver();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeJob = jobs.find(j => ["en_route", "loading", "bol_captured", "approaching", "arrived", "delivering"].includes(j.status));
  const nextPendingJob = jobs.find(j => j.status === "pending");
  const focusJob = activeJob || nextPendingJob;

  const completedCount = jobs.filter(j => j.status === "completed").length;
  const totalJobs = jobs.length;
  const shiftStarted = jobs.some(j => j.status !== "pending");

  const todayDate = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  const connectionConfig = {
    online: { icon: Wifi, label: "Connected", color: "text-success", bg: "bg-success/10 border-success/20" },
    weak:   { icon: Wifi, label: "Weak Signal", color: "text-warning", bg: "bg-warning/10 border-warning/20" },
    offline: { icon: WifiOff, label: "Offline", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
  };
  const conn = connectionConfig[signal] || connectionConfig.online;
  const ConnIcon = conn.icon;

  return (
    <div className="bg-background min-h-screen pb-28">

      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          className="w-11 h-11 flex items-center justify-center rounded-xl bg-secondary active:bg-secondary/70"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <p className="text-xs font-black tracking-wide text-foreground uppercase">FuelRouteOS</p>
          </div>
          <p className="text-[10px] text-muted-foreground">{todayDate}</p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <span className="text-xs font-black text-primary">{driver.initials}</span>
        </div>
      </header>

      <div className="px-3 py-4 space-y-3 max-w-lg mx-auto">

        {/* Driver Card */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-base font-black text-primary">{driver.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-base text-foreground truncate">{driver.name}</p>
              <p className="text-xs text-muted-foreground">{getTenantName()}</p>
            </div>
            <div className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shrink-0", conn.bg, conn.color)}>
              <ConnIcon className="w-3.5 h-3.5" />
              {conn.label}
            </div>
          </div>

          {/* Truck / Trailer */}
          <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Truck</p>
                <p className="text-xs font-bold text-foreground truncate">#{truck.number} · {truck.year} {truck.make}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Container className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground">Trailer</p>
                <p className="text-xs font-bold text-foreground truncate">#{trailer.number}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shift Summary */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Shift Status</p>
            <span className={cn(
              "text-[10px] font-black px-2 py-1 rounded-lg",
              shiftStarted ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
            )}>
              {shiftStarted ? "IN PROGRESS" : "NOT STARTED"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-3xl font-black text-foreground">{completedCount}<span className="text-base font-semibold text-muted-foreground">/{totalJobs}</span></p>
              <p className="text-xs text-muted-foreground">Stops completed</p>
            </div>
            {totalUnsynced > 0 && (
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold",
                failedSyncCount > 0 ? "bg-destructive/10 border-destructive/25 text-destructive" : "bg-warning/10 border-warning/25 text-warning-foreground"
              )}>
                <RefreshCw className="w-3.5 h-3.5" />
                {totalUnsynced} pending sync
              </div>
            )}
          </div>
        </div>

        {/* Active / Next Job */}
        {focusJob && (
          <div
            className="bg-card border border-primary/25 rounded-2xl p-4 space-y-3"
            role="region"
            aria-label="Active stop"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                {activeJob ? "Active Stop" : "Next Stop"}
              </p>
              <StatusChip status={focusJob.status} size="sm" />
            </div>
            <div>
              <p className="font-black text-base text-foreground">{focusJob.customer?.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{focusJob.site?.address}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {focusJob.plannedTime || "—"}
                </span>
                <span>Stop #{focusJob.stopNumber}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/stop/${focusJob.id}`)}
              className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-primary/85"
            >
              Open Stop <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold px-1 mb-2">Quick Actions</p>
          <div className="grid grid-cols-3 gap-2">
            <QuickAction
              icon={shiftStarted ? Play : Play}
              label={shiftStarted ? "Continue Shift" : "Start Shift"}
              variant="primary"
              onClick={() => navigate("/today-shift")}
            />
            <QuickAction
              icon={CalendarDays}
              label="Today's Route"
              onClick={() => navigate("/today-shift")}
            />
            <QuickAction
              icon={ScanLine}
              label="Universal Scan"
              onClick={() => navigate("/scan")}
            />
            <QuickAction
              icon={MessageSquare}
              label="Dispatch Chat"
              onClick={() => navigate("/chat")}
            />
            <QuickAction
              icon={Wrench}
              label="Vehicle Issue"
              variant="warning"
              onClick={() => navigate("/vehicle-issue")}
            />
            <QuickAction
              icon={RefreshCw}
              label="Sync Queue"
              badge={totalUnsynced > 0 ? totalUnsynced : null}
              onClick={() => navigate("/sync")}
            />
          </div>
        </div>

      </div>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <DriverBottomNav />
    </div>
  );
}