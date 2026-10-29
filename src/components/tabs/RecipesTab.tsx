"use client";

import React, { useState } from "react";
import {
  ScrollText,
  Calculator,
  Sparkles,
  ChefHat,
  Scale,
  Plus,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Recipe, RawMaterial } from "../../data/adminData";

interface RecipesTabProps {
  recipes: Recipe[];
  rawMaterials: RawMaterial[];
}

export default function RecipesTab({ recipes, rawMaterials }: RecipesTabProps) {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(recipes[0]?.id || "rec-1");
  const [productionVolume, setProductionVolume] = useState<number>(100); // e.g. 100 plates or 100 pcs
  const [actualIngredientUsed, setActualIngredientUsed] = useState<number>(0);

  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0];

  // Helper to extract numeric yield for multiplier calculation
  const getYieldMultiplier = () => {
    if (!selectedRecipe) return 1;
    if (selectedRecipe.batchYield.includes("100 Pcs")) return productionVolume / 100;
    if (selectedRecipe.batchYield.includes("10 kg")) return productionVolume / 10;
    if (selectedRecipe.batchYield.includes("15 kg")) return productionVolume / 15;
    if (selectedRecipe.batchYield.includes("50 Plates")) return productionVolume / 50;
    return productionVolume / 100;
  };

  const multiplier = getYieldMultiplier();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950 uppercase tracking-wider">
              Smart RMS Engine
            </span>
            <span className="text-xs text-emerald-200">Standard Recipes & Yield Control</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Recipe Management & Automatic Inventory Tracking
          </h2>
          <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
            Eliminates pilferage and stock mystery: as dishes are prepared and sold, the system calculates exact theoretical ingredient consumption (Opening + Purchases − Usage = Remaining) and detects actual wastage variance!
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Interactive Automatic Usage & Variance Calculator */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Live Recipe Consumption Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Test inventory deduction based on plates/batches sold or produced
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-600">Select Dish:</label>
            <select
              value={selectedRecipeId}
              onChange={(e) => setSelectedRecipeId(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.dishName} ({r.dishHindiName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Quantity Prepared / Sold
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={productionVolume}
                onChange={(e) => setProductionVolume(Math.max(1, Number(e.target.value)))}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-slate-500 font-semibold whitespace-nowrap">
                {selectedRecipe?.batchYield.includes("Pcs")
                  ? "Pieces"
                  : selectedRecipe?.batchYield.includes("Plates")
                  ? "Plates"
                  : "Kg"}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Standard Batch Yield Base</label>
            <div className="p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700">
              {selectedRecipe?.batchYield}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Est. Preparation Time</label>
            <div className="p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700">
              {Math.round(selectedRecipe?.prepTimeMinutes * multiplier)} minutes
            </div>
          </div>
        </div>

        {/* Dynamic Ingredient Deduction Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Raw Ingredient</th>
                <th className="py-2.5 px-3">Recipe Ratio (Per Batch)</th>
                <th className="py-2.5 px-3">Calculated Consumption</th>
                <th className="py-2.5 px-3">Warehouse Stock Available</th>
                <th className="py-2.5 px-3">Post-Deduction Balance</th>
                <th className="py-2.5 px-3 text-right">RMS Stock Feasibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {selectedRecipe?.ingredients.map((ing, idx) => {
                const consumed = +(ing.quantityRequired * multiplier).toFixed(2);
                const rawMat = rawMaterials.find((rm) => rm.id === ing.rawMaterialId);
                const availableStock = rawMat ? rawMat.currentStock : 50;
                const balance = +(availableStock - consumed).toFixed(2);
                const isShortage = balance < 0;

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{ing.rawMaterialName}</td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      {ing.quantityRequired} {ing.unit} / batch
                    </td>
                    <td className="py-3 px-3 font-extrabold text-emerald-700 text-sm">
                      {consumed} {ing.unit}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {availableStock} {ing.unit}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${isShortage ? "text-red-600" : "text-slate-900"}`}>
                        {balance} {ing.unit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {isShortage ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 text-red-700">
                          <AlertCircle className="w-3 h-3" /> Shortage ({Math.abs(balance)} {ing.unit})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Sufficient Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Theoretical Formula Explanation Banner */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Netaji Hotel Variance Formula:</span> Remaining Warehouse Stock =
            Opening Stock + Recorded Inward Purchases − Total Calculated Recipe Usage. Any negative variance
            exceeding standard tolerance ({selectedRecipe?.standardWastagePct}%) is flagged to Head Halwai.
          </div>
        </div>
      </div>

      {/* Standard Recipes Master Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
              selectedRecipeId === recipe.id ? "border-emerald-500 ring-2 ring-emerald-100" : "border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{recipe.dishName}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {recipe.batchYield}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{recipe.dishHindiName}</div>
              </div>

              <button
                onClick={() => setSelectedRecipeId(recipe.id)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                  selectedRecipeId === recipe.id
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {selectedRecipeId === recipe.id ? "Active in Simulator" : "Simulate"}
              </button>
            </div>

            {/* Ingredients required */}
            <div className="space-y-1.5 text-xs mb-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Standard Recipe Bill of Materials (BOM)
              </div>
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex justify-between items-center text-slate-700">
                  <span>• {ing.rawMaterialName}</span>
                  <span className="font-bold text-slate-900">
                    {ing.quantityRequired} {ing.unit}
                  </span>
                </div>
              ))}
            </div>

            {/* Preparation notes & standard wastage */}
            <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100 space-y-1">
              <div>
                <strong className="text-slate-800">Preparation:</strong> {recipe.instructions}
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                <span>Standard Allowable Wastage: <strong>{recipe.standardWastagePct}%</strong></span>
                <span>Prep Time: <strong>{recipe.prepTimeMinutes} mins</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
