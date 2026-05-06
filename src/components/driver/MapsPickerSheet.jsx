import React from "react";
import { Map, X } from "lucide-react";
import { MAPS_APPS } from "@/lib/appContext";

const OPTIONS = [
  { app: MAPS_APPS.GOOGLE, label: "Google Maps" },
  { app: MAPS_APPS.APPLE,  label: "Apple Maps" },
  { app: MAPS_APPS.WAZE,   label: "Waze" },
];

export default function MapsPickerSheet({ address, onPick, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="Choose maps app">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 bg-card rounded-t-3xl border-t border-border p-5 pb-10 space-y-3 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold text-foreground">Open in Maps</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center" aria-label="Cancel">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        {address && (
          <p className="text-xs text-muted-foreground leading-relaxed">{address}</p>
        )}
        <div className="space-y-2 pt-1">
          {OPTIONS.map(({ app, label }) => (
            <button
              key={app}
              onClick={() => onPick(app)}
              className="w-full flex items-center gap-3 h-12 px-4 bg-secondary border border-border rounded-xl text-sm font-semibold text-foreground active:bg-secondary/70 transition-colors"
            >
              <Map className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}