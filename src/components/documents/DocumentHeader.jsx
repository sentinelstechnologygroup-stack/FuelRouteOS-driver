import React from "react";
import { Fuel } from "lucide-react";
import { getDocumentHeaderData } from "@/lib/branding";
import { cn } from "@/lib/utils";

export default function DocumentHeader({ title, date, driverName, truckNumber, trailerNumber, className }) {
  const { companyName, logoUrl, initials, platformName, poweredBy, showLogo } = getDocumentHeaderData();
  const now = date || new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className={cn("bg-card border border-border rounded-2xl p-4 space-y-3", className)}>
      {/* Top row: brand + platform */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {showLogo && (
            logoUrl
              ? <img src={logoUrl} alt={companyName} className="w-9 h-9 rounded-xl object-contain border border-border" />
              : (
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-primary">{initials}</span>
                </div>
              )
          )}
          <div>
            <p className="text-xs font-black text-foreground">{companyName}</p>
            <div className="flex items-center gap-1">
              <Fuel className="w-2.5 h-2.5 text-primary" aria-hidden="true" />
              <p className="text-[9px] font-bold uppercase tracking-wider text-primary">{platformName}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">{now}</p>
        </div>
      </div>

      {/* Document title */}
      {title && (
        <div className="border-t border-border pt-2.5">
          <p className="text-base font-black text-foreground">{title}</p>
        </div>
      )}

      {/* Driver / vehicle row */}
      {(driverName || truckNumber || trailerNumber) && (
        <div className="flex flex-wrap gap-3 text-xs">
          {driverName && (
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Driver</p>
              <p className="font-semibold text-foreground">{driverName}</p>
            </div>
          )}
          {truckNumber && (
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Truck</p>
              <p className="font-semibold text-foreground">#{truckNumber}</p>
            </div>
          )}
          {trailerNumber && (
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Trailer</p>
              <p className="font-semibold text-foreground">#{trailerNumber}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}