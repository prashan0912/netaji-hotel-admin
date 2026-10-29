"use client";

import React, { useState } from "react";
import {
  Boxes,
  AlertTriangle,
  Calendar,
  Plus,
  Trash2,
  TrendingDown,
  Clock,
  CheckCircle2,
  PackagePlus,
  FileSpreadsheet,
  Search,
  Filter,
} from "lucide-react";
import { RawMaterial, WastageLog } from "../../data/adminData";

interface InventoryTabProps {
  rawMaterials: RawMaterial[];
  wastageLogs: WastageLog[];
  onAddStock: (materialId: string, addedQty: number, invoiceCost: number, supplier: string) => void;
  onLogWastage: (newWastage: WastageLog) => void;
}

export default function InventoryTab({
  rawMaterials,
  wastageLogs,
  onAddStock,
  onLogWastage,
}: InventoryTabProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showWastageModal, setShowWastageModal] = useState(false);

  // Purchase modal form state
  const [selectedMaterialId, setSelectedMaterialId] = useState(rawMaterials[0]?.id || "");
  const [purchaseQty, setPurchaseQty] = useState(10);
  const [purchaseCost, setPurchaseCost] = useState(1500);
  const [supplierName, setSupplierName] = useState("Chhattisgarh Dairy Federation");

  // Wastage modal form state
  const [wasteItemName, setWasteItemName] = useState("Fresh Khoya / Mawa");
  const [wasteCategory, setWasteCategory] = useState<"Raw Material" | "Prepared Sweet" | "Prepared Snack">("Raw Material");
  const [wasteQty, setWasteQty] = useState("1.5 kg");
  const [wasteReason, setWasteReason] = useState<"Burnt/Overcooked" | "Spoiled/Expired" | "Spillage" | "Unsold End-of-Day">("Spoiled/Expired");
  const [wasteLoss, setWasteLoss] = useState(480);
  const [reportedBy, setReportedBy] = useState("Ramesh Sharma (Head Halwai)");

  const lowStockCount = rawMaterials.filter((rm) => rm.currentStock <= rm.minStockAlert).length;
  const totalValuation = rawMaterials.reduce((acc, rm) => acc + rm.currentStock * rm.costPerUnit, 0);
  const totalWastageLoss = wastageLogs.reduce((acc, w) => acc + w.estimatedLoss, 0);

  const filteredMaterials = rawMaterials.filter((rm) => {
    if (showLowStockOnly && rm.currentStock > rm.minStockAlert) return false;
    if (filterCategory !== "all" && rm.category !== filterCategory) return false;
    return true;
  });

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialId) return;
    onAddStock(selectedMaterialId, purchaseQty, purchaseCost, supplierName);
    setShowPurchaseModal(false);
  };

  const handleWastageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: WastageLog = {
      id: `w-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      itemName: wasteItemName,
      category: wasteCategory,
      quantity: wasteQty,
      reason: wasteReason,
      estimatedLoss: wasteLoss,
      reportedBy,
    };
    onLogWastage(newLog);
    setShowWastageModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Raw Materials & Inventory Management
            </h2>
            {lowStockCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                {lowStockCount} Reorder Alerts
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track opening stock, inward purchases, kitchen usage, expiry batches & wastage costs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Record Raw Purchase</span>
          </button>
          <button
            onClick={() => setShowWastageModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Log Food Wastage</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">
              Total Raw Stock Value
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₹{totalValuation.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Across 11 active kitchen ingredients
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase">
              Low Stock Warnings
            </div>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {lowStockCount} Items
            </div>
            <div className="text-[11px] text-amber-700 mt-1">
              Needs replenishment before tomorrow's batches
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-rose-700 uppercase">
              Logged Wastage Loss
            </div>
            <div className="text-2xl font-black text-rose-600 mt-1">
              ₹{totalWastageLoss.toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-rose-600 mt-1">
              {wastageLogs.length} incidents recorded this week
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Switch Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {["all", "Dairy", "Grains & Flour", "Sweetener", "Dry Fruits & Nuts", "Spices & Oils", "Packaging"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filterCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`px-3 py-1.5 rounded-lg font-bold border transition-colors flex items-center gap-1.5 ${
            showLowStockOnly
              ? "bg-amber-500 text-white border-amber-600"
              : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Show Low Stock Only ({lowStockCount})</span>
        </button>
      </div>

      {/* Raw Materials Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Raw Material</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Current Stock</th>
                <th className="py-3 px-3">Min Reorder Level</th>
                <th className="py-3 px-3">Rate (Per Unit)</th>
                <th className="py-3 px-3">Supplier (Raipur)</th>
                <th className="py-3 px-3">Expiry / Batch</th>
                <th className="py-3 px-4 text-right">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMaterials.map((rm) => {
                const isLow = rm.currentStock <= rm.minStockAlert;
                return (
                  <tr key={rm.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{rm.name}</div>
                      <div className="text-[11px] text-slate-400">{rm.hindiName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {rm.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-sm font-extrabold ${isLow ? "text-red-600" : "text-slate-900"}`}>
                        {rm.currentStock} {rm.unit}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-500">
                      {rm.minStockAlert} {rm.unit}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      ₹{rm.costPerUnit} / {rm.unit}
                    </td>
                    <td className="py-3 px-3 text-slate-600 truncate max-w-[160px]">
                      {rm.supplierName}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-[11px] text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{rm.expiryDate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300">
                          <AlertTriangle className="w-3 h-3" /> Reorder Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Sufficient
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Food Wastage & Loss Log Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Food Wastage & Loss Tracking Report
            </h3>
            <p className="text-xs text-slate-400">
              Audit unsold sweets, overcooked batches, or spillage to prevent profit leaks.
            </p>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
            Total Loss: ₹{totalWastageLoss}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Item / Ingredient</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">Est. Loss (₹)</th>
                <th className="py-2.5 px-3 text-right">Reported By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {wastageLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-medium text-slate-500">{log.date}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{log.itemName}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold">{log.quantity}</td>
                  <td className="py-2.5 px-3 text-rose-600 font-medium">{log.reason}</td>
                  <td className="py-2.5 px-3 font-extrabold text-rose-600">₹{log.estimatedLoss}</td>
                  <td className="py-2.5 px-3 text-right text-slate-500">{log.reportedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Inward Raw Material Delivery
              </h3>
              <button onClick={() => setShowPurchaseModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Raw Material</label>
                <select
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {rawMaterials.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.name} ({rm.hindiName}) - Current: {rm.currentStock} {rm.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purchased Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Invoice Cost (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Supplier / Vendor</label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Confirm & Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Wastage Modal */}
      {showWastageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Log Food Wastage / Spoilage
              </h3>
              <button onClick={() => setShowWastageModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleWastageSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item / Ingredient Name</label>
                <input
                  type="text"
                  required
                  value={wasteItemName}
                  onChange={(e) => setWasteItemName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item Type</label>
                  <select
                    value={wasteCategory}
                    onChange={(e) => setWasteCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Raw Material">Raw Material</option>
                    <option value="Prepared Sweet">Prepared Sweet</option>
                    <option value="Prepared Snack">Prepared Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wasted Quantity</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10 pcs or 1.5 kg"
                    value={wasteQty}
                    onChange={(e) => setWasteQty(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for Loss</label>
                  <select
                    value={wasteReason}
                    onChange={(e) => setWasteReason(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Burnt/Overcooked">Burnt / Overcooked</option>
                    <option value="Spoiled/Expired">Spoiled / Expired</option>
                    <option value="Spillage">Spillage / Dropped</option>
                    <option value="Unsold End-of-Day">Unsold End-of-Day</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Cost Loss (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={wasteLoss}
                    onChange={(e) => setWasteLoss(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reported By</label>
                <input
                  type="text"
                  required
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowWastageModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm"
                >
                  Record Loss Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
