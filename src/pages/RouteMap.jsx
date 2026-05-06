import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, CheckCircle2 } from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import { cn } from "@/lib/utils";
import { getJobRequestedGallons, STATUS_LABELS } from "@/lib/jobHelpers";

export default function RouteMap() {
  const navigate = useNavigate();
  const { jobs } = useDriver();

  return (
    <div className="bg-background min-h-screen pb-24">
      <PageHeader title="Route Overview" subtitle="Today's delivery stops" />

      <div className="px-4 py-4">
        {/* Route Timeline */}
        <div className="relative">
          {jobs.map((job, idx) => {
            const isLast = idx === jobs.length - 1;
            const isActive = ["en_route", "loading", "bol_captured", "approaching", "arrived", "site_verified", "delivering", "pod_required"].includes(job.status);
            const isCompleted = job.status === "completed";

            return (
              <button
                key={job.id}
                onClick={() => navigate(`/stop/${job.id}`)}
                className="flex gap-4 w-full text-left mb-1 active:bg-secondary/30 rounded-xl p-2 -ml-2 transition-colors"
              >
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border-2",
                      isCompleted && "bg-success/15 border-success/30",
                      isActive && "bg-primary/15 border-primary/40",
                      !isCompleted && !isActive && "bg-secondary border-border"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : isActive ? (
                      <Navigation className="w-4 h-4 text-primary" />
                    ) : (
                      <span className="text-sm font-bold text-muted-foreground">{job.stopNumber}</span>
                    )}
                  </div>
                  {!isLast && (
                    <div className={cn(
                      "w-0.5 h-16",
                      isCompleted ? "bg-success/30" : "bg-border"
                    )} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "font-semibold text-sm",
                      isCompleted && "text-muted-foreground"
                    )}>
                      {job.customer.name}
                    </p>
                    <span className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      isCompleted && "bg-success/15 text-success",
                      isActive && "bg-primary/15 text-primary",
                      !isCompleted && !isActive && "bg-muted text-muted-foreground"
                    )}>
                      {STATUS_LABELS[job.status] || "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.site.name}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.site.address.split(",")[0]}
                    </span>
                    <span>{getJobRequestedGallons(job).toLocaleString()} gal</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <DriverBottomNav />
    </div>
  );
}