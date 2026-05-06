import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import HamburgerMenu from "@/components/driver/HamburgerMenu";

const ORDER_TYPES = [
  { label: "Delivery Order", path: "/record-order/delivery" },
  { label: "Load Order", path: "/record-order/load" },
  { label: "Extraction Order", path: "/record-order/extraction" },
];

export default function RecordOrder() {
  const navigate = useNavigate();
  const { shiftStarted } = useDriver();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-black min-h-screen font-inter">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-10 h-10 flex items-center justify-center"
        >
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
        <h1 className="text-base font-bold text-white flex-1 text-center pr-10">Record Order</h1>
      </div>

      {/* Shift required banner */}
      {!shiftStarted && (
        <div className="bg-amber-500 px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-black shrink-0" />
          <div>
            <p className="text-black text-xs font-bold">Screen inaccessible</p>
            <p className="text-black/80 text-xs">You need an active shift to access this page.</p>
          </div>
        </div>
      )}

      {/* Order type list */}
      <div className="divide-y divide-white/10">
        {ORDER_TYPES.map((type) => (
          <button
            key={type.path}
            onClick={() => navigate(type.path)}
            className="w-full flex items-center justify-between px-5 py-5 text-left active:bg-white/5"
          >
            <span className="text-gray-300 text-sm">{type.label}</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        ))}
      </div>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}