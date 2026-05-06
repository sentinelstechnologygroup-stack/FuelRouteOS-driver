import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "@/lib/driverContext";
import HamburgerMenu from "@/components/driver/HamburgerMenu";
import { format } from "date-fns";

const TODAY = "May 5";

export default function OrderWell() {
  const navigate = useNavigate();
  const { jobs } = useDriver();
  const [menuOpen, setMenuOpen] = useState(false);

  const dateLabel = format(new Date(), "MMMM");
  const dayNum = format(new Date(), "d");
  const dayName = format(new Date(), "EEE").toUpperCase();

  return (
    <div className="bg-black min-h-screen font-inter">
      <div className="sticky top-0 z-30 bg-black border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-center">
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
        <h1 className="text-base font-bold text-white flex-1 text-center pr-10">Order Well</h1>
      </div>

      <div className="px-4 py-4">
        {/* Date header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="text-center">
            <p className="text-gray-400 text-[10px] uppercase">{dateLabel.slice(0, 3).toUpperCase()}</p>
            <p className="text-white text-2xl font-bold leading-none">{dayNum}</p>
            <p className="text-gray-400 text-[10px] uppercase">{dayName}</p>
          </div>
          <div className="flex-1" />
        </div>

        {/* Stop list */}
        <div className="divide-y divide-white/5">
          {jobs.map((job) => {
            const initials = job.stopName.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("");
            return (
              <button
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="w-full flex items-center gap-3 py-3.5 text-left active:bg-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{job.stopName}</p>
                  <p className="text-xs text-gray-400">Upcoming Date: May 5 - {job.plannedTime}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}