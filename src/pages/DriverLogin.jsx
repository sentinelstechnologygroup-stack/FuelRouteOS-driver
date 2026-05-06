import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Fuel, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ActionButton from "@/components/driver/ActionButton";
import { useApp, APPEARANCES } from "@/lib/appContext";
import { getTenantName, getTenantLogo, getTenantInitials, getPlatformProductName, getPoweredByLine } from "@/lib/branding";
import { cn } from "@/lib/utils";

export default function DriverLogin() {
  const navigate = useNavigate();
  const { appearance, setAppearance, termsAccepted } = useApp();

  const [email, setEmail] = useState("m.johnson@sentinelsfleet.com");
  const [pin, setPin] = useState("4821");
  const [showPin, setShowPin] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const tenantName    = getTenantName();
  const tenantLogo    = getTenantLogo();
  const tenantInitials = getTenantInitials();
  const productName   = getPlatformProductName();
  const poweredBy     = getPoweredByLine();

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (!termsAccepted) {
        navigate("/terms-acceptance");
      } else {
        navigate("/home");
      }
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-8 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Sentinels FleetOps
        </span>
        {/* Day / Night toggle */}
        <div className="flex items-center gap-1 bg-secondary border border-border rounded-xl p-1" role="group" aria-label="Display mode">
          {[
            { val: APPEARANCES.DAY,   icon: Sun,  label: "Day" },
            { val: APPEARANCES.NIGHT, icon: Moon, label: "Night" },
          ].map(({ val, icon: Icon, label }) => {
            const active = appearance === val;
            return (
              <button
                key={val}
                onClick={() => setAppearance(val)}
                aria-label={`${label} mode`}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all",
                  active
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-3 h-3" /> {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-6">

        {/* Brand lockup */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            {/* Platform icon */}
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
              <Fuel className="w-7 h-7 text-primary-foreground" aria-hidden="true" />
            </div>
            {/* Client brand mark */}
            {tenantLogo ? (
              <img src={tenantLogo} alt={tenantName} className="w-10 h-10 rounded-xl object-contain border border-border" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-primary">{tenantInitials}</span>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">{productName}</h1>
          <p className="text-sm font-semibold text-muted-foreground mt-0.5">{tenantName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{poweredBy}</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="login-email" className="text-xs font-bold text-foreground mb-1.5 block uppercase tracking-wide">
              Email or Employee ID <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <Input
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="driver@company.com"
              autoComplete="username"
              className="h-12 bg-secondary border-input text-foreground rounded-xl text-base"
            />
          </div>

          <div>
            <label htmlFor="login-pin" className="text-xs font-bold text-foreground mb-1.5 block uppercase tracking-wide">
              Password / PIN <span className="text-destructive" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Input
                id="login-pin"
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                autoComplete="current-password"
                className="h-12 bg-secondary border-input text-foreground rounded-xl pr-12 text-base"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-2 hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer min-h-[44px]">
              <Checkbox
                checked={remember}
                onCheckedChange={setRemember}
                className="border-input data-[state=checked]:bg-primary"
                aria-label="Remember this device"
              />
              <span className="text-sm text-muted-foreground">Remember this device</span>
            </label>
            <button
              type="button"
              className="text-sm text-primary font-semibold min-h-[44px] px-1 hover:underline"
            >
              Forgot PIN?
            </button>
          </div>

          <div className="pt-2">
            <ActionButton onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </ActionButton>
          </div>
        </div>

        <button
          onClick={() => navigate("/settings")}
          className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground w-full min-h-[44px] hover:text-foreground transition-colors"
          aria-label="Go to accessibility and display settings"
        >
          Accessibility &amp; Display Settings
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 px-6">
        <div className="h-px bg-border mb-5" />
        <p className="text-xs text-muted-foreground font-medium">
          FuelRouteOS Driver v1.0 · Sentinels FleetOps
        </p>
        <p className="text-xs text-muted-foreground mt-1">For authorized fleet personnel only</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          {[
            { label: "Terms",         path: "/terms" },
            { label: "Privacy",       path: "/privacy" },
            { label: "Accessibility", path: "/accessibility-statement" },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="text-xs text-primary hover:underline min-h-[44px] flex items-center"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}