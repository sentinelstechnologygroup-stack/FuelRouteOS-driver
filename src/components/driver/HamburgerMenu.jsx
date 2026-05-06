import React from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "@/lib/driverContext";
import {
  MessageSquare, Settings, LogOut, User, ClipboardCheck, Wrench,
  Fuel, CalendarDays, ShoppingCart, GitBranch, Repeat, PlusCircle, X
} from "lucide-react";

const menuItems = [
  { label: "Home",                 path: "/home"           },
  { label: "Today's Route",        path: "/today-shift"    },
  { label: "Record Order",         path: "/record-order"   },
  { label: "Schedule Order",       path: "/schedule-order" },
  { label: "Order Well",           path: "/order-well"     },
  { label: "Record Fuel Transfer", path: "/record-transfer" },
  { label: "Add Customer Assets",  path: "/create-asset"   },
];

const bottomItems = [
  { label: "Dispatch Chat",         path: "/chat",          icon: MessageSquare },
  { label: "Driver Profile",        path: "/profile",       icon: User          },
  { label: "Pre-Trip Inspection",   path: "/pre-trip",      icon: ClipboardCheck },
  { label: "Post-Trip Inspection",  path: "/post-trip",     icon: ClipboardCheck },
  { label: "Vehicle Issue Report",  path: "/vehicle-issue", icon: Wrench        },
  { label: "Settings",              path: "/settings",      icon: Settings      },
];

export default function HamburgerMenu({ open, onClose }) {
  const navigate = useNavigate();
  const { driver } = useDriver();

  if (!open) return null;

  const handleNav = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Navigation menu">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="relative z-10 w-[78%] max-w-xs bg-card h-full flex flex-col shadow-2xl overflow-y-auto border-r border-border">

        {/* Driver header */}
        <div className="bg-primary/10 border-b border-primary/20 px-5 pt-12 pb-5">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-secondary/60 text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-3">
            <span className="text-foreground text-xl font-black">{driver.initials}</span>
          </div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Fuel className="w-3 h-3 text-primary" aria-hidden="true" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-primary">FuelRouteOS</span>
          </div>
          <p className="text-foreground font-bold text-base">{driver.name}</p>
          <p className="text-muted-foreground text-xs mt-0.5">{driver.phone}</p>
          <p className="text-muted-foreground text-xs">{driver.company}</p>
        </div>

        {/* Primary nav */}
        <nav className="py-2" aria-label="Primary navigation">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className="w-full text-left px-6 py-3.5 text-foreground font-semibold text-sm active:bg-secondary/60 border-b border-border last:border-0"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Secondary nav */}
        <div className="border-t border-border py-2" aria-label="Secondary navigation">
          {bottomItems.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className="w-full flex items-center gap-3 px-5 py-3 text-muted-foreground text-sm active:bg-secondary/60 hover:text-foreground transition-colors"
            >
              {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-auto border-t border-border py-4 px-4">
          <button
            onClick={() => handleNav("/")}
            className="w-full flex items-center gap-3 px-2 py-3 text-muted-foreground text-sm active:bg-secondary/60 rounded-xl transition-colors hover:text-destructive"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="pb-6 px-5">
          <p className="text-[10px] text-muted-foreground/50">FuelRouteOS Driver · Sentinels FleetOps</p>
        </div>
      </div>
    </div>
  );
}