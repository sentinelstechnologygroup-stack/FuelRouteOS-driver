import React, { useState } from "react";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import {
  Wifi, WifiOff, WifiLow, RefreshCw, CheckCircle2,
  AlertCircle, Clock, Phone, CloudOff, FileText,
  PenTool, Camera, Droplets, AlertTriangle, ChevronDown, ChevronUp
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const TYPE_CONFIG = {
  delivery:                  { label: "Delivery Record",            icon: Droplets,      color: "text-info" },
  delivery_record:           { label: "Delivery Record",            icon: Droplets,      color: "text-info" },
  bol_photo:                 { label: "BOL / Pickup Image",         icon: FileText,      color: "text-info" },
  bol_capture:               { label: "BOL / Pickup Document",      icon: FileText,      color: "text-info" },
  pod_signature:             { label: "POD Signature",              icon: PenTool,       color: "text-primary" },
  pod_image:                 { label: "POD Image",                  icon: Camera,        color: "text-primary" },
  photos:                    { label: "Delivery Confirmation Image", icon: Camera,        color: "text-warning" },
  delivery_photo:            { label: "Delivery Confirmation Image", icon: Camera,        color: "text-warning" },
  pickup_photo:              { label: "Pickup Confirmation Image",   icon: Camera,        color: "text-sky-400" },
  arrival_check:             { label: "Arrival Check-in",           icon: CheckCircle2,  color: "text-success" },
  exception_report:          { label: "Exception Report",           icon: AlertTriangle, color: "text-destructive" },
  exception_image:           { label: "Exception Image",            icon: Camera,        color: "text-destructive" },
  tank_image:                { label: "Tank Image",                 icon: Camera,        color: "text-teal-400" },
  meter_image:               { label: "Meter Image",                icon: Camera,        color: "text-amber-400" },
  equipment_image:           { label: "Equipment Image",            icon: Camera,        color: "text-purple-400" },
  scan_bol:                  { label: "BOL Barcode Scan",           icon: FileText,      color: "text-info" },
  scan_tank:                 { label: "Tank QR Scan",               icon: CheckCircle2,  color: "text-teal-400" },
  scan_equipment:            { label: "Equipment Scan",             icon: CheckCircle2,  color: "text-amber-400" },
  scan_asset:                { label: "Asset Tag Scan",             icon: CheckCircle2,  color: "text-purple-400" },
  scan_delivery:             { label: "Delivery Confirmation Scan", icon: CheckCircle2,  color: "text-success" },
  scan_pickup:               { label: "Pickup Confirmation Scan",   icon: CheckCircle2,  color: "text-sky-400" },
  scan_transfer:             { label: "Fuel Transfer Scan",         icon: Droplets,      color: "text-orange-400" },
  scan_unknown:              { label: "Unknown Code Scan",          icon: AlertTriangle, color: "text-muted-foreground" },
  order_draft_delivery:      { label: "Delivery Order Draft",       icon: FileText,      color: "text-info" },
  order_submit_delivery:     { label: "Delivery Order Submitted",   icon: FileText,      color: "text-success" },
  order_draft_load:          { label: "Load Order Draft",           icon: FileText,      color: "text-info" },
  order_submit_load:         { label: "Load Order Submitted",       icon: FileText,      color: "text-success" },
  order_draft_extraction:    { label: "Extraction Order Draft",     icon: FileText,      color: "text-info" },
  order_submit_extraction:   { label: "Extraction Order Submitted", icon: FileText,      color: "text-success" },
};

function getTypeConfig(type) {
  return TYPE_CONFIG[type] || { label: type.replace(/_/g, " "), icon: CloudOff, color: "text-muted-foreground" };
}

const SIGNAL_OPTIONS = [
  { value: "online", label: "Online", icon: Wifi, color: "text-success" },
  { value: "weak",   label: "Weak Signal", icon: WifiLow, color: "text-warning" },
  { value: "offline", label: "Offline", icon: WifiOff, color: "text-destructive" },
];

function SyncItemRow({ item, onRetry }) {
  const [expanded, setExpanded] = useState(false);
  const tc = getTypeConfig(item.type);
  const Icon = tc.icon;

  return (
    <div className={cn(
      "rounded-xl border overflow-hidden",
      item.status === "failed" ? "border-destructive/30 bg-destructive/5" :
      item.status === "pending" ? "border-warning/20 bg-card" :
      "border-border bg-card opacity-70"
    )}>
      <div className="flex items-center gap-3 p-3">
        <div className={cn("w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0")}>
          <Icon className={cn("w-4 h-4", tc.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">{tc.label}</p>
          <p className="text-xs text-muted-foreground">
            {item.jobId}
            {item.savedAt ? ` · saved ${item.savedAt}` : item.timestamp ? ` · ${item.timestamp}` : ""}
            {item.size ? ` · ${item.size}` : ""}
          </p>
        </div>

        {item.status === "failed" && (
          <button
            onClick={() => onRetry(item.id)}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg active:opacity-70 shrink-0"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        )}
        {item.status === "pending" && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-warning shrink-0">
            <Clock className="w-3 h-3" /> Pending
          </span>
        )}
        {item.status === "synced" && (
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
        )}

        {(item.error || item.syncedAt) && (
          <button onClick={() => setExpanded(!expanded)} className="ml-1 shrink-0">
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            }
          </button>
        )}
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-0">
          <div className="border-t border-border pt-2">
            {item.error && (
              <p className="text-xs text-destructive font-medium">{item.error}</p>
            )}
            {item.syncedAt && (
              <p className="text-xs text-muted-foreground">Synced at {item.syncedAt}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SyncStatus() {
  const { syncs, signal, setSignal, retrySyncItem, retryAllFailed, lastSyncTime, pendingSyncCount, failedSyncCount } = useDriver();

  const synced = syncs.filter(s => s.status === "synced");
  const pending = syncs.filter(s => s.status === "pending");
  const failed = syncs.filter(s => s.status === "failed");
  const totalUnsynced = pending.length + failed.length;

  const currentSignalConfig = SIGNAL_OPTIONS.find(o => o.value === signal) || SIGNAL_OPTIONS[0];
  const SignalIcon = currentSignalConfig.icon;

  return (
    <div className="bg-background min-h-screen pb-24">
      <PageHeader
        title="Sync Status"
        subtitle={totalUnsynced > 0 ? `${totalUnsynced} item${totalUnsynced > 1 ? "s" : ""} need attention` : "All data up to date"}
      />

      <div className="px-4 py-4 space-y-4">

        {/* Connection Status Card */}
        <div className={cn(
          "rounded-2xl border p-4",
          signal === "online" ? "bg-success/5 border-success/25" :
          signal === "weak"   ? "bg-warning/5 border-warning/25" :
                                "bg-destructive/5 border-destructive/25"
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              signal === "online" ? "bg-success/15" : signal === "weak" ? "bg-warning/15" : "bg-destructive/15"
            )}>
              <SignalIcon className={cn("w-5 h-5", currentSignalConfig.color)} />
            </div>
            <div className="flex-1">
              <p className="font-bold">{currentSignalConfig.label}</p>
              <p className="text-xs text-muted-foreground">
                {signal === "online"  && "All data syncing normally"}
                {signal === "weak"    && "Data will sync when signal improves"}
                {signal === "offline" && "No connection — changes saved locally"}
              </p>
            </div>
          </div>

          {/* Signal simulator toggle */}
          <div className="flex gap-2">
            {SIGNAL_OPTIONS.map(opt => {
              const Ico = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSignal(opt.value)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all",
                    signal === opt.value
                      ? "bg-secondary border-border text-foreground"
                      : "border-transparent text-muted-foreground"
                  )}
                >
                  <Ico className="w-3.5 h-3.5" /> {opt.label}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">Tap to simulate connection state</p>
        </div>

        {/* Last sync + summary */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Upload Summary</p>
            <p className="text-xs text-muted-foreground">
              Last sync: {lastSyncTime ? format(lastSyncTime, "h:mm a") : "—"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
              <p className="text-xl font-black text-success">{synced.length}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Synced</p>
            </div>
            <div className={cn(
              "border rounded-xl p-3 text-center",
              pending.length > 0 ? "bg-warning/10 border-warning/25" : "bg-card border-border"
            )}>
              <p className={cn("text-xl font-black", pending.length > 0 ? "text-warning" : "text-muted-foreground")}>
                {pending.length}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Pending</p>
            </div>
            <div className={cn(
              "border rounded-xl p-3 text-center",
              failed.length > 0 ? "bg-destructive/10 border-destructive/25" : "bg-card border-border"
            )}>
              <p className={cn("text-xl font-black", failed.length > 0 ? "text-destructive" : "text-muted-foreground")}>
                {failed.length}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Failed</p>
            </div>
          </div>
        </div>

        {/* All synced state */}
        {totalUnsynced === 0 && synced.length > 0 && (
          <div className="bg-success/5 border border-success/20 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
            <div>
              <p className="font-bold text-success">All items synced</p>
              <p className="text-xs text-muted-foreground">Nothing pending — you're up to date</p>
            </div>
          </div>
        )}

        {/* Failed items */}
        {failed.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-destructive uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Failed — Action Required
              </h3>
              <button
                onClick={retryAllFailed}
                className="text-xs text-primary font-bold flex items-center gap-1 px-2.5 py-1 bg-primary/10 rounded-lg"
              >
                <RefreshCw className="w-3 h-3" /> Retry All
              </button>
            </div>
            <div className="space-y-2">
              {failed.map(item => (
                <SyncItemRow key={item.id} item={item} onRetry={retrySyncItem} />
              ))}
            </div>
          </div>
        )}

        {/* Pending items */}
        {pending.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-warning uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Pending Upload
              </h3>
              <span className="text-[10px] text-muted-foreground">Will auto-sync when connected</span>
            </div>
            <div className="space-y-2">
              {pending.map(item => (
                <SyncItemRow key={item.id} item={item} onRetry={retrySyncItem} />
              ))}
            </div>
          </div>
        )}

        {/* Synced items */}
        {synced.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-success uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded Successfully
            </h3>
            <div className="space-y-2">
              {synced.map(item => (
                <SyncItemRow key={item.id} item={item} onRetry={retrySyncItem} />
              ))}
            </div>
          </div>
        )}

        {syncs.length === 0 && (
          <div className="text-center py-10">
            <CloudOff className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm text-muted-foreground">No sync activity yet</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {(failed.length > 0 || pending.length > 0) && (
            <ActionButton onClick={retryAllFailed} icon={RefreshCw} variant="secondary" size="md">
              Retry All Pending & Failed
            </ActionButton>
          )}
          <a
            href="tel:5125550100"
            className="w-full h-12 bg-success/10 border border-success/25 text-success rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:bg-success/20"
          >
            <Phone className="w-4 h-4" /> Call Dispatch
          </a>
        </div>
      </div>
      <DriverBottomNav />
    </div>
  );
}