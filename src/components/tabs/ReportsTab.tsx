"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  FileSpreadsheet,
  TrendingUp,
  Receipt,
  Trash2,
  PieChart,
  CheckCircle2,
} from "lucide-react";
import { Order, WastageLog, CashRegister } from "../../data/adminData";
import { AdminProduct } from "../../data/products";

interface ReportsTabProps {
  orders: Order[];
  products: AdminProduct[];
  wastageLogs: WastageLog[];
  cashRegister: CashRegister;
  onExportExcel: () => void;
}

export default function ReportsTab({
  orders,
  products,
  wastageLogs,
  cashRegister,
  onExportExcel,
}: ReportsTabProps) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const totalSales = period === "daily" ? 72870 : period === "weekly" ? 495000 : 2080000;
  const sweetSales = Math.round(totalSales * 0.48);
  const snackSales = Math.round(totalSales * 0.44);
  const beverageSales = totalSales - sweetSales - snackSales;

  const totalWastageLoss = wastageLogs.reduce((s, w) => s + w.estimatedLoss, 0);
  const rawMaterialCost = Math.round(totalSales * 0.42);
  const staffWagesCost = period === "daily" ? 5800 : period === "weekly" ? 40600 : 174000;
  const overheadUtilities = period === "daily" ? 2200 : period === "weekly" ? 15400 : 66000;

  const totalExpenses = rawMaterialCost + staffWagesCost + overheadUtilities + totalWastageLoss;
  const netProfit = totalSales - totalExpenses;
  const profitMargin = Math.round((netProfit / totalSales) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Sales, Profitability & Wastage Audit Reports
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
              Official Statement
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audited financial breakdown across Sweets, Snacks, Raw Materials, Labor & Net Store Profit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-bold">
            {(["daily", "weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  period === p ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* P&L Statement Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              Netaji Hotel Profit & Loss Statement ({period.toUpperCase()})
            </h3>
            <span className="text-xs text-slate-400">
              Branch: Katora Talab Main Road, Raipur, Chhattisgarh
            </span>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Net Margin: {profitMargin}%
          </span>
        </div>

        {/* Financial Line Items */}
        <div className="space-y-3 text-xs">
          {/* Revenues */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
            <div className="font-extrabold text-slate-900 text-sm flex justify-between">
              <span>1. Total Gross Revenue (सकल बिक्री)</span>
              <span className="text-emerald-700">₹{totalSales.toLocaleString("en-IN")}</span>
            </div>
            <div className="pl-4 space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>• Sweets & Bengali Delicacies (Kaju Katli, Jalebi, Ladoo, Rasgulla):</span>
                <span className="font-semibold text-slate-800">₹{sweetSales.toLocaleString("en-IN")} (48%)</span>
              </div>
              <div className="flex justify-between">
                <span>• Snacks & Chaat (Aloo Samosa, Khasta Kachori, Dahi Bada, Dhokla):</span>
                <span className="font-semibold text-slate-800">₹{snackSales.toLocaleString("en-IN")} (44%)</span>
              </div>
              <div className="flex justify-between">
                <span>• Lassi, Beverages & Savouries:</span>
                <span className="font-semibold text-slate-800">₹{beverageSales.toLocaleString("en-IN")} (8%)</span>
              </div>
            </div>
          </div>

          {/* Deductions & Expenses */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
            <div className="font-extrabold text-slate-900 text-sm flex justify-between">
              <span>2. Total Direct & Operating Expenses (लागत व खर्च)</span>
              <span className="text-rose-600 font-bold">-₹{totalExpenses.toLocaleString("en-IN")}</span>
            </div>
            <div className="pl-4 space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>• Cost of Goods Sold / Raw Ingredients (Ghee, Sugar, Mawa, Maida, Oil):</span>
                <span className="font-semibold text-slate-800">-₹{rawMaterialCost.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>• Halwai, Cook & Staff Salaries:</span>
                <span className="font-semibold text-slate-800">-₹{staffWagesCost.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>• Shop LPG Gas, Electricity, Cleaning & Packaging:</span>
                <span className="font-semibold text-slate-800">-₹{overheadUtilities.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>• Logged Food Wastage & Spoilage Loss:</span>
                <span>-₹{totalWastageLoss.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Net Profit Summary */}
          <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-xs flex justify-between items-center text-sm">
            <div>
              <div className="text-xs text-emerald-100 uppercase font-bold tracking-wider">
                Estimated Net Operating Profit (शुद्ध लाभ)
              </div>
              <div className="text-2xl font-black mt-0.5">
                ₹{netProfit.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-100 font-medium">Return on Sales</div>
              <div className="text-xl font-black">{profitMargin}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
