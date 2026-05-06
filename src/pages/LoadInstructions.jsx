import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Package, AlertTriangle, Camera } from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import { Checkbox } from "@/components/ui/checkbox";
import { trailer } from "@/lib/mockData";
import { getJobProduct, getJobRequestedGallons } from "@/lib/jobHelpers";

export default function LoadInstructions() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobStatus } = useDriver();
  const job = jobs.find(j => j.id === jobId);
  const [confirmed, setConfirmed] = useState(false);

  if (!job) return null;

  const product = getJobProduct(job);
  const requestedGallons = getJobRequestedGallons(job);

  const handleConfirm = () => {
    updateJobStatus(job.id, "loading");
    navigate(`/job/${job.id}/bol`);
  };

  return (
    <div className="bg-background min-h-screen pb-28">
      <PageHeader title="Load Instructions" subtitle={job.customer.name} backTo={`/job/${job.id}`} />

      <div className="px-4 py-4 space-y-4">
        {/* Terminal */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Terminal / Rack</p>
              <p className="font-semibold">{job.bol?.terminal || "Magellan East Austin"}</p>
            </div>
          </div>
        </div>

        {/* Product & Quantity */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Product Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Product</p>
              <p className="font-semibold text-sm">{product}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Requested</p>
              <p className="font-semibold text-sm">{requestedGallons.toLocaleString()} gal</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gross Gallons</p>
              <p className="font-semibold text-sm">{(requestedGallons + 40).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Gallons</p>
              <p className="font-semibold text-sm">{requestedGallons.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Compartment Allocation */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Compartment Allocation</p>
          <div className="space-y-2">
            {trailer.compartments.map(comp => {
              const isMatch = comp.product === (job.product?.split(" ").pop() || "");
              return (
                <div
                  key={comp.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    isMatch ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">C{comp.id}</span>
                    <span className="text-sm font-medium">{comp.product}</span>
                  </div>
                  <span className="text-sm font-semibold">{comp.capacity.toLocaleString()} gal</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Confirmation */}
        <div className="bg-warning/5 border border-warning/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={confirmed}
              onCheckedChange={setConfirmed}
              className="mt-0.5 border-warning data-[state=checked]:bg-warning data-[state=checked]:border-warning"
            />
            <div>
              <p className="text-sm font-semibold">I confirm the load instructions are correct</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Product, quantity, and compartment allocation have been verified.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <ActionButton onClick={handleConfirm} disabled={!confirmed} icon={Camera}>
            Confirm & Capture BOL
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="md"
            icon={AlertTriangle}
            onClick={() => navigate(`/exception?jobId=${job.id}`)}
          >
            Report Load Issue
          </ActionButton>
        </div>
      </div>
      <DriverBottomNav />
    </div>
  );
}