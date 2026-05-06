import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Camera, X, Plus } from "lucide-react";
import { customers, assetTypes, products } from "@/lib/mockData";
import HamburgerMenu from "@/components/driver/HamburgerMenu";

function PickerSheet({ title, items, onSelect, onClose }) {
  const [search, setSearch] = useState("");
  const filtered = items.filter(i => i.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/40">
      <div className="flex-1" onClick={onClose} />
      <div className="bg-[#f0f0f0] rounded-t-3xl max-h-[75vh] flex flex-col">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-black font-bold text-base mb-3">{title}</h3>
          <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-2 mb-1">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              className="flex-1 bg-transparent text-sm text-black placeholder:text-gray-400 outline-none"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 px-2">
          {filtered.map((item, i) => (
            <button
              key={i}
              onClick={() => { onSelect(item); onClose(); }}
              className="w-full text-left px-4 py-3 text-blue-600 text-sm active:bg-gray-100"
            >
              {item}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full py-4 text-sm font-semibold text-gray-600 border-t border-gray-200 bg-[#f0f0f0]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function SimpleSheet({ title, items, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/40">
      <div className="flex-1" onClick={onClose} />
      <div className="bg-[#f0f0f0] rounded-t-3xl">
        <div className="px-5 pt-5 pb-3">
          <h3 className="text-black font-bold text-base mb-3">Select an Item</h3>
        </div>
        <div className="px-2 pb-2">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { onSelect(item); onClose(); }}
              className="w-full text-left px-4 py-3 text-blue-600 text-sm active:bg-gray-100"
            >
              {item}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-4 text-sm font-semibold text-gray-600 border-t border-gray-200 bg-[#f0f0f0]">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function CreateAsset() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [location, setLocation] = useState("");
  const [assetType, setAssetType] = useState("");
  const [assetName, setAssetName] = useState("");
  const [product, setProduct] = useState("");
  const [capacity, setCapacity] = useState("");
  const [notes, setNotes] = useState("");

  const [sheet, setSheet] = useState(null); // null | "customer" | "location" | "assetType" | "product"

  const customerNames = customers.map(c => c.name);
  const locationOptions = ["FM 2100", "Site A", "Site B", "Main Yard"];

  const Row = ({ label, value, placeholder, onPress }) => (
    <button
      onClick={onPress}
      className="w-full flex items-center justify-between px-5 py-4 border-b border-white/5"
    >
      <span className="text-gray-300 text-sm">{label}</span>
      <div className="flex items-center gap-2 max-w-[55%]">
        <span className={`text-sm text-right ${value ? "text-gray-200" : "text-gray-500"} truncate`}>
          {value || placeholder}
        </span>
        <span className="text-gray-500 text-lg">›</span>
      </div>
    </button>
  );

  return (
    <div className="bg-black min-h-screen font-inter pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black px-4 py-3 flex items-center gap-3">
        <button onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-center">
          <div className="space-y-1.5">
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
            <span className="block w-6 h-0.5 bg-white" />
          </div>
        </button>
        <h1 className="text-gray-400 text-base font-semibold flex-1 text-center pr-10">Create Asset</h1>
      </div>

      {/* Form */}
      <div className="divide-y divide-white/5">
        <Row label="Select customer*" value={customer} placeholder="Choose customer" onPress={() => setSheet("customer")} />
        <Row label="Select location*" value={location} placeholder="Choose location" onPress={() => setSheet("location")} />
        <Row label="Select asset type*" value={assetType} placeholder="Choose asset type" onPress={() => setSheet("assetType")} />

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <span className="text-gray-300 text-sm">Enter asset name*</span>
          <input
            className="bg-[#2a2a2a] text-gray-200 text-sm rounded-lg px-3 py-2 w-[55%] outline-none placeholder:text-gray-500"
            placeholder="Enter asset name"
            value={assetName}
            onChange={e => setAssetName(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <span className="text-gray-300 text-sm">Fuel capacity</span>
          <input
            className="bg-[#2a2a2a] text-gray-200 text-sm rounded-lg px-3 py-2 w-[55%] outline-none placeholder:text-gray-500"
            placeholder="Enter capacity"
            type="number"
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
          />
        </div>

        <Row label="Select product*" value={product} placeholder="Choose product" onPress={() => setSheet("product")} />
      </div>

      {/* Add product */}
      <div className="flex justify-center py-5">
        <button className="border border-amber-500 text-amber-500 rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Photos + Notes */}
      <div className="px-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Add pics here</span>
          <button className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>
        <div>
          <p className="text-gray-300 text-sm mb-2">Notes:</p>
          <textarea
            className="w-full bg-[#1a1a1a] text-gray-300 text-sm rounded-xl px-4 py-3 outline-none placeholder:text-gray-500 resize-none h-24 border border-white/10"
            placeholder="Ex. other details like manufacturer, color, etc."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
      </div>

      {/* Create button */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-black">
        <button className="w-full bg-green-700 text-white font-semibold py-4 rounded-full text-base">
          Create
        </button>
      </div>

      {/* Sheets */}
      {sheet === "customer" && (
        <PickerSheet title="Select a Customer" items={customerNames} onSelect={setCustomer} onClose={() => setSheet(null)} />
      )}
      {sheet === "location" && (
        <SimpleSheet title="Select Location" items={locationOptions} onSelect={setLocation} onClose={() => setSheet(null)} />
      )}
      {sheet === "assetType" && (
        <SimpleSheet title="Select Asset Type" items={assetTypes} onSelect={setAssetType} onClose={() => setSheet(null)} />
      )}
      {sheet === "product" && (
        <PickerSheet title="Select a Product" items={products} onSelect={setProduct} onClose={() => setSheet(null)} />
      )}

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}