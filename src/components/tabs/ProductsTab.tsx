"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Scale,
  Sparkles,
  Search,
} from "lucide-react";
import { AdminProduct, CATEGORIES } from "../../data/products";

interface ProductsTabProps {
  products: AdminProduct[];
  onToggleAvailability: (productId: string) => void;
  onUpdateProduct: (product: AdminProduct) => void;
  onAddProduct: (product: AdminProduct) => void;
}

export default function ProductsTab({
  products,
  onToggleAvailability,
  onUpdateProduct,
  onAddProduct,
}: ProductsTabProps) {
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [name, setName] = useState("");
  const [hindiName, setHindiName] = useState("");
  const [category, setCategory] = useState<AdminProduct["category"]>("bengali-sweets");
  const [price, setPrice] = useState(380);
  const [unit, setUnit] = useState("per kg");
  const [stockUnit, setStockUnit] = useState<AdminProduct["stockUnit"]>("kg");
  const [currentStock, setCurrentStock] = useState(10);
  const [shelfLife, setShelfLife] = useState("24 hours");
  const [costEstimate, setCostEstimate] = useState(190);

  const filteredProducts = products.filter((p) => {
    if (selectedCat !== "all" && p.category !== selectedCat) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.hindiName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: AdminProduct = {
      id: `prod-${Date.now()}`,
      name,
      hindiName,
      category,
      price,
      unit,
      stockUnit,
      currentStock,
      isVeg: true,
      isAvailable: currentStock > 0,
      prepTimeMinutes: 20,
      shelfLife,
      costEstimate,
    };
    onAddProduct(newP);
    setShowAddModal(false);
    setName("");
    setHindiName("");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900">
              Menu & Product Catalogue Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Customer App Linked
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage sweets, samosas, gift boxes, per kg/piece pricing, and 1-click Sold Out availability toggles.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish / Sweet</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                selectedCat === c.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sweets or snacks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => {
          const margin = Math.round(((p.price - p.costEstimate) / p.price) * 100);
          return (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                p.isAvailable ? "border-slate-200 hover:shadow-md" : "border-red-200 bg-red-50/20"
              }`}
            >
              <div>
                <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border-2 border-emerald-600 flex items-center justify-center p-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{p.name}</h4>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{p.hindiName}</div>
                  </div>

                  {p.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Pricing & Stock Details */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs mb-3">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Selling Price</span>
                    <span className="text-base font-extrabold text-slate-900">₹{p.price}</span>{" "}
                    <span className="text-[10px] text-slate-500">/{p.unit.replace("per ", "")}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Stock</span>
                    <span className={`text-base font-black ${p.currentStock <= 0 ? "text-red-600" : "text-emerald-700"}`}>
                      {p.currentStock} {p.stockUnit}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Cost & Margin</span>
                    <span className="text-slate-700 font-semibold">₹{p.costEstimate} ({margin}%)</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Shelf Life</span>
                    <span className="text-slate-700 font-semibold">{p.shelfLife}</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <button
                  onClick={() => onToggleAvailability(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    p.isAvailable
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  {p.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{p.isAvailable ? "Available in Store" : "Sold Out"}</span>
                </button>

                <button
                  onClick={() => setEditingProduct(p)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-bold flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Add New Dish / Sweet Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dish Name (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malai Chum Chum"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hindi Name (हिंदी नाम)</label>
                <input
                  type="text"
                  placeholder="मलाई चमचम"
                  value={hindiName}
                  onChange={(e) => setHindiName(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="snacks-chaat">Snacks & Chaat</option>
                    <option value="bengali-sweets">Bengali Sweets</option>
                    <option value="kaju-dryfruit">Cashew & Dry Fruits</option>
                    <option value="gift-boxes">Sweet Gift Boxes</option>
                    <option value="beverages">Lassi & Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="per kg">per kg (किलो)</option>
                    <option value="per piece">per piece (पीस)</option>
                    <option value="per plate">per plate (प्लेट)</option>
                    <option value="per box">per box (डिब्बा)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shelf Life</label>
                  <input
                    type="text"
                    value={shelfLife}
                    onChange={(e) => setShelfLife(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Est. Recipe Cost (₹)</label>
                  <input
                    type="number"
                    value={costEstimate}
                    onChange={(e) => setCostEstimate(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
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
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-sm"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Edit {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Level</label>
                  <input
                    type="number"
                    value={editingProduct.currentStock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        currentStock: Number(e.target.value),
                        isAvailable: Number(e.target.value) > 0,
                      })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shelf Life</label>
                <input
                  type="text"
                  value={editingProduct.shelfLife}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shelfLife: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
