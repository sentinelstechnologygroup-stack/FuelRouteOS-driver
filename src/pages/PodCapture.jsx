import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PenTool, Camera, Check, Trash2, Phone, Info,
  AlertTriangle, CheckCircle2, User, Droplets, Clock
} from "lucide-react";
import { useDriver } from "@/lib/driverContext";
import PageHeader from "@/components/driver/PageHeader";
import ActionButton from "@/components/driver/ActionButton";
import SyncBadge from "@/components/driver/SyncBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PHOTO_CHECKLIST = [
  { id: "meter", label: "Meter reading (end)" },
  { id: "tank", label: "Tank fill port / hatch" },
  { id: "spill", label: "No spill confirmation" },
];

export default function PodCapture() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob, updateJobStatus, addSyncItem, signal } = useDriver();
  const job = jobs.find(j => j.id === jobId);

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [receiverName, setReceiverName] = useState("");
  const [notes, setNotes] = useState("");
  const [photoCount, setPhotoCount] = useState(0);
  const [photoChecklist, setPhotoChecklist] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSigned(true);
  };

  const endDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  if (!job) return null;

  const deliveredGallons = job.deliveredGallons || job.requestedGallons;
  const missingSignature = !hasSigned;
  const missingName = !receiverName.trim();
  const missingPhotos = photoCount === 0;
  const canSubmit = hasSigned && receiverName.trim();

  const togglePhotoCheck = (id) =>
    setPhotoChecklist(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!canSubmit) return;
    updateJob(job.id, {
      pod: {
        signature: true,
        receiverName: receiverName.trim(),
        photos: photoCount,
        timestamp: format(new Date(), "HH:mm"),
      },
    });
    updateJobStatus(job.id, "completed");
    addSyncItem({
      jobId: job.id,
      type: "delivery_record",
      label: "Delivery Record",
      status: "pending",
      timestamp: format(new Date(), "HH:mm"),
    });
    addSyncItem({
      jobId: job.id,
      type: "pod_signature",
      label: "POD Signature",
      status: "pending",
      timestamp: format(new Date(), "HH:mm"),
    });
    if (photoCount > 0) {
      addSyncItem({
        jobId: job.id,
        type: "delivery_confirmation_image",
        label: "Delivery Confirmation Images",
        status: "pending",
        timestamp: format(new Date(), "HH:mm"),
        size: `${(photoCount * 1.4).toFixed(1)} MB`,
      });
    }
    navigate(`/job/${job.id}/complete`);
  };

  return (
    <div className="bg-background min-h-screen pb-8">
      <PageHeader
        title="Proof of Delivery"
        subtitle={`Stop #${job.stopNumber} — ${job.customer.name}`}
        backTo={`/job/${job.id}/deliver`}
        rightAction={
          <a href="tel:5125550100" className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-success/15 border border-success/30">
            <Phone className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-semibold text-success">Dispatch</span>
          </a>
        }
      />

      <div className="px-4 py-4 space-y-4">

        {/* Instruction */}
        <div className="bg-info/5 border border-info/20 rounded-xl p-3 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-info shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Signature and receiver name are required. Photos are strongly recommended before submitting.
          </p>
        </div>

        {/* Delivery Summary */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">Delivery Summary</p>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div>
              <p className="text-[10px] text-muted-foreground">Customer</p>
              <p className="font-bold text-sm leading-tight">{job.customer.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Product</p>
              <p className="font-bold text-sm leading-tight">{job.product}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Droplets className="w-3 h-3" /> Delivered
              </p>
              <p className="font-black text-2xl text-primary leading-none">
                {deliveredGallons?.toLocaleString()}
                <span className="text-xs font-normal text-muted-foreground ml-1">gal</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Completed
              </p>
              <p className="font-bold text-sm">{format(new Date(), "MMM d, h:mm a")}</p>
            </div>
          </div>
        </div>

        {/* Receiver Name */}
        <div className={cn(
          "bg-card border rounded-2xl p-4",
          submitAttempted && missingName ? "border-destructive/50" : "border-border"
        )}>
          <label className="text-xs font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Receiver Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={receiverName}
            onChange={e => setReceiverName(e.target.value)}
            placeholder="Full name of person accepting delivery"
            className={cn(
              "h-12 bg-secondary border-border rounded-xl font-semibold",
              submitAttempted && missingName && "border-destructive"
            )}
          />
          {submitAttempted && missingName && (
            <p className="text-xs text-destructive mt-1.5">Receiver name is required.</p>
          )}
        </div>

        {/* Signature Pad */}
        <div className={cn(
          "bg-card border rounded-2xl p-4",
          submitAttempted && missingSignature ? "border-destructive/50" : "border-border"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-info" />
              <p className="text-sm font-bold">
                Receiver Signature <span className="text-destructive">*</span>
              </p>
            </div>
            {hasSigned && (
              <button
                onClick={clearSignature}
                className="flex items-center gap-1 text-xs text-muted-foreground px-2.5 py-1.5 rounded-lg bg-secondary active:opacity-70"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              className={cn(
                "w-full h-40 bg-secondary rounded-xl border signature-canvas cursor-crosshair",
                hasSigned ? "border-success/30" : "border-border"
              )}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
            {!hasSigned && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center gap-2">
                <PenTool className="w-6 h-6 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground/50">Sign here with finger or stylus</p>
              </div>
            )}
            {hasSigned && (
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-success/15 px-2 py-0.5 rounded-lg">
                <CheckCircle2 className="w-3 h-3 text-success" />
                <span className="text-[10px] text-success font-semibold">Signed</span>
              </div>
            )}
          </div>
          {submitAttempted && missingSignature && (
            <p className="text-xs text-destructive mt-2">Signature is required.</p>
          )}
        </div>

        {/* Photo Checklist */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-bold">Delivery Photos</p>
            </div>
            <span className={cn(
              "text-xs font-semibold",
              missingPhotos ? "text-warning" : "text-success"
            )}>
              {photoCount > 0 ? `${photoCount} attached` : "Recommended"}
            </span>
          </div>

          {/* Checklist */}
          <div className="divide-y divide-border">
            {PHOTO_CHECKLIST.map(item => (
              <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                    photoChecklist[item.id] ? "bg-success border-success" : "border-border"
                  )}>
                    {photoChecklist[item.id] && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <p className={cn(
                    "text-sm",
                    photoChecklist[item.id] ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {item.label}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPhotoCount(p => p + 1);
                    togglePhotoCheck(item.id);
                  }}
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors",
                    photoChecklist[item.id]
                      ? "bg-success/15 text-success"
                      : "bg-secondary text-muted-foreground active:bg-primary/10 active:text-primary"
                  )}
                >
                  {photoChecklist[item.id] ? "✓ Done" : "Add"}
                </button>
              </div>
            ))}
          </div>

          <div className="px-4 pb-4 pt-2">
            <button
              onClick={() => setPhotoCount(p => p + 1)}
              className="w-full h-11 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground active:bg-secondary/50"
            >
              <Camera className="w-4 h-4" /> Add Additional Photo
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Notes (optional)</label>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Customer comments, access issues, any issues with delivery..."
            className="bg-secondary border-border rounded-xl resize-none h-20"
          />
        </div>

        {/* Warnings */}
        {submitAttempted && !canSubmit && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-destructive mb-0.5">Cannot submit — missing required items:</p>
              {missingName && <p className="text-xs text-destructive">• Receiver name is blank</p>}
              {missingSignature && <p className="text-xs text-destructive">• Signature not captured</p>}
            </div>
          </div>
        )}

        {missingPhotos && !submitAttempted && (
          <div className="bg-warning/5 border border-warning/20 rounded-xl p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
            <p className="text-xs text-muted-foreground">
              No photos attached. Photos are strongly recommended before submitting.
            </p>
          </div>
        )}

        {/* Offline save notice */}
        <div className="flex items-center justify-between bg-muted/30 border border-border rounded-xl px-3 py-2.5">
          <p className="text-xs text-muted-foreground">
            {signal === "offline"
              ? "POD saved offline — will sync on reconnect. You can continue."
              : "POD data saved — syncs automatically"}
          </p>
          <SyncBadge
            status={signal === "offline" ? "offline" : "pending"}
            label={signal === "offline" ? "Saved offline" : "Will sync"}
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <ActionButton onClick={handleSubmit} variant="success" icon={Check}>
            Submit POD & Complete Delivery
          </ActionButton>
        </div>
      </div>
    </div>
  );
}