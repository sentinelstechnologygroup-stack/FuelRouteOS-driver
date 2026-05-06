import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function PageHeader({ title, subtitle, backTo, rightAction, className }) {
  const navigate = useNavigate();

  return (
    <header className={cn("sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border px-4 py-3 max-w-lg mx-auto w-full", className)} role="banner">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-secondary hover:bg-secondary/80 transition-colors -ml-1 shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-base font-bold leading-tight truncate">{title}</h1>
            {subtitle && <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>}
          </div>
        </div>
        {rightAction && <div className="shrink-0 ml-3">{rightAction}</div>}
      </div>
    </header>
  );
}