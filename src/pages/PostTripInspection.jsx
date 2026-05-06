import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, CheckCircle2, AlertTriangle, Camera } from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import { postTripChecklist, truck as truckData, trailer as trailerData } from "@/lib/mockData";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function PostTripInspection() {
  const navigate = useNavigate();
  const { addSyncItem } = useDriver();

  const [checked, setChecked]         = useState({});
  const [notes, setNotes]             = useState("");
  const [odometer, setOdometer]       = useState(String(truckData.odometerMi + 142));
  const [fuelLevel, setFuelLevel]     = useState("1/2");
  const [photoCount, setPhotoCount]   = useState(0);
  const [submitted, setSubmitted]     = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const allChecked = postTripChecklist.every(i => checked[i.id]);
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!allChecked) return;
    addSyncItem({ type: "post_trip", label: "Post-Trip Inspection", jobId: null, status: "pending" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-background min-h-screen">
        <PageHeader title="Post-Trip Inspection" backTo="/profile" />
        <div className="px-4 py-8 flex flex-col items-center gap-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-success/15 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-success" />
          </div>
          <div>
            <p className="text-xl font-black">Post-Trip Logged</p>
            <p className="text-muted-foreground text-sm mt-1">Saved to device. Sync pending.</p>
          </div>
          <div className="w-full bg-card border border-border rounded-2xl p-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Truck</span>
              <span className="font-semibold">#{truckData.number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">End Odometer</span>
              <span className="font-semibold">{parseInt(odometer).toLocaleString()} mi</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fuel Level</span>
              <span className="font-semibold">{fuelLevel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Checks Passed</span>
              <span className="font-semibold">{checkedCount} / {postTripChecklist.length}</span>
            </div>
          </div>
          <ActionButton onClick={() => navigate("/profile")} variant="primary">
            Done
          </ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-8">
      <PageHeader title="Post-Trip Inspection" subtitle="Required after completing your route" backTo="/profile" />

      <div className="px-4 py-4 space-y-4">

        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", allChecked ? "bg-success" : "bg-primary")}
              style={{ width: `${Math.round((checkedCount / postTripChecklist.length) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
            {checkedCount} / {postTripChecklist.length}
          </span>
        </div>

        {/* Readings */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">End-of-Shift Readings</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">End Odometer (mi)</label>
              <input
                type="number"
                value={odometer}
                onChange={e => setOdometer(e.target.value)}
                className="mt-1 w-full bg-secondary rounded-xl px-3 py-2 text-sm font-semibold outline-none border border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Fuel Level</label>
              <select
                value={fuelLevel}
                onChange={e => setFuelLevel(e.target.value)}
                className="mt-1 w-full bg-secondary rounded-xl px-3 py-2 text-sm font-semibold outline-none border border-border"
              >
                {["Full","7/8","3/4","5/8","1/2","3/8","1/4","1/8","Empty"].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-info" />
              <span className="text-sm font-bold">Post-Trip Checklist</span>
            </div>
            <span className="text-xs text-muted-foreground">{checkedCount}/{postTripChecklist.length}</span>
          </div>
          <div className="divide-y divide-border">
            {postTripChecklist.map(item => (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-secondary/40"
              >
                <Checkbox
                  checked={!!checked[item.id]}
                  onCheckedChange={() => toggle(item.id)}
                  className="border-border data-[state=checked]:bg-success data-[state=checked]:border-success shrink-0"
                />
                <span className={cn("text-sm", checked[item.id] ? "line-through text-muted-foreground" : "")}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setPhotoCount(n => n + 1)}
          className="w-full h-14 bg-secondary border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium active:bg-secondary/70"
        >
          <Camera className="w-5 h-5" />
          {photoCount === 0 ? "Add End-of-Shift Photos (optional)" : `${photoCount} photo${photoCount > 1 ? "s" : ""} attached`}
        </button>

        <textarea
          className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground resize-none outline-none"
          rows={3}
          placeholder="Any issues to report for next shift?…"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        {submitAttempted && !allChecked && (
          <p className="text-xs text-destructive font-semibold">
            Complete all {postTripChecklist.length} items before submitting.
          </p>
        )}

        <ActionButton
          onClick={handleSubmit}
          variant={allChecked ? "success" : "primary"}
          icon={allChecked ? ShieldCheck : AlertTriangle}
        >
          {allChecked ? "Submit Post-Trip Inspection" : `Complete Checklist (${checkedCount}/${postTripChecklist.length})`}
        </ActionButton>
      </div>
    </div>
  );
}