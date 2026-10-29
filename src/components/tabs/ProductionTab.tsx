"use client";

import React, { useState } from "react";
import {
  Flame,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Plus,
  Scale,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Check,
  XCircle,
} from "lucide-react";
import { DailyProduction } from "../../data/adminData";

interface ProductionTabProps {
  productionLogs: DailyProduction[];
  onAddProductionBatch: (newBatch: DailyProduction) => void;
  onToggleAvailability: (dishId: string) => void;
}

export default function ProductionTab({
  productionLogs,
  onAddProductionBatch,
}: ProductionTabProps) {
  const [filterType, setFilterType] = useState<"all" | "Sweet" | "Snack">("all");
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);

  // Tomorrow Demand Planning state
  const [tomorrowNotes, setTomorrowNotes] = useState(
    "High morning demand expected near Katora Talab for Sunday breakfast. Increase Samosa batch to 1,100 pcs and Jalebi to 65 kg."
  );
  const [plannedSamosa, setPlannedSamosa] = useState(1100);
  const [plannedJalebi, setPlannedJalebi] = useState(65);
  const [plannedKachori, setPlannedKachori] = useState(550);
  const [plannerSaved, setPlannerSaved] = useState(false);

  // New Batch Form State
  const [dishName, setDishName] = useState("Famous Raipur Aloo Samosa");
  const [dishCategory, setDishCategory] = useState<"Sweet" | "Snack" | "Beverage">("Snack");
  const [unit, setUnit] = useState<"kg" | "pieces" | "plates">("pieces");
  const [morningQty, setMorningQty] = useState(300);
  const [afternoonQty, setAfternoonQty] = useState(200);
  const [halwai, setHalwai] = useState("Ramesh Sharma (Head Halwai)");
  const [shelfLifeHours, setShelfLifeHours] = useState(14);

  const filteredLogs = productionLogs.filter((p) => {
    if (filterType !== "all" && p.dishCategory !== filterType) return false;
    return true;
  });

  const totalSamosaProduced = productionLogs.find((p) => p.dishId === "snack-samosa")?.totalProduced || 850;
  const totalJalebiProduced = productionLogs.find((p) => p.dishId === "sweet-jalebi")?.totalProduced || 48;

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const total = morningQty + afternoonQty;
    const newBatch: DailyProduction = {
      id: `dp-${Date.now()}`,
      dishId: `dish-${Date.now()}`,
      dishName,
      dishCategory,
      unit,
      morningBatch: morningQty,
      afternoonBatch: afternoonQty,
      totalProduced: total,
      totalSold: 0,
      remainingStock: total,
      wastedQuantity: 0,
      preparationDate: new Date().toISOString().split("T")[0],
      prepTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      expiryTime: `Valid next ${shelfLifeHours} hrs`,
      freshnessStatus: "Freshly Made",
      halwaiInCharge: halwai,
    };

    onAddProductionBatch(newBatch);
    setShowNewBatchModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Daily Production, Stock & Freshness Control
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Live Raipur Halwai Floor
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time batch production logging, weight-based (kg/g) & piece stock tracking with auto-expiry alerts.
          </p>
        </div>

        <button
          onClick={() => setShowNewBatchModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Fresh Cooking Batch</span>
        </button>
      </div>

      {/* Production Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Today's Samosas Fried</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalSamosaProduced} pcs</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">760 sold • 82 remaining</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Desi Ghee Jalebi Made</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalJalebiProduced} kg</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">44.5 kg sold • 3.0 kg remaining</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Active Sweet Stock</div>
          <div className="text-2xl font-black text-slate-900 mt-1">114.5 kg</div>
          <div className="text-[11px] text-slate-500 mt-1">Kaju Katli, Rasgulla, Gulab Jamun, Ladoo</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Freshness Status</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">100% Fresh</div>
          <div className="text-[11px] text-slate-400 mt-1">0 expired batches on display</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs w-fit">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterType === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All Items ({productionLogs.length})
        </button>
        <button
          onClick={() => setFilterType("Snack")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterType === "Snack" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Hot Snacks & Chaat (Pieces/Plates)
        </button>
        <button
          onClick={() => setFilterType("Sweet")}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            filterType === "Sweet" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sweets & Bengali Delicacies (Kg/Grams)
        </button>
      </div>

      {/* Production & Freshness Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Dish / Sweet Name</th>
                <th className="py-3 px-3">Unit Type</th>
                <th className="py-3 px-3">Morning Batch</th>
                <th className="py-3 px-3">Afternoon Batch</th>
                <th className="py-3 px-3">Total Prepared</th>
                <th className="py-3 px-3">Sold Today</th>
                <th className="py-3 px-3">Stock Left</th>
                <th className="py-3 px-3">Freshness & Shelf Life</th>
                <th className="py-3 px-4 text-right">Halwai In-Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((item) => {
                const isLow = item.remainingStock <= (item.unit === "kg" ? 4 : 20);
                const isSoldOut = item.remainingStock <= 0;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900">{item.dishName}</div>
                      <div className="text-[10px] text-slate-400">Prep time: {item.prepTime}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px]">
                        {item.unit === "kg" ? "Weight (kg/g)" : item.unit === "plates" ? "Plates" : "Pieces"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      {item.morningBatch} {item.unit}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      {item.afternoonBatch} {item.unit}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {item.totalProduced} {item.unit}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      {item.totalSold} {item.unit}
                    </td>
                    <td className="py-3 px-3">
                      {isSoldOut ? (
                        <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-red-100 text-red-700">
                          Sold Out
                        </span>
                      ) : (
                        <span className={`font-black text-sm ${isLow ? "text-amber-600" : "text-slate-900"}`}>
                          {item.remainingStock} {item.unit}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <div>
                          <div className="font-bold text-slate-800">{item.freshnessStatus}</div>
                          <div className="text-[10px] text-slate-400">Exp: {item.expiryTime}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      {item.halwaiInCharge}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tomorrow Demand & Production Planner */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-amber-950 text-base">
                Tomorrow's Demand & Production Planner (कल की मांग)
              </h3>
              <p className="text-xs text-amber-800">
                Plan morning fryer & kadai targets based on day of week, weddings & local Raipur festivals.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setPlannerSaved(true);
              setTimeout(() => setPlannerSaved(false), 2500);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            {plannerSaved ? <Check className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            <span>{plannerSaved ? "Targets Saved!" : "Save Tomorrow's Targets"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Planned Aloo Samosa (Pcs)
            </label>
            <input
              type="number"
              value={plannedSamosa}
              onChange={(e) => setPlannedSamosa(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="text-[10px] text-slate-400 mt-1">
              Raw requirement: ~50 kg Aloo, 32 kg Maida
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Planned Desi Ghee Jalebi (Kg)
            </label>
            <input
              type="number"
              value={plannedJalebi}
              onChange={(e) => setPlannedJalebi(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="text-[10px] text-slate-400 mt-1">
              Raw requirement: ~40 kg Sugar, 18 kg Ghee
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Planned Khasta Kachori (Pcs)
            </label>
            <input
              type="number"
              value={plannedKachori}
              onChange={(e) => setPlannedKachori(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="text-[10px] text-slate-400 mt-1">
              Raw requirement: ~16 kg Moong Dal, 22 kg Maida
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Production Directives & Halwai Instructions
          </label>
          <textarea
            rows={2}
            value={tomorrowNotes}
            onChange={(e) => setTomorrowNotes(e.target.value)}
            className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* New Batch Cooking Modal */}
      {showNewBatchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Log Cooking Batch (कढ़ाई / भट्टी)
              </h3>
              <button onClick={() => setShowNewBatchModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="Snack">Hot Snack / Chaat</option>
                    <option value="Sweet">Sweet / Mithai</option>
                    <option value="Beverage">Lassi / Beverage</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="pieces">Pieces (Samosa/Kachori)</option>
                    <option value="kg">Kilograms (Sweets/Jalebi)</option>
                    <option value="plates">Plates (Dahi Bada/Dhokla)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Morning Batch</label>
                  <input
                    type="number"
                    min="0"
                    value={morningQty}
                    onChange={(e) => setMorningQty(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Afternoon Batch</label>
                  <input
                    type="number"
                    min="0"
                    value={afternoonQty}
                    onChange={(e) => setAfternoonQty(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Halwai In-Charge</label>
                  <input
                    type="text"
                    required
                    value={halwai}
                    onChange={(e) => setHalwai(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shelf Life (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    value={shelfLifeHours}
                    onChange={(e) => setShelfLifeHours(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewBatchModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm"
                >
                  Add to Production Floor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
