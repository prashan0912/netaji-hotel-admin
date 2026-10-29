"use client";

import React, { useState } from "react";
import Sidebar, { TabKey } from "../components/Sidebar";
import Header from "../components/Header";
import DashboardTab from "../components/tabs/DashboardTab";
import OrdersTab from "../components/tabs/OrdersTab";
import InventoryTab from "../components/tabs/InventoryTab";
import RecipesTab from "../components/tabs/RecipesTab";
import ProductionTab from "../components/tabs/ProductionTab";
import BulkOrdersTab from "../components/tabs/BulkOrdersTab";
import ProductsTab from "../components/tabs/ProductsTab";
import EmployeesTab from "../components/tabs/EmployeesTab";
import DeliveryTab from "../components/tabs/DeliveryTab";
import AccountsTab from "../components/tabs/AccountsTab";
import ReportsTab from "../components/tabs/ReportsTab";
import ExcelSyncTab from "../components/tabs/ExcelSyncTab";

import {
  INITIAL_RAW_MATERIALS,
  INITIAL_RECIPES,
  INITIAL_DAILY_PRODUCTION,
  INITIAL_ORDERS,
  INITIAL_BULK_ORDERS,
  INITIAL_EMPLOYEES,
  INITIAL_CASH_REGISTER,
  INITIAL_WASTAGE_LOGS,
  Order,
  OrderStatus,
  RawMaterial,
  DailyProduction,
  BulkOrder,
  Employee,
  CashRegister,
  WastageLog,
} from "../data/adminData";

import { INITIAL_PRODUCTS, AdminProduct } from "../data/products";
import { exportFullDatabaseToExcel } from "../utils/excelHelper";

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState<TabKey>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Live Application States
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_PRODUCTS);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(INITIAL_RAW_MATERIALS);
  const [dailyProduction, setDailyProduction] = useState<DailyProduction[]>(INITIAL_DAILY_PRODUCTION);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [bulkOrders, setBulkOrders] = useState<BulkOrder[]>(INITIAL_BULK_ORDERS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [cashRegister, setCashRegister] = useState<CashRegister>(INITIAL_CASH_REGISTER);
  const [wastageLogs, setWastageLogs] = useState<WastageLog[]>(INITIAL_WASTAGE_LOGS);
  const [recipes] = useState(INITIAL_RECIPES);

  // Computed Badge Counts
  const activeOrdersCount = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length;
  const lowStockCount = rawMaterials.filter((rm) => rm.currentStock <= rm.minStockAlert).length;
  const pendingBulkCount = bulkOrders.filter((b) => b.status === "Confirmed" || b.status === "In Production").length;

  // Handlers for Live Interactivity
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleAssignStaff = (orderId: string, staffName: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, assignedStaff: staffName } : o))
    );
  };

  const handleCreateOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleAddStock = (
    materialId: string,
    addedQty: number,
    invoiceCost: number,
    supplier: string
  ) => {
    setRawMaterials((prev) =>
      prev.map((rm) => {
        if (rm.id === materialId) {
          const newStock = rm.currentStock + addedQty;
          return {
            ...rm,
            currentStock: newStock,
            status: newStock <= rm.minStockAlert ? "low_stock" : "in_stock",
            lastPurchaseDate: new Date().toISOString().split("T")[0],
            supplierName: supplier,
          };
        }
        return rm;
      })
    );
  };

  const handleLogWastage = (newWastage: WastageLog) => {
    setWastageLogs((prev) => [newWastage, ...prev]);
  };

  const handleAddProductionBatch = (newBatch: DailyProduction) => {
    setDailyProduction((prev) => [newBatch, ...prev]);
  };

  const handleAddBulkOrder = (newBulk: BulkOrder) => {
    setBulkOrders((prev) => [newBulk, ...prev]);
  };

  const handleUpdateBulkStatus = (orderId: string, status: BulkOrder["status"]) => {
    setBulkOrders((prev) =>
      prev.map((b) => (b.id === orderId ? { ...b, status } : b))
    );
  };

  const handleCollectBulkPayment = (orderId: string, amount: number) => {
    setBulkOrders((prev) =>
      prev.map((b) => {
        if (b.id === orderId) {
          const advance = b.advanceReceived + amount;
          return {
            ...b,
            advanceReceived: advance,
            remainingDue: Math.max(0, b.totalBill - advance),
          };
        }
        return b;
      })
    );
  };

  const handleToggleProductAvailability = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
      )
    );
  };

  const handleUpdateProduct = (updated: AdminProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleAddProduct = (newProd: AdminProduct) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateAttendance = (empId: string, status: Employee["todayStatus"]) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, todayStatus: status } : e))
    );
  };

  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [...prev, newEmp]);
  };

  const handleAddPettyExpense = (description: string, amount: number, receiptNo?: string) => {
    const newExp = {
      id: `pce-${Date.now()}`,
      description,
      amount,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      receiptNo,
    };
    setCashRegister((prev) => ({
      ...prev,
      pettyCashExpenses: [newExp, ...prev.pettyCashExpenses],
      expectedCashInDrawer: prev.expectedCashInDrawer - amount,
    }));
  };

  const handleAddSupplierPayout = (supplier: string, amount: number, purpose: string) => {
    const newPayout = {
      id: `sp-${Date.now()}`,
      supplier,
      amount,
      purpose,
    };
    setCashRegister((prev) => ({
      ...prev,
      supplierPayouts: [newPayout, ...prev.supplierPayouts],
      expectedCashInDrawer: prev.expectedCashInDrawer - amount,
    }));
  };

  const handleReconcileDrawer = (actualCash: number) => {
    setCashRegister((prev) => ({
      ...prev,
      actualCashInDrawer: actualCash,
      difference: actualCash - prev.expectedCashInDrawer,
    }));
  };

  const handleExportMasterExcel = () => {
    exportFullDatabaseToExcel({
      products,
      rawMaterials,
      recipes,
      dailyProduction,
      orders,
      bulkOrders,
      employees,
      cashRegister,
      wastageLogs,
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeOrdersCount={activeOrdersCount}
        lowStockCount={lowStockCount}
        pendingBulkCount={pendingBulkCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onExportMasterExcel={handleExportMasterExcel}
          activeOrdersCount={activeOrdersCount}
          lowStockCount={lowStockCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="p-6 md:p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {currentTab === "dashboard" && (
            <DashboardTab
              orders={orders}
              products={products}
              rawMaterials={rawMaterials}
              dailyProduction={dailyProduction}
              bulkOrders={bulkOrders}
              cashRegister={cashRegister}
              onNavigateTab={setCurrentTab}
              onExportExcel={handleExportMasterExcel}
            />
          )}

          {currentTab === "orders" && (
            <OrdersTab
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onAssignStaff={handleAssignStaff}
              onCreateOrder={handleCreateOrder}
            />
          )}

          {currentTab === "inventory" && (
            <InventoryTab
              rawMaterials={rawMaterials}
              wastageLogs={wastageLogs}
              onAddStock={handleAddStock}
              onLogWastage={handleLogWastage}
            />
          )}

          {currentTab === "recipes" && (
            <RecipesTab recipes={recipes} rawMaterials={rawMaterials} />
          )}

          {currentTab === "production" && (
            <ProductionTab
              productionLogs={dailyProduction}
              onAddProductionBatch={handleAddProductionBatch}
              onToggleAvailability={handleToggleProductAvailability}
            />
          )}

          {currentTab === "bulk" && (
            <BulkOrdersTab
              bulkOrders={bulkOrders}
              onAddBulkOrder={handleAddBulkOrder}
              onUpdateStatus={handleUpdateBulkStatus}
              onCollectPayment={handleCollectBulkPayment}
            />
          )}

          {currentTab === "products" && (
            <ProductsTab
              products={products}
              onToggleAvailability={handleToggleProductAvailability}
              onUpdateProduct={handleUpdateProduct}
              onAddProduct={handleAddProduct}
            />
          )}

          {currentTab === "employees" && (
            <EmployeesTab
              employees={employees}
              onUpdateAttendance={handleUpdateAttendance}
              onAddEmployee={handleAddEmployee}
            />
          )}

          {currentTab === "delivery" && <DeliveryTab />}

          {currentTab === "accounts" && (
            <AccountsTab
              cashRegister={cashRegister}
              onAddPettyExpense={handleAddPettyExpense}
              onAddSupplierPayout={handleAddSupplierPayout}
              onReconcileDrawer={handleReconcileDrawer}
            />
          )}

          {currentTab === "reports" && (
            <ReportsTab
              orders={orders}
              products={products}
              wastageLogs={wastageLogs}
              cashRegister={cashRegister}
              onExportExcel={handleExportMasterExcel}
            />
          )}

          {currentTab === "excel" && (
            <ExcelSyncTab
              products={products}
              rawMaterials={rawMaterials}
              dailyProduction={dailyProduction}
              orders={orders}
              bulkOrders={bulkOrders}
              employees={employees}
              cashRegister={cashRegister}
              wastageLogs={wastageLogs}
              onExportExcel={handleExportMasterExcel}
            />
          )}
        </main>
      </div>
    </div>
  );
}
