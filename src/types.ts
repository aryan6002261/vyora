export type Language = 'hinglish' | 'hindi' | 'english';

export type ProductCategory = 
  | 'Grains & Atta'
  | 'Dairy & Eggs'
  | 'Oils & Ghee'
  | 'Spices & Masala'
  | 'Snacks & Biscuits'
  | 'Beverages'
  | 'Personal Care'
  | 'Cleaning & Household';

export type UnitType = 'kg' | 'packet' | 'liter' | 'piece' | 'box' | 'bundle';

export interface Product {
  id: string;
  name: string;
  nameHindi: string;
  category: ProductCategory;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStockThreshold: number;
  unit: UnitType;
  barcode?: string;
  isPopular?: boolean;
}

export type PaymentMode = 'CASH' | 'UPI' | 'UDHAAR';

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: UnitType;
  unitPrice: number;
  unitCost: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  items: SaleItem[];
  totalAmount: number;
  totalCost: number;
  profit: number;
  paymentMode: PaymentMode;
  customerId?: string;
  customerName?: string;
  timestamp: string; // ISO string
}

export interface KhataTransaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'CREDIT_GIVEN' | 'PAYMENT_RECEIVED';
  amount: number;
  date: string;
  note?: string;
  saleId?: string;
  balanceAfter: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  udhaarBalance: number;
  lastActive: string;
  address?: string;
  transactions: KhataTransaction[];
}

export interface ActionProposal {
  id: string;
  type: 'SEND_WHATSAPP_REMINDER' | 'UPDATE_STOCK' | 'ADD_UDHAAR' | 'CREATE_SALE';
  title: string;
  description: string;
  status: 'PENDING' | 'EXECUTED' | 'DISMISSED';
  details: {
    customerName?: string;
    customerId?: string;
    phone?: string;
    amount?: number;
    productName?: string;
    productId?: string;
    quantity?: number;
    newStock?: number;
    whatsAppMessage?: string;
    waLink?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isVoice?: boolean;
  actionProposal?: ActionProposal;
}

export interface BusinessSummary {
  todayRevenue: number;
  todayProfit: number;
  todaySalesCount: number;
  totalUdhaar: number;
  lowStockItemsCount: number;
  cashRevenue: number;
  upiRevenue: number;
  udhaarRevenue: number;
}
