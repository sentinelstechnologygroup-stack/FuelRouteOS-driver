import React from "react";
import { getDocumentFooterData } from "@/lib/branding";
import { cn } from "@/lib/utils";

export default function DocumentFooter({ variant = "default", className }) {
  const { footerText, showPoweredBy, poweredBy, supportPhone, supportEmail } = getDocumentFooterData();

  return (
    <div className={cn("border-t border-border pt-3 mt-3 space-y-1", className)}>
      {(supportPhone || supportEmail) && (
        <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
          {supportPhone && <span>Support: {supportPhone}</span>}
          {supportEmail && <span>{supportEmail}</span>}
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">{footerText}</p>
        {showPoweredBy && (
          <p className="text-[10px] text-muted-foreground font-semibold">{poweredBy}</p>
        )}
      </div>
      <p className="text-[9px] text-muted-foreground/50 italic">
        Draft — for internal use. Not a legal document until countersigned.
      </p>
    </div>
  );
}