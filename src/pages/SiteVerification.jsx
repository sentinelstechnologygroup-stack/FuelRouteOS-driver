import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin, ScanLine, ShieldCheck, AlertTriangle,
  CheckCircle2, Phone, Info, Droplets, Building2,
  FlameKindling, CircleSlash
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { getJobTank, getJobRequestedGallons, getJobProduct } from "@/lib/jobHelpers";
import DriverBottomNav from "@/components/driver/DriverBottomNav";

const SAFETY_CHECKS = [
  "No smoking signs visible and observed",
  "Area clear of ignition sources",
  "Spill kit and fire extinguisher accessible",
  "Grounding cable connected",
];

export default function SiteVerification() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus } = useDriver();
  const job = jobs.find(j => j.id === jobId);

  const [verified, setVerified] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [safetyChecked, setSafetyChecked] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  if (!job) return null;

  const tank = getJobTank(job);
  const requestedGallons = getJobRequestedGallons(job);
  const productName = getJobProduct(job);
  const tankPct = tank ? Math.round((tank.currentLevel / tank.capacity) * 100) : 0;

  const allSafetyChecked = SAFETY_CHECKS.every((_, i) => safetyChecked[i]);
  const toggleSafety = (i) => setSafetyChecked(prev => ({ ...prev, [i]: !prev[i] }));

  const handleScan = () => {
    setShowScanModal(true);
    setTimeout(() => {
      setShowScanModal(false);
      setVerified(true);
      setVerifyMethod("scan");
    }, 2200);
  };

  const handleManualVerify = () => {
    setVerified(true);
    setVerifyMethod("manual");
  };

  const handleContinue = () => {
    setSubmitAttempted(true);
    if (!allSafetyChecked) return;
    updateJobStatus(job.id, "site_verified");
    navigate(`/job/${job.id}/deliver`);
  };

  return (
    <div className="bg-background min-h-screen pb-8">
      <PageHeader
        title="Site & Tank Verification"
        subtitle={job.site.name}
        backTo={`/job/${job.id}/bol`}
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
            Verify site and tank before connecting hose. Confirm correct customer, tank ID, and product. Do not proceed if anything looks wrong.
          </p>
        </div>

        {/* Customer & Site Confirmation */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Confirm You Are At</p>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-info" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold leading-tight">{job.customer.name}</p>
              <p className="text-sm text-muted-foreground">{job.site.name}</p>
              <div className="flex items-start gap-1.5 mt-1">
                <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">{job.site.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tank Details */}
        {tank && (
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Tank to Fill</p>
              <span className="text-xs font-bold bg-secondary px-2 py-1 rounded-lg">{tank.id}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-secondary/60 rounded-xl p-2.5">
                <p className="text-[10px] text-muted-foreground mb-0.5">Capacity</p>
                <p className="font-bold text-sm">{tank.capacity?.toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground">gal</p>
              </div>
              <div className="bg-secondary/60 rounded-xl p-2.5">
                <p className="text-[10px] text-muted-foreground mb-0.5">On Hand</p>
                <p className="font-bold text-sm">{tank.currentLevel?.toLocaleString()}</p>
                <p className="text-[9px] text-muted-foreground">gal</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-2.5">
                <p className="text-[10px] text-muted-foreground mb-0.5">Ullage</p>
                <p className="font-bold text-sm text-primary">
                  {(tank.capacity - tank.currentLevel)?.toLocaleString()}
                </p>
                <p className="text-[9px] text-muted-foreground">avail.</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                <span>Tank level</span>
                <span className="font-bold">{tankPct}% full</span>
              </div>
              <Progress value={tankPct} className="h-2.5 bg-secondary" />
            </div>

            <div className="flex items-center justify-between bg-secondary/60 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: "#888" }} />
                <div>
                  <p className="text-[10px] text-muted-foreground">Expected Product</p>
                  <p className="text-sm font-bold">{productName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Delivering</p>
                <p className="text-sm font-bold text-primary">{requestedGallons.toLocaleString()} gal</p>
              </div>
            </div>
          </div>
        )}

        {/* Safety Checklist */}
        <div className={cn(
          "rounded-2xl border overflow-hidden",
          submitAttempted && !allSafetyChecked ? "border-destructive/40" : "border-border"
        )}>
          <div className={cn(
            "px-4 py-3 flex items-center justify-between border-b",
            submitAttempted && !allSafetyChecked ? "bg-destructive/5 border-destructive/30" : "bg-card border-border"
          )}>
            <div className="flex items-center gap-2">
              <FlameKindling className="w-4 h-4 text-destructive" />
              <p className="text-sm font-bold">Safety Checklist</p>
              {submitAttempted && !allSafetyChecked && (
                <span className="text-xs text-destructive font-semibold">— Required</span>
              )}
            </div>
            <span className="text-xs font-bold text-muted-foreground">
              {Object.values(safetyChecked).filter(Boolean).length}/{SAFETY_CHECKS.length}
            </span>
          </div>
          <div className="bg-card divide-y divide-border">
            {SAFETY_CHECKS.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleSafety(i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-secondary/40"
              >
                <Checkbox
                  checked={!!safetyChecked[i]}
                  onCheckedChange={() => toggleSafety(i)}
                  className="border-border data-[state=checked]:bg-success data-[state=checked]:border-success shrink-0"
                />
                <p className={cn(
                  "text-sm",
                  safetyChecked[i] ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {item}
                </p>
              </button>
            ))}
          </div>
        </div>
        {submitAttempted && !allSafetyChecked && (
          <p className="text-xs text-destructive -mt-2">Complete all safety checks before proceeding.</p>
        )}

        {/* Site safety notes from dispatch */}
        {job.safetyNotes && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-destructive" />
              <p className="text-xs font-bold text-destructive">Site Safety Notes</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.safetyNotes}</p>
          </div>
        )}

        {/* Verified banner */}
        {verified && (
          <div className="bg-success/10 border border-success/30 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-success shrink-0" />
            <div>
              <p className="font-bold text-success">Site & Tank Verified</p>
              <p className="text-xs text-muted-foreground">
                {verifyMethod === "scan" ? "QR scan confirmed" : "Manual verification recorded"}
                {job.tank ? ` · ${job.tank.id}` : ""}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {!verified ? (
            <>
              <ActionButton onClick={handleScan} icon={ScanLine}>
                Scan Tank QR / Barcode
              </ActionButton>
              <ActionButton variant="secondary" size="md" onClick={handleManualVerify}>
                Verify Manually (No QR)
              </ActionButton>
            </>
          ) : (
            <ActionButton
              onClick={handleContinue}
              variant="success"
              icon={Droplets}
              disabled={submitAttempted && !allSafetyChecked}
            >
              {allSafetyChecked ? "Begin Delivery" : `Complete Safety Checks (${Object.values(safetyChecked).filter(Boolean).length}/${SAFETY_CHECKS.length})`}
            </ActionButton>
          )}

          <ActionButton
            variant="ghost"
            size="md"
            icon={CircleSlash}
            onClick={() => navigate(`/exception?jobId=${job.id}&type=wrong_site`)}
          >
            Wrong Site or Tank
          </ActionButton>

          <a
            href="tel:5125550100"
            className="w-full h-12 bg-success/10 border border-success/25 text-success rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:bg-success/20"
          >
            <Phone className="w-4 h-4" /> Call Dispatch
          </a>
        </div>
      </div>

      {/* Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6">
          <div className="bg-card rounded-3xl p-8 text-center max-w-sm w-full">
            <div className="w-52 h-52 mx-auto mb-5 relative flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl" />
              <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-primary rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-primary rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-primary rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-primary rounded-br-xl" />
              <div
                className="w-3/4 h-[2px] bg-primary rounded-full animate-bounce"
                style={{ boxShadow: "0 0 10px hsl(var(--primary))" }}
              />
            </div>
            <p className="font-bold text-base">Scanning…</p>
            <p className="text-xs text-muted-foreground mt-1 mb-5">Point camera at tank QR code or barcode</p>
            <button
              onClick={() => setShowScanModal(false)}
              className="text-sm text-muted-foreground underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <DriverBottomNav />
    </div>
  );
}