"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  IndianRupee,
  Receipt,
  Utensils,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Award,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Calendar,
  Sparkles,
} from "lucide-react";
import {
  Order,
  RawMaterial,
  DailyProduction,
  BulkOrder,
  CashRegister,
} from "../../data/adminData";
import { AdminProduct } from "../../data/products";

interface DashboardTabProps {
  orders: Order[];
  products: AdminProduct[];
  rawMaterials: RawMaterial[];
  dailyProduction: DailyProduction[];
  bulkOrders: BulkOrder[];
  cashRegister: CashRegister;
  onNavigateTab: (tab: any) => void;
  onExportExcel: () => void;
}

export default function DashboardTab({
  orders,
  products,
  rawMaterials,
  dailyProduction,
  bulkOrders,
  cashRegister,
  onNavigateTab,
  onExportExcel,
}: DashboardTabProps) {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");

  // Calculate dynamic sales numbers based on range
  const salesMultiplier = timeRange === "daily" ? 1 : timeRange === "weekly" ? 6.8 : 28.5;
  const baseRevenue = 72870; // Today's combined revenue (Counter + UPI + Card)
  const currentRevenue = Math.round(baseRevenue * salesMultiplier);

  const baseOrdersCount = 142; // Today's order count
  const currentOrdersCount = Math.round(baseOrdersCount * salesMultiplier);
  const averageOrderValue = Math.round(currentRevenue / currentOrdersCount);

  const estimatedCOGS = Math.round(currentRevenue * 0.44); // 44% ingredient + packaging cost
  const operationalExpenses = Math.round((timeRange === "daily" ? 6800 : timeRange === "weekly" ? 47000 : 195000));
  const estimatedNetProfit = currentRevenue - estimatedCOGS - operationalExpenses;
  const profitMarginPct = Math.round((estimatedNetProfit / currentRevenue) * 100);

  // Best & least selling dishes
  const bestSellers = [
    { name: "Famous Raipur Aloo Samosa", category: "Snacks", sold: "850 pcs", revenue: "₹15,300", change: "+14%" },
    { name: "Pure Desi Ghee Jalebi", category: "Sweets", sold: "48 kg", revenue: "₹18,240", change: "+22%" },
    { name: "Netaji Special Dahi Bada", category: "Chaat", sold: "200 plates", revenue: "₹13,000", change: "+9%" },
    { name: "Diamond Kaju Katli", category: "Sweets", sold: "18.5 kg", revenue: "₹17,390", change: "+18%" },
    { name: "Motichoor Desi Ghee Ladoo", category: "Sweets", sold: "56 kg", revenue: "₹23,520", change: "+31%" },
  ];

  const leastSellers = [
    { name: "Kolkata Chum Chum", category: "Sweets", sold: "2.5 kg", remaining: "5.5 kg", status: "Slow Moving", action: "Review Batch" },
    { name: "Bread Pakoda", category: "Snacks", sold: "18 pcs", remaining: "12 pcs", status: "Freshness Alert", action: "Discount 20%" },
    { name: "Sugarfree Kalakand", category: "Diet Sweet", sold: "1.2 kg", remaining: "4.8 kg", status: "Low Demand", action: "Reduce Batch" },
  ];

  // Daily hourly trend points for SVG curve
  const hourlyData = [
    { hour: "7 AM", sales: 2400 },
    { hour: "8 AM", sales: 5800 },
    { hour: "9 AM", sales: 9400 },
    { hour: "10 AM", sales: 11200 },
    { hour: "11 AM", sales: 7800 },
    { hour: "12 PM", sales: 6200 },
    { hour: "1 PM", sales: 4800 },
    { hour: "2 PM", sales: 3200 },
    { hour: "3 PM", sales: 4100 },
    { hour: "4 PM", sales: 8600 },
    { hour: "5 PM", sales: 12900 },
    { hour: "6 PM", sales: 16400 },
    { hour: "7 PM", sales: 14800 },
  ];

  const maxSale = Math.max(...hourlyData.map((d) => d.sales));

  return (
    <div className="space-y-6">
      {/* Top Banner & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-900 via-red-800 to-amber-900 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-red-950 uppercase tracking-wider">
              Executive Overview
            </span>
            <span className="text-xs text-red-200">Raipur Flagship Branch</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Netaji Hotel Business Command</h2>
          <p className="text-sm text-red-100 max-w-xl mt-1">
            Real-time sales, kitchen throughput, recipe cost tracking and daily profit analysis.
          </p>
        </div>

        {/* Range Buttons & Export */}
        <div className="flex items-center gap-2 relative z-10 flex-wrap">
          <div className="bg-red-950/60 p-1 rounded-xl flex items-center border border-red-700/50">
            {(["daily", "weekly", "monthly"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  timeRange === r
                    ? "bg-amber-400 text-red-950 shadow-sm"
                    : "text-red-100 hover:bg-red-800/60"
                }`}
              >
                {r === "daily" ? "Daily (आज)" : r === "weekly" ? "Weekly (हफ्ता)" : "Monthly (माह)"}
              </button>
            ))}
          </div>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-red-900 font-bold text-xs hover:bg-amber-50 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-red-700" />
            <span>Excel / PDF</span>
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {timeRange === "daily" ? "Today's Gross Sales" : `${timeRange} Gross Sales`}
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              ₹{currentRevenue.toLocaleString("en-IN")}
            </span>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +16.4%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Counter Cash: ₹{(cashRegister.counterCashSales * salesMultiplier).toFixed(0)} | Digital UPI: ₹
            {(cashRegister.upiSales * salesMultiplier).toFixed(0)}
          </p>
        </div>

        {/* Total Orders & AOV */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Orders & AOV
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {currentOrdersCount.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              (AOV: <strong className="text-slate-800">₹{averageOrderValue}</strong>)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Peak hours: 8:00 AM - 10:30 AM & 5:00 PM - 7:30 PM
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              COGS & Raw Material
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              ₹{estimatedCOGS.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-500 font-medium">44% of revenue</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Ghee, Mawa, Sugar, Oil & Packaging consumables
          </p>
        </div>

        {/* Estimated Net Profit */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Est. Net Profit (शुद्ध लाभ)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-950">
              ₹{estimatedNetProfit.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-200/60 px-1.5 py-0.5 rounded">
              {profitMarginPct}% Margin
            </span>
          </div>
          <p className="text-xs text-emerald-700 mt-2">
            After raw materials, staff wages & shop utilities
          </p>
        </div>
      </div>

      {/* Sales Trend Visual Graph + Quick Operational Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Sales Graph */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Raipur Store Sales Velocity & Demand Curve
              </h3>
              <p className="text-xs text-slate-400">
                Hourly revenue curve across Samosa, Kachori, Jalebi & Lassi rushes
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">
              Peak: 6:00 PM (₹16.4k/hr)
            </span>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="h-56 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
            {hourlyData.map((d, i) => {
              const heightPct = Math.round((d.sales / maxSale) * 100);
              const isPeak = d.sales > 12000;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                  <div className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{(d.sales / 1000).toFixed(1)}k
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 group-hover:brightness-110 ${
                      isPeak
                        ? "bg-gradient-to-t from-red-600 to-amber-500 shadow-xs"
                        : "bg-slate-200 group-hover:bg-red-400"
                    }`}
                  />
                  <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {d.hour}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500"></span> Peak Rush Hours (Breakfast & Evening)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200"></span> Standard Hours
              </span>
            </div>
            <button
              onClick={() => onNavigateTab("reports")}
              className="font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              Detailed Analytics & Reports →
            </button>
          </div>
        </div>

        {/* Category Breakdown & Operations Pulse */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base mb-1">Sales by Category</h3>
            <p className="text-xs text-slate-400 mb-4">Sweets vs Snacks revenue proportion</p>

            <div className="space-y-3.5">
              {[
                { name: "Snacks & Hot Chaat (Samosa, Bada)", pct: 42, amount: "₹30,600", color: "bg-red-600" },
                { name: "Pure Ghee & Bengali Sweets", pct: 36, amount: "₹26,230", color: "bg-amber-500" },
                { name: "Kaju & Dry Fruit Classics", pct: 14, amount: "₹10,200", color: "bg-purple-600" },
                { name: "Lassi & Beverages", pct: 8, amount: "₹5,840", color: "bg-blue-500" },
              ].map((c, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{c.name}</span>
                    <span className="text-slate-900 font-bold">{c.amount} ({c.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${c.color}`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Badges */}
          <div className="pt-5 border-t border-slate-100 mt-5">
            <div className="text-xs font-bold text-slate-700 mb-2">Fast Operations Shortcuts</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab("orders")}
                className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Utensils className="w-3.5 h-3.5" />
                Live KDS ({orders.filter((o) => o.status !== "completed").length})
              </button>
              <button
                onClick={() => onNavigateTab("production")}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5" />
                Production Log
              </button>
              <button
                onClick={() => onNavigateTab("inventory")}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5" />
                Raw Materials
              </button>
              <button
                onClick={() => onNavigateTab("excel")}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Excel DB Sync
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Best Sellers & Least Sellers Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Items */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Best-Selling Dishes & Sweets</h3>
                <p className="text-xs text-slate-400">High volume drivers for Raipur branch</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Top 5 Items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-2">Volume</th>
                  <th className="py-2.5 px-2">Revenue</th>
                  <th className="py-2.5 px-3 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bestSellers.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      {item.name}
                    </td>
                    <td className="py-2.5 px-2 font-medium">{item.sold}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-900">{item.revenue}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{item.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Least Selling Items & Expiry Warning */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Least-Selling / Slow Dishes</h3>
                <p className="text-xs text-slate-400">Items requiring batch adjustments to avoid wastage</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              Wastage Watch
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-2">Sold Today</th>
                  <th className="py-2.5 px-2">Stock Left</th>
                  <th className="py-2.5 px-2">Alert Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leastSellers.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-2.5 px-2 font-medium text-slate-500">{item.sold}</td>
                    <td className="py-2.5 px-2 font-bold text-amber-600">{item.remaining}</td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onNavigateTab("production")}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                      >
                        {item.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
