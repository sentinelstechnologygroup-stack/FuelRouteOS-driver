import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import HamburgerMenu from "@/components/driver/HamburgerMenu";

export default function RecordTransfer() {
  const navigate = useNavigate();
  const { shiftStarted } = useDriver();
  const [menuOpen, setMenuOpen] = useState(false);
  const [started, setStarted] = useState(false);

  return (
    <div className="bg-black min-h-screen font-inter flex flex-col">
      <div className="sticky top-0 z-30 bg-black px-4 py-3 flex items-center gap-3">
        <button onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-center">
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
      </div>

      {!shiftStarted && (
        <div className="bg-amber-500 px-4 py-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-black shrink-0" />
          <div>
            <p className="text-black text-xs font-bold">Screen inaccessible</p>
            <p className="text-black/80 text-xs">You need an active shift to access this page.</p>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
        {!started ? (
          <>
            <p className="text-gray-400 text-base text-center">Press the button to start the record transfer</p>
            <button
              onClick={() => shiftStarted && setStarted(true)}
              className="w-full max-w-xs bg-[#1a3d1a] text-gray-400 font-semibold py-4 rounded-full text-sm"
            >
              Record Transfer
            </button>
          </>
        ) : (
          <div className="w-full max-w-sm space-y-4">
            <h2 className="text-white text-lg font-bold text-center">Record Fuel Transfer</h2>
            <div className="bg-[#1a1a1a] rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">From</p>
                <input className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm outline-none" placeholder="Source" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">To</p>
                <input className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm outline-none" placeholder="Destination" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Gallons</p>
                <input type="number" className="w-full bg-[#2a2a2a] text-white rounded-lg px-3 py-2 text-sm outline-none" placeholder="0" />
              </div>
              <button className="w-full bg-green-700 text-white font-semibold py-3 rounded-full text-sm mt-2">
                Submit Transfer
              </button>
            </div>
          </div>
        )}
      </div>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}