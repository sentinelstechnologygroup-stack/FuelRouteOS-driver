// StatusBadge now delegates to StatusChip for consistent color-blind safe rendering.
import React from "react";
import StatusChip from "./StatusChip";

export default function StatusBadge({ status, className, size = "sm" }) {
  return <StatusChip status={status} size={size === "md" ? "sm" : "dot"} className={className} />;
}