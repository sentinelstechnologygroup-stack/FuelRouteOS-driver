import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, X, AlertCircle } from "lucide-react";
import { customers } from "@/lib/mockData";
import { cn } from "@/lib/utils";

function CustomerAvatar({ name, blocked }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
  return (
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white relative",
      "bg-gray-500"
    )}>
      {initials}
      {blocked && (
        <div className="absolute inset-0 rounded-full flex items-center justify-center">
          <div className="w-7 h-0.5 bg-red-500 rotate-45 absolute" />
          <div className="w-7 h-7 rounded-full border-2 border-red-500" />
        </div>
      )}
    </div>
  );
}

const TIME_OPTIONS = ["06:00 am", "06:30 am", "07:00 am", "07:30 am", "08:00 am", "08:30 am", "09:00 am", "09:30 am", "10:00 am", "10:30 am", "11:00 am", "12:00 pm", "01:00 pm", "02:00 pm", "03:00 pm", "04:00 pm", "04:59 pm", "05:00 pm"];

export default function ScheduleExtractionOrder() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("May,04 2026");
  const [time, setTime] = useState("04:59 pm");
  const [site, setSite] = useState("-");
  const [creditWarning, setCreditWarning] = useState(null);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (customer) => {
    if (!customer.creditChecked) {
      setCreditWarning(customer.name);
      return;
    }
    setSelectedCustomer(customer);
    setShowModal(true);
    setCreditWarning(null);
  };

  return (
    <div className="bg-black min-h-screen font-inter relative">
      <div className="sticky top-0 z-30 bg-[#111] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center opacity-40">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-base font-semibold text-gray-400 flex-1 text-center pr-9">Schedule Extraction Order</h1>
      </div>

      {creditWarning && (
        <div className="bg-red-600 px-4 py-3 flex items-center gap-2 mx-3 rounded-xl mb-2 mt-2">
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <p className="text-white text-xs font-semibold">This customer has not been credit checked yet.</p>
          <button onClick={() => setCreditWarning(null)} className="ml-auto text-white/70 text-xs">✕</button>
        </div>
      )}

      <div className="px-4 pb-3">
        <div className="bg-[#2a2a2a] rounded-full flex items-center gap-2 px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm text-gray-400 placeholder:text-gray-500 outline-none"
            placeholder="Search for Customer"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={cn("divide-y divide-white/5", showModal && "opacity-30 pointer-events-none")}>
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelect(c)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-white/5"
          >
            <CustomerAvatar name={c.name} blocked={!c.creditChecked} />
            <p className="text-sm text-gray-400">{c.name} {c.erpId ? `- ${c.erpId}` : ""}</p>
          </button>
        ))}
      </div>

      {/* Extraction modal */}
      {showModal && (
        <div className="absolute inset-x-0 top-40 z-50 px-4">
          <div className="bg-[#f0f0f0] rounded-2xl p-4 shadow-2xl">
            <div className="flex justify-end mb-3">
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-amber-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Day Of Extraction</p>
                <select
                  className="w-full bg-[#e0e0e0] text-black rounded-lg px-3 py-2 text-sm border-none outline-none"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                >
                  <option>May,04 2026</option>
                  <option>May,05 2026</option>
                  <option>May,06 2026</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Time Of Extraction</p>
                <select
                  className="w-full bg-[#e0e0e0] text-black rounded-lg px-3 py-2 text-sm border-none outline-none"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                >
                  {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Customer Site</p>
              <select
                className="w-full bg-[#e0e0e0] text-black rounded-lg px-3 py-2 text-sm border-none outline-none"
                value={site}
                onChange={e => setSite(e.target.value)}
              >
                <option>-</option>
                <option>Site A</option>
                <option>Site B</option>
              </select>
            </div>
            <button
              className="w-full bg-green-700 text-white font-semibold py-3 rounded-full text-sm"
              onClick={() => setShowModal(false)}
            >
              Create Extraction Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}