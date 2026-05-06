import React, { useState, useRef, useEffect } from "react";
import {
  Send, Phone, Paperclip, MapPin, AlertTriangle,
  Wifi, WifiOff, CheckCheck, Check, Clock, MessageCircle,
  ChevronDown
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const QUICK_REPLIES = [
  "Arrived at site",
  "Running delayed",
  "Need assistance",
  "Loading now",
  "Delivery complete",
  "Customer unavailable",
  "Wrong tank / site",
  "Mechanical issue",
  "En route to next stop",
  "Request route change",
];

const DELIVERY_STATUS_ICONS = {
  queued:    { icon: Clock,      label: "Queued",    color: "text-muted-foreground" },
  sent:      { icon: Check,      label: "Sent",      color: "text-muted-foreground" },
  delivered: { icon: CheckCheck, label: "Delivered", color: "text-muted-foreground" },
  read:      { icon: CheckCheck, label: "Read",      color: "text-primary" },
  failed:    { icon: AlertTriangle, label: "Failed", color: "text-destructive" },
};

function DeliveryIndicator({ status }) {
  const cfg = DELIVERY_STATUS_ICONS[status] || DELIVERY_STATUS_ICONS.sent;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-0.5", cfg.color)} title={cfg.label}>
      <Icon className="w-3 h-3" aria-label={cfg.label} />
    </span>
  );
}

function MessageBubble({ msg }) {
  const isDriver = msg.role === "driver";
  const isUrgent = msg.urgent;
  const deliveryStatus = msg.deliveryStatus || (isDriver ? "delivered" : undefined);

  return (
    <div className={cn("flex flex-col gap-1", isDriver ? "items-end" : "items-start")}>
      {isUrgent && (
        <div className="flex items-center gap-1.5 text-[10px] text-destructive font-black px-1" role="alert">
          <AlertTriangle className="w-3 h-3" aria-hidden="true" />
          URGENT
        </div>
      )}

      <div className={cn(
        "max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
        isDriver
          ? "bg-primary text-primary-foreground rounded-br-sm"
          : isUrgent
          ? "bg-destructive/15 border border-destructive/30 text-foreground rounded-bl-sm"
          : "bg-card border border-border text-foreground rounded-bl-sm"
      )}>
        {!isDriver && (
          <p className="text-[10px] font-bold mb-1 opacity-60">{msg.senderName || "Dispatch"}</p>
        )}
        {msg.text}
      </div>

      <div className={cn(
        "flex items-center gap-1.5 text-[10px] text-muted-foreground px-1",
        isDriver && "flex-row-reverse"
      )}>
        <Clock className="w-3 h-3" aria-hidden="true" />
        <span>{msg.timestamp}</span>
        {isDriver && deliveryStatus && <DeliveryIndicator status={deliveryStatus} />}
        {msg.jobId && (
          <>
            <span aria-hidden="true">·</span>
            <span className="font-semibold bg-secondary px-1.5 py-0.5 rounded text-[9px]">
              Job {msg.jobId}
            </span>
          </>
        )}
        {deliveryStatus === "queued" && (
          <span className="text-[9px] font-semibold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
            Queued offline
          </span>
        )}
      </div>
    </div>
  );
}

export default function DispatchChat() {
  const { messages, sendMessage, markAllRead, signal, jobs, driver } = useDriver();
  const [input, setInput] = useState("");
  const [showQuick, setShowQuick] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const bottomRef = useRef(null);

  const activeJob = jobs.find(j =>
    ["en_route", "arrived", "loading", "delivering", "approaching", "bol_captured"].includes(j.status)
  );

  useEffect(() => { markAllRead(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = (text) => {
    const msg = (text || input).trim();
    if (!msg) return;

    const deliveryStatus = signal === "offline" ? "queued" : "sent";

    sendMessage(msg, activeJob?.id || null, {
      urgent: isUrgent,
      deliveryStatus,
      threadId: `thread-${driver?.id || "drv"}-${Date.now()}`,
      driverId: driver?.id || "drv-001",
      companyId: "sentinels-fleetops",
      senderRole: "driver",
      timestamp: format(new Date(), "HH:mm"),
    });

    setInput("");
    setShowQuick(false);
    setIsUrgent(false);
  };

  const handleAttachPlaceholder = () => {
    // Prototype placeholder
    alert("Photo attachment — available in production build.");
  };

  const handleLocationPlaceholder = () => {
    alert("Send location — available in production build.");
  };

  return (
    <div className="bg-background flex flex-col h-screen">
      <PageHeader
        title="Dispatch Chat"
        subtitle="Sentinels FleetOps — Dispatch Desk"
        rightAction={
          <a
            href="tel:5125550100"
            className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-success/15 border border-success/30"
            aria-label="Call dispatch at 5125550100"
          >
            <Phone className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-semibold text-success">Call</span>
          </a>
        }
      />

      {/* Connection banner */}
      {signal !== "online" && (
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-xs font-semibold",
            signal === "offline" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning-foreground"
          )}
          role="alert"
        >
          <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {signal === "offline"
            ? "Offline — messages will queue and send when connection is restored"
            : "Weak signal — messages may be delayed"}
        </div>
      )}

      {/* Active job + sync note */}
      <div className="px-4 py-2 border-b border-border bg-card/50 space-y-1">
        {activeJob && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MessageCircle className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span>Active job:</span>
            <span className="font-bold text-foreground">
              Stop #{activeJob.stopNumber} — {activeJob.customer?.name}
            </span>
          </div>
        )}
        <p className="text-[10px] text-muted-foreground">Messages sync with Dispatch when connected.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-2">
        <p className="text-center text-[10px] text-muted-foreground/50 py-2">
          Today · FuelRouteOS Shift Communications
        </p>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {showQuick && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 border-t border-border pt-2 bg-background">
          {QUICK_REPLIES.map((r) => (
            <button
              key={r}
              onClick={() => handleSend(r)}
              className="text-xs bg-secondary text-foreground px-3 py-1.5 rounded-full font-medium active:bg-secondary/70"
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Urgent toggle banner */}
      {isUrgent && (
        <div className="mx-4 mb-1 bg-destructive/10 border border-destructive/30 rounded-xl px-3 py-1.5 flex items-center gap-2" role="status">
          <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />
          <span className="text-xs font-bold text-destructive flex-1">Urgent message — dispatcher will be notified immediately</span>
          <button onClick={() => setIsUrgent(false)} className="text-xs text-muted-foreground">
            Cancel
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-border bg-card/80 backdrop-blur-xl flex items-end gap-2 pb-safe">
        {/* Quick replies toggle */}
        <button
          onClick={() => setShowQuick(v => !v)}
          aria-label="Toggle quick replies"
          aria-expanded={showQuick}
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
            showQuick ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
          )}
        >
          <ChevronDown className={cn("w-5 h-5 transition-transform", showQuick && "rotate-180")} />
        </button>

        {/* Attach */}
        <button
          onClick={handleAttachPlaceholder}
          aria-label="Attach photo"
          className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0 text-muted-foreground active:bg-secondary/70"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Location */}
        <button
          onClick={handleLocationPlaceholder}
          aria-label="Send location"
          className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0 text-muted-foreground active:bg-secondary/70"
        >
          <MapPin className="w-4 h-4" />
        </button>

        {/* Input */}
        <div className="flex-1 bg-secondary rounded-2xl flex items-center px-3 min-h-[40px]">
          <input
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground py-2"
            placeholder={isUrgent ? "Type urgent message…" : "Message dispatch…"}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            aria-label="Message input"
          />
          {/* Urgent toggle */}
          <button
            onClick={() => setIsUrgent(v => !v)}
            aria-label={isUrgent ? "Cancel urgent" : "Mark as urgent"}
            className={cn(
              "ml-1 p-1 rounded-lg transition-colors",
              isUrgent ? "text-destructive" : "text-muted-foreground/50"
            )}
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
          {signal === "offline" && (
            <WifiOff className="w-4 h-4 text-muted-foreground shrink-0 ml-1" aria-hidden="true" />
          )}
        </div>

        {/* Send */}
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          aria-label="Send message"
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
            input.trim()
              ? "bg-primary text-primary-foreground active:scale-95"
              : "bg-secondary text-muted-foreground opacity-50"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}