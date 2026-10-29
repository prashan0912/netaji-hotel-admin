"use client";

import React, { useState } from "react";
import {
  CalendarCheck2,
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Plus,
  CheckCircle2,
  Package,
  Gift,
  Phone,
  Filter,
  User,
} from "lucide-react";
import { BulkOrder } from "../../data/adminData";

interface BulkOrdersTabProps {
  bulkOrders: BulkOrder[];
  onAddBulkOrder: (newOrder: BulkOrder) => void;
  onUpdateStatus: (orderId: string, status: BulkOrder["status"]) => void;
  onCollectPayment: (orderId: string, amount: number) => void;
}

export default function BulkOrdersTab({
  bulkOrders,
  onAddBulkOrder,
  onUpdateStatus,
  onCollectPayment,
}: BulkOrdersTabProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [paymentModalOrder, setPaymentModalOrder] = useState<BulkOrder | null>(null);
  const [collectionAmount, setCollectionAmount] = useState<number>(0);

  // New Bulk Order Form
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [occasion, setOccasion] = useState<BulkOrder["occasion"]>("Wedding");
  const [eventDate, setEventDate] = useState("2026-11-15");
  const [eventTime, setEventTime] = useState("07:00 PM");
  const [deliveryVenue, setDeliveryVenue] = useState("");
  const [area, setArea] = useState("VIP Road");
  const [itemsSummary, setItemsSummary] = useState("");
  const [totalBill, setTotalBill] = useState(25000);
  const [advanceReceived, setAdvanceReceived] = useState(10000);
  const [specialPackaging, setSpecialPackaging] = useState(true);
  const [notes, setNotes] = useState("");

  const filteredOrders = bulkOrders.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    return true;
  });

  const totalBulkRevenue = bulkOrders.reduce((sum, b) => sum + b.totalBill, 0);
  const totalAdvanceCollected = bulkOrders.reduce((sum, b) => sum + b.advanceReceived, 0);
  const totalOutstandingDue = bulkOrders.reduce((sum, b) => sum + b.remainingDue, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;

    const newBulk: BulkOrder = {
      id: `bulk-${Date.now()}`,
      clientName,
      phone,
      occasion,
      eventDate,
      eventTime,
      deliveryVenue: deliveryVenue || "Raipur Venue",
      area,
      itemsSummary,
      totalBill,
      advanceReceived,
      remainingDue: Math.max(0, totalBill - advanceReceived),
      status: "Confirmed",
      specialPackaging,
      notes,
    };

    onAddBulkOrder(newBulk);
    setShowAddModal(false);
    setClientName("");
    setItemsSummary("");
    setNotes("");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalOrder || collectionAmount <= 0) return;
    onCollectPayment(paymentModalOrder.id, collectionAmount);
    setPaymentModalOrder(null);
    setCollectionAmount(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Bulk, Wedding & Party Catering Orders
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
              High-Ticket Management
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track large quantity sweet boxes, advance tokens, delivery venues across Raipur and remaining balance payments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Book Wedding / Bulk Order</span>
        </button>
      </div>

      {/* Financial Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Bulk Pipeline</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{totalBulkRevenue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{bulkOrders.length} confirmed event contracts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-emerald-700 uppercase">Advance Received</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ₹{totalAdvanceCollected.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">Deposited to bank / cash counter</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-amber-700 uppercase">Remaining Balance Due</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            ₹{totalOutstandingDue.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">Due upon venue delivery & handoff</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl text-xs w-fit">
        {["all", "Inquiry", "Confirmed", "In Production", "Ready", "Delivered"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === st ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {st === "all" ? "All Bookings" : st}
          </button>
        ))}
      </div>

      {/* Bulk Orders List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOrders.map((order) => {
          const isFullyPaid = order.remainingDue <= 0;
          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-base">
                        {order.clientName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {order.occasion}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {order.phone}
                      </span>
                    </div>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as any)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
                  >
                    <option value="Inquiry">Inquiry</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Production">In Production</option>
                    <option value="Ready">Ready</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Event Schedule & Delivery Venue */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs mb-3">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1.5 text-red-700">
                      <Calendar className="w-3.5 h-3.5" /> Date: {order.eventDate}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5" /> Time: {order.eventTime}
                    </span>
                  </div>
                  <div className="text-slate-600 flex items-start gap-1.5 pt-1 border-t border-slate-200/60">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{order.deliveryVenue} ({order.area})</span>
                  </div>
                </div>

                {/* Items & Special Packaging */}
                <div className="space-y-1.5 text-xs mb-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Ordered Sweets & Catering Items
                  </div>
                  <div className="font-semibold text-slate-800 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                    {order.itemsSummary}
                  </div>
                  {order.specialPackaging && (
                    <div className="flex items-center gap-1 text-[11px] text-purple-700 font-semibold">
                      <Gift className="w-3.5 h-3.5" /> Designer Gift Packaging Included
                    </div>
                  )}
                  {order.notes && (
                    <div className="text-[11px] text-slate-500 italic">
                      Note: {order.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Breakdown & Balance Settlement */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center mb-3 text-xs">
                  <div>
                    <div className="text-slate-500">Total Contract Value</div>
                    <div className="text-base font-extrabold text-slate-900">
                      ₹{order.totalBill.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-slate-500">Advance Paid</div>
                    <div className="font-bold text-emerald-600">
                      ₹{order.advanceReceived.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-slate-500">Balance Due</div>
                    <div className={`font-black text-sm ${isFullyPaid ? "text-emerald-600" : "text-amber-600"}`}>
                      {isFullyPaid ? "Settled (₹0)" : `₹${order.remainingDue.toLocaleString("en-IN")}`}
                    </div>
                  </div>
                </div>

                {!isFullyPaid && (
                  <button
                    onClick={() => {
                      setPaymentModalOrder(order);
                      setCollectionAmount(order.remainingDue);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Collect Remaining Payment</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Book New Bulk Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Book Wedding & Party Bulk Order
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Dewangan"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Occasion</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Pooja/Ceremony">Pooja / Ceremony</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Catering">Catering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivery Time</label>
                  <input
                    type="text"
                    placeholder="06:30 PM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Delivery Venue / Bhawan</label>
                  <input
                    type="text"
                    required
                    placeholder="Sayaji Banquet, Agrasen Dham..."
                    value={deliveryVenue}
                    onChange={(e) => setDeliveryVenue(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Raipur Area</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ordered Items & Quantities Summary
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. 50 kg Motichoor Ladoo, 30 kg Kaju Katli, 300 Pcs Samosa..."
                  value={itemsSummary}
                  onChange={(e) => setItemsSummary(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Contract Bill (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={totalBill}
                    onChange={(e) => setTotalBill(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Advance Token (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={advanceReceived}
                    onChange={(e) => setAdvanceReceived(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="specialpack"
                  checked={specialPackaging}
                  onChange={(e) => setSpecialPackaging(e.target.checked)}
                />
                <label htmlFor="specialpack" className="text-slate-700 font-semibold cursor-pointer">
                  Includes Designer Wedding Sweet Packaging Boxes
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-sm"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      {paymentModalOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 mb-2">
              Collect Remaining Payment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Client: <strong>{paymentModalOrder.clientName}</strong> • Total Due: ₹
              {paymentModalOrder.remainingDue}
            </p>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount to Collect (₹)</label>
                <input
                  type="number"
                  max={paymentModalOrder.remainingDue}
                  min="1"
                  required
                  value={collectionAmount}
                  onChange={(e) => setCollectionAmount(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOrder(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
