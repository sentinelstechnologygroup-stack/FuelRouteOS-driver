import React from "react";
import { getTenantLogo, getTenantInitials, getTenantName, getTenantAccentColor } from "@/lib/branding";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: { container: "w-8 h-8 rounded-xl",    text: "text-xs font-black",   img: "w-8 h-8 rounded-xl" },
  md: { container: "w-12 h-12 rounded-2xl",  text: "text-base font-black", img: "w-12 h-12 rounded-2xl" },
  lg: { container: "w-16 h-16 rounded-2xl",  text: "text-xl font-black",   img: "w-16 h-16 rounded-2xl" },
};

export default function ClientBrandMark({ size = "md", showName = false, variant = "app", className }) {
  const logo = getTenantLogo();
  const initials = getTenantInitials();
  const name = getTenantName();
  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {logo ? (
        <img
          src={logo}
          alt={name}
          className={cn(s.img, "object-contain bg-card border border-border")}
        />
      ) : (
        <div
          className={cn(
            s.container,
            "flex items-center justify-center bg-primary/10 border border-primary/25 shrink-0"
          )}
          aria-hidden="true"
        >
          <span className={cn(s.text, "text-primary")}>{initials}</span>
        </div>
      )}
      {showName && (
        <span className="font-bold text-sm text-foreground truncate">{name}</span>
      )}
    </div>
  );
}