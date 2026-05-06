import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import {
  CheckCircle2, FileText, PenTool, Camera,
  ChevronRight, Phone, Droplets, RefreshCw,
  Clock, AlertCircle, CloudOff
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import SyncBadge from "@/components/driver/SyncBadge";
import { cn } from "@/lib/utils";

function getSyncStatus(syncs, jobId, type) {
  const items = syncs.filter(s => s.jobId === jobId && s.type === type);
  if (!items.length) return "offline";
  if (items.some(s => s.status === "failed")) return "failed";
  if (items.some(s => s.status === "pending")) return "pending";
  if (items.some(s => s.status === "synced")) return "synced";
  return "offline";
}

function StatusRow({ icon: Icon, label, captured, syncStatus, onRetry }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
        captured ? "bg-success/15" : "bg-secondary"
      )}>
        <Icon className={cn("w-4 h-4", captured ? "text-success" : "text-muted-foreground")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", !captured && "text-muted-foreground")}>{label}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {captured ? (
          <SyncBadge status={syncStatus} />
        ) : (
          <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
            Not captured
          </span>
        )}
        {captured && syncStatus === "failed" && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default function CompletedJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, getNextPendingJob, syncs, retrySyncItem, isOnline } = useDriver();
  const job = jobs.find(j => j.id === jobId);
  const nextJob = getNextPendingJob();

  if (!job) return null;

  const bolSyncStatus    = getSyncStatus(syncs, job.id, "bol_capture") || getSyncStatus(syncs, job.id, "bol_photo");
  const podSyncStatus    = getSyncStatus(syncs, job.id, "pod_signature");
  const photoSyncStatus  = getSyncStatus(syncs, job.id, "photos");
  const deliverySyncStatus = getSyncStatus(syncs, job.id, "delivery");

  // Overall dispatch sync status
  const allStatuses = [bolSyncStatus, podSyncStatus, photoSyncStatus, deliverySyncStatus];
  const hasFailed  = allStatuses.some(s => s === "failed");
  const hasPending = allStatuses.some(s => s === "pending" || s === "offline");
  const allSynced  = !hasFailed && !hasPending;

  const dispatchStatus = hasFailed ? "failed" : hasPending ? "pending" : "synced";

  const retryById = (type) => {
    const item = syncs.find(s => s.jobId === job.id && s.type === type && s.status === "failed");
    if (item) retrySyncItem(item.id);
  };

  return (
    <div className="bg-background min-h-screen max-w-lg mx-auto pb-24">
      <PageHeader
        title="Delivery Complete"
        subtitle={`Stop #${job.stopNumber} — ${job.customer.name}`}
        backTo="/today-shift"
      />

      <div className="px-4 py-6 flex flex-col items-center">

      {/* Header icon */}
      <div className={cn(
        "w-20 h-20 rounded-3xl flex items-center justify-center mb-5",
        allSynced ? "bg-success/15" : hasFailed ? "bg-destructive/10" : "bg-warning/10"
      )}>
        {allSynced
          ? <CheckCircle2 className="w-10 h-10 text-success" />
          : hasFailed
          ? <AlertCircle className="w-10 h-10 text-destructive" />
          : <Clock className="w-10 h-10 text-warning" />
        }
      </div>

      <h1 className="text-2xl font-bold mb-0.5">
        {allSynced ? "Delivery Complete" : hasFailed ? "Sync Issues" : "Delivery Saved"}
      </h1>
      <p className="text-sm text-muted-foreground mb-1">
        Stop #{job.stopNumber} — {job.customer.name}
      </p>
      <SyncBadge
        status={dispatchStatus}
        label={
          allSynced ? "All data synced to dispatch" :
          hasFailed ? "Sync failed — tap Retry" :
          "Pending sync — saved offline"
        }
        className="mb-6"
      />

      {/* Not online warning */}
      {!isOnline && (
        <div className="w-full bg-warning/10 border border-warning/25 rounded-2xl p-3 flex items-center gap-3 mb-4">
          <CloudOff className="w-5 h-5 text-warning shrink-0" />
          <div>
            <p className="text-sm font-bold text-warning">Saved Offline</p>
            <p className="text-xs text-muted-foreground">Data will auto-sync when you reconnect.</p>
          </div>
        </div>
      )}

      {/* Delivery summary numbers */}
      <div className="w-full bg-card border border-border rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground">Product</p>
            <p className="font-bold text-sm">{job.product}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Droplets className="w-3 h-3" /> Delivered
            </p>
            <p className="font-black text-xl text-success leading-none">
              {(job.deliveredGallons || job.requestedGallons)?.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground ml-1">gal</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Received By</p>
            <p className="font-bold text-sm">{job.pod?.receiverName || job.customer.contact}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Completed</p>
            <p className="font-bold text-sm">{job.pod?.timestamp || "—"}</p>
          </div>
        </div>
      </div>

      {/* Per-item sync status */}
      <div className="w-full bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Document & Sync Status</p>
        </div>
        <div className="px-4">
          <StatusRow
            icon={FileText}
            label="BOL / Pickup Confirmation"
            captured={!!job.bol?.captured}
            syncStatus={bolSyncStatus}
            onRetry={() => retryById("bol_photo")}
          />
          <StatusRow
            icon={PenTool}
            label="POD Signature"
            captured={!!job.pod?.signature}
            syncStatus={podSyncStatus}
            onRetry={() => retryById("pod_signature")}
          />
          <StatusRow
            icon={Camera}
            label={`Delivery Confirmation Images${job.pod?.photos > 0 ? ` (${job.pod.photos})` : ""}`}
            captured={(job.pod?.photos || 0) > 0}
            syncStatus={photoSyncStatus}
            onRetry={() => retryById("photos")}
          />
          <StatusRow
            icon={Droplets}
            label="Delivery Record"
            captured={true}
            syncStatus={deliverySyncStatus}
            onRetry={() => retryById("delivery")}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-3">
        {nextJob ? (
          <ActionButton onClick={() => navigate(`/stop/${nextJob.id}`)} icon={ChevronRight}>
            Next Stop: {nextJob.customer.name}
          </ActionButton>
        ) : (
          <ActionButton onClick={() => navigate("/today-shift")}>
            All Stops Complete — Return to Shift
          </ActionButton>
        )}

        {(hasFailed || hasPending) && (
          <ActionButton
            variant="secondary"
            size="md"
            icon={RefreshCw}
            onClick={() => navigate("/sync")}
          >
            View Sync Status
          </ActionButton>
        )}

        <ActionButton variant="secondary" size="md" onClick={() => navigate("/today-shift")}>
          Back to Today's Shift
        </ActionButton>

        <a
          href="tel:5125550100"
          className="w-full h-12 bg-success/10 border border-success/25 text-success rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:bg-success/20"
        >
          <Phone className="w-4 h-4" /> Contact Dispatch
        </a>
      </div>
      </div>
      <DriverBottomNav />
    </div>
  );
}