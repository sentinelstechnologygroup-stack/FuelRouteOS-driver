import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft, MapPin, Phone, AlertTriangle, ExternalLink, Copy, Navigation
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import { useApp } from "@/lib/appContext";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import { getJobRequestedGallons, getJobNotes, STATUS_NEXT_LABEL, STATUS_NEXT_ROUTE } from "@/lib/jobHelpers";
import { buildMapsUrl, getMapsAppLabel } from "@/lib/mapsHelper";
import { getNavigationAddress } from "@/lib/branding";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import MapsPickerSheet from "@/components/driver/MapsPickerSheet";

export default function StopDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, shiftStarted } = useDriver();
  const { mapsApp } = useApp();
  const { toast } = useToast();
  const job = jobs.find(j => j.id === jobId);
  const [showMapsPicker, setShowMapsPicker] = useState(false);

  if (!job) return null;

  const notes = getJobNotes(job);
  const totalGallons = getJobRequestedGallons(job);
  const address = getNavigationAddress(job);
  const nextLabel = STATUS_NEXT_LABEL[job.status] || "Start Delivery";
  const nextRoute = STATUS_NEXT_ROUTE[job.status]?.(job.id) || `/job/${job.id}/load`;

  const handleOpenMaps = () => {
    if (mapsApp === "ask") {
      setShowMapsPicker(true);
      return;
    }
    const url = buildMapsUrl(address, mapsApp);
    if (url) window.open(url, "_blank", "noopener");
  };

  const handlePickMapsApp = (app) => {
    setShowMapsPicker(false);
    const url = buildMapsUrl(address, app);
    if (url) window.open(url, "_blank", "noopener");
  };

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address)
      .then(() => {
        toast({
          title: "Address copied",
          description: address,
          duration: 3500,
        });
      })
      .catch(() => {
        toast({ title: "Unable to copy address", duration: 3500 });
      });
  };

  return (
    <div className="bg-background min-h-screen font-inter pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl px-4 py-3 flex items-center gap-2 border-b border-border max-w-lg mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-secondary active:bg-secondary/70"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: job.type === "D" ? "#0d9488" : "#6366f1" }}
          >
            <span className="text-white text-xs font-bold">{job.type}</span>
          </div>
          <h1 className="text-base font-bold text-foreground truncate">{job.stopName}</h1>
          {job.starred && <span className="text-warning text-base shrink-0" aria-label="Priority stop">★</span>}
        </div>
      </div>

      {/* Shift required warning */}
      {!shiftStarted && (
        <div className="bg-warning px-4 py-3 flex items-center gap-2 max-w-lg mx-auto w-full" role="alert">
          <AlertTriangle className="w-4 h-4 text-warning-foreground shrink-0" />
          <p className="text-warning-foreground text-xs font-semibold">Please start the shift to perform this task.</p>
        </div>
      )}

      <div className="px-4 py-4 space-y-3 max-w-lg mx-auto">

        {/* Customer / Address */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-bold text-sm">{job.customer.name}</p>
              {address
                ? <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{address}</p>
                : <p className="text-destructive text-xs mt-0.5">No destination address available for this stop.</p>
              }
              <p className="text-muted-foreground text-xs mt-1">
                <span className="text-foreground font-bold">{job.orderNumber}</span>
                {" · "}Planned: <span className="font-semibold">{job.plannedTime}</span>
              </p>
            </div>
            {job.customer.phone && (
              <a
                href={`tel:${job.customer.phone}`}
                className="w-9 h-9 rounded-xl bg-success/10 border border-success/25 flex items-center justify-center shrink-0"
                aria-label={`Call ${job.customer.name}`}
              >
                <Phone className="w-4 h-4 text-success" />
              </a>
            )}
          </div>

          {/* Maps / Copy row */}
          <div className="flex gap-2 pt-1">
            {address ? (
              <button
                onClick={handleOpenMaps}
                className="flex-1 h-10 bg-primary/10 border border-primary/25 text-primary rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold active:bg-primary/20"
                aria-label={`Open in ${getMapsAppLabel(mapsApp)}`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in {getMapsAppLabel(mapsApp)}
              </button>
            ) : (
              <div className="flex-1 h-10 bg-secondary border border-border rounded-xl flex items-center justify-center text-xs text-muted-foreground">
                No address available
              </div>
            )}
            {address && (
              <button
                onClick={handleCopyAddress}
                className="h-10 px-3 bg-secondary border border-border rounded-xl flex items-center gap-1.5 text-xs font-semibold text-muted-foreground active:bg-secondary/70"
                aria-label="Copy address"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            )}
            {address && (
              <button
                onClick={() => navigate(`/job/${job.id}/navigate`)}
                className="h-10 px-3 bg-secondary border border-border rounded-xl flex items-center gap-1.5 text-xs font-semibold text-muted-foreground active:bg-secondary/70"
                aria-label="Start navigation"
              >
                <Navigation className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {job.lastDelivery && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
              <span>Last Delivery</span>
              <span className="text-foreground font-semibold">{job.lastDelivery}</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        {notes && (
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-bold">Instructions</p>
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">{notes}</p>
          </div>
        )}

        {/* PO / Carrier */}
        {(job.poNumber || job.carrierNumber) && (
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-bold">PO Number</p>
                <p className="text-foreground text-sm font-semibold">{job.poNumber || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-bold">Carrier #</p>
                <p className="text-foreground text-sm font-semibold">{job.carrierNumber || "—"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between mb-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Products</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Requested</p>
          </div>
          {job.products && job.products.map((p, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: p.color || "#888" }} />
                  <span className="text-foreground text-sm font-semibold">{p.name}</span>
                  {p.assets && <span className="text-muted-foreground text-xs">{p.assets.length} tank{p.assets.length !== 1 ? "s" : ""}</span>}
                </div>
                <span className="text-foreground text-sm font-bold">{Number(p.quantity || 0).toLocaleString()} gal</span>
              </div>
              {p.assets && p.assets.map((a, j) => (
                <div key={j} className="flex justify-between pl-5 py-1 border-t border-border">
                  <span className="text-muted-foreground text-xs">{a.name}</span>
                  <span className="text-muted-foreground text-xs">{Number(a.qty || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ))}
          <div className="pt-2 border-t border-border flex justify-between">
            <span className="text-muted-foreground text-xs font-semibold">Total</span>
            <span className="text-foreground text-sm font-bold">{totalGallons.toLocaleString()} gal</span>
          </div>
        </div>

        {/* Planned time */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">Planned Time</p>
            <span className="bg-secondary text-foreground rounded-lg px-3 py-1.5 text-sm font-semibold border border-border">
              {job.plannedTime}
            </span>
          </div>
        </div>

        {/* Primary action */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => navigate(nextRoute)}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl text-sm shadow-sm shadow-primary/20 active:bg-primary/85 transition-all"
          >
            {nextLabel}
          </button>
          <button
            onClick={() => navigate(`/exception?jobId=${job.id}`)}
            className="w-full bg-card text-muted-foreground font-semibold py-3.5 rounded-2xl text-sm border border-border active:bg-secondary/50 transition-colors"
          >
            Report an Issue
          </button>
        </div>
      </div>

      {showMapsPicker && (
        <MapsPickerSheet
          address={address}
          onPick={handlePickMapsApp}
          onClose={() => setShowMapsPicker(false)}
        />
      )}

      <DriverBottomNav />
    </div>
  );
}