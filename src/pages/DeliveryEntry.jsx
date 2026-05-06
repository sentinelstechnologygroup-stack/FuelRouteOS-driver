import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Droplets, Camera, AlertTriangle, ArrowRight, Clock,
  Phone, Info, CheckCircle2, Gauge, FlaskConical
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import SyncBadge from "@/components/driver/SyncBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getJobProduct, getJobRequestedGallons, getJobTank, getJobProductColor } from "@/lib/jobHelpers";
import DriverBottomNav from "@/components/driver/DriverBottomNav";

export default function DeliveryEntry() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob, updateJobStatus, signal } = useDriver();
  const job = jobs.find(j => j.id === jobId);

  const now = format(new Date(), "HH:mm");
  const jobProduct = getJobProduct(job);
  const requestedGallons = getJobRequestedGallons(job);
  const jobTank = getJobTank(job);
  const productColor = getJobProductColor(job);

  const [startMeter, setStartMeter] = useState("");
  const [endMeter, setEndMeter] = useState("");
  const [tankBefore, setTankBefore] = useState(jobTank?.currentLevel?.toString() || "");
  const [tankAfter, setTankAfter] = useState("");
  const [startTime, setStartTime] = useState(now);
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [productConfirmed, setProductConfirmed] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  if (!job) return null;

  const deliveredGallons = endMeter && startMeter
    ? Math.max(0, Number(endMeter) - Number(startMeter))
    : 0;

  const isOverDelivery = deliveredGallons > 0 && deliveredGallons > requestedGallons * 1.05;
  const isUnderDelivery = deliveredGallons > 0 && deliveredGallons < requestedGallons * 0.95;
  const hasDiscrepancy = isOverDelivery || isUnderDelivery;

  const canSave = startMeter && endMeter && productConfirmed;

  const handleSave = () => {
    setSubmitAttempted(true);
    if (!canSave) return;
    updateJobStatus(job.id, "pod_required");
    updateJob(job.id, {
      delivery: {
        startMeter: Number(startMeter),
        endMeter: Number(endMeter),
        startTime,
        endTime: endTime || now,
        tankBefore: Number(tankBefore),
        tankAfter: Number(tankAfter),
      },
      deliveredGallons,
    });
    navigate(`/job/${job.id}/pod`);
  };

  return (
    <div className="bg-background min-h-screen pb-8">
      <PageHeader
        title="Delivery Entry"
        subtitle={`${job.customer.name} · Stop #${job.stopNumber}`}
        backTo={`/job/${job.id}/arrive`}
        rightAction={
          <a href="tel:5125550100" className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-success/15 border border-success/30">
            <Phone className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-semibold text-success">Dispatch</span>
          </a>
        }
      />

      <div className="px-4 py-4 space-y-4">

        {/* Product Confirmation — must confirm before saving */}
        <div className={cn(
          "rounded-2xl border p-4 transition-colors",
          productConfirmed
            ? "bg-success/5 border-success/30"
            : submitAttempted && !productConfirmed
            ? "bg-destructive/5 border-destructive/30"
            : "bg-card border-border"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-5 h-5 rounded-full shrink-0"
              style={{ backgroundColor: productColor }}
            />
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Delivering</p>
              <p className="font-bold">{jobProduct}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Ordered</p>
              <p className="font-bold text-primary">{requestedGallons.toLocaleString()} gal</p>
            </div>
          </div>
          <button
            onClick={() => setProductConfirmed(!productConfirmed)}
            className="flex items-center gap-2.5 w-full"
          >
            <div className={cn(
              "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
              productConfirmed ? "bg-success border-success" : "border-muted-foreground"
            )}>
              {productConfirmed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </div>
            <p className={cn("text-xs font-semibold", productConfirmed ? "text-success" : "text-muted-foreground")}>
              I confirm product matches — {job.product}
            </p>
          </button>
          {submitAttempted && !productConfirmed && (
            <p className="text-xs text-destructive mt-2">Product confirmation is required.</p>
          )}
        </div>

        {/* Meter Readings */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-info" />
            <p className="text-sm font-bold">Meter Readings</p>
            <span className="text-[10px] text-destructive font-semibold ml-auto">* Required</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Starting Meter <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={startMeter}
                onChange={e => setStartMeter(e.target.value)}
                placeholder="0"
                className={cn(
                  "h-14 bg-secondary border-border rounded-xl text-2xl font-black text-center",
                  submitAttempted && !startMeter && "border-destructive"
                )}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
                Ending Meter <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                inputMode="numeric"
                value={endMeter}
                onChange={e => setEndMeter(e.target.value)}
                placeholder="0"
                className={cn(
                  "h-14 bg-secondary border-border rounded-xl text-2xl font-black text-center",
                  submitAttempted && !endMeter && "border-destructive"
                )}
              />
            </div>
          </div>

          {/* Live calculated gallons */}
          <div className={cn(
            "rounded-xl p-3 text-center border",
            deliveredGallons === 0
              ? "bg-secondary/40 border-border"
              : hasDiscrepancy
              ? "bg-warning/10 border-warning/40"
              : "bg-primary/10 border-primary/20"
          )}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Gallons Delivered</p>
            <p className={cn(
              "text-4xl font-black leading-none",
              deliveredGallons === 0 ? "text-muted-foreground" : hasDiscrepancy ? "text-warning" : "text-primary"
            )}>
              {deliveredGallons > 0 ? deliveredGallons.toLocaleString() : "—"}
            </p>
            {deliveredGallons > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                of {requestedGallons.toLocaleString()} ordered
              </p>
            )}
            {isOverDelivery && (
              <p className="text-xs text-warning font-bold mt-1.5">⚠ Over-delivery — verify before continuing</p>
            )}
            {isUnderDelivery && (
              <p className="text-xs text-warning font-bold mt-1.5">⚠ Short load — verify or report exception</p>
            )}
          </div>

          {submitAttempted && (!startMeter || !endMeter) && (
            <p className="text-xs text-destructive">Both meter readings are required.</p>
          )}
        </div>

        {/* Tank Levels */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-bold">Tank Levels</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Before Delivery (gal)</label>
              <Input
                type="number"
                inputMode="numeric"
                value={tankBefore}
                onChange={e => setTankBefore(e.target.value)}
                className="h-12 bg-secondary border-border rounded-xl text-base font-bold text-center"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">After Delivery (gal)</label>
              <Input
                type="number"
                inputMode="numeric"
                value={tankAfter}
                onChange={e => setTankAfter(e.target.value)}
                className="h-12 bg-secondary border-border rounded-xl text-base font-bold text-center"
              />
            </div>
          </div>
        </div>

        {/* Delivery Times */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-bold">Delivery Times</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="h-12 bg-secondary border-border rounded-xl font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="h-12 bg-secondary border-border rounded-xl font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Photo attachment */}
        <button
          onClick={() => setPhotoCount(p => p + 1)}
          className={cn(
            "w-full bg-card border rounded-2xl p-4 flex items-center gap-3 active:bg-secondary/40 transition-colors",
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
            <p className="text-sm font-bold">Delivery Photos</p>
            <p className="text-xs text-muted-foreground">
              {photoCount > 0
                ? `${photoCount} photo${photoCount > 1 ? "s" : ""} added — tap to add more`
                : "Tap to add photo of delivery / meter reading"}
            </p>
          </div>
          {photoCount > 0 && <CheckCircle2 className="w-5 h-5 text-success shrink-0" />}
        </button>

        {/* Notes */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Notes (optional)</label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Access conditions, discrepancies, customer instructions..."
            className="bg-secondary border-border rounded-xl resize-none h-20"
          />
        </div>

        {/* Offline / sync notice */}
        <div className="flex items-center justify-between bg-muted/30 border border-border rounded-xl px-3 py-2.5">
          <p className="text-xs text-muted-foreground">
            {signal === "offline" ? "Delivery saved locally — will sync on reconnect" : "Data saved — syncs automatically"}
          </p>
          <SyncBadge status={signal === "offline" ? "offline" : "pending"} label={signal === "offline" ? "Saved offline" : "Will sync"} />
        </div>

        {/* Validation summary */}
        {submitAttempted && !canSave && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-destructive mb-0.5">Complete required fields:</p>
              {!startMeter && <p className="text-xs text-destructive">• Starting meter reading</p>}
              {!endMeter && <p className="text-xs text-destructive">• Ending meter reading</p>}
              {!productConfirmed && <p className="text-xs text-destructive">• Product confirmation</p>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <ActionButton onClick={handleSave} icon={ArrowRight}>
            Save Delivery & Capture POD
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="md"
            icon={AlertTriangle}
            onClick={() => navigate(`/exception?jobId=${job.id}`)}
          >
            Report Delivery Exception
          </ActionButton>
        </div>
      </div>
      <DriverBottomNav />
    </div>
  );
}