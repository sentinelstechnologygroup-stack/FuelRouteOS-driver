import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import ConnectionBar from "./ConnectionBar";
import { useDriver } from "@/lib/driverContext";

export default function DriverLayout() {
  const { signal, totalUnsynced } = useDriver();

  // Add top padding when the connection bar is visible
  const hasBar = signal !== "online" || totalUnsynced > 0;

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <ConnectionBar />
      <div className={`pb-20 ${hasBar ? "pt-7" : ""}`}>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}