"use client";

import React, { useState } from "react";
import {
  Utensils,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChefHat,
  Filter,
  Plus,
  Bike,
  Store,
  CalendarCheck2,
  Search,
  Timer,
  UserCheck,
  XCircle,
} from "lucide-react";
import { Order, OrderStatus, OrderType, OrderItem } from "../../data/adminData";

interface OrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAssignStaff: (orderId: string, staffName: string) => void;
  onCreateOrder: (newOrder: Order) => void;
}

export default function OrdersTab({
  orders,
  onUpdateOrderStatus,
  onAssignStaff,
  onCreateOrder,
}: OrdersTabProps) {
  const [activeTabFilter, setActiveTabFilter] = useState<"all" | OrderStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | OrderType>("all");
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // New order form state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("counter");
  const [selectedDish, setSelectedDish] = useState("Famous Raipur Aloo Samosa");
  const [itemQty, setItemQty] = useState(4);
  const [paymentMode, setPaymentMode] = useState<"Cash" | "UPI (PhonePe/GPay)">("UPI (PhonePe/GPay)");
  const [specialNote, setSpecialNote] = useState("");

  const staffOptions = [
    "Sunil Sahu (Snack Cook)",
    "Ramesh Sharma (Head Halwai)",
    "Dinanath Maharaj (Sweets Chef)",
    "Raju Nishad (Packaging)",
    "Mukesh Yadav (Delivery)",
  ];

  const filteredOrders = orders.filter((o) => {
    if (activeTabFilter !== "all" && o.status !== activeTabFilter) return false;
    if (typeFilter !== "all" && o.orderType !== typeFilter) return false;
    return true;
  });

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "new":
        return "bg-amber-100 text-amber-800 border-amber-300 animate-pulse";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "ready":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "completed":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  const handleCreateNewOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return;

    const unitPrice = selectedDish.includes("Samosa") ? 18 : selectedDish.includes("Jalebi") ? 380 : 65;
    const items: OrderItem[] = [
      {
        productId: "custom-p1",
        name: selectedDish,
        quantity: itemQty,
        unit: selectedDish.includes("Jalebi") ? "kg" : "pieces",
        unitPrice: unitPrice,
        totalPrice: unitPrice * itemQty,
      },
    ];

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `NH-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      customerPhone: customerPhone || "+91 98000 00000",
      customerAddress: orderType === "counter" ? "Counter Takeaway" : "Raipur City",
      orderType,
      status: "new",
      items,
      subtotal: unitPrice * itemQty,
      deliveryCharge: orderType === "online" ? 30 : 0,
      discount: 0,
      totalAmount: unitPrice * itemQty + (orderType === "online" ? 30 : 0),
      paymentStatus: paymentMode === "Cash" ? "paid_cash" : "paid_upi",
      paymentMethod: paymentMode,
      createdAt: new Date().toISOString(),
      estimatedPrepMinutes: 15,
      assignedStaff: "Sunil Sahu (Snack Cook)",
      notes: specialNote,
    };

    onCreateOrder(newOrder);
    setShowNewOrderModal(false);
    setCustomerName("");
    setCustomerPhone("");
    setSpecialNote("");
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Counter Order Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Kitchen Display System (KDS) & Order Pipeline
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
              Live Raipur Kitchen
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track order lifecycle from fryer & kadai to packaging and table/delivery handoff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewOrderModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Counter / Phone Order</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-xl text-xs">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: "all", label: "All Orders", count: orders.length },
            { id: "new", label: "New (नया)", count: orders.filter((o) => o.status === "new").length },
            { id: "accepted", label: "Accepted (स्वीकृत)", count: orders.filter((o) => o.status === "accepted").length },
            { id: "preparing", label: "Preparing (कढ़ाई/किचन)", count: orders.filter((o) => o.status === "preparing").length },
            { id: "ready", label: "Ready (तैयार)", count: orders.filter((o) => o.status === "ready").length },
            { id: "completed", label: "Completed (सम्पन्न)", count: orders.filter((o) => o.status === "completed").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTabFilter === tab.id
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTabFilter === tab.id ? "bg-red-100 text-red-700" : "bg-slate-200 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Channel Filters */}
        <div className="flex items-center gap-1 border-l border-slate-300 pl-3">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
              typeFilter === "all" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Channels
          </button>
          <button
            onClick={() => setTypeFilter("counter")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 ${
              typeFilter === "counter" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Store className="w-3 h-3" /> Counter
          </button>
          <button
            onClick={() => setTypeFilter("online")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 ${
              typeFilter === "online" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Bike className="w-3 h-3" /> Online
          </button>
          <button
            onClick={() => setTypeFilter("bulk_catering")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 ${
              typeFilter === "bulk_catering" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <CalendarCheck2 className="w-3 h-3" /> Bulk
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrders.map((order) => {
          const isDelayed = order.isDelayed || false;
          return (
            <div
              key={order.id}
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-xs transition-all hover:shadow-md ${
                order.status === "new"
                  ? "border-amber-300 ring-2 ring-amber-100"
                  : order.status === "preparing"
                  ? "border-orange-300"
                  : "border-slate-200"
              }`}
            >
              <div>
                {/* Order Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm tracking-wide">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1">
                    {order.orderType === "counter" ? (
                      <Store className="w-3 h-3 text-amber-600" />
                    ) : order.orderType === "online" ? (
                      <Bike className="w-3 h-3 text-blue-600" />
                    ) : (
                      <CalendarCheck2 className="w-3 h-3 text-purple-600" />
                    )}
                    <span className="capitalize">{order.orderType}</span>
                  </span>
                </div>

                {/* Customer Details */}
                <div className="mb-3">
                  <div className="text-xs font-bold text-slate-900">{order.customerName}</div>
                  <div className="text-[11px] text-slate-500">{order.customerPhone}</div>
                  {order.customerAddress && (
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      📍 {order.customerAddress}
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 mb-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Dishes & Quantities
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span>{item.name}</span>
                        {item.variant && (
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-1 rounded">
                            {item.variant}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-slate-900">
                        {item.quantity} {item.unit}
                      </div>
                    </div>
                  ))}
                  {order.notes && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200/60 mt-1">
                      ⚠️ <span className="font-semibold">Note:</span> {order.notes}
                    </div>
                  )}
                </div>

                {/* Staff Assignment & Countdown */}
                <div className="space-y-2 text-xs mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <ChefHat className="w-3.5 h-3.5 text-slate-400" /> In-Charge:
                    </span>
                    <select
                      value={order.assignedStaff || ""}
                      onChange={(e) => onAssignStaff(order.id, e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-none"
                    >
                      <option value="">Select Staff...</option>
                      {staffOptions.map((st, i) => (
                        <option key={i} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5 text-slate-400" /> Est. Prep:
                    </span>
                    <span className="font-bold text-slate-800">{order.estimatedPrepMinutes} mins</span>
                  </div>
                </div>
              </div>

              {/* Order Total & Status Transition Buttons */}
              <div className="border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-semibold text-slate-500">Total Bill</span>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-slate-900">
                      ₹{order.totalAmount}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {order.paymentMethod} • <span className="text-emerald-600 font-bold">{order.paymentStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5">
                  {order.status === "new" && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, "accepted")}
                      className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                    >
                      Accept Order (स्वीकार करें)
                    </button>
                  )}

                  {order.status === "accepted" && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, "preparing")}
                      className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors"
                    >
                      Start Cooking (कढ़ाई चालू करें)
                    </button>
                  )}

                  {order.status === "preparing" && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, "ready")}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                    >
                      Mark Ready (तैयार है)
                    </button>
                  )}

                  {order.status === "ready" && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, "completed")}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors"
                    >
                      Handover / Complete (सम्पन्न)
                    </button>
                  )}

                  {order.status !== "completed" && order.status !== "cancelled" && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, "cancelled")}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                      title="Cancel order"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">
                Create Counter / Takeaway Order
              </h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewOrderSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Agrawal"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98260..."
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Order Channel</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="counter">Counter Takeaway</option>
                    <option value="online">Online Delivery</option>
                    <option value="bulk_catering">Bulk Catering</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Select Item</label>
                  <select
                    value={selectedDish}
                    onChange={(e) => setSelectedDish(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="Famous Raipur Aloo Samosa">Famous Raipur Aloo Samosa (₹18)</option>
                    <option value="Pure Desi Ghee Jalebi">Pure Desi Ghee Jalebi (₹380/kg)</option>
                    <option value="Netaji Special Dahi Bada">Netaji Special Dahi Bada (₹65)</option>
                    <option value="Khasta Pyaaz Kachori">Khasta Pyaaz Kachori (₹22)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={itemQty}
                    onChange={(e) => setItemQty(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Mode</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymode"
                      checked={paymentMode === "UPI (PhonePe/GPay)"}
                      onChange={() => setPaymentMode("UPI (PhonePe/GPay)")}
                    />
                    <span>UPI (PhonePe/GPay)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="paymode"
                      checked={paymentMode === "Cash"}
                      onChange={() => setPaymentMode("Cash")}
                    />
                    <span>Cash Counter</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kitchen / Packing Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Extra meethi chutney, warm packing"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
