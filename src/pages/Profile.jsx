import React from "react";
import {
  User, Truck, Container, CreditCard, Phone, LogOut,
  Wifi, WifiOff, Info, Shield, ClipboardCheck, Wrench,
  ChevronRight, FileText, Lock, Eye, Type
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import DriverBottomNav from "@/components/driver/DriverBottomNav";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function NavRow({ icon: Icon, label, onClick, sub }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 text-left active:bg-secondary/40 transition-colors min-h-[52px]"
    >
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { driver, truck, trailer, signal } = useDriver();

  const connectionLabel = signal === "online" ? "Online" : signal === "weak" ? "Weak Signal" : "Offline";
  const ConnectionIcon = signal === "offline" ? WifiOff : Wifi;

  const initials = driver.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div className="bg-background min-h-screen pb-28">
      <PageHeader title="Driver Profile" subtitle={driver.company} />

      <div className="px-4 py-4 space-y-4">

        {/* Avatar & summary */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <span className="text-xl font-black text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-black text-foreground truncate">{driver.name}</p>
            <p className="text-xs text-muted-foreground">{driver.email}</p>
            <p className="text-xs text-muted-foreground">{driver.company}</p>
          </div>
        </div>

        {/* Driver info */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <p className="px-4 py-2.5 text-[10px] text-muted-foreground uppercase tracking-wider font-bold border-b border-border">
            Driver Information
          </p>
          <InfoRow icon={CreditCard}   label="CDL Number"        value={driver.cdl} />
          <InfoRow icon={Phone}        label="Phone"             value={driver.phone} />
          <InfoRow icon={Truck}        label="Assigned Truck"    value={`#${truck.number} — ${truck.year} ${truck.make} ${truck.model}`} />
          <InfoRow icon={Container}    label="Assigned Trailer"  value={`#${trailer.number} — ${trailer.type}`} />
          <InfoRow icon={ConnectionIcon} label="Connection"      value={connectionLabel} />
          <InfoRow icon={Info}         label="Device ID"         value="DEV-LOCAL-PROTO" />
          <InfoRow icon={Info}         label="App Version"       value="FuelRouteOS v1.0.0" />
        </div>

        {/* Appearance shortcuts */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <p className="px-4 py-2.5 text-[10px] text-muted-foreground uppercase tracking-wider font-bold border-b border-border">
            Display &amp; Accessibility
          </p>
          <NavRow icon={Eye}  label="Appearance &amp; Display" sub="Day, Night, or Accessible mode" onClick={() => navigate("/settings")} />
          <NavRow icon={Type} label="Text Size"              sub="Standard, Large, Extra Large" onClick={() => navigate("/settings")} />
        </div>

        {/* Vehicle & Inspections */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <p className="px-4 py-2.5 text-[10px] text-muted-foreground uppercase tracking-wider font-bold border-b border-border">
            Vehicle &amp; Inspections
          </p>
          <NavRow icon={ClipboardCheck} label="Pre-Trip Inspection"   onClick={() => navigate("/pre-trip")} />
          <NavRow icon={ClipboardCheck} label="Post-Trip Inspection"  onClick={() => navigate("/post-trip")} />
          <NavRow icon={Wrench}         label="Report Vehicle Issue"  onClick={() => navigate("/vehicle-issue")} />
        </div>

        {/* Legal & Trust */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <p className="px-4 py-2.5 text-[10px] text-muted-foreground uppercase tracking-wider font-bold border-b border-border">
            Legal &amp; Trust
          </p>
          <NavRow icon={FileText} label="Terms of Service"         onClick={() => navigate("/terms")} />
          <NavRow icon={Lock}     label="Privacy Policy"           onClick={() => navigate("/privacy")} />
          <NavRow icon={Eye}      label="Accessibility Statement"  onClick={() => navigate("/accessibility-statement")} />
          <NavRow icon={Shield}   label="Data Use Notice"          onClick={() => navigate("/data-use")} />
        </div>

        {/* Support */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <p className="px-4 py-2.5 text-[10px] text-muted-foreground uppercase tracking-wider font-bold border-b border-border">
            Support
          </p>
          <NavRow icon={Phone} label="Contact Dispatch" sub="5125550100" onClick={() => window.location.href = "tel:5125550100"} />
        </div>

        {/* Sign out */}
        <div className="pt-2 space-y-3">
          <ActionButton
            variant="ghost"
            size="md"
            icon={LogOut}
            onClick={() => navigate("/")}
          >
            Sign Out
          </ActionButton>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/60 pt-2 pb-4">
          FuelRouteOS Driver v1.0.0 · Sentinels FleetOps
        </p>
      </div>

      <DriverBottomNav />
    </div>
  );
}