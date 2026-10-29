"use client";

import React from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Boxes,
  ScrollText,
  Flame,
  CalendarCheck2,
  BookOpen,
  Users2,
  Bike,
  Wallet,
  BarChart3,
  FileSpreadsheet,
  ChevronRight,
  Bell,
  Sparkles,
} from "lucide-react";

export type TabKey =
  | "dashboard"
  | "orders"
  | "inventory"
  | "recipes"
  | "production"
  | "bulk"
  | "products"
  | "employees"
  | "delivery"
  | "accounts"
  | "reports"
  | "excel";

interface SidebarProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  activeOrdersCount: number;
  lowStockCount: number;
  pendingBulkCount: number;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  activeOrdersCount,
  lowStockCount,
  pendingBulkCount,
}: SidebarProps) {
  const navItems = [
    {
      id: "dashboard" as TabKey,
      label: "Sales & Dashboard",
      hindiLabel: "डैशबोर्ड व बिक्री",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "orders" as TabKey,
      label: "Kitchen & Orders",
      hindiLabel: "किचन व ऑर्डर्स",
      icon: UtensilsCrossed,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} Live` : null,
      badgeColor: "bg-red-500 text-white animate-pulse",
    },
    {
      id: "inventory" as TabKey,
      label: "Inventory & Raw Material",
      hindiLabel: "कच्चा माल व स्टॉक",
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} Alert` : null,
      badgeColor: "bg-amber-500 text-white",
    },
    {
      id: "recipes" as TabKey,
      label: "Recipe & Auto-Usage",
      hindiLabel: "रेसिपी व खपत ट्रैकिंग",
      icon: ScrollText,
      badge: "Smart",
      badgeColor: "bg-emerald-600 text-white",
    },
    {
      id: "production" as TabKey,
      label: "Production & Freshness",
      hindiLabel: "दैनिक उत्पादन व ताज़गी",
      icon: Flame,
      badge: null,
    },
    {
      id: "bulk" as TabKey,
      label: "Bulk & Wedding Orders",
      hindiLabel: "शादी व पार्टी ऑर्डर्स",
      icon: CalendarCheck2,
      badge: pendingBulkCount > 0 ? `${pendingBulkCount}` : null,
      badgeColor: "bg-purple-600 text-white",
    },
    {
      id: "products" as TabKey,
      label: "Products & Menu",
      hindiLabel: "मिठाई व नाश्ता मेनू",
      icon: BookOpen,
      badge: null,
    },
    {
      id: "employees" as TabKey,
      label: "Staff & Attendance",
      hindiLabel: "कर्मचारी व हाजिरी",
      icon: Users2,
      badge: null,
    },
    {
      id: "delivery" as TabKey,
      label: "Delivery & Riders",
      hindiLabel: "डिलीवरी व राइडर",
      icon: Bike,
      badge: null,
    },
    {
      id: "accounts" as TabKey,
      label: "Daily Cash Reconciliation",
      hindiLabel: "दैनिक गल्ला व हिसाब",
      icon: Wallet,
      badge: null,
    },
    {
      id: "reports" as TabKey,
      label: "Reports & Profit Analysis",
      hindiLabel: "रिपोर्ट्स व मुनाफा",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "excel" as TabKey,
      label: "Excel Database & Sync",
      hindiLabel: "एक्सेल डेटाबेस सिंक",
      icon: FileSpreadsheet,
      badge: "Sheets",
      badgeColor: "bg-green-700 text-white",
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-200 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl select-none flex-shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-amber-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg ring-2 ring-amber-400/40">
          NH
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-bold text-white text-base tracking-wide">NETAJI HOTEL</h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              ADMIN
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Katora Talab, Raipur
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Management Console
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 group text-sm ${
                isActive
                  ? "bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold shadow-md shadow-red-950/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-amber-400"
                  }`}
                />
                <div className="truncate">
                  <div className="truncate leading-tight">{item.label}</div>
                  <div
                    className={`text-[10px] leading-tight mt-0.5 ${
                      isActive ? "text-red-100" : "text-slate-400"
                    }`}
                  >
                    {item.hindiLabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      item.badgeColor || "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? "rotate-90 text-white" : "text-slate-400 group-hover:translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Store Status */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Store Live Status
          </span>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
            ONLINE
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Counter POS #01</span>
          <span>Shift: Ramesh S.</span>
        </div>
      </div>
    </aside>
  );
}
