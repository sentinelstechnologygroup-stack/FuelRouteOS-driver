import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Navigation, MapPin, AlertTriangle, CheckCircle2, Copy,
  Phone, LocateFixed, Clock, ChevronRight, WifiOff, ExternalLink
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import { useApp } from "@/lib/appContext";
import { getDispatchPhone } from "@/lib/branding";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import MapsPickerSheet from "@/components/driver/MapsPickerSheet";
import { buildMapsUrl, getMapsAppLabel } from "@/lib/mapsHelper";
import { getNavigationAddress } from "@/lib/branding";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const ARRIVAL_STEPS = ["en_route", "approaching", "inside_geofence", "confirmed"];

const stateConfig = {
  not_started: {
    label: "Not Started",
    color: "text-muted-foreground",
    bg: "bg-secondary border-border",
    distanceFt: null,
    etaMin: null,
  },
  en_route: {
    label: "En Route",
    color: "text-info",
    bg: "bg-info/10 border-info/30",
    distanceFt: 3200,
    etaMin: 14,
  },
  approaching: {
    label: "Approaching Site",
    color: "text-warning",
    bg: "bg-warning/10 border-warning/30",
    distanceFt: 480,
    etaMin: 2,
  },
  inside_geofence: {
    label: "Inside Geofence",
    color: "text-success",
    bg: "bg-success/10 border-success/30",
    distanceFt: 90,
    etaMin: 0,
  },
  confirmed: {
    label: "Arrival Confirmed",
    color: "text-success",
    bg: "bg-success/10 border-success/30",
    distanceFt: 60,
    etaMin: 0,
  },
  outside_geofence: {
    label: "Arrived Outside Geofence",
    color: "text-destructive",
    bg: "bg-destructive/10 border-destructive/30",
    distanceFt: 1240,
    etaMin: null,
  },
  location_unavailable: {
    label: "Location Unavailable",
    color: "text-muted-foreground",
    bg: "bg-secondary border-border",
    distanceFt: null,
    etaMin: null,
  },
};

const GEOFENCE_RADIUS_FT = 500;

export default function ArrivalNavigation() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus, signal } = useDriver();
  const { mapsApp } = useApp();
  const { toast } = useToast();
  const job = jobs.find(j => j.id === jobId);

  const [arrivalState, setArrivalState] = useState("en_route");
  const [overrideReason, setOverrideReason] = useState("");
  const [showOverride, setShowOverride] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [showMapsPicker, setShowMapsPicker] = useState(false);

  if (!job) return null;

  const config = stateConfig[arrivalState] || stateConfig.en_route;
  const address = getNavigationAddress(job);
  const mapsUrl = buildMapsUrl(address, mapsApp);

  const canConfirm = arrivalState === "inside_geofence" || arrivalState === "confirmed";
  const canOverride = (arrivalState === "outside_geofence" || arrivalState === "location_unavailable") && overrideReason.trim().length >= 5;

  const handleSimulateStep = () => {
    const nextIdx = Math.min(stepIdx + 1, ARRIVAL_STEPS.length - 1);
    setStepIdx(nextIdx);
    const nextState = ARRIVAL_STEPS[nextIdx];
    setArrivalState(nextState);
    if (nextState === "approaching") updateJobStatus(job.id, "approaching");
  };

  const handleConfirmArrival = () => {
    updateJobStatus(job.id, "arrived");
    navigate(`/job/${job.id}/arrive`);
  };

  const handleManualOverride = () => {
    if (!canOverride) return;
    updateJobStatus(job.id, "arrived");
    navigate(`/job/${job.id}/arrive`);
  };

  const handleCopyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address)
      .then(() => {
        toast({ title: "Address copied", description: address, duration: 3500 });
      })
      .catch(() => {
        toast({ title: "Unable to copy address", duration: 3500 });
      });
  };

  const handleOpenMaps = () => {
    if (mapsApp === "ask") { setShowMapsPicker(true); return; }
    if (mapsUrl) window.open(mapsUrl, "_blank", "noopener");
  };

  const handlePickMapsApp = (app) => {
    setShowMapsPicker(false);
    const url = buildMapsUrl(address, app);
    if (url) window.open(url, "_blank", "noopener");
  };

  const handleStartNavigation = () => {
    setArrivalState("en_route");
    setStepIdx(0);
    updateJobStatus(job.id, "en_route");
    if (mapsApp === "ask") { setShowMapsPicker(true); return; }
    if (mapsUrl) window.open(mapsUrl, "_blank", "noopener");
  };

  const handleWrongSite = () => {
    navigate(`/exception?jobId=${job.id}&reason=wrong_site`);
  };

  return (
    <div className="bg-background min-h-screen pb-28">
      <PageHeader
        title="Navigation & Arrival"
        subtitle={job.site?.name}
        backTo={`/job/${job.id}`}
        rightAction={
          <a
            href={`tel:${getDispatchPhone() || "5125550100"}`}
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-success/15 border border-success/30"
            aria-label="Call dispatch"
          >
            <Phone className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-semibold text-success">Dispatch</span>
          </a>
        }
      />

      <div className="px-4 py-4 space-y-4 max-w-lg mx-auto">

        {/* Offline warning */}
        {signal === "offline" && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-2.5" role="alert">
            <WifiOff className="w-4 h-4 text-destructive shrink-0" />
            <p className="text-xs text-destructive font-semibold">
              Offline — GPS and ETA updates paused. Arrival will be saved locally.
            </p>
          </div>
        )}

        {/* Prototype notice */}
        <div className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-center">
          <p className="text-[10px] text-muted-foreground">
            Prototype geofence simulation — production build will use live GPS.
          </p>
        </div>

        {/* Arrival State Card */}
        <div className={cn("rounded-2xl border p-4", config.bg)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <LocateFixed className={cn("w-5 h-5", config.color)} aria-hidden="true" />
              <span className={cn("text-sm font-bold", config.color)}>{config.label}</span>
            </div>
            {arrivalState !== "confirmed" && arrivalState !== "outside_geofence" && arrivalState !== "location_unavailable" && (
              <button
                onClick={handleSimulateStep}
                className="text-[10px] bg-secondary px-2 py-1 rounded-lg text-muted-foreground font-semibold active:bg-secondary/70"
                aria-label="Simulate next arrival step"
              >
                Simulate →
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background/40 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">Distance</p>
              <p className="font-black text-lg leading-none text-foreground">
                {config.distanceFt != null
                  ? config.distanceFt >= 5280
                    ? `${(config.distanceFt / 5280).toFixed(1)} mi`
                    : `${config.distanceFt} ft`
                  : "—"}
              </p>
            </div>
            <div className="bg-background/40 rounded-xl p-2.5 text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">ETA</p>
              <p className="font-black text-lg leading-none text-foreground">
                {config.etaMin != null
                  ? config.etaMin === 0 ? "Now" : `${config.etaMin} min`
                  : "—"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
            </div>
            Geofence radius: {GEOFENCE_RADIUS_FT} ft
          </div>
        </div>

        {/* Destination Card */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Destination</p>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-info" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground">{job.customer?.name}</p>
              <p className="text-xs text-muted-foreground">{job.site?.name}</p>
              {address
                ? <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{address}</p>
                : <p className="text-xs text-destructive mt-0.5">No address available for this stop.</p>
              }
            </div>
          </div>

          {/* Maps + Copy actions */}
          <div className="flex gap-2 pt-1">
            {address ? (
              <button
                onClick={handleOpenMaps}
                className="flex-1 h-10 bg-primary/10 border border-primary/25 text-primary rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold active:bg-primary/20"
                aria-label={`Open in ${getMapsAppLabel(mapsApp)}`}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in {getMapsAppLabel(mapsApp)}
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
                aria-label="Copy address to clipboard"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-border text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Delivery window: <span className="font-semibold text-foreground">{job.deliveryWindow || "—"}</span></span>
          </div>
        </div>

        {/* Geofence Progress */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">Arrival Progress</p>
          <div className="space-y-2.5">
            {ARRIVAL_STEPS.map((s) => {
              const stepDone = ARRIVAL_STEPS.indexOf(s) <= stepIdx;
              const isActive = s === arrivalState;
              const cfg = stateConfig[s];
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full shrink-0 border-2",
                    stepDone ? "bg-success border-success" : "bg-transparent border-border"
                  )} aria-hidden="true" />
                  <span className={cn(
                    "text-xs flex-1",
                    isActive ? "font-bold text-foreground" : stepDone ? "text-muted-foreground" : "text-muted-foreground/40"
                  )}>
                    {cfg?.label || s}
                  </span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary" aria-hidden="true" />}
                  {stepDone && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-success" aria-hidden="true" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Outside Geofence Warning */}
        {arrivalState === "outside_geofence" && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4" role="alert">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" aria-hidden="true" />
              <p className="font-bold text-destructive">Arrived Outside Geofence</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your GPS location does not match the expected delivery site. Verify you are at the correct address before proceeding, or report a wrong site.
            </p>
          </div>
        )}

        {/* Primary Actions */}
        <div className="space-y-3 pt-1">

          {/* Start Navigation */}
          {arrivalState === "en_route" && (
            <ActionButton onClick={handleStartNavigation} variant="primary" icon={Navigation}>
              Start Navigation
            </ActionButton>
          )}

          {/* Confirm Arrival (only inside geofence) */}
          {canConfirm && (
            <ActionButton onClick={handleConfirmArrival} variant="success" icon={CheckCircle2}>
              Confirm Arrival &amp; Verify Site
            </ActionButton>
          )}

          {/* Wrong Location */}
          {(arrivalState === "en_route" || arrivalState === "approaching") && (
            <ActionButton
              onClick={() => setArrivalState("outside_geofence")}
              variant="secondary"
              size="md"
            >
              I'm at the wrong location
            </ActionButton>
          )}

          {/* Manual Override */}
          {(arrivalState === "outside_geofence" || arrivalState === "location_unavailable") && (
            <>
              {!showOverride ? (
                <ActionButton variant="outline" size="md" onClick={() => setShowOverride(true)}>
                  Manual Arrival Override
                </ActionButton>
              ) : (
                <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
                  <p className="text-sm font-bold text-foreground">Override Reason Required</p>
                  <p className="text-xs text-muted-foreground">Minimum 5 characters. This will be recorded.</p>
                  <label htmlFor="override-reason" className="sr-only">Override reason</label>
                  <textarea
                    id="override-reason"
                    className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none border border-border focus-visible:ring-2 focus-visible:ring-ring"
                    rows={3}
                    placeholder="Describe why you are arriving outside the expected geofence…"
                    value={overrideReason}
                    onChange={e => setOverrideReason(e.target.value)}
                    aria-required="true"
                  />
                  <ActionButton
                    variant="warning"
                    size="md"
                    icon={AlertTriangle}
                    onClick={handleManualOverride}
                    disabled={!canOverride}
                  >
                    Submit Override &amp; Continue
                  </ActionButton>
                </div>
              )}

              {/* Wrong Site */}
              <ActionButton variant="destructive" size="md" icon={AlertTriangle} onClick={handleWrongSite}>
                Report Wrong Site / Wrong Location
              </ActionButton>
            </>
          )}
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