import { Product, Customer, Sale } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aashirvaad Shudh Chakki Atta',
    nameHindi: 'आशीर्वाद चक्की आटा (10kg)',
    category: 'Grains & Atta',
    purchasePrice: 385,
    sellingPrice: 440,
    stock: 4, // Low stock: trigger for "Atta kitna bacha hai?"
    minStockThreshold: 10,
    unit: 'packet',
    barcode: '8901030383120',
    isPopular: true,
  },
  {
    id: 'prod-2',
    name: 'Amul Taaza Toned Milk (500ml)',
    nameHindi: 'अमुल ताज़ा दूध (500ml)',
    category: 'Dairy & Eggs',
    purchasePrice: 25,
    sellingPrice: 28,
    stock: 18,
    minStockThreshold: 12,
    unit: 'packet',
    isPopular: true,
  },
  {
    id: 'prod-3',
    name: 'Fortune Sunlite Sunflower Oil (1L)',
    nameHindi: 'फॉर्च्यून सनलाइट तेल (1L)',
    category: 'Oils & Ghee',
    purchasePrice: 130,
    sellingPrice: 155,
    stock: 6,
    minStockThreshold: 8,
    unit: 'packet',
    isPopular: true,
  },
  {
    id: 'prod-4',
    name: 'Tata Salt Vacuum Evaporated (1kg)',
    nameHindi: 'टाटा नमक (1kg)',
    category: 'Spices & Masala',
    purchasePrice: 22,
    sellingPrice: 28,
    stock: 24,
    minStockThreshold: 10,
    unit: 'packet',
    isPopular: true,
  },
  {
    id: 'prod-5',
    name: 'Maggi 2-Minute Noodles (70g)',
    nameHindi: 'मैगी नूडल्स (70g)',
    category: 'Snacks & Biscuits',
    purchasePrice: 11.5,
    sellingPrice: 14,
    stock: 35,
    minStockThreshold: 15,
    unit: 'packet',
    isPopular: true,
  },
  {
    id: 'prod-6',
    name: 'Parle-G Glucose Biscuits (250g)',
    nameHindi: 'पारले-जी बिस्कुट (250g)',
    category: 'Snacks & Biscuits',
    purchasePrice: 24,
    sellingPrice: 30,
    stock: 28,
    minStockThreshold: 12,
    unit: 'packet',
    isPopular: true,
  },
  {
    id: 'prod-7',
    name: 'MDH Deggi Mirch Powder (100g)',
    nameHindi: 'MDH देगी मिर्च (100g)',
    category: 'Spices & Masala',
    purchasePrice: 78,
    sellingPrice: 95,
    stock: 5, // Low stock
    minStockThreshold: 8,
    unit: 'box',
  },
  {
    id: 'prod-8',
    name: 'Surf Excel Quick Wash Detergent (1kg)',
    nameHindi: 'सर्फ एक्सेल पाउडर (1kg)',
    category: 'Cleaning & Household',
    purchasePrice: 135,
    sellingPrice: 160,
    stock: 9,
    minStockThreshold: 10,
    unit: 'packet',
  },
  {
    id: 'prod-9',
    name: 'Brooke Bond Red Label Tea (250g)',
    nameHindi: 'रेड लेबल चायपत्ती (250g)',
    category: 'Beverages',
    purchasePrice: 120,
    sellingPrice: 145,
    stock: 14,
    minStockThreshold: 8,
    unit: 'box',
    isPopular: true,
  },
  {
    id: 'prod-10',
    name: 'Colgate Strong Teeth Toothpaste (150g)',
    nameHindi: 'कोलगेट टूथपेस्ट (150g)',
    category: 'Personal Care',
    purchasePrice: 90,
    sellingPrice: 110,
    stock: 3, // critically low
    minStockThreshold: 6,
    unit: 'piece',
  },
  {
    id: 'prod-11',
    name: 'Madhur Pure & Hygienic Sugar (1kg)',
    nameHindi: 'मधुर चीनी (1kg)',
    category: 'Grains & Atta',
    purchasePrice: 42,
    sellingPrice: 48,
    stock: 40,
    minStockThreshold: 15,
    unit: 'kg',
    isPopular: true,
  },
  {
    id: 'prod-12',
    name: 'Dettol Original Soap (125g pack of 3)',
    nameHindi: 'डेटॉल साबुन (3 का पैक)',
    category: 'Personal Care',
    purchasePrice: 138,
    sellingPrice: 165,
    stock: 11,
    minStockThreshold: 8,
    unit: 'box',
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    udhaarBalance: 850, // Specified in user prompt demo flow
    lastActive: 'Yesterday, 6:30 PM',
    address: 'Gali No. 4, Near Shiv Mandir',
    transactions: [
      {
        id: 'tx-1',
        customerId: 'cust-1',
        customerName: 'Ramesh Kumar',
        type: 'CREDIT_GIVEN',
        amount: 850,
        date: '2026-09-18 18:30',
        note: 'Atta 10kg + Fortune Oil 1L + Tata Salt',
        balanceAfter: 850
      },
      {
        id: 'tx-2',
        customerId: 'cust-1',
        customerName: 'Ramesh Kumar',
        type: 'PAYMENT_RECEIVED',
        amount: 500,
        date: '2026-09-12 11:15',
        note: 'UPI Payment received (PhonePe)',
        balanceAfter: 0
      }
    ]
  },
  {
    id: 'cust-2',
    name: 'Suresh Sharma',
    phone: '9811223344',
    udhaarBalance: 1200,
    lastActive: '3 days ago',
    address: 'Flat 202, Shanti Vihar',
    transactions: [
      {
        id: 'tx-3',
        customerId: 'cust-2',
        customerName: 'Suresh Sharma',
        type: 'CREDIT_GIVEN',
        amount: 1200,
        date: '2026-09-17 19:45',
        note: 'Monthly ration balance',
        balanceAfter: 1200
      }
    ]
  },
  {
    id: 'cust-3',
    name: 'Anita Devi (Masterji wife)',
    phone: '9765432199',
    udhaarBalance: 420,
    lastActive: 'Today, 9:15 AM',
    address: 'Makan No. 12, Pipal Chowk',
    transactions: [
      {
        id: 'tx-4',
        customerId: 'cust-3',
        customerName: 'Anita Devi',
        type: 'CREDIT_GIVEN',
        amount: 420,
        date: '2026-09-20 09:15',
        note: 'Red Label Chai + Parle-G + Sugar',
        balanceAfter: 420
      }
    ]
  },
  {
    id: 'cust-4',
    name: 'Vikash Patel',
    phone: '9988776655',
    udhaarBalance: 0,
    lastActive: 'Today, 10:45 AM',
    address: 'Shop No. 5, Main Bazar',
    transactions: [
      {
        id: 'tx-5',
        customerId: 'cust-4',
        customerName: 'Vikash Patel',
        type: 'PAYMENT_RECEIVED',
        amount: 650,
        date: '2026-09-19 14:20',
        note: 'Full payment cleared in cash',
        balanceAfter: 0
      }
    ]
  },
  {
    id: 'cust-5',
    name: 'Priya Singh',
    phone: '9833445566',
    udhaarBalance: 2100,
    lastActive: 'Last week',
    address: 'Krishna Nagar, Lane 2',
    transactions: [
      {
        id: 'tx-6',
        customerId: 'cust-5',
        customerName: 'Priya Singh',
        type: 'CREDIT_GIVEN',
        amount: 2100,
        date: '2026-09-14 20:10',
        note: 'Diwali groceries advance',
        balanceAfter: 2100
      }
    ]
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-1',
    invoiceNo: 'BILL-1041',
    items: [
      {
        productId: 'prod-1',
        productName: 'Aashirvaad Shudh Chakki Atta',
        quantity: 2,
        unit: 'packet',
        unitPrice: 440,
        unitCost: 385,
        subtotal: 880
      },
      {
        productId: 'prod-3',
        productName: 'Fortune Sunlite Sunflower Oil (1L)',
        quantity: 1,
        unit: 'packet',
        unitPrice: 155,
        unitCost: 130,
        subtotal: 155
      }
    ],
    totalAmount: 1035,
    totalCost: 900,
    profit: 135,
    paymentMode: 'UPI',
    customerName: 'Sunil Verma',
    timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString() // Today, ~2.5 hrs ago
  },
  {
    id: 'sale-2',
    invoiceNo: 'BILL-1042',
    items: [
      {
        productId: 'prod-2',
        productName: 'Amul Taaza Toned Milk (500ml)',
        quantity: 4,
        unit: 'packet',
        unitPrice: 28,
        unitCost: 25,
        subtotal: 112
      },
      {
        productId: 'prod-5',
        productName: 'Maggi 2-Minute Noodles (70g)',
        quantity: 6,
        unit: 'packet',
        unitPrice: 14,
        unitCost: 11.5,
        subtotal: 84
      },
      {
        productId: 'prod-6',
        productName: 'Parle-G Glucose Biscuits (250g)',
        quantity: 3,
        unit: 'packet',
        unitPrice: 30,
        unitCost: 24,
        subtotal: 90
      }
    ],
    totalAmount: 286,
    totalCost: 241,
    profit: 45,
    paymentMode: 'CASH',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString() // Today, ~1.5 hrs ago
  },
  {
    id: 'sale-3',
    invoiceNo: 'BILL-1043',
    items: [
      {
        productId: 'prod-9',
        productName: 'Brooke Bond Red Label Tea (250g)',
        quantity: 1,
        unit: 'box',
        unitPrice: 145,
        unitCost: 120,
        subtotal: 145
      },
      {
        productId: 'prod-11',
        productName: 'Madhur Pure & Hygienic Sugar (1kg)',
        quantity: 2,
        unit: 'kg',
        unitPrice: 48,
        unitCost: 42,
        subtotal: 96
      },
      {
        productId: 'prod-6',
        productName: 'Parle-G Glucose Biscuits (250g)',
        quantity: 2,
        unit: 'packet',
        unitPrice: 30,
        unitCost: 24,
        subtotal: 60
      }
    ],
    totalAmount: 301,
    totalCost: 252,
    profit: 49,
    paymentMode: 'UDHAAR',
    customerId: 'cust-3',
    customerName: 'Anita Devi',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() // Today, 45 mins ago
  },
  {
    id: 'sale-4',
    invoiceNo: 'BILL-1044',
    items: [
      {
        productId: 'prod-8',
        productName: 'Surf Excel Quick Wash Detergent (1kg)',
        quantity: 1,
        unit: 'packet',
        unitPrice: 160,
        unitCost: 135,
        subtotal: 160
      },
      {
        productId: 'prod-4',
        productName: 'Tata Salt Vacuum Evaporated (1kg)',
        quantity: 2,
        unit: 'packet',
        unitPrice: 28,
        unitCost: 22,
        subtotal: 56
      }
    ],
    totalAmount: 216,
    totalCost: 179,
    profit: 37,
    paymentMode: 'CASH',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() // Today, 15 mins ago
  }
];
