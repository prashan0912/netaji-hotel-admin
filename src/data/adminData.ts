export interface OrderItem {
  productId: string;
  name: string;
  hindiName?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  variant?: string; // e.g. "500g", "1kg", "2 Pcs", "Plate"
}

export type OrderStatus = "new" | "accepted" | "preparing" | "ready" | "completed" | "cancelled";
export type OrderType = "counter" | "online" | "bulk_catering";
export type PaymentStatus = "paid_upi" | "paid_cash" | "advance_paid" | "pending";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  deliveryArea?: string;
  orderType: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  advancePaid?: number;
  paymentStatus: PaymentStatus;
  paymentMethod: "Cash" | "UPI (PhonePe/GPay)" | "Card" | "Credit/Khata";
  createdAt: string;
  estimatedPrepMinutes: number;
  assignedStaff?: string;
  notes?: string;
  isDelayed?: boolean;
}

export interface RawMaterial {
  id: string;
  name: string;
  hindiName: string;
  category: "Dairy" | "Grains & Flour" | "Sweetener" | "Dry Fruits & Nuts" | "Spices & Oils" | "Packaging";
  currentStock: number;
  unit: "kg" | "liter" | "pieces" | "packets";
  minStockAlert: number;
  costPerUnit: number;
  lastPurchaseDate: string;
  supplierName: string;
  expiryDate: string;
  status: "in_stock" | "low_stock" | "critical";
}

export interface RecipeIngredient {
  rawMaterialId: string;
  rawMaterialName: string;
  quantityRequired: number; // e.g. per 1 kg or per 100 pcs
  unit: string;
}

export interface Recipe {
  id: string;
  dishName: string;
  dishHindiName: string;
  batchYield: string; // e.g. "100 Pcs Samosa" or "10 kg Kaju Katli"
  ingredients: RecipeIngredient[];
  prepTimeMinutes: number;
  instructions: string;
  standardWastagePct: number;
}

export interface DailyProduction {
  id: string;
  dishId: string;
  dishName: string;
  dishCategory: "Sweet" | "Snack" | "Beverage";
  unit: "kg" | "pieces" | "plates";
  morningBatch: number;
  afternoonBatch: number;
  totalProduced: number;
  totalSold: number;
  remainingStock: number;
  wastedQuantity: number;
  preparationDate: string;
  prepTime: string;
  expiryTime: string;
  freshnessStatus: "Freshly Made" | "Good" | "Expiring Soon" | "Expired";
  halwaiInCharge: string;
  notes?: string;
}

export interface BulkOrder {
  id: string;
  clientName: string;
  phone: string;
  occasion: "Wedding" | "Birthday Party" | "Pooja/Ceremony" | "Corporate Event" | "Catering";
  eventDate: string;
  eventTime: string;
  deliveryVenue: string;
  area: string;
  itemsSummary: string;
  totalBill: number;
  advanceReceived: number;
  remainingDue: number;
  status: "Inquiry" | "Confirmed" | "In Production" | "Ready" | "Dispatched" | "Delivered";
  specialPackaging: boolean;
  notes: string;
}

export interface Employee {
  id: string;
  name: string;
  role: "Head Halwai" | "Assistant Halwai" | "Snack Cook" | "Cashier" | "Packaging Staff" | "Delivery Rider" | "Manager";
  phone: string;
  shift: "Morning (6 AM - 2 PM)" | "Evening (2 PM - 10 PM)" | "Full Day (8 AM - 8 PM)";
  monthlySalary: number;
  todayStatus: "Present" | "Absent" | "Half Day" | "On Leave";
  attendanceRecord: { date: string; status: "P" | "A" | "HD" | "L" }[];
  performanceScore: number; // out of 100
  tasksAssigned: string[];
}

export interface CashRegister {
  date: string;
  openingCash: number;
  counterCashSales: number;
  upiSales: number;
  cardSales: number;
  pettyCashExpenses: { id: string; description: string; amount: number; time: string; receiptNo?: string }[];
  supplierPayouts: { id: string; supplier: string; amount: number; purpose: string }[];
  expectedCashInDrawer: number;
  actualCashInDrawer: number;
  difference: number; // actual - expected
  reconciledBy: string;
}

export interface WastageLog {
  id: string;
  date: string;
  itemName: string;
  category: "Raw Material" | "Prepared Sweet" | "Prepared Snack";
  quantity: string;
  reason: "Burnt/Overcooked" | "Spoiled/Expired" | "Spillage" | "Unsold End-of-Day";
  estimatedLoss: number;
  reportedBy: string;
}

// Initial Seed Data
export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
  {
    id: "rm-1",
    name: "Pure Cow Desi Ghee",
    hindiName: "शुद्ध गाय का देशी घी",
    category: "Dairy",
    currentStock: 42,
    unit: "kg",
    minStockAlert: 50,
    costPerUnit: 640,
    lastPurchaseDate: "2026-10-25",
    supplierName: "Chhattisgarh Dairy Federation",
    expiryDate: "2026-12-15",
    status: "low_stock",
  },
  {
    id: "rm-2",
    name: "Fresh Khoya / Mawa (Hathras Style)",
    hindiName: "ताजा खोया / मावा",
    category: "Dairy",
    currentStock: 18,
    unit: "kg",
    minStockAlert: 20,
    costPerUnit: 340,
    lastPurchaseDate: "2026-10-28",
    supplierName: "Baloda Bazar Milk Union",
    expiryDate: "2026-10-31",
    status: "low_stock",
  },
  {
    id: "rm-3",
    name: "Cashews (Kaju Tukda & Whole)",
    hindiName: "काजू (टुकड़ा व साबुत)",
    category: "Dry Fruits & Nuts",
    currentStock: 65,
    unit: "kg",
    minStockAlert: 25,
    costPerUnit: 780,
    lastPurchaseDate: "2026-10-20",
    supplierName: "Malviya Dry Fruits Raipur",
    expiryDate: "2027-04-10",
    status: "in_stock",
  },
  {
    id: "rm-4",
    name: "Maida (Fine Wheat Flour)",
    hindiName: "मैदा (सुपर फाइन)",
    category: "Grains & Flour",
    currentStock: 140,
    unit: "kg",
    minStockAlert: 60,
    costPerUnit: 38,
    lastPurchaseDate: "2026-10-26",
    supplierName: "Shree Ganesh Flour Mill Telibandha",
    expiryDate: "2027-01-15",
    status: "in_stock",
  },
  {
    id: "rm-5",
    name: "Sugar (Double Sulphur Free)",
    hindiName: "सफेद दानेदार चीनी",
    category: "Sweetener",
    currentStock: 220,
    unit: "kg",
    minStockAlert: 100,
    costPerUnit: 44,
    lastPurchaseDate: "2026-10-22",
    supplierName: "Bhatapara Sugar Traders",
    expiryDate: "2027-09-01",
    status: "in_stock",
  },
  {
    id: "rm-6",
    name: "Fresh Paneer (Malai Block)",
    hindiName: "मलाई पनीर",
    category: "Dairy",
    currentStock: 12,
    unit: "kg",
    minStockAlert: 15,
    costPerUnit: 360,
    lastPurchaseDate: "2026-10-29",
    supplierName: "Katora Talab Daily Dairy",
    expiryDate: "2026-10-31",
    status: "low_stock",
  },
  {
    id: "rm-7",
    name: "Chana Besan (Coarse & Fine)",
    hindiName: "चना बेसन (राजस्थानी)",
    category: "Grains & Flour",
    currentStock: 85,
    unit: "kg",
    minStockAlert: 40,
    costPerUnit: 82,
    lastPurchaseDate: "2026-10-24",
    supplierName: "Shri Shyam Agro Pandri",
    expiryDate: "2027-02-20",
    status: "in_stock",
  },
  {
    id: "rm-8",
    name: "Red Round Potatoes (Aloo)",
    hindiName: "आलू (समोसा स्पेशल)",
    category: "Spices & Oils",
    currentStock: 160,
    unit: "kg",
    minStockAlert: 50,
    costPerUnit: 24,
    lastPurchaseDate: "2026-10-28",
    supplierName: "Ganj Mandi Raipur Traders",
    expiryDate: "2026-11-20",
    status: "in_stock",
  },
  {
    id: "rm-9",
    name: "Refined Groundnut & Mustard Oil",
    hindiName: "मूंगफली व सरसों तेल",
    category: "Spices & Oils",
    currentStock: 75,
    unit: "liter",
    minStockAlert: 40,
    costPerUnit: 155,
    lastPurchaseDate: "2026-10-23",
    supplierName: "Kisan Oil Mills Tatibandh",
    expiryDate: "2027-05-10",
    status: "in_stock",
  },
  {
    id: "rm-10",
    name: "Green Cardamom (Chhoti Elaichi)",
    hindiName: "हरी इलायची (सुपर बोल्ड)",
    category: "Spices & Oils",
    currentStock: 3.5,
    unit: "kg",
    minStockAlert: 2,
    costPerUnit: 2800,
    lastPurchaseDate: "2026-10-10",
    supplierName: "Kerala Spices Malviya Rd",
    expiryDate: "2027-08-30",
    status: "in_stock",
  },
  {
    id: "rm-11",
    name: "Sweet Gift Packaging Boxes (1kg / 500g)",
    hindiName: "मिठाई डिब्बे (गोल्डन प्रिंट)",
    category: "Packaging",
    currentStock: 480,
    unit: "pieces",
    minStockAlert: 200,
    costPerUnit: 18,
    lastPurchaseDate: "2026-10-18",
    supplierName: "Royal Print & Pack Fafadih",
    expiryDate: "2028-01-01",
    status: "in_stock",
  },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: "rec-1",
    dishName: "Famous Raipur Aloo Samosa",
    dishHindiName: "मशहूर रायपुर आलू समोसा",
    batchYield: "100 Pcs",
    prepTimeMinutes: 45,
    standardWastagePct: 2.5,
    instructions: "Boil potatoes, temper with cumin, crushed coriander seeds, green chillies & garam masala. Knead stiff maida with ajwain & warm oil. Fry on medium-low flame for crisp crust.",
    ingredients: [
      { rawMaterialId: "rm-4", rawMaterialName: "Maida", quantityRequired: 4.5, unit: "kg" },
      { rawMaterialId: "rm-8", rawMaterialName: "Red Round Potatoes", quantityRequired: 7.0, unit: "kg" },
      { rawMaterialId: "rm-9", rawMaterialName: "Refined Oil", quantityRequired: 1.8, unit: "liter" },
      { rawMaterialId: "rm-10", rawMaterialName: "Elaichi & Spices", quantityRequired: 0.25, unit: "kg" },
    ],
  },
  {
    id: "rec-2",
    dishName: "Pure Kaju Katli (Diamond Cut)",
    dishHindiName: "काजू कतली (शुद्ध चांदी वर्क)",
    batchYield: "10 kg",
    prepTimeMinutes: 90,
    standardWastagePct: 1.2,
    instructions: "Grind premium cashews into fine powder. Prepare one-string sugar syrup. Cook cashew paste on slow flame till smooth dough forms. Roll and cut diamond shapes.",
    ingredients: [
      { rawMaterialId: "rm-3", rawMaterialName: "Cashews (Kaju)", quantityRequired: 7.2, unit: "kg" },
      { rawMaterialId: "rm-5", rawMaterialName: "Sugar", quantityRequired: 3.8, unit: "kg" },
      { rawMaterialId: "rm-1", rawMaterialName: "Desi Ghee", quantityRequired: 0.35, unit: "kg" },
      { rawMaterialId: "rm-10", rawMaterialName: "Elaichi Powder", quantityRequired: 0.05, unit: "kg" },
    ],
  },
  {
    id: "rec-3",
    dishName: "Ghee Gulab Jamun",
    dishHindiName: "देसी घी गुलाब जामुन",
    batchYield: "15 kg (approx 350 pcs)",
    prepTimeMinutes: 80,
    standardWastagePct: 3.0,
    instructions: "Knead fresh khoya with paneer and minimal maida until silky. Deep fry slowly in pure desi ghee until deep golden. Soak in cardamom & rose saffron syrup.",
    ingredients: [
      { rawMaterialId: "rm-2", rawMaterialName: "Fresh Khoya", quantityRequired: 6.5, unit: "kg" },
      { rawMaterialId: "rm-6", rawMaterialName: "Fresh Paneer", quantityRequired: 1.2, unit: "kg" },
      { rawMaterialId: "rm-4", rawMaterialName: "Maida", quantityRequired: 1.5, unit: "kg" },
      { rawMaterialId: "rm-5", rawMaterialName: "Sugar", quantityRequired: 8.0, unit: "kg" },
      { rawMaterialId: "rm-1", rawMaterialName: "Desi Ghee", quantityRequired: 3.0, unit: "kg" },
    ],
  },
  {
    id: "rec-4",
    dishName: "Netaji Special Dahi Bada",
    dishHindiName: "नेताजी स्पेशल दही बड़ा",
    batchYield: "50 Plates (100 Badepcs)",
    prepTimeMinutes: 60,
    standardWastagePct: 1.5,
    instructions: "Soak and whip urad dal until airy. Fry golden vadas, soak in warm salted hing water, squeeze, immerse in chilled thick sweetened dahi with roasted jeera & saunth chutney.",
    ingredients: [
      { rawMaterialId: "rm-7", rawMaterialName: "Urad Dal / Flour", quantityRequired: 3.0, unit: "kg" },
      { rawMaterialId: "rm-9", rawMaterialName: "Refined Oil", quantityRequired: 1.2, unit: "liter" },
      { rawMaterialId: "rm-5", rawMaterialName: "Sugar", quantityRequired: 1.0, unit: "kg" },
    ],
  },
];

export const INITIAL_DAILY_PRODUCTION: DailyProduction[] = [
  {
    id: "dp-1",
    dishId: "snack-samosa",
    dishName: "Famous Raipur Aloo Samosa",
    dishCategory: "Snack",
    unit: "pieces",
    morningBatch: 500,
    afternoonBatch: 350,
    totalProduced: 850,
    totalSold: 760,
    remainingStock: 82,
    wastedQuantity: 8,
    preparationDate: "2026-10-29",
    prepTime: "07:00 AM & 02:30 PM",
    expiryTime: "10:00 PM (15 hrs)",
    freshnessStatus: "Good",
    halwaiInCharge: "Ramesh Sharma (Head Halwai)",
    notes: "High demand evening expected near Katora Talab garden",
  },
  {
    id: "dp-2",
    dishId: "snack-kachori",
    dishName: "Khasta Pyaaz & Moong Kachori",
    dishCategory: "Snack",
    unit: "pieces",
    morningBatch: 300,
    afternoonBatch: 180,
    totalProduced: 480,
    totalSold: 430,
    remainingStock: 45,
    wastedQuantity: 5,
    preparationDate: "2026-10-29",
    prepTime: "07:30 AM & 03:00 PM",
    expiryTime: "10:30 PM",
    freshnessStatus: "Good",
    halwaiInCharge: "Sunil Sahu",
  },
  {
    id: "dp-3",
    dishId: "snack-dahibada",
    dishName: "Netaji Special Chilled Dahi Bada",
    dishCategory: "Snack",
    unit: "plates",
    morningBatch: 120,
    afternoonBatch: 80,
    totalProduced: 200,
    totalSold: 185,
    remainingStock: 12,
    wastedQuantity: 3,
    preparationDate: "2026-10-29",
    prepTime: "08:00 AM & 03:30 PM",
    expiryTime: "09:30 PM",
    freshnessStatus: "Good",
    halwaiInCharge: "Sunil Sahu",
    notes: "Keep in chilled counter refrigerator",
  },
  {
    id: "dp-4",
    dishId: "sweet-jalebi",
    dishName: "Pure Desi Ghee Jalebi",
    dishCategory: "Sweet",
    unit: "kg",
    morningBatch: 28,
    afternoonBatch: 20,
    totalProduced: 48,
    totalSold: 44.5,
    remainingStock: 3.0,
    wastedQuantity: 0.5,
    preparationDate: "2026-10-29",
    prepTime: "06:30 AM (Live Kadai)",
    expiryTime: "09:00 PM",
    freshnessStatus: "Good",
    halwaiInCharge: "Ramesh Sharma (Head Halwai)",
  },
  {
    id: "dp-5",
    dishId: "sweet-kajukatli",
    dishName: "Diamond Cut Kaju Katli",
    dishCategory: "Sweet",
    unit: "kg",
    morningBatch: 35,
    afternoonBatch: 0,
    totalProduced: 35,
    totalSold: 18.5,
    remainingStock: 16.5,
    wastedQuantity: 0,
    preparationDate: "2026-10-28",
    prepTime: "11:00 AM",
    expiryTime: "2026-11-12 (15 Days Shelf)",
    freshnessStatus: "Freshly Made",
    halwaiInCharge: "Dinanath Maharaj",
  },
  {
    id: "dp-6",
    dishId: "sweet-rasgulla",
    dishName: "Kolkata Sponge Rasgulla",
    dishCategory: "Sweet",
    unit: "kg",
    morningBatch: 25,
    afternoonBatch: 0,
    totalProduced: 25,
    totalSold: 19.0,
    remainingStock: 5.5,
    wastedQuantity: 0.5,
    preparationDate: "2026-10-29",
    prepTime: "06:00 AM",
    expiryTime: "2026-10-31 (48 hrs chilled)",
    freshnessStatus: "Freshly Made",
    halwaiInCharge: "Dinanath Maharaj",
  },
  {
    id: "dp-7",
    dishId: "sweet-ladoo",
    dishName: "Motichoor Desi Ghee Ladoo",
    dishCategory: "Sweet",
    unit: "kg",
    morningBatch: 40,
    afternoonBatch: 25,
    totalProduced: 65,
    totalSold: 56.0,
    remainingStock: 8.5,
    wastedQuantity: 0.5,
    preparationDate: "2026-10-29",
    prepTime: "07:00 AM",
    expiryTime: "2026-11-04 (6 days)",
    freshnessStatus: "Freshly Made",
    halwaiInCharge: "Ramesh Sharma",
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-101",
    orderNumber: "NH-2026-101",
    customerName: "Vikram Agrawal",
    customerPhone: "+91 98261 44520",
    customerAddress: "Flat 402, Royal Palms, Shankar Nagar, Raipur",
    deliveryArea: "Shankar Nagar",
    orderType: "online",
    status: "preparing",
    items: [
      { productId: "snack-samosa", name: "Aloo Samosa (Crispy)", quantity: 6, unit: "pieces", unitPrice: 18, totalPrice: 108 },
      { productId: "sweet-jalebi", name: "Pure Ghee Jalebi", quantity: 0.5, unit: "kg", unitPrice: 380, totalPrice: 190, variant: "500g" },
      { productId: "beverage-lassi", name: "Kulhad Rabdi Lassi", quantity: 2, unit: "glasses", unitPrice: 70, totalPrice: 140 },
    ],
    subtotal: 438,
    deliveryCharge: 30,
    discount: 25,
    totalAmount: 443,
    paymentStatus: "paid_upi",
    paymentMethod: "UPI (PhonePe/GPay)",
    createdAt: "2026-10-29T13:42:00",
    estimatedPrepMinutes: 18,
    assignedStaff: "Sunil Sahu",
    notes: "Pack jalebi warm in foil container, extra green chutney please.",
  },
  {
    id: "ord-102",
    orderNumber: "NH-2026-102",
    customerName: "Pooja Verma",
    customerPhone: "+91 94252 88190",
    customerAddress: "Counter Takeaway (Katora Talab)",
    deliveryArea: "Counter",
    orderType: "counter",
    status: "new",
    items: [
      { productId: "snack-dahibada", name: "Special Dahi Bada", quantity: 3, unit: "plates", unitPrice: 65, totalPrice: 195 },
      { productId: "sweet-kajukatli", name: "Diamond Kaju Katli", quantity: 0.5, unit: "kg", unitPrice: 940, totalPrice: 470, variant: "500g Box" },
    ],
    subtotal: 665,
    deliveryCharge: 0,
    discount: 0,
    totalAmount: 665,
    paymentStatus: "paid_cash",
    paymentMethod: "Cash",
    createdAt: "2026-10-29T13:50:00",
    estimatedPrepMinutes: 8,
    assignedStaff: "Raju Packaging",
    notes: "Gift box packaging requested with ribbon.",
  },
  {
    id: "ord-103",
    orderNumber: "NH-2026-103",
    customerName: "Dr. Alok Tiwari",
    customerPhone: "+91 97550 33411",
    customerAddress: "Devendra Nagar Sector 3, Raipur",
    deliveryArea: "Devendra Nagar",
    orderType: "online",
    status: "ready",
    items: [
      { productId: "snack-samosa", name: "Aloo Samosa (Crispy)", quantity: 10, unit: "pieces", unitPrice: 18, totalPrice: 180 },
      { productId: "snack-kachori", name: "Khasta Pyaaz Kachori", quantity: 5, unit: "pieces", unitPrice: 22, totalPrice: 110 },
      { productId: "sweet-gulabjamun", name: "Desi Ghee Gulab Jamun", quantity: 1, unit: "kg", unitPrice: 420, totalPrice: 420, variant: "1kg" },
    ],
    subtotal: 710,
    deliveryCharge: 40,
    discount: 50,
    totalAmount: 700,
    paymentStatus: "paid_upi",
    paymentMethod: "UPI (PhonePe/GPay)",
    createdAt: "2026-10-29T13:28:00",
    estimatedPrepMinutes: 20,
    assignedStaff: "Mukesh Rider",
    notes: "Rider assigned, order packed and ready at pickup counter.",
  },
  {
    id: "ord-104",
    orderNumber: "NH-2026-104",
    customerName: "Sanjay Singhania",
    customerPhone: "+91 99930 12044",
    customerAddress: "Pandri Cloth Market, Shop 42, Raipur",
    deliveryArea: "Pandri",
    orderType: "bulk_catering",
    status: "accepted",
    items: [
      { productId: "sweet-ladoo", name: "Motichoor Desi Ghee Ladoo", quantity: 15, unit: "kg", unitPrice: 420, totalPrice: 6300, variant: "15x 1kg Gift Boxes" },
      { productId: "snack-samosa", name: "Cocktail Mini Samosas", quantity: 150, unit: "pieces", unitPrice: 12, totalPrice: 1800 },
    ],
    subtotal: 8100,
    deliveryCharge: 0,
    discount: 400,
    totalAmount: 7700,
    advancePaid: 3000,
    paymentStatus: "advance_paid",
    paymentMethod: "UPI (PhonePe/GPay)",
    createdAt: "2026-10-29T12:15:00",
    estimatedPrepMinutes: 90,
    assignedStaff: "Ramesh Sharma",
    notes: "Shop opening ceremony event at 4:30 PM. Needs 15 individual gift bags.",
  },
  {
    id: "ord-105",
    orderNumber: "NH-2026-105",
    customerName: "Ananya Choubey",
    customerPhone: "+91 98933 66722",
    customerAddress: "Civil Lines, Near Raj Bhavan, Raipur",
    deliveryArea: "Civil Lines",
    orderType: "online",
    status: "completed",
    items: [
      { productId: "sweet-rasgulla", name: "Sponge Rasgulla Tin", quantity: 1, unit: "kg", unitPrice: 340, totalPrice: 340 },
      { productId: "snack-dhokla", name: "Nylon Khaman Dhokla", quantity: 4, unit: "plates", unitPrice: 45, totalPrice: 180 },
    ],
    subtotal: 520,
    deliveryCharge: 35,
    discount: 30,
    totalAmount: 525,
    paymentStatus: "paid_upi",
    paymentMethod: "UPI (PhonePe/GPay)",
    createdAt: "2026-10-29T12:05:00",
    estimatedPrepMinutes: 15,
    assignedStaff: "Mukesh Rider",
    notes: "Delivered smoothly at 12:40 PM.",
  },
];

export const INITIAL_BULK_ORDERS: BulkOrder[] = [
  {
    id: "bulk-1",
    clientName: "Er. Rajesh Dewangan (Wedding of Son)",
    phone: "+91 98271 55662",
    occasion: "Wedding",
    eventDate: "2026-11-08",
    eventTime: "06:30 PM",
    deliveryVenue: "Sayaji Hotel Banquet Hall, VIP Road, Raipur",
    area: "VIP Road",
    itemsSummary: "50 kg Motichoor Ladoo (in 100x 500g designer boxes) + 30 kg Kaju Katli + 400 pcs Paneer Samosa",
    totalBill: 58500,
    advanceReceived: 25000,
    remainingDue: 33500,
    status: "Confirmed",
    specialPackaging: true,
    notes: "Gold foil custom printed boxes with 'Rajesh Weds Shruti' stickers supplied by client.",
  },
  {
    id: "bulk-2",
    clientName: "State Bank Officers Association",
    phone: "+91 94255 12900",
    occasion: "Corporate Event",
    eventDate: "2026-11-02",
    eventTime: "11:00 AM",
    deliveryVenue: "SBI LHO Complex, Byron Bazar, Raipur",
    area: "Byron Bazar",
    itemsSummary: "250 Plates Breakfast Box (2 Samosa + 1 Dhokla + 2 Gulab Jamun per box)",
    totalBill: 23750,
    advanceReceived: 10000,
    remainingDue: 13750,
    status: "In Production",
    specialPackaging: true,
    notes: "Disposable spoon & napkin kit to be placed inside each box.",
  },
  {
    id: "bulk-3",
    clientName: "Smt. Shashi Khandelwal (Diwali Milan)",
    phone: "+91 97520 89123",
    occasion: "Pooja/Ceremony",
    eventDate: "2026-11-12",
    eventTime: "04:00 PM",
    deliveryVenue: "Khandelwal Bhawan, Samta Colony, Raipur",
    area: "Samta Colony",
    itemsSummary: "40 kg Assorted Bengali Sweets + 25 kg Besan Ladoo",
    totalBill: 34200,
    advanceReceived: 15000,
    remainingDue: 19200,
    status: "Confirmed",
    specialPackaging: false,
    notes: "Keep in temperature controlled cold van during transport.",
  },
  {
    id: "bulk-4",
    clientName: "Mahesh Gupta (Daughter's Ring Ceremony)",
    phone: "+91 98263 77410",
    occasion: "Wedding",
    eventDate: "2026-11-05",
    eventTime: "07:00 PM",
    deliveryVenue: "Agrasen Dham, VIP Club, Raipur",
    area: "VIP Road",
    itemsSummary: "20 kg Kaju Anjeer Roll + 35 kg Desi Ghee Jalebi (Live Counter Kadai at venue)",
    totalBill: 38000,
    advanceReceived: 38000,
    remainingDue: 0,
    status: "Ready",
    specialPackaging: true,
    notes: "2 Halwais (Ramesh Sharma & assistant) required with portable gas burners for live jalebi counter.",
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "emp-1",
    name: "Ramesh Sharma",
    role: "Head Halwai",
    phone: "+91 98261 10293",
    shift: "Morning (6 AM - 2 PM)",
    monthlySalary: 38000,
    todayStatus: "Present",
    attendanceRecord: [
      { date: "2026-10-25", status: "P" },
      { date: "2026-10-26", status: "P" },
      { date: "2026-10-27", status: "P" },
      { date: "2026-10-28", status: "P" },
      { date: "2026-10-29", status: "P" },
    ],
    performanceScore: 96,
    tasksAssigned: ["Morning Jalebi live batch", "Motichoor Ladoo preparation", "Bulk order wedding sweets QC"],
  },
  {
    id: "emp-2",
    name: "Dinanath Maharaj",
    role: "Head Halwai",
    phone: "+91 94252 77192",
    shift: "Morning (6 AM - 2 PM)",
    monthlySalary: 36000,
    todayStatus: "Present",
    attendanceRecord: [
      { date: "2026-10-25", status: "P" },
      { date: "2026-10-26", status: "P" },
      { date: "2026-10-27", status: "P" },
      { date: "2026-10-28", status: "P" },
      { date: "2026-10-29", status: "P" },
    ],
    performanceScore: 94,
    tasksAssigned: ["Bengali milk sweets & Rasgulla", "Kaju Katli diamond cuts", "Milk boiling & chenna making"],
  },
  {
    id: "emp-3",
    name: "Sunil Sahu",
    role: "Snack Cook",
    phone: "+91 99932 44100",
    shift: "Morning (6 AM - 2 PM)",
    monthlySalary: 24000,
    todayStatus: "Present",
    attendanceRecord: [
      { date: "2026-10-25", status: "P" },
      { date: "2026-10-26", status: "P" },
      { date: "2026-10-27", status: "P" },
      { date: "2026-10-28", status: "HD" },
      { date: "2026-10-29", status: "P" },
    ],
    performanceScore: 91,
    tasksAssigned: ["Samosa dough & stuffing", "Kachori frying", "Dahi bada tempering"],
  },
  {
    id: "emp-4",
    name: "Ashok Verma",
    role: "Cashier",
    phone: "+91 98270 33819",
    shift: "Full Day (8 AM - 8 PM)",
    monthlySalary: 22000,
    todayStatus: "Present",
    attendanceRecord: [
      { date: "2026-10-25", status: "P" },
      { date: "2026-10-26", status: "P" },
      { date: "2026-10-27", status: "P" },
      { date: "2026-10-28", status: "P" },
      { date: "2026-10-29", status: "P" },
    ],
    performanceScore: 98,
    tasksAssigned: ["Counter billing & drawer custody", "UPI QR reconciliation", "Daily sales closing tally"],
  },
  {
    id: "emp-5",
    name: "Raju Nishad",
    role: "Packaging Staff",
    phone: "+91 97551 22980",
    shift: "Morning (6 AM - 2 PM)",
    monthlySalary: 16000,
    todayStatus: "Present",
    attendanceRecord: [
      { date: "2026-10-25", status: "P" },
      { date: "2026-10-26", status: "P" },
      { date: "2026-10-27", status: "A" },
      { date: "2026-10-28", status: "P" },
      { date: "2026-10-29", status: "P" },
    ],
    performanceScore: 88,
    tasksAssigned: ["Weight weighing precision check", "Gift box ribbons & sweet seals", "Chutney pouch packing"],
  },
  {
    id: "emp-6",
    name: "Mukesh Yadav",
    role: "Delivery Rider",
    phone: "+91 99071 88412",
    shift: "Full Day (8 AM - 8 PM)",
    monthlySalary: 18000,
    todayStatus: "Present",
    attendanceRecord: [
      { date: "2026-10-25", status: "P" },
      { date: "2026-10-26", status: "P" },
      { date: "2026-10-27", status: "P" },
      { date: "2026-10-28", status: "P" },
      { date: "2026-10-29", status: "P" },
    ],
    performanceScore: 92,
    tasksAssigned: ["Shankar Nagar & Pandri delivery runs", "Thermal bag sweet carrier maintenance"],
  },
  {
    id: "emp-7",
    name: "Suraj Kurre",
    role: "Delivery Rider",
    phone: "+91 97130 66201",
    shift: "Evening (2 PM - 10 PM)",
    monthlySalary: 18000,
    todayStatus: "On Leave",
    attendanceRecord: [
      { date: "2026-10-25", status: "P" },
      { date: "2026-10-26", status: "P" },
      { date: "2026-10-27", status: "P" },
      { date: "2026-10-28", status: "P" },
      { date: "2026-10-29", status: "L" },
    ],
    performanceScore: 85,
    tasksAssigned: ["Evening express delivery duty (On Leave today)"],
  },
];

export const INITIAL_CASH_REGISTER: CashRegister = {
  date: "2026-10-29",
  openingCash: 5000,
  counterCashSales: 28450,
  upiSales: 34820,
  cardSales: 9600,
  pettyCashExpenses: [
    { id: "pce-1", description: "Fresh Coriander, Green Chillies & Mint (Mandi)", amount: 480, time: "07:15 AM", receiptNo: "MN-481" },
    { id: "pce-2", description: "Emergency 20 Litre Can Milk (Morning rush)", amount: 1100, time: "09:30 AM", receiptNo: "MK-09" },
    { id: "pce-3", description: "Block Ice for Dahi Bada chilling tanks", amount: 250, time: "11:00 AM" },
    { id: "pce-4", description: "Cleaning phenyl & floor sanitizers", amount: 320, time: "01:20 PM" },
  ],
  supplierPayouts: [
    { id: "sp-1", supplier: "Bhatapara Sugar Traders", amount: 4400, purpose: "100kg Sugar delivery payment" },
  ],
  expectedCashInDrawer: 27150 - 2150, // 5000 opening + 28450 cash - 2150 expenses - 4400 supplier = 26900
  actualCashInDrawer: 26900,
  difference: 0,
  reconciledBy: "Ashok Verma (Cashier) & Manager",
};

export const INITIAL_WASTAGE_LOGS: WastageLog[] = [
  {
    id: "w-1",
    date: "2026-10-29",
    itemName: "Aloo Samosa",
    category: "Prepared Snack",
    quantity: "8 pcs",
    reason: "Burnt/Overcooked",
    estimatedLoss: 72,
    reportedBy: "Sunil Sahu",
  },
  {
    id: "w-2",
    date: "2026-10-29",
    itemName: "Sweet Curd (Dahi)",
    category: "Raw Material",
    quantity: "1.2 kg",
    reason: "Spillage",
    estimatedLoss: 120,
    reportedBy: "Raju Nishad",
  },
  {
    id: "w-3",
    date: "2026-10-28",
    itemName: "Kolkata Chum Chum",
    category: "Prepared Sweet",
    quantity: "0.8 kg",
    reason: "Unsold End-of-Day",
    estimatedLoss: 280,
    reportedBy: "Dinanath Maharaj",
  },
];

export const DELIVERY_ZONES = [
  { id: "z-1", name: "Katora Talab (Immediate vicinity)", minTimeMins: 15, fee: 0, status: "Active" },
  { id: "z-2", name: "Shankar Nagar & Civil Lines", minTimeMins: 25, fee: 30, status: "Active" },
  { id: "z-3", name: "Pandri & Devendra Nagar", minTimeMins: 30, fee: 35, status: "Active" },
  { id: "z-4", name: "Telibandha & VIP Road", minTimeMins: 35, fee: 40, status: "Active" },
  { id: "z-5", name: "Samta Colony & Byron Bazar", minTimeMins: 30, fee: 35, status: "Active" },
  { id: "z-6", name: "Tatibandh & AIIMS Area", minTimeMins: 45, fee: 60, status: "Active" },
];

export const OFFERS_LIST = [
  { code: "FESTIVE10", title: "10% Off on Sweet Gift Boxes", minOrder: 1000, discountPct: 10, validUntil: "2026-11-15", active: true, usageCount: 68 },
  { code: "SAMOSALOVE", title: "Buy 5 Samosas Get 1 Plate Jalebi Free", minOrder: 90, discountFlat: 35, validUntil: "2026-11-30", active: true, usageCount: 142 },
  { code: "BULKWEDDING", title: "Flat ₹1500 Off on Bulk Wedding Orders above ₹25,000", minOrder: 25000, discountFlat: 1500, validUntil: "2026-12-31", active: true, usageCount: 9 },
];
