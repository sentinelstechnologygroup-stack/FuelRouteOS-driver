import React from "react";
import { Fuel } from "lucide-react";
import { getPlatformProductName, getPoweredByLine } from "@/lib/branding";
import { cn } from "@/lib/utils";

export default function PlatformAttribution({ variant = "default", className }) {
  if (variant === "compact") {
    return (
      <span className={cn("text-[10px] text-muted-foreground font-medium", className)}>
        {getPoweredByLine()}
      </span>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Fuel className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">
        {getPlatformProductName()}
      </span>
    </div>
  );
}