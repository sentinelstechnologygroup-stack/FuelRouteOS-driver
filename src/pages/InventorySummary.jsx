import React from "react";
import { useNavigate } from "react-router-dom";
import { Droplets, AlertTriangle, CheckCircle2, Package, ChevronRight } from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import { trailer as trailerData, products } from "@/lib/mockData";
import PageHeader from "@/components/driver/PageHeader";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function InventorySummary() {
  const navigate = useNavigate();
  const { jobs } = useDriver();

  const totalLoaded      = trailerData.compartments.reduce((s, c) => s + c.loadedGallons, 0);
  const totalCapacity    = trailerData.compartments.reduce((s, c) => s + c.capacity, 0);
  const deliveredSoFar   = jobs.filter(j => j.status === "completed" && j.deliveredGallons)
                               .reduce((s, j) => s + (j.deliveredGallons || 0), 0);
  const remainingOnboard = totalLoaded - deliveredSoFar;
  const pctRemaining     = Math.round((remainingOnboard / totalLoaded) * 100);

  // Per-product delivered vs. loaded
  const productSummary = trailerData.compartments.map(comp => {
    const product = products.find(p => p.name === comp.product);
    const delivered = jobs
      .filter(j => j.product === comp.product && j.deliveredGallons)
      .reduce((s, j) => s + (j.deliveredGallons || 0), 0);
    const remaining = comp.loadedGallons - delivered;
    const pct = Math.round((remaining / comp.loadedGallons) * 100);
    const isLow = pct < 20;
    return { ...comp, product: comp.product, productMeta: product, delivered, remaining, pct, isLow };
  });

  // Pending deliveries
  const pendingJobs = jobs.filter(j => j.status !== "completed");
  const totalPendingGallons = pendingJobs.reduce((s, j) => s + (j.requestedGallons || 0), 0);
  const canFulfill = remainingOnboard >= totalPendingGallons;

  return (
    <div className="bg-background min-h-screen pb-8">
      <PageHeader title="Load & Inventory" subtitle={`Trailer #${trailerData.number}`} backTo="/today" />

      <div className="px-4 py-4 space-y-4">

        {/* Short load warning */}
        {!canFulfill && (
          <div className="bg-warning/10 border border-warning/30 rounded-2xl p-3.5 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-warning text-sm">Short Load Warning</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Remaining onboard ({remainingOnboard.toLocaleString()} gal) may not cover all pending
                deliveries ({totalPendingGallons.toLocaleString()} gal needed). Contact dispatch.
              </p>
            </div>
          </div>
        )}

        {/* Overall summary */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">
            Onboard Summary — {trailerData.type}
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground mb-1">Loaded</p>
              <p className="font-black text-lg leading-none">{totalLoaded.toLocaleString()}</p>
              <p className="text-[9px] text-muted-foreground">gal</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground mb-1">Delivered</p>
              <p className="font-black text-lg leading-none text-success">{deliveredSoFar.toLocaleString()}</p>
              <p className="text-[9px] text-muted-foreground">gal</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground mb-1">Remaining</p>
              <p className={cn("font-black text-lg leading-none", pctRemaining < 20 ? "text-warning" : "text-primary")}>
                {remainingOnboard.toLocaleString()}
              </p>
              <p className="text-[9px] text-muted-foreground">gal</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Onboard remaining</span>
              <span className="font-bold">{pctRemaining}%</span>
            </div>
            <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", pctRemaining < 20 ? "bg-warning" : "bg-primary")}
                style={{ width: `${pctRemaining}%` }}
              />
            </div>
          </div>
        </div>

        {/* Compartment breakdown */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Compartment Allocation
            </p>
          </div>
          {productSummary.map((comp, idx) => (
            <div key={comp.id} className={cn(
              "px-4 py-3.5",
              idx < productSummary.length - 1 && "border-b border-border"
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold bg-secondary text-muted-foreground">
                    C{comp.id}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: comp.productMeta?.color || "#888" }} />
                    <span className="text-sm font-semibold">{comp.productMeta?.shortName || comp.product}</span>
                  </div>
                  {comp.isLow && (
                    <span className="text-[10px] bg-warning/15 text-warning border border-warning/30 rounded-full px-2 py-0.5 font-bold">LOW</span>
                  )}
                </div>
                <span className={cn("text-sm font-bold", comp.isLow ? "text-warning" : "text-foreground")}>
                  {comp.remaining.toLocaleString()} gal
                </span>
              </div>
              <Progress value={comp.pct} className="h-1.5 bg-secondary" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>Loaded {comp.loadedGallons.toLocaleString()} / {comp.capacity.toLocaleString()} gal</span>
                <span>{comp.delivered > 0 ? `${comp.delivered.toLocaleString()} delivered` : "None delivered yet"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Per-stop breakdown */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Stop-by-Stop Delivery Plan
            </p>
          </div>
          {jobs.map((job, idx) => {
            const product = products.find(p => p.name === job.product);
            const isCompleted = job.status === "completed";
            return (
              <button
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left active:bg-secondary/40",
                  idx < jobs.length - 1 && "border-b border-border"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0",
                  isCompleted ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : job.stopNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-semibold truncate", isCompleted && "line-through text-muted-foreground")}>
                    {job.customer.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: product?.color || "#888" }} />
                    <span>{product?.shortName}</span>
                    <span>·</span>
                    <Droplets className="w-3 h-3" />
                    <span>{job.requestedGallons?.toLocaleString()} req</span>
                    {isCompleted && (
                      <>
                        <span>·</span>
                        <span className="text-success font-semibold">{job.deliveredGallons?.toLocaleString()} del</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Reload notice */}
        {pctRemaining < 30 && (
          <div className="bg-info/10 border border-info/25 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-info" />
              <p className="text-sm font-bold text-info">Return to Terminal</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Onboard fuel is below 30%. Contact dispatch to schedule a terminal reload after remaining stops are completed.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}