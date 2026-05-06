import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserX, MapPinOff, CircleAlert, CircleSlash, RefreshCcwDot,
  Wrench, ShieldAlert, Droplets, FileWarning, TrendingDown,
  Settings, MessageSquare, Camera, Phone, Send, CheckCircle2,
  AlertTriangle, CloudOff, ChevronRight, Info
} from "lucide-react";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const iconMap = {
  UserX, MapPinOff, CircleAlert, CircleSlash, RefreshCcwDot,
  Wrench, ShieldAlert, Droplets, FileWarning, TrendingDown,
  Settings, MessageSquare
};

const exceptionTypes = [
  { id: "cust_unavail", label: "Customer Unavailable", icon: "UserX", hint: "No one available to receive delivery" },
  { id: "wrong_site", label: "Wrong Site", icon: "MapPinOff", hint: "Address doesn't match dispatch order" },
  { id: "wrong_tank", label: "Wrong Tank", icon: "CircleAlert", hint: "Tank ID doesn't match BOL" },
  { id: "tank_full", label: "Tank Full", icon: "CircleSlash", hint: "Tank has no ullage available" },
  { id: "product_mismatch", label: "Product Mismatch", icon: "RefreshCcwDot", hint: "Product in tank doesn't match order" },
  { id: "unsafe_condition", label: "Unsafe Condition", icon: "ShieldAlert", hint: "Site condition prevents safe delivery" },
  { id: "spill_concern", label: "Spill / Safety", icon: "Droplets", hint: "Spill or safety incident occurred" },
  { id: "equipment_issue", label: "Equipment Issue", icon: "Wrench", hint: "Hose, pump, or fitting problem" },
  { id: "bol_issue", label: "BOL Issue", icon: "FileWarning", hint: "BOL missing, damaged, or incorrect" },
  { id: "short_load", label: "Short Load", icon: "TrendingDown", hint: "Loaded quantity less than ordered" },
  { id: "mechanical", label: "Mechanical Issue", icon: "Settings", hint: "Truck or trailer mechanical problem" },
  { id: "other", label: "Other", icon: "MessageSquare", hint: "Any other issue not listed" },
];

const severities = [
  { id: "low", label: "Low", desc: "Minor, can continue", activeClass: "bg-muted text-foreground border-border" },
  { id: "medium", label: "Medium", desc: "Needs follow-up", activeClass: "bg-warning/15 text-warning border-warning/40" },
  { id: "high", label: "High", desc: "Stop work now", activeClass: "bg-destructive/15 text-destructive border-destructive/40" },
];

export default function ExceptionReport() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get("jobId");
  const preselected = urlParams.get("type");

  const [selected, setSelected] = useState(preselected || null);
  const [severity, setSeverity] = useState("medium");
  const [notes, setNotes] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedType = exceptionTypes.find(t => t.id === selected);
  const isCritical = ["unsafe_condition", "spill_concern", "mechanical"].includes(selected);

  const handleSaveOffline = () => {
    setSavedOffline(true);
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!selected || !notes.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      navigate(jobId ? `/job/${jobId}` : "/today");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 max-w-lg mx-auto">
        <div className="text-center w-full">
          <div className="w-20 h-20 rounded-3xl bg-warning/15 flex items-center justify-center mx-auto mb-5">
            <Send className="w-9 h-9 text-warning" />
          </div>
          <h2 className="text-xl font-bold mb-1">Exception Submitted</h2>
          <p className="text-sm text-muted-foreground mb-6">Dispatch has been notified</p>
          <div className="bg-card border border-border rounded-2xl p-4 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Type</span>
              <span className="text-xs font-bold">{selectedType?.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Severity</span>
              <span className={cn("text-xs font-bold capitalize", severity === "high" ? "text-destructive" : severity === "medium" ? "text-warning" : "text-muted-foreground")}>
                {severity}
              </span>
            </div>
            {photoCount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Photos</span>
                <span className="text-xs font-bold">{photoCount} attached</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4 bg-success/10 border border-success/20 rounded-xl p-3">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
            <p className="text-xs text-success font-medium">Saved and synced to dispatch</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-8">
      <PageHeader
        title="Report Exception"
        subtitle={jobId ? `Job #${jobId.replace("JOB-", "")}` : "General report"}
        backTo={jobId ? `/job/${jobId}` : "/today"}
        rightAction={
          <a href="tel:5125550100" className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-success/15 border border-success/30">
            <Phone className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-semibold text-success">Dispatch</span>
          </a>
        }
      />

      <div className="px-4 py-4 space-y-4">

        {/* Critical safety warning */}
        {isCritical && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-destructive">Critical Safety Event</p>
              <p className="text-xs text-muted-foreground mt-0.5">Stop all work immediately. Call dispatch before proceeding.</p>
              <a href="tel:5125550100" className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-destructive underline">
                <Phone className="w-3.5 h-3.5" /> Call Dispatch Now
              </a>
            </div>
          </div>
        )}

        {/* Exception Type Grid */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Select Exception Type <span className="text-destructive">*</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {exceptionTypes.map(type => {
              const Icon = iconMap[type.icon] || CircleAlert;
              const isSelected = selected === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelected(type.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all active:scale-95",
                    isSelected
                      ? "bg-warning/10 border-warning/50 text-warning"
                      : "bg-card border-border text-muted-foreground hover:border-border/80"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-semibold text-center leading-tight">{type.label}</span>
                </button>
              );
            })}
          </div>
          {submitAttempted && !selected && (
            <p className="text-xs text-destructive mt-1.5">Select an exception type.</p>
          )}
        </div>

        {/* Selected type hint */}
        {selectedType && (
          <div className="bg-warning/5 border border-warning/20 rounded-xl p-3 flex items-center gap-2.5">
            <Info className="w-4 h-4 text-warning shrink-0" />
            <p className="text-xs text-muted-foreground">{selectedType.hint}</p>
          </div>
        )}

        {selected && (
          <>
            {/* Severity */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Severity</p>
              <div className="space-y-2">
                {severities.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSeverity(s.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all",
                      severity === s.id ? s.activeClass : "bg-secondary border-transparent text-muted-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        severity === s.id ? "border-current" : "border-muted-foreground"
                      )}>
                        {severity === s.id && <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <span className="text-sm font-bold">{s.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <label className="text-xs font-bold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                Describe the Issue <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={`What happened? Be specific — e.g. "${selectedType?.label.toLowerCase()} at ${jobId || "site"}..."`}
                className={cn(
                  "bg-secondary border-border rounded-xl resize-none h-28 text-sm",
                  submitAttempted && !notes.trim() && "border-destructive"
                )}
              />
              {submitAttempted && !notes.trim() && (
                <p className="text-xs text-destructive mt-1.5">Description is required.</p>
              )}
            </div>

            {/* Photos */}
            <button
              onClick={() => setPhotoCount(p => p + 1)}
              className={cn(
                "w-full bg-card border rounded-2xl p-4 flex items-center gap-3 active:bg-secondary/40",
                photoCount > 0 ? "border-success/30 bg-success/5" : "border-border"
              )}
            >
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                photoCount > 0 ? "bg-success/15" : "bg-secondary"
              )}>
                <Camera className={cn("w-5 h-5", photoCount > 0 ? "text-success" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold">Attach Photos</p>
                <p className="text-xs text-muted-foreground">
                  {photoCount > 0
                    ? `${photoCount} photo${photoCount > 1 ? "s" : ""} attached — tap for more`
                    : "Recommended — photograph the issue"}
                </p>
              </div>
              {photoCount > 0
                ? <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              }
            </button>

            {/* Save offline indicator */}
            {savedOffline && (
              <div className="bg-muted/40 border border-border rounded-xl p-3 flex items-center gap-2">
                <CloudOff className="w-4 h-4 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground">Saved offline — will sync when connected.</p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <ActionButton onClick={handleSubmit} variant="warning" icon={Send}>
                Submit Exception to Dispatch
              </ActionButton>

              <ActionButton
                variant="secondary"
                size="md"
                icon={CloudOff}
                onClick={handleSaveOffline}
              >
                {savedOffline ? "Saved Offline ✓" : "Save Offline Only"}
              </ActionButton>

              <a
                href="tel:5125550100"
                className="w-full h-12 bg-success/10 border border-success/25 text-success rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:bg-success/20"
              >
                <Phone className="w-4 h-4" /> Call Dispatch Directly
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}