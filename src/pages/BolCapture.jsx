import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Camera, FileText, Check, RotateCcw, AlertTriangle,
  Phone, Info, Clock, Package, CircleSlash
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import SyncBadge from "@/components/driver/SyncBadge";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { getJobProduct, getJobRequestedGallons } from "@/lib/jobHelpers";

export default function BolCapture() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob, updateJobStatus, addSyncItem, signal, driver } = useDriver();
  const job = jobs.find(j => j.id === jobId);

  const now = format(new Date(), "HH:mm");

  const [bolNumber, setBolNumber] = useState(job?.bol?.number || "");
  const [terminal, setTerminal] = useState(job?.bol?.terminal || "Magellan East Austin");
  const jobProduct = getJobProduct(job);
  const jobGallons = getJobRequestedGallons(job);
  const [grossGallons, setGrossGallons] = useState(
    job?.bol?.grossGallons || (jobGallons ? String(jobGallons + 40) : "")
  );
  const [netGallons, setNetGallons] = useState(
    job?.bol?.netGallons || String(jobGallons || "")
  );
  const [loadTime, setLoadTime] = useState(now);
  const [notes, setNotes] = useState("");
  const [driverConfirmed, setDriverConfirmed] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [showMissingWarning, setShowMissingWarning] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  if (!job) return null;

  const missingPhoto = !photoCaptured;
  const missingBol = !bolNumber.trim();
  const missingTerminal = !terminal.trim();
  const missingConfirm = !driverConfirmed;
  const canSave = photoCaptured && bolNumber.trim() && terminal.trim() && driverConfirmed;

  const handleSave = () => {
    setSubmitAttempted(true);
    if (!canSave) {
      setShowMissingWarning(true);
      return;
    }
    setShowMissingWarning(false);

    const bolData = {
      number: bolNumber.trim(),
      terminal: terminal.trim(),
      product: jobProduct,
      grossGallons: Number(grossGallons),
      netGallons: Number(netGallons),
      loadTime,
      captured: true,
      imageStatus: "captured",
    };

    updateJob(job.id, { bol: bolData });
    updateJobStatus(job.id, "bol_captured");

    addSyncItem({
      type: "bol_capture",
      label: "BOL / Pickup Confirmation",
      jobId: job.id,
      bolNumber: bolNumber.trim(),
      terminal: terminal.trim(),
      product: bolData.product,
      grossGallons: Number(grossGallons),
      netGallons: Number(netGallons),
      loadTime,
      driverId: driver.id,
      deviceId: "device-local",
      imageStatus: "captured",
      source: "device_capture",
      status: signal === "offline" ? "pending" : "pending",
      savedAt: format(new Date(), "HH:mm"),
    });

    navigate(`/job/${job.id}/navigate`);
  };

  return (
    <div className="bg-background min-h-screen pb-28">
      <PageHeader
        title="Capture BOL"
        subtitle={`Stop #${job.stopNumber} — ${job.customer.name}`}
        backTo={`/job/${job.id}/load`}
        rightAction={
          <a href="tel:5125550100" className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-success/15 border border-success/30">
            <Phone className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-semibold text-success">Dispatch</span>
          </a>
        }
      />

      <div className="px-4 py-4 space-y-4">

        {/* Instruction */}
        <div className="bg-info/5 border border-info/20 rounded-xl p-3 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-info shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Confirm load before leaving terminal. Photo, BOL number, and terminal are required. Check all details match your paperwork.
          </p>
        </div>

        {/* Missing BOL Warning */}
        {showMissingWarning && (
          <div className="bg-destructive/8 border border-destructive/30 rounded-2xl p-4 flex items-start gap-3">
            <CircleSlash className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-destructive">Missing Required Fields</p>
              <ul className="mt-1 space-y-0.5">
                {missingPhoto && <li className="text-xs text-destructive">• BOL photo not captured</li>}
                {missingBol && <li className="text-xs text-destructive">• BOL number is blank</li>}
                {missingTerminal && <li className="text-xs text-destructive">• Terminal / rack is blank</li>}
                {missingConfirm && <li className="text-xs text-destructive">• Driver confirmation not checked</li>}
              </ul>
            </div>
          </div>
        )}

        {/* BOL Photo Capture */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            BOL Photo <span className="text-destructive">*</span>
          </p>
          <div className={`rounded-2xl overflow-hidden border-2 transition-colors ${
            submitAttempted && missingPhoto
              ? "border-destructive/50 bg-destructive/5"
              : photoCaptured
              ? "border-success/40 bg-success/5"
              : "border-dashed border-border bg-card"
          }`}>
            {!photoCaptured ? (
              <button
                onClick={() => setPhotoCaptured(true)}
                className="w-full flex flex-col items-center justify-center py-12 gap-3 active:bg-secondary/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-bold">Tap to Capture BOL Photo</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Take a clear, well-lit photo of the full Bill of Lading document
                  </p>
                </div>
              </button>
            ) : (
              <div className="relative">
                <div className="w-full h-44 bg-secondary/60 flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-success/15 flex items-center justify-center">
                    <Check className="w-7 h-7 text-success" />
                  </div>
                  <p className="text-sm font-bold text-success">BOL Photo Captured</p>
                  <p className="text-xs text-muted-foreground">Saved locally</p>
                </div>
                <button
                  onClick={() => setPhotoCaptured(false)}
                  className="absolute top-3 right-3 h-9 px-3 bg-card/90 backdrop-blur rounded-xl flex items-center justify-center gap-1.5 border border-border text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BOL Details */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2 pb-1">
            <FileText className="w-4 h-4 text-info" />
            <p className="text-sm font-bold">BOL Details</p>
          </div>

          {/* BOL Number */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              BOL Number <span className="text-destructive">*</span>
            </label>
            <Input
              value={bolNumber}
              onChange={e => setBolNumber(e.target.value)}
              placeholder="e.g. BOL-92841"
              className={`h-12 bg-secondary border-border rounded-xl text-base font-bold tracking-wide ${submitAttempted && missingBol ? "border-destructive" : ""}`}
            />
          </div>

          {/* Terminal */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              Terminal / Rack <span className="text-destructive">*</span>
            </label>
            <Input
              value={terminal}
              onChange={e => setTerminal(e.target.value)}
              placeholder="e.g. Magellan East Austin"
              className={`h-12 bg-secondary border-border rounded-xl font-semibold ${submitAttempted && missingTerminal ? "border-destructive" : ""}`}
            />
          </div>

          {/* Product — read only */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              Product
            </label>
            <div className="h-12 bg-secondary/60 border border-border rounded-xl px-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">{jobProduct}</span>
            </div>
          </div>

          {/* Gallons */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Gross Gallons</label>
              <Input
                type="number"
                inputMode="numeric"
                value={grossGallons}
                onChange={e => setGrossGallons(e.target.value)}
                className="h-12 bg-secondary border-border rounded-xl text-base font-bold text-center"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Net Gallons</label>
              <Input
                type="number"
                inputMode="numeric"
                value={netGallons}
                onChange={e => setNetGallons(e.target.value)}
                className="h-12 bg-secondary border-border rounded-xl text-base font-bold text-center"
              />
            </div>
          </div>

          {/* Load time */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              Load Time
            </label>
            <Input
              type="time"
              value={loadTime}
              onChange={e => setLoadTime(e.target.value)}
              className="h-12 bg-secondary border-border rounded-xl font-semibold"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Notes (optional)</label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Loading issues, discrepancies, seal numbers..."
              className="bg-secondary border-border rounded-xl resize-none h-20"
            />
          </div>
        </div>

        {/* Driver Confirmation */}
        <div className={`rounded-2xl p-4 border transition-colors ${
          driverConfirmed
            ? "bg-success/5 border-success/30"
            : submitAttempted && missingConfirm
            ? "bg-destructive/5 border-destructive/30"
            : "bg-card border-border"
        }`}>
          <button
            onClick={() => setDriverConfirmed(!driverConfirmed)}
            className="flex items-start gap-3 w-full text-left"
          >
            <Checkbox
              checked={driverConfirmed}
              onCheckedChange={setDriverConfirmed}
              className="mt-0.5 border-border data-[state=checked]:bg-success data-[state=checked]:border-success"
            />
            <div>
              <p className="text-sm font-bold">Driver Confirmation</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                I confirm the BOL details above are correct, the product matches the order, and the load is secure before departure.
              </p>
            </div>
          </button>
        </div>

        {/* Offline save notice */}
        <div className="bg-muted/30 border border-border rounded-xl px-3 py-2.5 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-semibold">BOL pickup confirmation image</p>
            <SyncBadge status={signal === "offline" ? "offline" : "pending"} />
          </div>
          <p className="text-xs text-muted-foreground">
            {signal === "offline"
              ? "Pending dispatch sync — BOL saved on device. Will sync automatically when online."
              : "BOL saved on device · Sync item created · Will sync automatically"}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <ActionButton onClick={handleSave} icon={Check}>
            Save BOL & Navigate to Site
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="md"
            icon={AlertTriangle}
            onClick={() => navigate(`/exception?jobId=${job.id}`)}
          >
            Report BOL Issue
          </ActionButton>
        </div>
      </div>
      <DriverBottomNav />
    </div>
  );
}