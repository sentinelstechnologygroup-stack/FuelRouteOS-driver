import React from "react";
import { cn } from "@/lib/utils";

export default function ActionButton({ children, onClick, variant = "primary", size = "lg", icon: Icon, className, disabled }) {
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-sm shadow-primary/25 active:bg-primary/85",
    success: "bg-success text-success-foreground shadow-sm shadow-success/20 active:bg-success/85",
    warning: "bg-warning text-warning-foreground active:bg-warning/85",
    destructive: "bg-destructive text-destructive-foreground active:bg-destructive/85",
    secondary: "bg-secondary text-secondary-foreground active:bg-secondary/70",
    outline: "border-2 border-border text-foreground active:bg-secondary",
    ghost: "text-muted-foreground active:text-foreground active:bg-secondary",
  };

  const sizes = {
    sm: "h-10 px-4 text-sm rounded-xl",
    md: "h-12 px-5 text-sm rounded-xl",
    lg: "h-14 px-6 text-base rounded-2xl font-bold",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.97] w-full",
        variants[variant],
        sizes[size],
        disabled && "opacity-40 cursor-not-allowed active:scale-100",
        className
      )}
    >
      {Icon && <Icon className={cn(size === "lg" ? "w-5 h-5" : "w-4 h-4")} />}
      {children}
    </button>
  );
}