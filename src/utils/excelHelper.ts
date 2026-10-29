import * as XLSX from "xlsx";
import {
  RawMaterial,
  Recipe,
  DailyProduction,
  Order,
  BulkOrder,
  Employee,
  CashRegister,
  WastageLog,
} from "../data/adminData";
import { AdminProduct } from "../data/products";

export function exportFullDatabaseToExcel(data: {
  products: AdminProduct[];
  rawMaterials: RawMaterial[];
  recipes: Recipe[];
  dailyProduction: DailyProduction[];
  orders: Order[];
  bulkOrders: BulkOrder[];
  employees: Employee[];
  cashRegister: CashRegister;
  wastageLogs: WastageLog[];
}) {
  const wb = XLSX.utils.book_new();

  // 1. Products Sheet
  const productsSheetData = data.products.map((p) => ({
    "Product ID": p.id,
    "Dish Name": p.name,
    "Hindi Name": p.hindiName,
    Category: p.category,
    "Selling Price (INR)": p.price,
    Unit: p.unit,
    "Current Stock": p.currentStock,
    "Stock Unit": p.stockUnit,
    Available: p.isAvailable ? "YES" : "NO",
    "Est. Unit Cost": p.costEstimate,
    "Shelf Life": p.shelfLife,
  }));
  const wsProducts = XLSX.utils.json_to_sheet(productsSheetData);
  XLSX.utils.book_append_sheet(wb, wsProducts, "Products");

  // 2. Raw Materials Sheet
  const rawMatSheetData = data.rawMaterials.map((rm) => ({
    "Item ID": rm.id,
    "Material Name": rm.name,
    "Hindi Name": rm.hindiName,
    Category: rm.category,
    "Current Stock": rm.currentStock,
    Unit: rm.unit,
    "Min Alert Level": rm.minStockAlert,
    "Cost Per Unit (INR)": rm.costPerUnit,
    "Last Purchase Date": rm.lastPurchaseDate,
    Supplier: rm.supplierName,
    "Expiry Date": rm.expiryDate,
    Status: rm.status,
  }));
  const wsRawMat = XLSX.utils.json_to_sheet(rawMatSheetData);
  XLSX.utils.book_append_sheet(wb, wsRawMat, "Raw_Materials");

  // 3. Daily Production & Freshness Sheet
  const prodSheetData = data.dailyProduction.map((dp) => ({
    "Production ID": dp.id,
    "Dish Name": dp.dishName,
    Category: dp.dishCategory,
    Unit: dp.unit,
    "Morning Batch": dp.morningBatch,
    "Afternoon Batch": dp.afternoonBatch,
    "Total Produced": dp.totalProduced,
    "Total Sold": dp.totalSold,
    "Remaining Stock": dp.remainingStock,
    Wastage: dp.wastedQuantity,
    "Prep Date": dp.preparationDate,
    "Prep Time": dp.prepTime,
    "Shelf Life Until": dp.expiryTime,
    Freshness: dp.freshnessStatus,
    "Halwai In-Charge": dp.halwaiInCharge,
  }));
  const wsProd = XLSX.utils.json_to_sheet(prodSheetData);
  XLSX.utils.book_append_sheet(wb, wsProd, "Daily_Production");

  // 4. Orders Sheet
  const ordersSheetData = data.orders.map((o) => ({
    "Order #": o.orderNumber,
    Customer: o.customerName,
    Phone: o.customerPhone,
    Type: o.orderType,
    Status: o.status,
    Items: o.items.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join("; "),
    "Subtotal (INR)": o.subtotal,
    "Discount (INR)": o.discount,
    "Delivery Fee": o.deliveryCharge,
    "Total Amount": o.totalAmount,
    "Payment Mode": o.paymentMethod,
    "Payment Status": o.paymentStatus,
    "Created Time": o.createdAt,
    "Assigned Staff": o.assignedStaff || "Unassigned",
  }));
  const wsOrders = XLSX.utils.json_to_sheet(ordersSheetData);
  XLSX.utils.book_append_sheet(wb, wsOrders, "Orders_KDS");

  // 5. Bulk & Wedding Orders Sheet
  const bulkSheetData = data.bulkOrders.map((bo) => ({
    "Bulk Order ID": bo.id,
    Client: bo.clientName,
    Phone: bo.phone,
    Occasion: bo.occasion,
    "Event Date": bo.eventDate,
    "Event Time": bo.eventTime,
    Venue: bo.deliveryVenue,
    Area: bo.area,
    Items: bo.itemsSummary,
    "Total Bill (INR)": bo.totalBill,
    "Advance Received": bo.advanceReceived,
    "Remaining Balance": bo.remainingDue,
    Status: bo.status,
    "Special Pack": bo.specialPackaging ? "YES" : "NO",
  }));
  const wsBulk = XLSX.utils.json_to_sheet(bulkSheetData);
  XLSX.utils.book_append_sheet(wb, wsBulk, "Bulk_Wedding_Orders");

  // 6. Employees & Attendance Sheet
  const empSheetData = data.employees.map((e) => ({
    "Emp ID": e.id,
    Name: e.name,
    Role: e.role,
    Phone: e.phone,
    Shift: e.shift,
    "Monthly Salary (INR)": e.monthlySalary,
    "Today Attendance": e.todayStatus,
    "Score (%)": e.performanceScore,
    Tasks: e.tasksAssigned.join(", "),
  }));
  const wsEmp = XLSX.utils.json_to_sheet(empSheetData);
  XLSX.utils.book_append_sheet(wb, wsEmp, "Employees_Staff");

  // 7. Wastage & Loss Report Sheet
  const wastageSheetData = data.wastageLogs.map((w) => ({
    "Wastage ID": w.id,
    Date: w.date,
    Item: w.itemName,
    Category: w.category,
    Quantity: w.quantity,
    Reason: w.reason,
    "Estimated Loss (INR)": w.estimatedLoss,
    "Reported By": w.reportedBy,
  }));
  const wsWastage = XLSX.utils.json_to_sheet(wastageSheetData);
  XLSX.utils.book_append_sheet(wb, wsWastage, "Food_Wastage_Report");

  // 8. Cash Register & Daily Accounts Sheet
  const cashSheetData = [
    { Field: "Register Date", Value: data.cashRegister.date },
    { Field: "Morning Opening Cash", Value: data.cashRegister.openingCash },
    { Field: "Counter Cash Collected", Value: data.cashRegister.counterCashSales },
    { Field: "UPI Collections (PhonePe/GPay)", Value: data.cashRegister.upiSales },
    { Field: "Card Payments", Value: data.cashRegister.cardSales },
    { Field: "Petty Cash Expenses Total", Value: data.cashRegister.pettyCashExpenses.reduce((s, x) => s + x.amount, 0) },
    { Field: "Supplier Payouts Total", Value: data.cashRegister.supplierPayouts.reduce((s, x) => s + x.amount, 0) },
    { Field: "Expected Drawer Balance", Value: data.cashRegister.expectedCashInDrawer },
    { Field: "Actual Drawer Cash", Value: data.cashRegister.actualCashInDrawer },
    { Field: "Drawer Variance (Diff)", Value: data.cashRegister.difference },
    { Field: "Reconciled By", Value: data.cashRegister.reconciledBy },
  ];
  const wsCash = XLSX.utils.json_to_sheet(cashSheetData);
  XLSX.utils.book_append_sheet(wb, wsCash, "Cash_Reconciliation");

  // Write and trigger download
  const dateStr = new Date().toISOString().split("T")[0];
  XLSX.writeFile(wb, `Netaji_Hotel_Admin_Database_${dateStr}.xlsx`);
}

export function parseExcelFile(file: File): Promise<Record<string, any[]>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const result: Record<string, any[]> = {};

        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          result[sheetName] = XLSX.utils.sheet_to_json(sheet);
        });

        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
