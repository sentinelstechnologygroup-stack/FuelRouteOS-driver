import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, AlertTriangle } from "lucide-react";

const CONTENT = {
  terms: {
    title: "Terms of Service",
    sections: [
      {
        heading: "Authorized Use",
        body: "FuelRouteOS Driver is provided exclusively to authorized fleet personnel employed or contracted by verified Sentinels FleetOps client organizations. Unauthorized access or use is strictly prohibited.",
      },
      {
        heading: "Account Access",
        body: "Drivers are responsible for maintaining the security of their login credentials. Do not share your PIN, password, or device access with any unauthorized party. Report lost or compromised credentials immediately to your dispatcher.",
      },
      {
        heading: "Driver Responsibilities",
        body: "Drivers must use this application in compliance with all applicable federal, state, and local transportation regulations. The app is intended as an operational aid only — drivers remain solely responsible for safe vehicle operation at all times.",
      },
      {
        heading: "Company-Owned Data",
        body: "All operational data including delivery records, BOL captures, POD signatures, scan records, and location data are the property of the authorized fleet operator. Drivers may not retain, copy, or distribute this data outside of sanctioned operational use.",
      },
      {
        heading: "Prohibited Use",
        body: "Drivers may not attempt to reverse engineer, modify, or interfere with the FuelRouteOS Driver application or its data transmission systems. Use of the app while operating a commercial vehicle is prohibited except for hands-free dispatch acknowledgement.",
      },
      {
        heading: "Service Availability",
        body: "FuelRouteOS Driver is designed to function in offline-first mode. Sentinels FleetOps does not guarantee uninterrupted service and is not liable for operational interruptions caused by network conditions, device failure, or scheduled maintenance.",
      },
      {
        heading: "Limitation of Liability",
        body: "To the maximum extent permitted by applicable law, Sentinels FleetOps and its affiliates are not liable for any indirect, incidental, or consequential damages arising from the use or inability to use FuelRouteOS Driver.",
      },
      {
        heading: "Contact",
        body: "For questions regarding these Terms of Service, contact: legal@sentinelsfleetops.com or your fleet operations administrator.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "Data Collected",
        body: "FuelRouteOS Driver collects operational data required to support fuel delivery logistics. Data collection is limited to what is necessary for the operation of your assigned duties.",
      },
      {
        heading: "Driver & Account Information",
        body: "We collect and store your name, employee ID, company assignment, CDL number, phone number, and login credentials as provided by your fleet operator.",
      },
      {
        heading: "Location & Geofence Data",
        body: "The app may record your vehicle's location during active shifts to support route tracking, geofence-based arrival confirmation, and dispatch coordination. Location collection is limited to active shift periods.",
      },
      {
        heading: "Photos & Documents",
        body: "BOL capture images, POD signature images, delivery confirmation photos, and exception report attachments are collected and stored as part of your delivery records.",
      },
      {
        heading: "Device & Sync Data",
        body: "The app records device identifiers, sync queue events, scan history, and timestamps to support operational auditing and offline-first data reliability.",
      },
      {
        heading: "How Data Is Used",
        body: "Data collected through FuelRouteOS Driver is used to support delivery operations, compliance documentation, dispatch coordination, and operational reporting for your fleet operator.",
      },
      {
        heading: "Data Sharing",
        body: "Your operational data may be shared with your employing fleet operator, terminal operators as required for BOL/delivery verification, and regulatory authorities as required by law.",
      },
      {
        heading: "Data Retention",
        body: "Operational records are retained in accordance with applicable transportation regulations and your fleet operator's data retention policy. Contact your fleet administrator for specific retention schedules.",
      },
      {
        heading: "Contact",
        body: "For privacy inquiries: privacy@sentinelsfleetops.com or contact your fleet administrator.",
      },
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    sections: [
      {
        heading: "Accessibility Commitment",
        body: "Sentinels FleetOps is committed to making FuelRouteOS Driver accessible to all drivers, including those with visual, motor, or cognitive accessibility needs. We aim to meet or exceed WCAG 2.1 Level AA standards.",
      },
      {
        heading: "Supported Settings",
        body: "FuelRouteOS Driver provides built-in accessibility settings including: theme mode (light/dark/system), adjustable font sizes (compact/standard/large/extra-large), color-blind safe status indicators, reduced motion mode, high contrast mode, and larger touch targets.",
      },
      {
        heading: "Known Prototype Limitations",
        body: "This is a prototype release. Some screens may not fully meet accessibility standards. Known limitations include: some dynamic content may not be fully announced by screen readers, and some complex workflows may require additional navigation aids in future releases.",
      },
      {
        heading: "Feedback & Contact",
        body: "If you encounter an accessibility barrier or need assistance using FuelRouteOS Driver, please contact: accessibility@sentinelsfleetops.com or speak with your fleet administrator.",
      },
    ],
  },
  data_use: {
    title: "Data Use Notice",
    sections: [
      {
        heading: "Location Use",
        body: "Your device location is used during active shifts to confirm site arrivals via geofence triggers, support route tracking, and enable dispatch coordination. Location data is not used outside of active shift periods.",
      },
      {
        heading: "Scan Data",
        body: "Barcode and QR code scan records (BOL barcodes, tank QR codes, asset tags, equipment codes) are recorded as part of your delivery documentation and sync to your fleet operator's dispatch system.",
      },
      {
        heading: "BOL / POD Images",
        body: "Bill of Lading capture images and Proof of Delivery signature images are required documentation for fuel delivery operations. These images are stored securely and transmitted to your fleet operator's records system.",
      },
      {
        heading: "Delivery Confirmation Images",
        body: "Delivery confirmation and exception report photos are collected to support delivery verification, discrepancy resolution, and compliance documentation.",
      },
      {
        heading: "Sync Queue Data",
        body: "The app maintains a local sync queue to support offline-first operations. Queued data is transmitted to your fleet operator's dispatch system when connectivity is available.",
      },
      {
        heading: "Driver & Device Logs",
        body: "App usage logs, device identifiers, shift timestamps, and workflow step completions are recorded for operational auditing, system reliability monitoring, and compliance documentation.",
      },
    ],
  },
};

export default function LegalPage({ type }) {
  const navigate = useNavigate();
  const content = CONTENT[type];

  if (!content) return null;

  return (
    <div className="bg-background min-h-screen max-w-lg mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-10 h-11 flex items-center justify-center rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold flex-1">{content.title}</h1>
      </header>

      <div className="px-4 py-4 space-y-4 pb-12">
        {/* Draft notice */}
        <div className="flex items-start gap-2.5 bg-warning/10 border border-warning/30 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-foreground">Draft placeholder</span> — final legal review required before commercial release.
          </p>
        </div>

        {content.sections.map((section, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <h2 className="text-sm font-bold text-foreground">{section.heading}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.body}</p>
          </div>
        ))}

        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            FuelRouteOS Driver · Sentinels FleetOps
          </p>
        </div>
      </div>
    </div>
  );
}