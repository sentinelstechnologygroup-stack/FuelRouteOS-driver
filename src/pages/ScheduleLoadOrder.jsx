import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import { terminals } from "@/lib/mockData";

function TerminalAvatar({ name }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
  return (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center shrink-0 text-sm font-bold text-white">
      {initials}
    </div>
  );
}

export default function ScheduleLoadOrder() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showMore, setShowMore] = useState(false);

  const filtered = terminals.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayed = showMore ? filtered : filtered.slice(0, 10);

  const handleSelect = (t) => {
    navigate(`/schedule-order/load/new?terminalId=${t.id}&mode=load`);
  };

  return (
    <div className="bg-black min-h-screen font-inter">
      <div className="sticky top-0 z-30 bg-black px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-base font-bold text-white flex-1 text-center pr-9">Schedule Load Order</h1>
      </div>

      <div className="px-4 pb-3">
        <div className="bg-[#2a2a2a] rounded-full flex items-center gap-2 px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
            placeholder="Search for Terminal"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {displayed.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t)}
            className="w-full flex items-start gap-3 px-4 py-3.5 text-left active:bg-white/5"
          >
            <TerminalAvatar name={t.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 font-medium leading-snug">{t.name}{t.erpId ? ` - ${t.erpId}` : ""}</p>
              {t.erpId && <p className="text-[11px] text-gray-500 mt-0.5">ERPID: {t.erpId}</p>}
              <p className="text-[11px] text-gray-500">Suppliers:</p>
              <p className="text-[11px] text-gray-500 truncate">{t.suppliers}</p>
            </div>
          </button>
        ))}
      </div>

      {!showMore && filtered.length > 10 && (
        <button
          onClick={() => setShowMore(true)}
          className="w-full py-4 text-sm text-gray-400 flex items-center justify-center gap-2"
        >
          ↓ Load More
        </button>
      )}
    </div>
  );
}