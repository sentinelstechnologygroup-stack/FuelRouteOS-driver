import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun, Moon, Eye, Type, Shield, FileText, Lock, Phone,
  HelpCircle, ChevronRight, User, Zap, Wifi, Map, Building2
} from "lucide-react";
import PageHeader from "@/components/driver/PageHeader";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import HamburgerMenu from "@/components/driver/HamburgerMenu";
import { useApp, APPEARANCES, FONT_SIZES, MAPS_APPS } from "@/lib/appContext";
import { getTenantName, getTenantLogo, getTenantInitials, getDispatchPhone, getSupportEmail, getTenantAccentColor } from "@/lib/branding";
import { cn } from "@/lib/utils";

function SectionHeader({ children }) {
  return (
    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold px-1 pt-3 pb-1">
      {children}
    </p>
  );
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-border last:border-0 min-h-[56px]">
      <div className="flex-1 pr-4">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-12 h-6 rounded-full transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          value ? "bg-primary" : "bg-muted"
        )}
      >
        <span className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
          value ? "translate-x-7" : "translate-x-1"
        )} />
        <span className="sr-only">{value ? "On" : "Off"}</span>
      </button>
    </div>
  );
}

function NavRow({ icon: Icon, label, sub, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 text-left active:bg-secondary/40 transition-colors min-h-[52px]"
    >
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5 truncate">{sub}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  );
}

const APPEARANCE_OPTIONS = [
  { value: APPEARANCES.DAY,        icon: Sun,  label: "Day",        desc: "Light mode" },
  { value: APPEARANCES.NIGHT,      icon: Moon, label: "Night",      desc: "Dark mode" },
  { value: APPEARANCES.ACCESSIBLE, icon: Eye,  label: "Accessible", desc: "High contrast" },
];

const FONT_OPTIONS = [
  { value: FONT_SIZES.STANDARD, label: "Standard", textClass: "text-sm" },
  { value: FONT_SIZES.LARGE,    label: "Large",    textClass: "text-base" },
  { value: FONT_SIZES.XLARGE,   label: "X-Large",  textClass: "text-lg" },
];

const MAPS_OPTIONS = [
  { value: MAPS_APPS.GOOGLE, label: "Google Maps" },
  { value: MAPS_APPS.APPLE,  label: "Apple Maps" },
  { value: MAPS_APPS.WAZE,   label: "Waze" },
  { value: MAPS_APPS.ASK,    label: "Ask Every Time" },
];

export default function AppSettings() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    appearance, setAppearance,
    fontSize, setFontSize,
    reducedMotion, setReducedMotion,
    largeTapTargets, setLargeTapTargets,
    mapsApp, setMapsApp,
  } = useApp();

  const tenantName     = getTenantName();
  const tenantInitials = getTenantInitials();
  const tenantLogo     = getTenantLogo();
  const dispatchPhone  = getDispatchPhone();
  const supportEmail   = getSupportEmail();
  const accentColor    = getTenantAccentColor();

  return (
    <div className="bg-background min-h-screen pb-28">
      <PageHeader
        title="Settings"
        subtitle="FuelRouteOS Driver"
        rightAction={
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary"
          >
            <div className="space-y-1.5" aria-hidden="true">
              <span className="block w-5 h-0.5 bg-foreground rounded" />
              <span className="block w-5 h-0.5 bg-foreground rounded" />
              <span className="block w-5 h-0.5 bg-foreground rounded" />
            </div>
          </button>
        }
      />

      <div className="px-4 py-2 space-y-0.5">

        {/* ─── APPEARANCE ─── */}
        <SectionHeader>Appearance</SectionHeader>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

          {/* Display Mode */}
          <div className="px-4 py-4 border-b border-border">
            <p className="text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Display Mode</p>
            <div className="grid grid-cols-3 gap-2">
              {APPEARANCE_OPTIONS.map(({ value, icon: Icon, label, desc }) => {
                const active = appearance === value;
                return (
                  <button
                    key={value}
                    onClick={() => setAppearance(value)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl border-2 transition-all",
                      active
                        ? "bg-primary/10 border-primary"
                        : "bg-secondary border-border"
                    )}
                  >
                    <Icon
                      className={cn("w-5 h-5", active ? "text-primary" : "text-foreground")}
                      aria-hidden="true"
                    />
                    <span className={cn(
                      "text-xs font-bold leading-tight",
                      active ? "text-primary" : "text-foreground"
                    )}>
                      {label}
                    </span>
                    <span className={cn(
                      "text-[9px] text-center leading-tight",
                      active ? "text-primary/70" : "text-muted-foreground"
                    )}>
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Size */}
          <div className="px-4 py-4">
            <p className="text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Text Size</p>
            <div className="grid grid-cols-3 gap-2">
              {FONT_OPTIONS.map(({ value, label, textClass }) => {
                const active = fontSize === value;
                return (
                  <button
                    key={value}
                    onClick={() => setFontSize(value)}
                    aria-pressed={active}
                    className={cn(
                      "flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all",
                      active
                        ? "bg-primary/10 border-primary"
                        : "bg-secondary border-border"
                    )}
                  >
                    <span className={cn(
                      textClass,
                      "font-black leading-tight",
                      active ? "text-primary" : "text-foreground"
                    )}>
                      Aa
                    </span>
                    <span className={cn(
                      "text-[10px] font-semibold",
                      active ? "text-primary" : "text-foreground"
                    )}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── ACCESSIBILITY ─── */}
        <SectionHeader>Accessibility</SectionHeader>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <ToggleRow
            label="Reduced Motion"
            sub="Disables non-essential animations"
            value={reducedMotion}
            onChange={setReducedMotion}
          />
          <ToggleRow
            label="Larger Touch Targets"
            sub="Increases minimum tap area to 52px"
            value={largeTapTargets}
            onChange={setLargeTapTargets}
          />
        </div>

        {/* ─── DEFAULT MAPS APP ─── */}
        <SectionHeader>Navigation</SectionHeader>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-4">
            <p className="text-xs font-bold text-foreground mb-3 uppercase tracking-wide">Default Maps App</p>
            <div className="grid grid-cols-2 gap-2">
              {MAPS_OPTIONS.map(({ value, label }) => {
                const active = mapsApp === value;
                return (
                  <button
                    key={value}
                    onClick={() => setMapsApp(value)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center gap-2 px-3 py-3 rounded-xl border-2 text-left transition-all",
                      active
                        ? "bg-primary/10 border-primary"
                        : "bg-secondary border-border"
                    )}
                  >
                    <Map className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "text-foreground")} aria-hidden="true" />
                    <span className={cn(
                      "text-xs font-semibold leading-tight",
                      active ? "text-primary" : "text-foreground"
                    )}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2.5">
              Used by Open in Maps and Start Navigation across all stops.
            </p>
          </div>
        </div>

        {/* ─── DRIVER PREFERENCES ─── */}
        <SectionHeader>Driver Preferences</SectionHeader>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <NavRow icon={User}  label="Driver Profile"   sub="Name, truck, CDL, contact"     onClick={() => navigate("/profile")} />
          <NavRow icon={Wifi}  label="Sync Preferences" sub="Sync queue, offline behavior"   onClick={() => navigate("/sync")} />
        </div>

        {/* ─── SYNC PREFERENCES ─── */}
        <SectionHeader>Sync Preferences</SectionHeader>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <ToggleRow
            label="Sync Over Cellular"
            sub="Allow sync on mobile data"
            value={true}
            onChange={() => {}}
          />
          <ToggleRow
            label="Images on Wi-Fi Only"
            sub="Save cellular data by syncing images on Wi-Fi"
            value={false}
            onChange={() => {}}
          />
        </div>

        {/* ─── COMPANY BRANDING ─── */}
        <SectionHeader>Company Branding</SectionHeader>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-4 space-y-3">
            {/* Brand preview */}
            <div className="flex items-center gap-3 py-2">
              {tenantLogo ? (
                <img src={tenantLogo} alt={tenantName} className="w-10 h-10 rounded-xl object-contain border border-border" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-black text-primary">{tenantInitials}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{tenantName}</p>
                <p className="text-xs text-muted-foreground">Logo status: {tenantLogo ? "Logo uploaded" : "Using initials"}</p>
              </div>
              <div
                className="w-6 h-6 rounded-lg border border-border shrink-0"
                style={{ backgroundColor: accentColor }}
                title="Accent color"
              />
            </div>

            <div className="space-y-1.5 border-t border-border pt-3">
              {[
                { label: "Dispatch Phone", value: dispatchPhone || "—" },
                { label: "Support Email",  value: supportEmail  || "—" },
                { label: "Customer Documents", value: "Branded · Enabled" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xs font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground/70 italic pt-1">
              Company branding is configured during FuelRouteOS onboarding and managed by your company administrator.
            </p>
          </div>
        </div>

        {/* ─── LEGAL & TRUST ─── */}
        <SectionHeader>Legal &amp; Trust</SectionHeader>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <NavRow icon={FileText} label="Terms of Service"        onClick={() => navigate("/terms")} />
          <NavRow icon={Lock}     label="Privacy Policy"          onClick={() => navigate("/privacy")} />
          <NavRow icon={Eye}      label="Accessibility Statement" onClick={() => navigate("/accessibility-statement")} />
          <NavRow icon={Shield}   label="Data Use Notice"         onClick={() => navigate("/data-use")} />
        </div>

        {/* ─── SUPPORT ─── */}
        <SectionHeader>Support</SectionHeader>
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <NavRow icon={Phone}      label="Contact Dispatch"  sub={dispatchPhone || "Call or message your dispatcher"} onClick={() => navigate("/chat")} />
          <NavRow icon={HelpCircle} label="App Version"       sub="FuelRouteOS Driver v1.0.0 · Sentinels FleetOps"   onClick={() => {}} />
        </div>

      </div>

      <DriverBottomNav />
      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}