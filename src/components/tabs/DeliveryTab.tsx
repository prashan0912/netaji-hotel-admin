"use client";

import React, { useState } from "react";
import {
  Bike,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  IndianRupee,
  ShieldCheck,
  Plus,
  Navigation,
} from "lucide-react";
import { DELIVERY_ZONES } from "../../data/adminData";

interface DeliveryTabProps {
  onUpdateZoneFee?: (zoneId: string, newFee: number) => void;
}

export default function DeliveryTab({ onUpdateZoneFee }: DeliveryTabProps) {
  const [zones, setZones] = useState(DELIVERY_ZONES);
  const [selectedRider, setSelectedRider] = useState<string>("all");

  const riders = [
    {
      id: "r-1",
      name: "Mukesh Yadav",
      phone: "+91 99071 88412",
      activeOrders: 2,
      completedToday: 14,
      status: "On Route (Shankar Nagar)",
      vehicle: "Honda Activa (CG-04-MB-4819)",
    },
    {
      id: "r-2",
      name: "Suraj Kurre",
      phone: "+91 97130 66201",
      activeOrders: 0,
      completedToday: 0,
      status: "On Leave Today",
      vehicle: "Hero Splendor (CG-04-KA-1102)",
    },
    {
      id: "r-3",
      name: "Santosh Verma (Part-Time)",
      phone: "+91 94241 55901",
      activeOrders: 1,
      completedToday: 8,
      status: "Delivering to Pandri Cloth Market",
      vehicle: "Bajaj Platina (CG-04-NZ-9022)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Raipur Local Delivery & Dispatch Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
              Thermal Sweet Bags Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure delivery zones, rates, transit lead times, and live rider assignments across Raipur.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border">
            Avg. Dispatch Time: <strong className="text-emerald-700">18 Mins</strong>
          </span>
        </div>
      </div>

      {/* Active Riders Grid */}
      <div>
        <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
          <Bike className="w-4 h-4 text-red-600" />
          <span>Delivery Partners & Fleet Status</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riders.map((r) => {
            const isBusy = r.activeOrders > 0;
            return (
              <div
                key={r.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{r.name}</h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {r.phone}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isBusy
                        ? "bg-blue-100 text-blue-800 animate-pulse"
                        : r.status.includes("Leave")
                        ? "bg-slate-100 text-slate-600"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isBusy ? "En Route" : r.status.includes("Leave") ? "Leave" : "Available"}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1">
                  <div className="text-slate-600 font-medium">
                    Vehicle: <strong className="text-slate-800">{r.vehicle}</strong>
                  </div>
                  <div className="text-slate-600 font-medium">
                    Status: <strong className="text-slate-800">{r.status}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-500">Active Deliveries: <strong>{r.activeOrders}</strong></span>
                    <span className="text-emerald-700 font-bold">Completed Today: {r.completedToday}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Raipur Delivery Zones & Fees Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Raipur City Delivery Zones & Tariffs</h3>
            <p className="text-[11px] text-slate-400">
              Orders from Katora Talab store hub are dispatched via these zone rates
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">{zones.length} Configured Localities</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Locality / Sector Name</th>
                <th className="py-3 px-3">Standard Transit Time</th>
                <th className="py-3 px-3">Delivery Fee (₹)</th>
                <th className="py-3 px-3">Special Temperature Packaging</th>
                <th className="py-3 px-4 text-right">Service Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {zones.map((zone) => (
                <tr key={zone.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>{zone.name}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">
                    ~{zone.minTimeMins} minutes
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-black text-sm ${zone.fee === 0 ? "text-emerald-600" : "text-slate-900"}`}>
                      {zone.fee === 0 ? "FREE" : `₹${zone.fee}`}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    Insulated sweet box carrier with dry ice pouch
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {zone.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
