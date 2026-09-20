import { Product, Customer, Sale, Supplier, NearbyMerchant, UserProfile, PaymentGatewayConfig } from '../types';

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

export const INITIAL_PAYMENT_CONFIG: PaymentGatewayConfig = {
  merchantUpiId: 'dukaan.sharma@okaxis',
  merchantName: 'Sharma General Kirana Store',
  paytmNumber: '9876543210',
  preferredGateway: 'UPI',
  isVerified: true,
};

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'supp-1',
    name: 'Rajesh Agrawal',
    companyName: 'Agrawal Grains & Pulses Wholesale',
    category: 'Grains, Atta & Pulses',
    phone: '+91 98112 34567',
    email: 'agrawal.wholesale@gmail.com',
    address: 'Shop No. 42, Krishi Upaj Mandi, Sector 12',
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110085',
    gstin: '07AAAAA0000A1Z5',
    latitude: 28.6289,
    longitude: 77.2065,
    distanceKm: 1.8,
    totalOrdersCount: 8,
    totalPurchases: 48500,
    totalPendingPayment: 9200,
    nextPaymentDueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // 2 days from now
    rating: 4.8,
    itemsSupplied: ['Aashirvaad Atta', 'Basmati Rice', 'Moong Dal', 'Toor Dal', 'Chana'],
    purchaseOrders: [
      {
        id: 'po-101',
        orderNumber: 'PO-2026-001',
        supplierId: 'supp-1',
        supplierName: 'Agrawal Grains Wholesale',
        items: [
          { productName: 'Aashirvaad Shudh Chakki Atta (10kg)', quantity: 20, unit: 'packet', unitCost: 385, subtotal: 7700 },
          { productName: 'Fortune Sunlite Sunflower Oil (1L)', quantity: 24, unit: 'packet', unitCost: 130, subtotal: 3120 }
        ],
        totalAmount: 10820,
        paidAmount: 6000,
        pendingAmount: 4820,
        orderDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        status: 'RECEIVED',
        paymentStatus: 'PARTIAL',
        payments: [
          { id: 'sp-1', amount: 6000, date: new Date(Date.now() - 4 * 86400000).toISOString(), paymentMethod: 'UPI', referenceId: 'UPI-98237461' }
        ]
      },
      {
        id: 'po-102',
        orderNumber: 'PO-2026-002',
        supplierId: 'supp-1',
        supplierName: 'Agrawal Grains Wholesale',
        items: [
          { productName: 'Basmati Rice Premium (5kg)', quantity: 15, unit: 'packet', unitCost: 290, subtotal: 4350 }
        ],
        totalAmount: 4380,
        paidAmount: 0,
        pendingAmount: 4380,
        orderDate: new Date(Date.now() - 1 * 86400000).toISOString(),
        dueDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
        status: 'ORDERED',
        paymentStatus: 'PENDING',
        payments: []
      }
    ]
  },
  {
    id: 'supp-2',
    name: 'Suresh Kumar',
    companyName: 'Delhi Dairy & Beverage Distributors',
    category: 'Dairy, Milk & Cold Beverages',
    phone: '+91 98711 88223',
    email: 'delhidairy.dist@yahoo.com',
    address: 'Plot 15, Industrial Area, Phase 2',
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110020',
    gstin: '07BBBBB1111B2Z6',
    latitude: 28.6142,
    longitude: 77.2198,
    distanceKm: 3.2,
    totalOrdersCount: 14,
    totalPurchases: 32400,
    totalPendingPayment: 3500,
    nextPaymentDueDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // Overdue by 1 day!
    rating: 4.6,
    itemsSupplied: ['Amul Taaza Milk', 'Amul Butter', 'Mother Dairy Paneer', 'Frooti', 'Coca-Cola'],
    purchaseOrders: [
      {
        id: 'po-103',
        orderNumber: 'PO-2026-003',
        supplierId: 'supp-2',
        supplierName: 'Delhi Dairy Distributors',
        items: [
          { productName: 'Amul Taaza Toned Milk (500ml)', quantity: 50, unit: 'packet', unitCost: 25, subtotal: 1250 },
          { productName: 'Amul Butter (100g)', quantity: 30, unit: 'packet', unitCost: 52, subtotal: 1560 },
          { productName: 'Amul Paneer (200g)', quantity: 15, unit: 'packet', unitCost: 75, subtotal: 1125 }
        ],
        totalAmount: 3935,
        paidAmount: 435,
        pendingAmount: 3500,
        orderDate: new Date(Date.now() - 7 * 86400000).toISOString(),
        dueDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
        status: 'RECEIVED',
        paymentStatus: 'OVERDUE',
        payments: [
          { id: 'sp-2', amount: 435, date: new Date(Date.now() - 6 * 86400000).toISOString(), paymentMethod: 'CASH', note: 'Token advance' }
        ]
      }
    ]
  },
  {
    id: 'supp-3',
    name: 'Manish Gupta',
    companyName: 'Gupta FMCG & Spices Traders',
    category: 'Packaged Snacks, Spices & Cleaning',
    phone: '+91 99100 44556',
    email: 'guptafmcg@rediffmail.com',
    address: 'Khari Baoli Main Bazaar, Old Delhi',
    city: 'Delhi NCR',
    state: 'Delhi',
    pincode: '110006',
    gstin: '07CCCCC2222C3Z7',
    latitude: 28.6562,
    longitude: 77.2285,
    distanceKm: 4.5,
    totalOrdersCount: 6,
    totalPurchases: 27900,
    totalPendingPayment: 0,
    rating: 4.9,
    itemsSupplied: ['MDH Masale', 'Tata Salt', 'Maggi Noodles', 'Surf Excel', 'Parle-G'],
    purchaseOrders: [
      {
        id: 'po-104',
        orderNumber: 'PO-2026-004',
        supplierId: 'supp-3',
        supplierName: 'Gupta FMCG Traders',
        items: [
          { productName: 'MDH Deggi Mirch (100g)', quantity: 30, unit: 'box', unitCost: 78, subtotal: 2340 },
          { productName: 'Maggi 2-Minute Noodles (70g)', quantity: 96, unit: 'packet', unitCost: 11.5, subtotal: 1104 }
        ],
        totalAmount: 3444,
        paidAmount: 3444,
        pendingAmount: 0,
        orderDate: new Date(Date.now() - 10 * 86400000).toISOString(),
        dueDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        status: 'RECEIVED',
        paymentStatus: 'PAID',
        payments: [
          { id: 'sp-3', amount: 3444, date: new Date(Date.now() - 3 * 86400000).toISOString(), paymentMethod: 'UPI', referenceId: 'UPI-77112288' }
        ]
      }
    ]
  },
  {
    id: 'supp-4',
    name: 'Vikas Sharma',
    companyName: 'Sharma Packaging & Daily Essentials',
    category: 'Packaging, Bags & Disposables',
    phone: '+91 98105 77119',
    address: 'Warehouse 9, Okhla Industrial Area',
    city: 'Delhi NCR',
    latitude: 28.5355,
    longitude: 77.2732,
    distanceKm: 6.8,
    totalOrdersCount: 3,
    totalPurchases: 8400,
    totalPendingPayment: 1800,
    nextPaymentDueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    rating: 4.5,
    itemsSupplied: ['Carry Bags (Cloth/Paper)', 'Packaging Tape', 'Dukan Receipt Rolls'],
    purchaseOrders: []
  }
];

export const INITIAL_NEARBY_MERCHANTS: NearbyMerchant[] = [
  {
    id: 'merch-1',
    name: 'Ramesh Sharma',
    storeName: 'Sharma General Kirana Store',
    category: 'Daily Grocery & Dairy',
    phone: '+91 98765 43210',
    rating: 4.8,
    address: 'Shop 14, Pocket B Market, Mayur Vihar',
    latitude: 28.6089,
    longitude: 77.2965,
    distanceKm: 0.3,
    isOpen: true,
    upiId: 'dukaan.sharma@okaxis',
    popularItems: ['Aashirvaad Atta', 'Amul Milk', 'Fortune Oil', 'Tata Salt']
  },
  {
    id: 'merch-2',
    name: 'Mohit Verma',
    storeName: 'Verma Provision & Daily Needs',
    category: 'Spices, FMCG & Beverages',
    phone: '+91 98110 99881',
    rating: 4.6,
    address: 'G-4, Central Market, Laxmi Nagar',
    latitude: 28.6312,
    longitude: 77.2778,
    distanceKm: 1.1,
    isOpen: true,
    upiId: 'verma.kirana@paytm',
    popularItems: ['MDH Masale', 'Surf Excel', 'Cadbury Dairy Milk', 'Maggi']
  },
  {
    id: 'merch-3',
    name: 'Pooja Agarwal',
    storeName: 'Krishna Dairy & Organic Store',
    category: 'Fresh Dairy, Paneer & Ghee',
    phone: '+91 98991 22334',
    rating: 4.9,
    address: 'Near Shivalik Park, Malviya Nagar',
    latitude: 28.5412,
    longitude: 77.2089,
    distanceKm: 2.4,
    isOpen: true,
    upiId: 'krishnadairy@okhdfcbank',
    popularItems: ['Desi Ghee', 'Fresh Paneer', 'Amul Taaza Milk', 'Organic Honey']
  },
  {
    id: 'merch-4',
    name: 'Sunil Gupta',
    storeName: 'Gupta Super Mart & Chemist',
    category: 'Personal Care & Groceries',
    phone: '+91 98101 55667',
    rating: 4.5,
    address: 'Shop 2, Block C, Lajpat Nagar 2',
    latitude: 28.5714,
    longitude: 77.2412,
    distanceKm: 3.5,
    isOpen: false,
    upiId: 'guptasupermart@icici',
    popularItems: ['Dettol Soap', 'Colgate Total', 'Dry Fruits', 'Beverages']
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user-merchant-1',
  name: 'Ramesh Sharma',
  phone: '+91 98765 43210',
  email: 'ramesh.sharma.kirana@gmail.com',
  role: 'MERCHANT',
  authProvider: 'phone',
  isLoggedIn: true,
  storeName: 'Sharma General Kirana Store',
  storeCategory: 'Kirana & General Store',
  address: 'Shop 14, Pocket B Market, Mayur Vihar, Delhi',
  latitude: 28.6089,
  longitude: 77.2965,
};
