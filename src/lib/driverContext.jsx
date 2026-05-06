import React, { createContext, useContext, useState, useCallback } from "react";
import {
  driver, truck, trailer,
  route as initialRoute,
  jobs as initialJobs,
  syncItems as initialSyncItems,
  dispatchMessages as initialMessages,
} from "./mockData";
import { format } from "date-fns";

const DriverContext = createContext(null);

const INITIAL_SIGNAL = "online";

export function DriverProvider({ children }) {
  const [shiftStarted, setShiftStarted]   = useState(false);
  const [shiftTime, setShiftTime]         = useState(null);
  const [currentRoute, setCurrentRoute]   = useState(initialRoute);
  const [jobs, setJobs]                   = useState(initialJobs);
  const [syncs, setSyncs]                 = useState(initialSyncItems);
  const [signal, setSignal]               = useState(INITIAL_SIGNAL);
  const [lastSyncTime, setLastSyncTime]   = useState(new Date());
  const [messages, setMessages]           = useState(initialMessages);

  const isOnline = signal !== "offline";
  const setIsOnline = (val) => setSignal(val ? "online" : "offline");

  const startShift = () => {
    setShiftStarted(true);
    setShiftTime(new Date());
  };

  const updateJobStatus = (jobId, newStatus) =>
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));

  const updateJob = (jobId, data) =>
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...data } : j));

  const getActiveJob      = () => jobs.find(j => ["en_route","arrived","loading","delivering"].includes(j.status));
  const getNextPendingJob = () => jobs.find(j => j.status === "pending");
  const completedCount    = jobs.filter(j => j.status === "completed").length;

  const addSyncItem = useCallback((item) => {
    const effectiveStatus = signal === "offline" ? "pending" : (item.status || "pending");
    setSyncs(prev => [...prev, {
      id: `SYN-${Date.now()}`,
      savedAt: format(new Date(), "HH:mm"),
      ...item,
      status: effectiveStatus,
    }]);
  }, [signal]);

  const retrySyncItem = useCallback((id) => {
    setSyncs(prev => prev.map(s =>
      s.id === id ? { ...s, status: "synced", error: null, syncedAt: format(new Date(), "HH:mm") } : s
    ));
    setLastSyncTime(new Date());
  }, []);

  const retryAllFailed = useCallback(() => {
    setSyncs(prev => prev.map(s =>
      (s.status === "failed" || s.status === "pending")
        ? { ...s, status: "synced", error: null, syncedAt: format(new Date(), "HH:mm") }
        : s
    ));
    setLastSyncTime(new Date());
  }, []);

  const pendingSyncCount = syncs.filter(s => s.status === "pending").length;
  const failedSyncCount  = syncs.filter(s => s.status === "failed").length;
  const totalUnsynced    = pendingSyncCount + failedSyncCount;

  // Chat
  const unreadCount = messages.filter(m => m.role === "dispatch" && !m.read).length;

  const sendMessage = useCallback((text, jobId = null, meta = {}) => {
    // meta: { urgent, deliveryStatus, threadId, driverId, companyId, senderRole, timestamp }
    const urgent = typeof meta === "object" ? (meta.urgent || false) : meta;
    const deliveryStatus = (typeof meta === "object" && meta.deliveryStatus) || "sent";
    const msg = {
      id: `MSG-${Date.now()}`,
      role: "driver",
      senderRole: "driver",
      senderName: "You",
      text,
      timestamp: format(new Date(), "HH:mm"),
      read: true,
      jobId,
      urgent,
      deliveryStatus,
      threadId: (typeof meta === "object" && meta.threadId) || null,
      driverId: (typeof meta === "object" && meta.driverId) || null,
      companyId: (typeof meta === "object" && meta.companyId) || null,
    };
    setMessages(prev => [...prev, msg]);
  }, []);

  const markAllRead = useCallback(() => {
    setMessages(prev => prev.map(m => ({ ...m, read: true })));
  }, []);

  return (
    <DriverContext.Provider
      value={{
        driver, truck, trailer,
        shiftStarted, shiftTime, startShift,
        currentRoute,
        jobs, updateJobStatus, updateJob,
        getActiveJob, getNextPendingJob, completedCount,
        syncs, addSyncItem, retrySyncItem, retryAllFailed,
        signal, setSignal,
        isOnline, setIsOnline,
        lastSyncTime, setLastSyncTime,
        pendingSyncCount, failedSyncCount, totalUnsynced,
        messages, sendMessage, markAllRead, unreadCount,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}

export function useDriver() {
  const ctx = useContext(DriverContext);
  if (!ctx) throw new Error("useDriver must be used within DriverProvider");
  return ctx;
}