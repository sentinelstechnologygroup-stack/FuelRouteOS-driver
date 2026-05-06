import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Fuel, Shield, FileText, Lock, ChevronRight } from "lucide-react";
import { useApp } from "@/lib/appContext";
import { cn } from "@/lib/utils";

export default function TermsAcceptance() {
  const navigate = useNavigate();
  const { acceptTerms } = useApp();

  const [checks, setChecks] = useState({ terms: false, privacy: false, dataUse: false });
  const allChecked = checks.terms && checks.privacy && checks.dataUse;

  const toggle = (key) => setChecks(prev => ({ ...prev, [key]: !prev[key] }));

  const handleAccept = () => {
    if (!allChecked) return;
    acceptTerms();
    navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto px-5 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-xl font-black tracking-tight">Before You Begin</h1>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Please review and accept the following before accessing FuelRouteOS Driver.
        </p>
      </div>

      {/* Acknowledgements */}
      <div className="space-y-3 mb-6">
        {[
          {
            key: "terms",
            icon: FileText,
            label: "I agree to the Terms of Service",
            sub: "Authorized use, driver responsibilities, and prohibited use.",
            link: "/terms",
          },
          {
            key: "privacy",
            icon: Lock,
            label: "I acknowledge the Privacy Policy",
            sub: "Data collection, use, and sharing practices.",
            link: "/privacy",
          },
          {
            key: "dataUse",
            icon: Fuel,
            label: "I understand data use for dispatch operations",
            sub: "Location, scan, BOL/POD images, and sync data may be used for delivery and dispatch operations.",
            link: "/data-use",
          },
        ].map(({ key, icon: Icon, label, sub, link }) => (
          <div
            key={key}
            className={cn(
              "rounded-2xl border p-4 transition-colors",
              checks[key] ? "bg-success/5 border-success/30" : "bg-card border-border"
            )}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={() => toggle(key)}
                aria-label={label}
                className={cn(
                  "w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                  checks[key] ? "bg-success border-success" : "border-muted-foreground"
                )}
              >
                {checks[key] && (
                  <svg viewBox="0 0 12 10" className="w-3 h-3 text-white fill-none stroke-current stroke-2">
                    <polyline points="1,5 4,9 11,1" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-snug">{label}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{sub}</p>
              </div>
            </div>
            {/* View link */}
            <button
              onClick={() => navigate(link)}
              className="mt-3 flex items-center gap-1.5 text-xs text-primary font-semibold ml-9"
            >
              <Icon className="w-3.5 h-3.5" />
              View document
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Accept button */}
      <button
        onClick={handleAccept}
        disabled={!allChecked}
        className={cn(
          "w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all",
          allChecked
            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 active:scale-[0.98]"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        <Shield className="w-5 h-5" />
        Accept and Continue
      </button>

      {!allChecked && (
        <p className="text-center text-xs text-muted-foreground mt-3">
          Please check all three items above to continue.
        </p>
      )}

      <div className="mt-auto pt-8 text-center space-y-1">
        <p className="text-[11px] text-muted-foreground/60">FuelRouteOS Driver · Sentinels FleetOps</p>
        <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground/50">
          <button onClick={() => navigate("/terms")} className="hover:underline">Terms</button>
          <span>·</span>
          <button onClick={() => navigate("/privacy")} className="hover:underline">Privacy</button>
          <span>·</span>
          <button onClick={() => navigate("/data-use")} className="hover:underline">Data Use</button>
        </div>
      </div>
    </div>
  );
}