import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Save, Send, Info } from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import { format } from "date-fns";
import DriverBottomNav from "@/components/driver/DriverBottomNav";

export default function NewOrderForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addSyncItem, driver } = useDriver();

  // Determine order type from URL
  const pathParts = window.location.pathname.split("/");
  const orderType = pathParts.includes("delivery") ? "delivery"
    : pathParts.includes("load") ? "load"
    : pathParts.includes("extraction") ? "extraction"
    : "delivery";

  const customerId = searchParams.get("customerId");
  const terminalId = searchParams.get("terminalId");

  const [form, setForm] = useState({
    product: "",
    quantity: "",
    plannedDate: format(new Date(), "yyyy-MM-dd"),
    plannedTime: "08:00",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const orderTypeLabel = orderType === "delivery" ? "Delivery Order"
    : orderType === "load" ? "Load Order"
    : "Extraction Order";

  const syncType = orderType === "delivery" ? "order_draft_delivery"
    : orderType === "load" ? "order_draft_load"
    : "order_draft_extraction";

  const handleSaveDraft = () => {
    addSyncItem({
      type: syncType,
      label: `${orderTypeLabel} Draft`,
      jobId: customerId || terminalId || "NEW",
      driverId: driver.id,
      status: "pending",
      source: "device_capture",
      ...form,
    });
    setSaved(true);
  };

  const handleSubmit = () => {
    addSyncItem({
      type: syncType.replace("draft", "submit"),
      label: `${orderTypeLabel} Submitted`,
      jobId: customerId || terminalId || "NEW",
      driverId: driver.id,
      status: "pending",
      source: "device_capture",
      ...form,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-16 h-16 rounded-full bg-teal-700/20 flex items-center justify-center mb-4">
          <Send className="w-8 h-8 text-teal-400" />
        </div>
        <h2 className="text-white font-bold text-lg mb-2">Order Submitted</h2>
        <p className="text-gray-400 text-sm text-center mb-6">Your order has been queued for sync with dispatch.</p>
        <div className="bg-amber-900/30 border border-amber-600/30 rounded-xl p-4 mb-6 w-full max-w-sm">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-300 text-xs">Prototype placeholder — production action pending</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/today-shift")}
          className="w-full max-w-sm bg-teal-700 text-white font-semibold py-4 rounded-xl text-sm"
        >
          Back to Today's Shift
        </button>
        <DriverBottomNav />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black border-b border-white/10 px-4 py-3 flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-base font-bold text-white flex-1">New {orderTypeLabel}</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Prototype notice */}
        <div className="bg-amber-900/30 border border-amber-600/30 rounded-xl p-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-amber-300 text-xs">Prototype placeholder — production action pending</p>
        </div>

        {/* Context */}
        {(customerId || terminalId) && (
          <div className="bg-[#1a1a1a] rounded-xl p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              {customerId ? "Customer ID" : "Terminal ID"}
            </p>
            <p className="text-white font-semibold text-sm">{customerId || terminalId}</p>
          </div>
        )}

        {/* Product */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Product</label>
            <input
              type="text"
              placeholder="e.g. 100*DIESEL-OFFROAD RED"
              value={form.product}
              onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
              className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2.5 text-sm border border-white/10 focus:border-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Quantity (Gallons)</label>
            <input
              type="number"
              placeholder="0"
              value={form.quantity}
              onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
              className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2.5 text-sm border border-white/10 focus:border-teal-500 outline-none"
            />
          </div>
        </div>

        {/* Date/Time */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Planned Date</label>
            <input
              type="date"
              value={form.plannedDate}
              onChange={e => setForm(f => ({ ...f, plannedDate: e.target.value }))}
              className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2.5 text-sm border border-white/10 focus:border-teal-500 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Planned Time</label>
            <input
              type="time"
              value={form.plannedTime}
              onChange={e => setForm(f => ({ ...f, plannedTime: e.target.value }))}
              className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2.5 text-sm border border-white/10 focus:border-teal-500 outline-none"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-[#1a1a1a] rounded-xl p-4">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">Notes</label>
          <textarea
            rows={3}
            placeholder="Optional delivery notes..."
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2.5 text-sm border border-white/10 focus:border-teal-500 outline-none resize-none"
          />
        </div>

        {saved && (
          <div className="bg-teal-900/30 border border-teal-600/30 rounded-xl p-3 text-teal-300 text-sm font-semibold text-center">
            Draft saved to device — will sync when online
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSubmit}
            className="w-full bg-teal-700 text-white font-semibold py-4 rounded-xl text-sm flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit Order
          </button>
          <button
            onClick={handleSaveDraft}
            className="w-full bg-[#1a1a1a] text-gray-300 font-semibold py-3.5 rounded-xl text-sm border border-white/10 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full text-gray-500 font-semibold py-3 text-sm"
          >
            Back
          </button>
        </div>
      </div>
      <DriverBottomNav />
    </div>
  );
}