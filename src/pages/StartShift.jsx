import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck, Container, CalendarDays, Clock, ShieldCheck,
  AlertTriangle, Phone, Play, CheckCircle2, Fuel
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import ActionButton from "@/components/driver/ActionButton";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

const PREFLIGHT_ITEMS = [
  "Pre-trip inspection completed",
  "Safety equipment onboard (spill kit, PPE, fire extinguisher)",
  "Compartments sealed and valves closed",
  "All required paperwork and IDs in cab",
];

export default function StartShift() {
  const navigate = useNavigate();
  const { driver, truck, trailer, startShift } = useDriver();
  const [checkedItems, setCheckedItems] = useState({});
  const now = new Date();

  const allChecked = PREFLIGHT_ITEMS.every((_, i) => checkedItems[i]);

  const toggleItem = (i) =>
    setCheckedItems(prev => ({ ...prev, [i]: !prev[i] }));

  const handleStartShift = () => {
    startShift();
    navigate("/today-shift");
  };

  const greetingHour = now.getHours();
  const greeting =
    greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 shrink-0">
            <Fuel className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.18em]">FuelRouteOS Driver</p>
            <p className="text-2xl font-black leading-tight mt-0.5">{greeting},</p>
            <p className="text-2xl font-black leading-tight text-primary">{driver.name.split(" ")[0]}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {format(now, "EEEE, MMMM d")}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {format(now, "h:mm a")}
          </span>
        </div>
      </div>

      <div className="px-4 space-y-4 pb-8">
        {/* Assignments */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's Assignment</p>

          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Truck</p>
              <p className="font-bold">#{truck.number} — {truck.year} {truck.make} {truck.model}</p>
              <p className="text-xs text-muted-foreground">Plate: {truck.licensePlate}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Container className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Trailer</p>
              <p className="font-bold">#{trailer.number} — {trailer.type}</p>
              <p className="text-xs text-muted-foreground">
                {trailer.capacity.toLocaleString()} gal · {trailer.compartments.length} compartments
              </p>
            </div>
          </div>
        </div>

        {/* Pre-trip Checklist */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${allChecked ? "text-success" : "text-warning"}`} />
            <p className="text-sm font-bold">Pre-Trip Safety Checklist</p>
            {allChecked && (
              <span className="ml-auto text-xs font-bold text-success flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All clear
              </span>
            )}
          </div>
          <div className="divide-y divide-border">
            {PREFLIGHT_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleItem(i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-secondary/50 transition-colors"
              >
                <Checkbox
                  checked={!!checkedItems[i]}
                  onCheckedChange={() => toggleItem(i)}
                  className="border-border data-[state=checked]:bg-success data-[state=checked]:border-success"
                />
                <p className={`text-sm ${checkedItems[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Info copy */}
        {!allChecked && (
          <p className="text-xs text-muted-foreground text-center px-4">
            Complete all checklist items before starting your shift.
          </p>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <ActionButton
            onClick={handleStartShift}
            icon={Play}
            disabled={!allChecked}
          >
            {allChecked ? "Start Shift" : `Complete checklist (${Object.values(checkedItems).filter(Boolean).length}/${PREFLIGHT_ITEMS.length})`}
          </ActionButton>

          <div className="grid grid-cols-2 gap-3">
            <ActionButton
              variant="outline"
              size="md"
              icon={AlertTriangle}
              onClick={() => navigate("/exception")}
            >
              Vehicle Issue
            </ActionButton>
            <a
              href="tel:5125550100"
              className="h-12 bg-success/10 border border-success/25 text-success rounded-xl flex items-center justify-center gap-2 text-sm font-semibold active:bg-success/20"
            >
              <Phone className="w-4 h-4" /> Dispatch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}