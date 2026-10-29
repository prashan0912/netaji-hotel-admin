"use client";

import React, { useState, useRef } from "react";
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  Table,
  Sparkles,
  RefreshCw,
  FileText,
  AlertCircle,
  Database,
} from "lucide-react";
import {
  RawMaterial,
  DailyProduction,
  Order,
  BulkOrder,
  Employee,
  CashRegister,
  WastageLog,
} from "../../data/adminData";
import { AdminProduct } from "../../data/products";
import { parseExcelFile } from "../../utils/excelHelper";

interface ExcelSyncTabProps {
  products: AdminProduct[];
  rawMaterials: RawMaterial[];
  dailyProduction: DailyProduction[];
  orders: Order[];
  bulkOrders: BulkOrder[];
  employees: Employee[];
  cashRegister: CashRegister;
  wastageLogs: WastageLog[];
  onExportExcel: () => void;
  onImportData?: (sheetData: Record<string, any[]>) => void;
}

export default function ExcelSyncTab({
  products,
  rawMaterials,
  dailyProduction,
  orders,
  bulkOrders,
  employees,
  cashRegister,
  wastageLogs,
  onExportExcel,
  onImportData,
}: ExcelSyncTabProps) {
  const [activeSheet, setActiveSheet] = useState<
    | "Products"
    | "Raw_Materials"
    | "Daily_Production"
    | "Orders_KDS"
    | "Bulk_Wedding_Orders"
    | "Employees_Staff"
    | "Cash_Reconciliation"
    | "Food_Wastage_Report"
  >("Products");

  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sheets = [
    { id: "Products", label: "1. Products (मिठाई व नाश्ता)", count: products.length },
    { id: "Raw_Materials", label: "2. Raw Materials (कच्चा माल)", count: rawMaterials.length },
    { id: "Daily_Production", label: "3. Daily Production (दैनिक भट्टी)", count: dailyProduction.length },
    { id: "Orders_KDS", label: "4. Orders KDS (ऑर्डर्स सूची)", count: orders.length },
    { id: "Bulk_Wedding_Orders", label: "5. Bulk Orders (शादी व पार्टी)", count: bulkOrders.length },
    { id: "Employees_Staff", label: "6. Staff & Attendance (कर्मचारी)", count: employees.length },
    { id: "Cash_Reconciliation", label: "7. Cash Register (गल्ला हिसाब)", count: 1 },
    { id: "Food_Wastage_Report", label: "8. Food Wastage (नुकसान ऑडिट)", count: wastageLogs.length },
  ] as const;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadStatus("Parsing Excel sheets with SheetJS...");
      const parsedData = await parseExcelFile(file);
      const sheetCount = Object.keys(parsedData).length;
      setUploadStatus(`Successfully parsed ${sheetCount} sheets from ${file.name}! Data synchronized.`);
      if (onImportData) {
        onImportData(parsedData);
      }
    } catch (err: any) {
      setUploadStatus(`Error parsing Excel: ${err.message || "Invalid spreadsheet"}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-emerald-950 uppercase tracking-wider">
              Excel-As-A-Database Engine
            </span>
            <span className="text-xs text-emerald-200">XLSX Multi-Sheet Synchronization</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Master Excel Database Center & Spreadsheet Viewer
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-2xl leading-relaxed">
            Since your restaurant currently operates on Excel sheets, this system is engineered with bidirectional Excel synchronization. Download the pre-structured master workbook with all necessary columns & demo rows, or upload your own spreadsheet to sync.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4 text-emerald-300" />
            <span>Upload & Sync Excel Sheet</span>
          </button>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs transition-colors shadow-md"
          >
            <Download className="w-4 h-4 text-emerald-950" />
            <span>Download Master Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {/* Sheet Tabs Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          Select Excel Sheet to View & Inspect:
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {sheets.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSheet(s.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeSheet === s.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{s.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeSheet === s.id ? "bg-slate-800 text-slate-200" : "bg-slate-200 text-slate-600"
                }`}
              >
                {s.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Spreadsheet Grid Preview Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-700" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Live Spreadsheet View: Sheet [{activeSheet}]
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Status: Synchronized with Netaji Hotel Admin State
          </span>
        </div>

        {/* Dynamic Sheet Tables */}
        <div className="overflow-x-auto max-h-[500px]">
          {activeSheet === "Products" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Product ID</th>
                  <th className="py-2.5 px-3">Dish Name</th>
                  <th className="py-2.5 px-3">Hindi Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Selling Price (₹)</th>
                  <th className="py-2.5 px-3">Display Unit</th>
                  <th className="py-2.5 px-3">Current Stock</th>
                  <th className="py-2.5 px-3">Stock Unit</th>
                  <th className="py-2.5 px-3">Available</th>
                  <th className="py-2.5 px-3">Est. Unit Cost</th>
                  <th className="py-2.5 px-3">Shelf Life</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {products.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-500">{p.id}</td>
                    <td className="py-2 px-3 font-bold font-sans text-slate-900">{p.name}</td>
                    <td className="py-2 px-3 font-sans text-slate-600">{p.hindiName}</td>
                    <td className="py-2 px-3 text-slate-600">{p.category}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">₹{p.price}</td>
                    <td className="py-2 px-3">{p.unit}</td>
                    <td className="py-2 px-3 font-bold text-emerald-700">{p.currentStock}</td>
                    <td className="py-2 px-3">{p.stockUnit}</td>
                    <td className="py-2 px-3 font-bold">{p.isAvailable ? "YES" : "NO"}</td>
                    <td className="py-2 px-3">₹{p.costEstimate}</td>
                    <td className="py-2 px-3">{p.shelfLife}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "Raw_Materials" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Item ID</th>
                  <th className="py-2.5 px-3">Material Name</th>
                  <th className="py-2.5 px-3">Hindi Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Current Stock</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Min Alert</th>
                  <th className="py-2.5 px-3">Cost Per Unit</th>
                  <th className="py-2.5 px-3">Supplier (Raipur)</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {rawMaterials.map((rm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-500">{rm.id}</td>
                    <td className="py-2 px-3 font-bold font-sans text-slate-900">{rm.name}</td>
                    <td className="py-2 px-3 font-sans text-slate-600">{rm.hindiName}</td>
                    <td className="py-2 px-3 text-slate-600">{rm.category}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{rm.currentStock}</td>
                    <td className="py-2 px-3">{rm.unit}</td>
                    <td className="py-2 px-3">{rm.minStockAlert}</td>
                    <td className="py-2 px-3 font-bold">₹{rm.costPerUnit}</td>
                    <td className="py-2 px-3 font-sans">{rm.supplierName}</td>
                    <td className="py-2 px-3">{rm.expiryDate}</td>
                    <td className="py-2 px-3 font-bold">{rm.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "Daily_Production" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Production ID</th>
                  <th className="py-2.5 px-3">Dish Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Morning Batch</th>
                  <th className="py-2.5 px-3">Afternoon Batch</th>
                  <th className="py-2.5 px-3">Total Produced</th>
                  <th className="py-2.5 px-3">Sold Today</th>
                  <th className="py-2.5 px-3">Remaining Stock</th>
                  <th className="py-2.5 px-3">Freshness</th>
                  <th className="py-2.5 px-3">Halwai In-Charge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {dailyProduction.map((dp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-500">{dp.id}</td>
                    <td className="py-2 px-3 font-bold font-sans text-slate-900">{dp.dishName}</td>
                    <td className="py-2 px-3 text-slate-600">{dp.dishCategory}</td>
                    <td className="py-2 px-3">{dp.unit}</td>
                    <td className="py-2 px-3">{dp.morningBatch}</td>
                    <td className="py-2 px-3">{dp.afternoonBatch}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{dp.totalProduced}</td>
                    <td className="py-2 px-3 font-bold text-emerald-700">{dp.totalSold}</td>
                    <td className="py-2 px-3 font-bold text-amber-700">{dp.remainingStock}</td>
                    <td className="py-2 px-3 font-sans font-bold text-emerald-700">{dp.freshnessStatus}</td>
                    <td className="py-2 px-3 font-sans">{dp.halwaiInCharge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "Orders_KDS" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Order Number</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Items Summary</th>
                  <th className="py-2.5 px-3">Total Amount</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Assigned Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {orders.map((o, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-bold text-slate-900">{o.orderNumber}</td>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{o.customerName}</td>
                    <td className="py-2 px-3">{o.customerPhone}</td>
                    <td className="py-2 px-3">{o.orderType}</td>
                    <td className="py-2 px-3 font-bold text-amber-700">{o.status}</td>
                    <td className="py-2 px-3 font-sans">
                      {o.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900">₹{o.totalAmount}</td>
                    <td className="py-2 px-3">{o.paymentMethod}</td>
                    <td className="py-2 px-3 font-sans">{o.assignedStaff || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "Bulk_Wedding_Orders" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Bulk ID</th>
                  <th className="py-2.5 px-3">Client Name</th>
                  <th className="py-2.5 px-3">Occasion</th>
                  <th className="py-2.5 px-3">Event Date</th>
                  <th className="py-2.5 px-3">Venue</th>
                  <th className="py-2.5 px-3">Total Bill</th>
                  <th className="py-2.5 px-3">Advance Paid</th>
                  <th className="py-2.5 px-3">Balance Due</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {bulkOrders.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-500">{b.id}</td>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{b.clientName}</td>
                    <td className="py-2 px-3">{b.occasion}</td>
                    <td className="py-2 px-3">{b.eventDate}</td>
                    <td className="py-2 px-3 font-sans">{b.deliveryVenue}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">₹{b.totalBill}</td>
                    <td className="py-2 px-3 font-bold text-emerald-700">₹{b.advanceReceived}</td>
                    <td className="py-2 px-3 font-bold text-amber-700">₹{b.remainingDue}</td>
                    <td className="py-2 px-3 font-sans font-bold">{b.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "Employees_Staff" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Emp ID</th>
                  <th className="py-2.5 px-3">Staff Name</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Phone</th>
                  <th className="py-2.5 px-3">Shift</th>
                  <th className="py-2.5 px-3">Monthly Salary</th>
                  <th className="py-2.5 px-3">Today Status</th>
                  <th className="py-2.5 px-3">Assigned Tasks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {employees.map((e, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-500">{e.id}</td>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{e.name}</td>
                    <td className="py-2 px-3 font-sans">{e.role}</td>
                    <td className="py-2 px-3">{e.phone}</td>
                    <td className="py-2 px-3">{e.shift}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">₹{e.monthlySalary}</td>
                    <td className="py-2 px-3 font-sans font-bold text-emerald-700">{e.todayStatus}</td>
                    <td className="py-2 px-3 font-sans">{e.tasksAssigned.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeSheet === "Cash_Reconciliation" && (
            <div className="p-6 max-w-lg space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-slate-600">Register Date:</span>
                <span className="font-bold text-slate-900">{cashRegister.date}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-slate-600">Opening Morning Float:</span>
                <span className="font-bold text-slate-900">₹{cashRegister.openingCash}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-slate-600">Counter Cash Sales:</span>
                <span className="font-bold text-emerald-700">₹{cashRegister.counterCashSales}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-slate-600">UPI PhonePe / GPay Sales:</span>
                <span className="font-bold text-blue-700">₹{cashRegister.upiSales}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-slate-600">Actual Counted Cash:</span>
                <span className="font-bold text-slate-900">₹{cashRegister.actualCashInDrawer}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span className="text-slate-600">Drawer Difference:</span>
                <span className="font-bold text-emerald-600">₹{cashRegister.difference} (Exact Match)</span>
              </div>
            </div>
          )}

          {activeSheet === "Food_Wastage_Report" && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Wastage ID</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Quantity</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Est. Loss (₹)</th>
                  <th className="py-2.5 px-3">Reported By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {wastageLogs.map((w, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-500">{w.id}</td>
                    <td className="py-2 px-3">{w.date}</td>
                    <td className="py-2 px-3 font-sans font-bold text-slate-900">{w.itemName}</td>
                    <td className="py-2 px-3 font-sans">{w.category}</td>
                    <td className="py-2 px-3 font-bold">{w.quantity}</td>
                    <td className="py-2 px-3 text-rose-600">{w.reason}</td>
                    <td className="py-2 px-3 font-bold text-rose-600">₹{w.estimatedLoss}</td>
                    <td className="py-2 px-3 font-sans">{w.reportedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
