import React from "react";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin, Phone, Clock, Droplets, FileText,
  ShieldAlert, Navigation, Play, AlertTriangle,
  CheckCircle2, ArrowRight, StickyNote, MessageCircle, Package
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import StatusBadge from "@/components/driver/StatusBadge";
import ActionButton from "@/components/driver/ActionButton";
import { products } from "@/lib/mockData";
import { Progress } from "@/components/ui/progress";

// Determines the next workflow step and CTA label/route
function getNextStep(job) {
  switch (job.status) {
    case "pending":
      return { label: "Start Job — Load Instructions", route: `/job/${job.id}/load`, icon: Play };
    case "en_route":
      return { label: "Capture BOL", route: `/job/${job.id}/bol`, icon: FileText };
    case "loading":
      return { label: "Capture BOL", route: `/job/${job.id}/bol`, icon: FileText };
    case "arrived":
      return { label: "Verify Tank & Site", route: `/job/${job.id}/arrive`, icon: CheckCircle2 };
    case "delivering":
      return { label: "Enter Delivery Data", route: `/job/${job.id}/deliver`, icon: ArrowRight };
    default:
      return null;
  }
}

export default function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus } = useDriver();
  const job = jobs.find(j => j.id === jobId);

  if (!job) return null;

  const product = products.find(p => p.name === job.product);
  const isCompleted = job.status === "completed";
  const nextStep = getNextStep(job);

  const tankPct = job.tank
    ? Math.round((job.tank.currentLevel / job.tank.capacity) * 100)
    : null;

  const handleNextStep = () => {
    if (!nextStep) return;
    if (job.status === "pending") {
      updateJobStatus(job.id, "en_route");
    }
    navigate(nextStep.route);
  };

  return (
    <div className="bg-background min-h-screen pb-24">
      <PageHeader
        title={`Stop #${job.stopNumber}`}
        subtitle={job.customer.name}
        backTo="/today"
        rightAction={<StatusBadge status={job.status} size="md" />}
      />

      <div className="px-4 py-4 space-y-4">

        {/* Priority Banner */}
        {job.priority === "high" && (
          <div className="bg-warning/10 border border-warning/30 rounded-2xl p-3.5 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
            <div>
              <p className="text-sm font-bold text-warning">Priority Delivery</p>
              <p className="text-xs text-muted-foreground">Customer is running low. Complete ASAP.</p>
            </div>
          </div>
        )}

        {/* Next Step CTA — top of screen, most prominent */}
        {nextStep && (
          <button
            onClick={handleNextStep}
            className="w-full bg-primary text-primary-foreground h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-base active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            <nextStep.icon className="w-5 h-5" />
            {nextStep.label}
          </button>
        )}

        {/* Customer & Site */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Customer & Site</p>
              <p className="font-bold mt-1">{job.customer.name}</p>
              <p className="text-sm text-muted-foreground">{job.site.name}</p>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-info" />
                <span>{job.site.address}</span>
              </div>
            </div>
            <a
              href={`tel:${job.customer.phone}`}
              className="ml-3 shrink-0 w-11 h-11 bg-success/15 border border-success/25 rounded-xl flex flex-col items-center justify-center gap-0.5"
            >
              <Phone className="w-4 h-4 text-success" />
              <span className="text-[9px] text-success font-semibold">Call</span>
            </a>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{job.customer.contact}</span>
            <span>·</span>
            <span>{job.customer.phone}</span>
          </div>
        </div>

        {/* Product & Delivery Window */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: product?.color || "#888" }}
              />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Product</p>
                <p className="font-bold">{job.product}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Requested</p>
              <p className="text-2xl font-black text-primary leading-none">{job.requestedGallons?.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">gallons</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Delivery window: <span className="font-semibold text-foreground">{job.deliveryWindow}</span>
            </p>
          </div>
        </div>

        {/* Tank Info with fill bar */}
        {job.tank && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tank</p>
              <span className="text-[10px] font-bold text-muted-foreground">{job.tank.id}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <p className="text-[10px] text-muted-foreground">Capacity</p>
                <p className="font-bold text-sm">{job.tank.capacity?.toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground">gal</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Current</p>
                <p className="font-bold text-sm">{job.tank.currentLevel?.toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground">gal</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Ullage</p>
                <p className="font-bold text-sm text-primary">
                  {(job.tank.capacity - job.tank.currentLevel)?.toLocaleString()}
                </p>
                <p className="text-[9px] text-muted-foreground">gal avail.</p>
              </div>
            </div>
            {tankPct !== null && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Tank level</span>
                  <span className="font-semibold">{tankPct}% full</span>
                </div>
                <Progress
                  value={tankPct}
                  className="h-2 bg-secondary"
                />
              </div>
            )}
            <p className="text-[10px] text-muted-foreground mt-2">
              Product: <span className="font-semibold text-foreground">{job.tank.product}</span>
            </p>
          </div>
        )}

        {/* Dispatch Notes */}
        {job.dispatchNotes && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-info" />
              <p className="text-xs font-bold text-info">Dispatch Notes</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.dispatchNotes}</p>
          </div>
        )}

        {/* Safety Notes */}
        {job.safetyNotes && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-destructive" />
              <p className="text-xs font-bold text-destructive">Safety Notes — Read Before Delivery</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.safetyNotes}</p>
          </div>
        )}

        {/* Completed delivery summary */}
        {isCompleted && (
          <div className="bg-success/5 border border-success/20 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <p className="font-bold text-success">Delivery Complete</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {job.deliveredGallons && (
                <div>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                  <p className="font-bold text-success">{job.deliveredGallons?.toLocaleString()} gal</p>
                </div>
              )}
              {job.delivery && (
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-bold">{job.delivery.startTime} — {job.delivery.endTime}</p>
                </div>
              )}
              {job.pod?.receiverName && (
                <div>
                  <p className="text-xs text-muted-foreground">Received by</p>
                  <p className="font-bold">{job.pod.receiverName}</p>
                </div>
              )}
              {job.pod?.timestamp && (
                <div>
                  <p className="text-xs text-muted-foreground">Signed at</p>
                  <p className="font-bold">{job.pod.timestamp}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Secondary actions */}
        <div className="space-y-2.5 pt-1">
          {!isCompleted && (
            <div className="grid grid-cols-2 gap-3">
              <ActionButton
                variant="outline"
                size="md"
                icon={Navigation}
                onClick={() => navigate(`/job/${job.id}/navigate`)}
              >
                Navigate
              </ActionButton>
              <a
                href={`tel:${job.customer.phone}`}
                className="h-12 px-5 bg-secondary text-secondary-foreground rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:opacity-80"
              >
                <Phone className="w-4 h-4" /> Customer
              </a>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:5125550100"
              className="h-12 px-3 bg-success/10 border border-success/25 text-success rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:bg-success/20"
            >
              <Phone className="w-4 h-4" /> Dispatch
            </a>
            <ActionButton
              variant="secondary"
              size="md"
              icon={MessageCircle}
              onClick={() => navigate("/chat")}
            >
              Chat
            </ActionButton>
          </div>

          <ActionButton
            variant="secondary"
            size="md"
            icon={Package}
            onClick={() => navigate("/inventory")}
          >
            View Load & Inventory
          </ActionButton>

          <ActionButton
            variant="ghost"
            size="md"
            icon={AlertTriangle}
            onClick={() => navigate(`/exception?jobId=${job.id}`)}
          >
            Report an Issue
          </ActionButton>
        </div>
      </div>
      <DriverBottomNav />
    </div>
  );
}