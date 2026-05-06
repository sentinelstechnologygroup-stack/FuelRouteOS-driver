import React, { useState } from "react";
import { ScanLine, X, CheckCircle2, Hash, FileText, Container, Tag, MapPin, Camera, Fuel, Truck, Package, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import PageHeader from "@/components/driver/PageHeader";
import DriverBottomNav from "@/components/driver/DriverBottomNav";
import { useDriver } from "@/lib/driverContext";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const SCAN_TYPES = [
  { id: "bol",       label: "BOL Barcode",         icon: FileText,   color: "text-info",        syncType: "scan_bol" },
  { id: "tank",      label: "Tank QR Code",         icon: Container,  color: "text-teal-400",    syncType: "scan_tank" },
  { id: "asset",     label: "Asset Tag",            icon: Tag,        color: "text-purple-400",  syncType: "scan_asset" },
  { id: "equipment", label: "Equipment Barcode",    icon: Truck,      color: "text-amber-400",   syncType: "scan_equipment" },
  { id: "site",      label: "Site / Location QR",   icon: MapPin,     color: "text-success",     syncType: "scan_tank" },
  { id: "pickup",    label: "Pickup Confirmation",  icon: Package,    color: "text-sky-400",     syncType: "scan_pickup" },
  { id: "delivery",  label: "Delivery Confirmation",icon: Camera,     color: "text-success",     syncType: "scan_delivery" },
  { id: "transfer",  label: "Fuel Transfer Scan",   icon: Fuel,       color: "text-orange-400",  syncType: "scan_transfer" },
  { id: "trailer",   label: "Trailer / Compartment",icon: Truck,      color: "text-pink-400",    syncType: "scan_equipment" },
  { id: "unknown",   label: "Unknown Code",         icon: AlertTriangle, color: "text-muted-foreground", syncType: "scan_unknown" },
];

const MOCK_RESULTS = {
  bol:       { id: "BOL-TX-204912",   detail: "Flint Hills Resources — Waco",   action: "BOL fields autofilled" },
  tank:      { id: "TNK-LSG-14A",     detail: "Site: Junction Fairbanks",       action: "Attached to active job" },
  asset:     { id: "AST-GEN-0822",    detail: "Customer Gen — JOB-5001",        action: "Equipment record updated" },
  equipment: { id: "EQ-FR4210PUMP",   detail: "FR4210 Pump — TRK-4821",         action: "Attached to vehicle record" },
  site:      { id: "SITE-HOU-0041",   detail: "5859 Houston FDC",               action: "Location verified" },
  pickup:    { id: "PKU-20260505-01", detail: "Pickup — JOB-5001",             action: "Pickup confirmation created" },
  delivery:  { id: "DLV-20260505-03", detail: "Delivery — JOB-5003",           action: "Attached to POD" },
  transfer:  { id: "TRF-20260505-01", detail: "Fuel Transfer — TRK-4821",      action: "Transfer record created" },
  trailer:   { id: "CMP-C2-7733",     detail: "Compartment 2 — TRL-7733",      action: "Compartment verified" },
  unknown:   { id: "UNK-00119283",    detail: "Unknown code",                  action: "Manual classification required" },
};

export default function ScanPage() {
  const { addSyncItem, driver, jobs } = useDriver();
  const [selectedType, setSelectedType] = useState("tank");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState("");

  const activeJob = jobs.find(j => ["en_route","loading","bol_captured","approaching","arrived","site_verified","delivering","pod_required"].includes(j.status));
  const currentScanType = SCAN_TYPES.find(t => t.id === selectedType);

  const processScan = (code, type) => {
    const mockResult = MOCK_RESULTS[type] || MOCK_RESULTS.unknown;
    const scanned = {
      id: code || mockResult.id,
      detail: mockResult.detail,
      action: mockResult.action,
      type,
      label: SCAN_TYPES.find(t => t.id === type)?.label || "Scan",
      scannedAt: format(new Date(), "HH:mm"),
    };
    setResult(scanned);
    setHistory(prev => [scanned, ...prev.slice(0, 9)]);

    addSyncItem({
      type: SCAN_TYPES.find(t => t.id === type)?.syncType || "scan_unknown",
      label: scanned.label,
      jobId: activeJob?.id || "—",
      scannedCode: scanned.id,
      source: "device_scan",
      status: "pending",
    });
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      processScan(null, selectedType);
    }, 2000);
  };

  const handleManualEntry = () => {
    if (!manualCode.trim()) return;
    processScan(manualCode.trim(), selectedType);
    setManualCode("");
    setShowManualEntry(false);
  };

  return (
    <div className="bg-background min-h-screen pb-28">
      <PageHeader title="Universal Scan" subtitle="BOLs, tanks, assets, pickups, deliveries" />

      <div className="px-4 py-4 space-y-4">
        {/* Active job strip */}
        {activeJob && (
          <div className="bg-primary/10 border border-primary/25 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <Hash className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-primary">Active Job</p>
              <p className="text-xs text-muted-foreground truncate">{activeJob.customer?.name} · {activeJob.stopName}</p>
            </div>
            <span className="text-[10px] text-primary font-semibold">Scan will attach here</span>
          </div>
        )}

        {/* Scan type selector */}
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Scan Type</p>
          <div className="grid grid-cols-2 gap-2">
            {SCAN_TYPES.map(type => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl border text-left transition-all",
                    isSelected
                      ? "bg-card border-primary"
                      : "bg-card/40 border-border active:bg-secondary"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isSelected ? "text-primary" : type.color)} />
                  <span className={cn("text-xs font-semibold leading-tight", isSelected ? "text-foreground" : "text-muted-foreground")}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scanner viewport */}
        <div className="w-full aspect-square bg-secondary/60 rounded-3xl border-2 border-border flex items-center justify-center relative overflow-hidden max-w-xs mx-auto">
          {scanning ? (
            <>
              <div className="absolute inset-4 border-2 border-primary/30 rounded-2xl" />
              <div className="w-3/4 h-[2px] bg-primary rounded-full animate-bounce" style={{ boxShadow: "0 0 12px hsl(var(--primary))" }} />
              <div className="absolute top-4 left-4 w-8 h-8 border-t-[3px] border-l-[3px] border-primary rounded-tl-xl" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-[3px] border-r-[3px] border-primary rounded-tr-xl" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-[3px] border-l-[3px] border-primary rounded-bl-xl" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-[3px] border-r-[3px] border-primary rounded-br-xl" />
              <p className="absolute bottom-6 text-xs text-primary/60 font-medium">Scanning for {currentScanType?.label}…</p>
            </>
          ) : result ? (
            <div className="text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-success/15 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-success" />
              </div>
              <p className="font-bold text-success">Scan Successful</p>
              <p className="font-semibold text-sm mt-1">{result.id}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{result.detail}</p>
              <p className="text-[10px] text-primary mt-1">{result.action}</p>
            </div>
          ) : (
            <div className="text-center px-4">
              {currentScanType && React.createElement(currentScanType.icon, { className: `w-12 h-12 mx-auto mb-3 opacity-20 ${currentScanType.color}` })}
              <p className="text-sm text-muted-foreground">Ready to scan</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{currentScanType?.label}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {!scanning && !result && (
            <button onClick={handleScan} className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base flex items-center justify-center gap-2">
              <ScanLine className="w-5 h-5" /> Start Scanning
            </button>
          )}
          {scanning && (
            <button onClick={() => setScanning(false)} className="w-full h-14 bg-secondary text-foreground rounded-2xl font-bold text-base flex items-center justify-center gap-2">
              <X className="w-5 h-5" /> Cancel
            </button>
          )}
          {result && (
            <button onClick={() => setResult(null)} className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base flex items-center justify-center gap-2">
              <ScanLine className="w-5 h-5" /> Scan Another
            </button>
          )}
          <button
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="w-full h-11 bg-secondary text-muted-foreground rounded-xl font-semibold text-sm"
          >
            Manual Entry
          </button>
        </div>

        {/* Manual entry */}
        {showManualEntry && (
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Manual Code Entry</p>
            <input
              type="text"
              placeholder="Enter barcode or QR value..."
              value={manualCode}
              onChange={e => setManualCode(e.target.value)}
              className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 text-sm border border-border focus:border-primary outline-none"
            />
            <button
              onClick={handleManualEntry}
              className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-semibold text-sm"
            >
              Submit
            </button>
          </div>
        )}

        {/* Scan history */}
        {history.length > 0 && (
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Shift Scan History
            </p>
            <div className="space-y-2">
              {history.map((h, i) => {
                const t = SCAN_TYPES.find(s => s.id === h.type);
                const Icon = t?.icon || Tag;
                return (
                  <div key={i} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Icon className={cn("w-4 h-4", t?.color || "text-muted-foreground")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{h.id}</p>
                      <p className="text-xs text-muted-foreground truncate">{h.label} · {h.scannedAt}</p>
                    </div>
                    <span className="text-[10px] text-warning font-semibold shrink-0">Pending</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <DriverBottomNav />
    </div>
  );
}