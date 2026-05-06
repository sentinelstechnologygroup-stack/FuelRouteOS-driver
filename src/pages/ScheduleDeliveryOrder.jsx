import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, MinusCircle, AlertCircle } from "lucide-react";
import { customers } from "@/lib/mockData";
import { cn } from "@/lib/utils";

function CustomerAvatar({ name, blocked }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
  return (
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white relative",
      blocked ? "bg-gray-600" : "bg-gray-500"
    )}>
      {initials}
      {blocked && (
        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50">
          <div className="w-7 h-0.5 bg-red-500 rotate-45 absolute" />
          <div className="w-7 h-7 rounded-full border-2 border-red-500" />
        </div>
      )}
    </div>
  );
}

export default function ScheduleDeliveryOrder() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [creditWarning, setCreditWarning] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (customer) => {
    if (!customer.creditChecked) {
      setCreditWarning(customer.name);
      return;
    }
    setSelectedCustomer(customer);
    navigate(`/schedule-order/delivery/new?customerId=${customer.id}&mode=delivery`);
  };

  return (
    <div className="bg-black min-h-screen font-inter">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-base font-bold text-white flex-1 text-center pr-9">Schedule Delivery Order</h1>
      </div>

      {/* Credit warning */}
      {creditWarning && (
        <div className="bg-red-600 px-4 py-3 flex items-center gap-2 mx-3 rounded-xl mb-2">
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <p className="text-white text-xs font-semibold">This customer has not been credit checked yet.</p>
          <button onClick={() => setCreditWarning(null)} className="ml-auto text-white/70 text-xs">✕</button>
        </div>
      )}

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="bg-[#2a2a2a] rounded-full flex items-center gap-2 px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
            placeholder="Search for Customer"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Customer list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <MinusCircle className="w-10 h-10 text-gray-600" />
          <p className="text-gray-500 text-sm">Your list is currently empty</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-white/5"
            >
              <CustomerAvatar name={c.name} blocked={!c.creditChecked} />
              <p className="text-sm text-gray-200">{c.name} {c.erpId ? `- ${c.erpId}` : ""}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}