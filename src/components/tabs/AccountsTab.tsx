"use client";

import React, { useState } from "react";
import {
  Wallet,
  IndianRupee,
  Receipt,
  Plus,
  AlertCircle,
  CheckCircle2,
  Calendar,
  CreditCard,
  QrCode,
  Building2,
} from "lucide-react";
import { CashRegister } from "../../data/adminData";

interface AccountsTabProps {
  cashRegister: CashRegister;
  onAddPettyExpense: (description: string, amount: number, receiptNo?: string) => void;
  onAddSupplierPayout: (supplier: string, amount: number, purpose: string) => void;
  onReconcileDrawer: (actualCash: number) => void;
}

export default function AccountsTab({
  cashRegister,
  onAddPettyExpense,
  onAddSupplierPayout,
  onReconcileDrawer,
}: AccountsTabProps) {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showTallyModal, setShowTallyModal] = useState(false);

  // Forms
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(250);
  const [expenseReceipt, setExpenseReceipt] = useState("");

  const [supplierName, setSupplierName] = useState("");
  const [supplierAmount, setSupplierAmount] = useState(3000);
  const [supplierPurpose, setSupplierPurpose] = useState("");

  const [actualDrawerCount, setActualDrawerCount] = useState(cashRegister.actualCashInDrawer);

  const totalPetty = cashRegister.pettyCashExpenses.reduce((s, e) => s + e.amount, 0);
  const totalSupplier = cashRegister.supplierPayouts.reduce((s, p) => s + p.amount, 0);

  // Total Expected Cash = Opening + Cash Sales - Petty Expenses - Supplier Payouts
  const expectedCash =
    cashRegister.openingCash +
    cashRegister.counterCashSales -
    totalPetty -
    totalSupplier;

  const variance = cashRegister.actualCashInDrawer - expectedCash;

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseDesc || expenseAmount <= 0) return;
    onAddPettyExpense(expenseDesc, expenseAmount, expenseReceipt);
    setShowExpenseModal(false);
    setExpenseDesc("");
  };

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName || supplierAmount <= 0) return;
    onAddSupplierPayout(supplierName, supplierAmount, supplierPurpose);
    setShowSupplierModal(false);
    setSupplierName("");
  };

  const handleTallySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReconcileDrawer(actualDrawerCount);
    setShowTallyModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Daily Cash Register & Accounts Reconciliation
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Drawer Balanced
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-of-day register tally for Katora Talab cash drawer, UPI settlements, petty expenses, and vendor payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Petty Cash Expense</span>
          </button>
          <button
            onClick={() => setShowSupplierModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Supplier Payout</span>
          </button>
          <button
            onClick={() => setShowTallyModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Tally Physical Drawer</span>
          </button>
        </div>
      </div>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Opening Morning Cash</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{cashRegister.openingCash.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Float in drawer at 06:00 AM</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-emerald-700 uppercase">Counter Cash Collected</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{cashRegister.counterCashSales.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">Direct physical cash from billing</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-blue-700 uppercase">Digital UPI & Card Collections</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            ₹{(cashRegister.upiSales + cashRegister.cardSales).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-blue-600 mt-1">
            UPI: ₹{cashRegister.upiSales} • Card: ₹{cashRegister.cardSales}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Actual Cash in Drawer</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{cashRegister.actualCashInDrawer.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] font-bold mt-1 text-emerald-600">
            {variance === 0 ? "✓ Exact 100% Match (0 Diff)" : `Diff: ₹${variance}`}
          </div>
        </div>
      </div>

      {/* Two Columns: Petty Cash Expenses & Supplier Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Petty Cash Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Petty Cash & Daily Running Expenses
              </h3>
              <p className="text-[11px] text-slate-400">Paid from cash drawer float</p>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              Total: ₹{totalPetty}
            </span>
          </div>

          <div className="space-y-2">
            {cashRegister.pettyCashExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{exp.description}</div>
                  <div className="text-[11px] text-slate-400">
                    Time: {exp.time} {exp.receiptNo && `• Receipt: ${exp.receiptNo}`}
                  </div>
                </div>
                <div className="text-sm font-extrabold text-red-600">-₹{exp.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplier Payouts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Supplier & Vendor Payments</h3>
              <p className="text-[11px] text-slate-400">Dairy, sugar mills, packaging vendors</p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
              Total: ₹{totalSupplier}
            </span>
          </div>

          <div className="space-y-2">
            {cashRegister.supplierPayouts.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{p.supplier}</div>
                  <div className="text-[11px] text-slate-400">Purpose: {p.purpose}</div>
                </div>
                <div className="text-sm font-extrabold text-slate-900">₹{p.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Petty Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-3">Record Petty Expense</h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extra mint & green chillies from Mandi"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Receipt / Voucher No. (Optional)</label>
                <input
                  type="text"
                  placeholder="VR-102"
                  value={expenseReceipt}
                  onChange={(e) => setExpenseReceipt(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold">
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Payout Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-3">Record Supplier Payment</h3>
            <form onSubmit={handleSupplierSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Supplier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baloda Bazar Milk Union"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={supplierAmount}
                  onChange={(e) => setSupplierAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Purpose / Bill Invoice</label>
                <input
                  type="text"
                  placeholder="e.g. 50 kg Khoya delivery settlement"
                  value={supplierPurpose}
                  onChange={(e) => setSupplierPurpose(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold">
                  Record Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tally Drawer Modal */}
      {showTallyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-2">Tally Cash Drawer Count</h3>
            <p className="text-xs text-slate-500 mb-3">
              Expected calculated cash: <strong>₹{expectedCash}</strong>
            </p>

            <form onSubmit={handleTallySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Physically Counted Cash in Drawer (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={actualDrawerCount}
                  onChange={(e) => setActualDrawerCount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold text-base"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTallyModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold">
                  Confirm Tally
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
