"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  DownloadCloud,
  Store,
  Clock,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
} from "lucide-react";

interface HeaderProps {
  onExportMasterExcel: () => void;
  activeOrdersCount: number;
  lowStockCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({
  onExportMasterExcel,
  activeOrdersCount,
  lowStockCount,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [storeOpen, setStoreOpen] = useState(true);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, sweets, raw materials, staff..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-800"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Quick Excel Master Export Button */}
        <button
          onClick={onExportMasterExcel}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-xs"
          title="Download master workbook with all sheets"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Excel DB</span>
        </button>

        {/* Store Online Switch */}
        <button
          onClick={() => setStoreOpen(!storeOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            storeOpen
              ? "bg-green-50 text-green-800 border-green-300"
              : "bg-red-50 text-red-800 border-red-300"
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>{storeOpen ? "Counter & Online: Open" : "Store: Closed"}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              storeOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {lowStockCount + activeOrdersCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs">
              <div className="font-semibold text-slate-800 border-b pb-2 mb-2 flex justify-between items-center">
                <span>Alerts & Notifications</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                  {lowStockCount + activeOrdersCount} Urgent
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {lowStockCount > 0 && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Low Stock Alert ({lowStockCount} items)</div>
                      <div className="text-[11px] text-amber-700">
                        Cow Ghee, Mawa & Paneer are below reorder threshold.
                      </div>
                    </div>
                  </div>
                )}

                {activeOrdersCount > 0 && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-800">
                    <Clock className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">{activeOrdersCount} Kitchen Orders Active</div>
                      <div className="text-[11px] text-red-700">
                        Vikram Agrawal order #101 in preparation (18m).
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Morning Production Batch Done</div>
                    <div className="text-[11px] text-emerald-700">
                      500 Samosas, 48 kg Jalebi logged by Ramesh Sharma.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            RA
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-800">Rajesh Agrawal</div>
            <div className="text-[10px] text-slate-400">Store Director</div>
          </div>
        </div>
      </div>
    </header>
  );
}
