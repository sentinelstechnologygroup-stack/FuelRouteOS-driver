import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench, AlertTriangle, XOctagon, Camera, CheckCircle2, Clock
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import { truck as truckData, trailer as trailerData, maintenanceHistory } from "@/lib/mockData";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import { cn } from "@/lib/utils";

const SEVERITIES = [
  {
    id: "minor",
    label: "Minor",
    desc: "Continue driving. Log for next maintenance.",
    icon: Wrench,
    color: "text-info",
    bg: "bg-info/10 border-info/30",
    activeBg: "bg-info/20 border-info/60",
  },
  {
    id: "needs_attention",
    label: "Needs Attention",
    desc: "Continue today, but schedule repair ASAP.",
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10 border-warning/30",
    activeBg: "bg-warning/20 border-warning/60",
  },
  {
    id: "do_not_operate",
    label: "Do Not Operate",
    desc: "Vehicle must not be driven. Contact dispatch immediately.",
    icon: XOctagon,
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
    activeBg: "bg-destructive/20 border-destructive/60",
  },
];

const ISSUE_CATEGORIES = [
  "Engine / Powertrain", "Brakes", "Tires / Wheels", "Lighting",
  "Trailer / Hoses", "Valves / Seals", "Cab / Interior", "Other",
];

export default function VehicleIssueReport() {
  const navigate = useNavigate();
  const { addSyncItem } = useDriver();

  const [severity,  setSeverity]  = useState(null);
  const [category,  setCategory]  = useState("");
  const [desc,      setDesc]      = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const canSubmit = severity && category && desc.trim().length >= 5;

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!canSubmit) return;
    addSyncItem({ type: "vehicle_issue", label: `Vehicle Issue — ${category}`, jobId: null, status: "pending" });
    setSubmitted(true);
  };

  if (submitted) {
    const sev = SEVERITIES.find(s => s.id === severity);
    return (
      <div className="bg-background min-h-screen">
        <PageHeader title="Issue Report" backTo="/profile" />
        <div className="px-4 py-8 flex flex-col items-center gap-6 text-center">
          <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center", sev?.bg)}>
            {sev && <sev.icon className={cn("w-10 h-10", sev.color)} />}
          </div>
          <div>
            <p className="text-xl font-black">Issue Reported</p>
            <p className="text-muted-foreground text-sm mt-1">Saved to device. Sync pending.</p>
          </div>
          {severity === "do_not_operate" && (
            <div className="w-full bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-left">
              <p className="font-bold text-destructive text-sm">Action Required</p>
              <p className="text-xs text-muted-foreground mt-1">
                You reported a Do Not Operate issue. Do not drive this vehicle. Contact dispatch immediately.
              </p>
              <a href="tel:5125550100" className="mt-3 flex items-center justify-center gap-2 h-11 bg-destructive text-destructive-foreground rounded-xl text-sm font-bold w-full">
                Call Dispatch Now
              </a>
            </div>
          )}
          <ActionButton onClick={() => navigate("/profile")} variant="primary">
            Back to Profile
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-8">
      <PageHeader title="Report Vehicle Issue" subtitle={`Truck #${truckData.number}`} backTo="/profile" />

      <div className="px-4 py-4 space-y-4">

        {/* Asset */}
        <div className="bg-card border border-border rounded-2xl p-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground">Truck</p>
            <p className="font-bold text-sm">#{truckData.number} — {truckData.year} {truckData.make} {truckData.model}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Trailer</p>
            <p className="font-bold text-sm">#{trailerData.number}</p>
          </div>
        </div>

        {/* Severity */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1">Severity</p>
          {SEVERITIES.map(sev => {
            const active = severity === sev.id;
            return (
              <button
                key={sev.id}
                onClick={() => setSeverity(sev.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all",
                  active ? sev.activeBg : sev.bg
                )}
              >
                <sev.icon className={cn("w-5 h-5 shrink-0", sev.color)} />
                <div className="flex-1 text-left">
                  <p className={cn("font-bold text-sm", sev.color)}>{sev.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sev.desc}</p>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 shrink-0",
                  active ? `border-current bg-current ${sev.color}` : "border-border"
                )}>
                  {active && <div className="w-full h-full rounded-full bg-current opacity-0" />}
                </div>
              </button>
            );
          })}
          {submitAttempted && !severity && (
            <p className="text-xs text-destructive px-1">Select a severity level.</p>
          )}
        </div>

        {/* Category */}
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1 mb-2">Category</p>
          <div className="grid grid-cols-2 gap-2">
            {ISSUE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all",
                  category === cat
                    ? "bg-primary/15 border-primary/40 text-primary"
                    : "bg-card border-border text-muted-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          {submitAttempted && !category && (
            <p className="text-xs text-destructive mt-1 px-1">Select a category.</p>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1 mb-2">Description</p>
          <textarea
            className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground resize-none outline-none"
            rows={4}
            placeholder="Describe the issue in detail…"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          {submitAttempted && desc.trim().length < 5 && (
            <p className="text-xs text-destructive mt-1 px-1">Please provide a description.</p>
          )}
        </div>

        {/* Photo */}
        <button
          onClick={() => setPhotoCount(n => n + 1)}
          className="w-full h-14 bg-secondary border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium active:bg-secondary/70"
        >
          <Camera className="w-5 h-5" />
          {photoCount === 0 ? "Add Issue Photos (optional)" : `${photoCount} photo${photoCount > 1 ? "s" : ""} attached`}
        </button>

        {/* History preview */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Recent Maintenance History</p>
          </div>
          {maintenanceHistory.map((entry, idx) => (
            <div
              key={entry.id}
              className={cn("px-4 py-3 flex items-center gap-3", idx < maintenanceHistory.length - 1 && "border-b border-border")}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                entry.severity === "do_not_operate" ? "bg-destructive/15" :
                entry.severity === "needs_attention" ? "bg-warning/15" :
                entry.severity === "minor" ? "bg-info/15" : "bg-success/15"
              )}>
                {entry.severity ? <Wrench className="w-4 h-4 text-muted-foreground" /> : <CheckCircle2 className="w-4 h-4 text-success" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{entry.summary}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{entry.date}</span>
                  <span>·</span>
                  <span>{entry.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <ActionButton
          onClick={handleSubmit}
          variant={severity === "do_not_operate" ? "destructive" : "primary"}
          icon={severity === "do_not_operate" ? XOctagon : Wrench}
        >
          Submit Issue Report
        </ActionButton>
      </div>
    </div>
  );
}