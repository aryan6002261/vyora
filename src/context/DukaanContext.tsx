import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Product, 
  Customer, 
  Sale, 
  BusinessSummary, 
  ChatMessage, 
  ActionProposal, 
  Language, 
  PaymentMode, 
  SaleItem,
  Supplier,
  PurchaseOrder,
  PurchaseOrderItem,
  SupplierPayment,
  UserProfile,
  UserRole,
  NearbyMerchant,
  PaymentGatewayConfig
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_SALES,
  INITIAL_SUPPLIERS,
  INITIAL_NEARBY_MERCHANTS,
  DEFAULT_USER_PROFILE,
  INITIAL_PAYMENT_CONFIG
} from '../data/initialData';
import { TRANSLATIONS, TranslationKey } from '../data/translations';
import { processAssistantQuery } from '../data/aiLocalEngine';

interface DukaanContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  summary: BusinessSummary;
  chatMessages: ChatMessage[];
  isAiLoading: boolean;
  isSpeaking: boolean;
  cart: { product: Product; quantity: number }[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  processSale: (paymentMode: PaymentMode, customerId?: string, customerName?: string) => Promise<Sale>;
  updateProductStock: (productId: string, delta: number) => void;
  setProductExactStock: (productId: string, newStock: number) => void;
  addNewProduct: (product: Omit<Product, 'id'>) => void;
  addNewCustomer: (name: string, phone: string, initialUdhaar?: number, address?: string) => Customer;
  recordKhataPayment: (customerId: string, amount: number, note?: string) => void;
  recordKhataCredit: (customerId: string, amount: number, note?: string) => void;
  sendAiQuery: (text: string, isVoice?: boolean) => Promise<void>;
  confirmActionProposal: (proposalId: string) => void;
  dismissActionProposal: (proposalId: string) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  resetToDemoData: () => void;
  openWhatsApp: (phone: string, message: string) => void;

  // New Supplier & Purchase Order state & actions
  suppliers: Supplier[];
  addNewSupplier: (supplierData: Omit<Supplier, 'id' | 'totalOrdersCount' | 'totalPurchases' | 'totalPendingPayment' | 'purchaseOrders'>) => Supplier;
  createPurchaseOrder: (supplierId: string, items: PurchaseOrderItem[], dueDate?: string) => PurchaseOrder;
  recordSupplierPayment: (supplierId: string, orderId: string, amount: number, method: 'UPI' | 'NEFT' | 'CASH' | 'CHEQUE', refId?: string, note?: string) => void;
  updatePurchaseOrderStatus: (supplierId: string, orderId: string, status: PurchaseOrder['status']) => void;
  totalPendingSupplierPayments: number;
  overdueSupplierPaymentsCount: number;
  getPendingSupplierPaymentsCount: () => number;
  getTotalSupplierPendingAmount: () => number;

  // User Auth & Role state & actions
  currentUser: UserProfile;
  loginUser: (role: UserRole, authProvider: 'google' | 'phone', name?: string, phoneOrEmail?: string) => void;
  logoutUser: () => void;
  switchRole: (newRole: UserRole) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  nearbyMerchants: NearbyMerchant[];

  // Payment Gateway Configuration
  paymentConfig: PaymentGatewayConfig;
  updatePaymentConfig: (config: Partial<PaymentGatewayConfig>) => void;
}

const DukaanContext = createContext<DukaanContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'dukaan_products_v1',
  CUSTOMERS: 'dukaan_customers_v1',
  SALES: 'dukaan_sales_v1',
  CHAT: 'dukaan_chat_v1',
  LANG: 'dukaan_lang_v1',
  SUPPLIERS: 'dukaan_suppliers_v1',
  USER: 'dukaan_user_v1',
  PAYMENT_CONFIG: 'dukaan_pay_config_v1',
};

export const DukaanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'hinglish';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const getUserKey = (user: UserProfile) => {
    const identifier = user.email || user.phone || user.id || 'default';
    return `dukaan_acc_${user.role}_${identifier.replace(/[^a-zA-Z0-9]/g, '_')}_`;
  };

  const userPrefix = getUserKey(currentUser);

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(userPrefix + 'products');
      if (saved) return JSON.parse(saved);
      const globalSaved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return globalSaved ? JSON.parse(globalSaved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(userPrefix + 'customers');
      if (saved) return JSON.parse(saved);
      const globalSaved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return globalSaved ? JSON.parse(globalSaved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(userPrefix + 'sales');
      if (saved) return JSON.parse(saved);
      const globalSaved = localStorage.getItem(STORAGE_KEYS.SALES);
      return globalSaved ? JSON.parse(globalSaved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(userPrefix + 'chat');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: currentUser.role === 'CLIENT'
          ? 'Namaste Grahak ji! 🙏 DukaanAI Shopping Assistant mein aapka swagat hai. Aap apne aas-paas ki dukaanon ke baare mein ya apne udhaar khata ke baare mein pooch sakte hain!'
          : currentUser.role === 'SUPPLIER'
          ? 'Namaste Supplier ji! 🙏 DukaanAI Wholesale Portal mein aapka swagat hai. Aap apne pending purchase orders aur payment collections yahan track kar sakte hain!'
          : 'Namaste Sethji! 🙏 Mai hoon DukaanAI, aapka personal digital munimji. Aap bol kar ya likh kar dukaan ki sale, stock, aur khata ke baare mein kuch bhi pooch sakte hain!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    try {
      const saved = localStorage.getItem(userPrefix + 'suppliers');
      if (saved) return JSON.parse(saved);
      const globalSaved = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
      return globalSaved ? JSON.parse(globalSaved) : INITIAL_SUPPLIERS;
    } catch {
      return INITIAL_SUPPLIERS;
    }
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentGatewayConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENT_CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_PAYMENT_CONFIG;
    } catch {
      return INITIAL_PAYMENT_CONFIG;
    }
  });

  const [nearbyMerchants] = useState<NearbyMerchant[]>(INITIAL_NEARBY_MERCHANTS);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);

  // Local storage & account memory synchronization
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    localStorage.setItem(userPrefix + 'products', JSON.stringify(products));
  }, [products, userPrefix]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    localStorage.setItem(userPrefix + 'customers', JSON.stringify(customers));
  }, [customers, userPrefix]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    localStorage.setItem(userPrefix + 'sales', JSON.stringify(sales));
  }, [sales, userPrefix]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
    localStorage.setItem(userPrefix + 'chat', JSON.stringify(chatMessages));
  }, [chatMessages, userPrefix]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
    localStorage.setItem(userPrefix + 'suppliers', JSON.stringify(suppliers));
  }, [suppliers, userPrefix]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(paymentConfig));
  }, [paymentConfig]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.english[key] || key;
  }, [language]);


  // Compute live business summary
  const summary: BusinessSummary = useMemo(() => {
    // Today's date comparison (or all sales if created in session)
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = sales.filter(s => s.timestamp.startsWith(today));

    let todayRevenue = 0;
    let todayCost = 0;
    let cashRevenue = 0;
    let upiRevenue = 0;
    let udhaarRevenue = 0;

    todaySales.forEach(s => {
      todayRevenue += s.totalAmount;
      todayCost += s.totalCost;
      if (s.paymentMode === 'CASH') cashRevenue += s.totalAmount;
      if (s.paymentMode === 'UPI') upiRevenue += s.totalAmount;
      if (s.paymentMode === 'UDHAAR') udhaarRevenue += s.totalAmount;
    });

    const todayProfit = todayRevenue - todayCost;
    const totalUdhaar = customers.reduce((sum, c) => sum + (c.udhaarBalance || 0), 0);
    const lowStockItemsCount = products.filter(p => p.stock <= p.minStockThreshold).length;

    return {
      todayRevenue,
      todayProfit,
      todaySalesCount: todaySales.length,
      totalUdhaar,
      lowStockItemsCount,
      cashRevenue,
      upiRevenue,
      udhaarRevenue,
    };
  }, [sales, customers, products]);

  // Cart Management
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Process a sale and update inventory & khata automatically
  const processSale = useCallback(async (
    paymentMode: PaymentMode, 
    customerId?: string, 
    customerName?: string
  ): Promise<Sale> => {
    if (cart.length === 0) {
      throw new Error('Cart is empty');
    }

    const saleItems: SaleItem[] = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      unit: item.product.unit,
      unitPrice: item.product.sellingPrice,
      unitCost: item.product.purchasePrice,
      subtotal: item.product.sellingPrice * item.quantity,
    }));

    const totalAmount = saleItems.reduce((sum, i) => sum + i.subtotal, 0);
    const totalCost = saleItems.reduce((sum, i) => sum + (i.unitCost * i.quantity), 0);
    const profit = totalAmount - totalCost;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      invoiceNo: `BILL-${1040 + sales.length + 1}`,
      items: saleItems,
      totalAmount,
      totalCost,
      profit,
      paymentMode,
      customerId,
      customerName,
      timestamp: new Date().toISOString(),
    };

    // 1. Deduct product stocks
    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const cartItem = cart.find(c => c.product.id === prod.id);
        if (cartItem) {
          const updatedStock = Math.max(0, prod.stock - cartItem.quantity);
          return { ...prod, stock: updatedStock };
        }
        return prod;
      });
    });

    // 2. If Udhaar, add transaction to Customer's Khata
    if (paymentMode === 'UDHAAR' && customerId) {
      setCustomers(prevCustomers => {
        return prevCustomers.map(cust => {
          if (cust.id === customerId) {
            const newBalance = cust.udhaarBalance + totalAmount;
            const itemsSummary = cart.map(c => `${c.quantity}x ${c.product.name}`).join(', ');
            return {
              ...cust,
              udhaarBalance: newBalance,
              lastActive: 'Just now',
              transactions: [
                {
                  id: `tx-${Date.now()}`,
                  customerId: cust.id,
                  customerName: cust.name,
                  type: 'CREDIT_GIVEN',
                  amount: totalAmount,
                  date: new Date().toLocaleString(),
                  note: `Bill ${newSale.invoiceNo}: ${itemsSummary}`,
                  saleId: newSale.id,
                  balanceAfter: newBalance,
                },
                ...cust.transactions,
              ],
            };
          }
          return cust;
        });
      });
    }

    // 3. Save new sale
    setSales(prev => [newSale, ...prev]);
    clearCart();

    return newSale;
  }, [cart, sales.length, clearCart]);

  // Inventory Stock adjustments
  const updateProductStock = useCallback((productId: string, delta: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return { ...p, stock: Math.max(0, p.stock + delta) };
        }
        return p;
      })
    );
  }, []);

  const setProductExactStock = useCallback((productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return { ...p, stock: Math.max(0, newStock) };
        }
        return p;
      })
    );
  }, []);

  const addNewProduct = useCallback((prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
    };
    setProducts(prev => [newProd, ...prev]);
  }, []);

  // Customer & Khata management
  const addNewCustomer = useCallback((name: string, phone: string, initialUdhaar = 0, address = ''): Customer => {
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      udhaarBalance: initialUdhaar,
      lastActive: 'Just now',
      address,
      transactions: initialUdhaar > 0 ? [
        {
          id: `tx-${Date.now()}`,
          customerId: `cust-${Date.now()}`,
          customerName: name,
          type: 'CREDIT_GIVEN',
          amount: initialUdhaar,
          date: new Date().toLocaleString(),
          note: 'Opening Udhaar Balance',
          balanceAfter: initialUdhaar,
        }
      ] : [],
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  }, []);

  const recordKhataPayment = useCallback((customerId: string, amount: number, note = 'Cash payment received') => {
    setCustomers(prev =>
      prev.map(cust => {
        if (cust.id === customerId) {
          const newBal = Math.max(0, cust.udhaarBalance - amount);
          return {
            ...cust,
            udhaarBalance: newBal,
            lastActive: 'Just now',
            transactions: [
              {
                id: `tx-${Date.now()}`,
                customerId: cust.id,
                customerName: cust.name,
                type: 'PAYMENT_RECEIVED',
                amount,
                date: new Date().toLocaleString(),
                note,
                balanceAfter: newBal,
              },
              ...cust.transactions,
            ],
          };
        }
        return cust;
      })
    );
  }, []);

  const recordKhataCredit = useCallback((customerId: string, amount: number, note = 'Credit / Udhaar given') => {
    setCustomers(prev =>
      prev.map(cust => {
        if (cust.id === customerId) {
          const newBal = cust.udhaarBalance + amount;
          return {
            ...cust,
            udhaarBalance: newBal,
            lastActive: 'Just now',
            transactions: [
              {
                id: `tx-${Date.now()}`,
                customerId: cust.id,
                customerName: cust.name,
                type: 'CREDIT_GIVEN',
                amount,
                date: new Date().toLocaleString(),
                note,
                balanceAfter: newBal,
              },
              ...cust.transactions,
            ],
          };
        }
        return cust;
      })
    );
  }, []);

  // WhatsApp sender utility
  const openWhatsApp = useCallback((phone: string, message: string) => {
    // Format Indian phone number
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }, []);

  // Text-To-Speech (TTS)
  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // stop any prior speech

    // Clean markdown symbols from text before speaking
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/•/g, '')
      .replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try finding Hindi or Indian English voice
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN') || 
                       voices.find(v => v.lang.startsWith('hi')) ||
                       voices.find(v => v.lang === 'en-IN') ||
                       voices.find(v => v.name.includes('India'));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // AI Assistant Query Handler
  const sendAiQuery = useCallback(async (query: string, isVoice = false) => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVoice,
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      let replyText = '';
      let actionProposal: ActionProposal | undefined;

      try {
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            context: {
              products,
              customers,
              sales,
              summary,
              suppliers,
              currentUser,
              nearbyMerchants,
              language,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.reply) {
            replyText = data.reply;
            actionProposal = data.actionProposal;
          }
        }
      } catch (networkErr) {
        console.warn('Backend assistant endpoint unreachable, running local NLP engine:', networkErr);
      }

      // If network call did not succeed, run our local multi-lingual NLP engine
      if (!replyText) {
        const localResult = processAssistantQuery(query, {
          products,
          customers,
          sales,
          summary,
          suppliers,
          currentUser,
          nearbyMerchants,
          language,
        });
        replyText = localResult.reply;
        actionProposal = localResult.actionProposal;
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionProposal,
      };

      setChatMessages(prev => [...prev, assistantMsg]);

      if (isVoice) {
        speakText(replyText);
      }
    } catch (err) {
      console.error('Error in sendAiQuery:', err);
      const localResult = processAssistantQuery(query, {
        products,
        customers,
        sales,
        summary,
        suppliers,
        currentUser,
        nearbyMerchants,
        language,
      });
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: localResult.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionProposal: localResult.actionProposal,
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsAiLoading(false);
    }
  }, [products, customers, sales, summary, suppliers, currentUser, nearbyMerchants, language, speakText]);

  // Action Proposal Confirmation
  const confirmActionProposal = useCallback((proposalId: string) => {
    setChatMessages(prev =>
      prev.map(msg => {
        if (msg.actionProposal && msg.actionProposal.id === proposalId) {
          const action = msg.actionProposal;

          if (action.type === 'SEND_WHATSAPP_REMINDER') {
            const phone = action.details.phone || '9876543210';
            const message = action.details.whatsAppMessage || 'Namaste! Udhaar payment reminder.';
            openWhatsApp(phone, message);
          } else if (action.type === 'UPDATE_STOCK') {
            const prodId = action.details.productId;
            const qty = action.details.quantity || 10;
            if (prodId) {
              updateProductStock(prodId, qty);
            }
          }

          return {
            ...msg,
            actionProposal: {
              ...action,
              status: 'EXECUTED',
            },
          };
        }
        return msg;
      })
    );
  }, [openWhatsApp, updateProductStock]);

  const dismissActionProposal = useCallback((proposalId: string) => {
    setChatMessages(prev =>
      prev.map(msg => {
        if (msg.actionProposal && msg.actionProposal.id === proposalId) {
          return {
            ...msg,
            actionProposal: {
              ...msg.actionProposal,
              status: 'DISMISSED',
            },
          };
        }
        return msg;
      })
    );
  }, []);

  // Supplier helper computations
  const totalPendingSupplierPayments = useMemo(() => {
    return suppliers.reduce((sum, supp) => sum + (supp.totalPendingPayment || 0), 0);
  }, [suppliers]);

  const overdueSupplierPaymentsCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    let count = 0;
    suppliers.forEach(s => {
      s.purchaseOrders?.forEach(po => {
        if (po.paymentStatus === 'OVERDUE' || (po.paymentStatus !== 'PAID' && po.dueDate && po.dueDate < today)) {
          count++;
        }
      });
    });
    return count;
  }, [suppliers]);

  const getPendingSupplierPaymentsCount = useCallback(() => {
    let count = 0;
    suppliers.forEach(s => {
      s.purchaseOrders?.forEach(po => {
        if (po.paymentStatus !== 'PAID') {
          count++;
        }
      });
    });
    return count;
  }, [suppliers]);

  const getTotalSupplierPendingAmount = useCallback(() => {
    return suppliers.reduce((sum, supp) => sum + (supp.totalPendingPayment || 0), 0);
  }, [suppliers]);

  // Supplier action methods
  const addNewSupplier = useCallback((supplierData: Omit<Supplier, 'id' | 'totalOrdersCount' | 'totalPurchases' | 'totalPendingPayment' | 'purchaseOrders'>): Supplier => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `supp-${Date.now()}`,
      totalOrdersCount: 0,
      totalPurchases: 0,
      totalPendingPayment: 0,
      purchaseOrders: [],
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    return newSupplier;
  }, []);

  const createPurchaseOrder = useCallback((supplierId: string, items: PurchaseOrderItem[], dueDate?: string): PurchaseOrder => {
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    const orderNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const due = dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const targetSupplier = suppliers.find(s => s.id === supplierId);
    const supplierName = targetSupplier ? targetSupplier.companyName : 'Supplier';

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      orderNumber,
      supplierId,
      supplierName,
      items,
      totalAmount,
      paidAmount: 0,
      pendingAmount: totalAmount,
      orderDate: new Date().toISOString(),
      dueDate: due,
      status: 'ORDERED',
      paymentStatus: 'PENDING',
      payments: []
    };

    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        return {
          ...s,
          totalOrdersCount: (s.totalOrdersCount || 0) + 1,
          totalPurchases: (s.totalPurchases || 0) + totalAmount,
          totalPendingPayment: (s.totalPendingPayment || 0) + totalAmount,
          nextPaymentDueDate: due,
          purchaseOrders: [newPO, ...(s.purchaseOrders || [])]
        };
      }
      return s;
    }));

    return newPO;
  }, [suppliers]);

  const recordSupplierPayment = useCallback((
    supplierId: string, 
    orderId: string, 
    amount: number, 
    method: 'UPI' | 'NEFT' | 'CASH' | 'CHEQUE', 
    refId?: string, 
    note?: string
  ) => {
    const newPayment: SupplierPayment = {
      id: `sp-${Date.now()}`,
      amount,
      date: new Date().toISOString(),
      paymentMethod: method,
      referenceId: refId || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      note
    };

    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        let orderFound = false;
        const updatedOrders = (s.purchaseOrders || []).map(po => {
          if (po.id === orderId) {
            orderFound = true;
            const newPaid = po.paidAmount + amount;
            const newPending = Math.max(0, po.totalAmount - newPaid);
            const status: PurchaseOrder['paymentStatus'] = newPending === 0 ? 'PAID' : newPaid > 0 ? 'PARTIAL' : 'PENDING';
            return {
              ...po,
              paidAmount: newPaid,
              pendingAmount: newPending,
              paymentStatus: status,
              payments: [newPayment, ...(po.payments || [])]
            };
          }
          return po;
        });

        const newTotalPending = Math.max(0, (s.totalPendingPayment || 0) - amount);

        return {
          ...s,
          totalPendingPayment: newTotalPending,
          purchaseOrders: updatedOrders
        };
      }
      return s;
    }));
  }, []);

  const updatePurchaseOrderStatus = useCallback((supplierId: string, orderId: string, status: PurchaseOrder['status']) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === supplierId) {
        return {
          ...s,
          purchaseOrders: (s.purchaseOrders || []).map(po => {
            if (po.id === orderId) {
              return { ...po, status };
            }
            return po;
          })
        };
      }
      return s;
    }));
  }, []);

  // User Auth & Switch actions
  const loginUser = useCallback((role: UserRole, authProvider: 'google' | 'phone', name?: string, phoneOrEmail?: string) => {
    const isGoogle = authProvider === 'google';
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      name: name || (isGoogle ? (role === 'MERCHANT' ? 'Ramesh Sharma' : 'Priya Verma') : role === 'SUPPLIER' ? 'Gupta Wholesale' : role === 'MERCHANT' ? 'Ramesh Sharma' : 'Priya Verma'),
      phone: !isGoogle ? (phoneOrEmail || '+91 98765 43210') : '+91 98991 22334',
      email: isGoogle ? (phoneOrEmail || 'user.demo@gmail.com') : undefined,
      role,
      authProvider,
      isLoggedIn: true,
      storeName: role === 'MERCHANT' ? 'Sharma General Kirana Store' : role === 'SUPPLIER' ? 'Gupta Wholesale Distributors' : undefined,
      storeCategory: role === 'MERCHANT' ? 'Kirana & Daily Needs' : role === 'SUPPLIER' ? 'Wholesale Grain & Oil' : undefined,
      address: role === 'MERCHANT' ? 'Shop 14, Pocket B Market, Mayur Vihar, Delhi' : 'Sector 15, Vasundhara Enclave, Delhi',
      latitude: 28.6089,
      longitude: 77.2965,
    };
    setCurrentUser(profile);

    // Load account-specific memory
    const identifier = profile.email || profile.phone || profile.id;
    const prefix = `dukaan_acc_${profile.role}_${identifier.replace(/[^a-zA-Z0-9]/g, '_')}_`;
    try {
      const savedProd = localStorage.getItem(prefix + 'products');
      if (savedProd) setProducts(JSON.parse(savedProd));
      const savedCust = localStorage.getItem(prefix + 'customers');
      if (savedCust) setCustomers(JSON.parse(savedCust));
      const savedSales = localStorage.getItem(prefix + 'sales');
      if (savedSales) setSales(JSON.parse(savedSales));
      const savedChat = localStorage.getItem(prefix + 'chat');
      if (savedChat) setChatMessages(JSON.parse(savedChat));
      const savedSupp = localStorage.getItem(prefix + 'suppliers');
      if (savedSupp) setSuppliers(JSON.parse(savedSupp));
    } catch (e) {
      console.warn('Could not load account memory:', e);
    }

    if (role === 'CLIENT') {
      setActiveTab('nearby');
    } else if (role === 'SUPPLIER') {
      setActiveTab('suppliers');
    } else {
      setActiveTab('dashboard');
    }
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUser({
      ...DEFAULT_USER_PROFILE,
      isLoggedIn: false,
    });
    setActiveTab('login');
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setCurrentUser(prev => ({
      ...prev,
      role: newRole,
      name: newRole === 'MERCHANT' ? 'Ramesh Sharma' : 'Priya Verma',
      storeName: newRole === 'MERCHANT' ? 'Sharma General Kirana Store' : undefined,
    }));
    if (newRole === 'CLIENT') {
      setActiveTab('nearby');
    } else {
      setActiveTab('dashboard');
    }
  }, []);

  const updateUserProfile = useCallback((profile: Partial<UserProfile>) => {
    setCurrentUser(prev => ({ ...prev, ...profile }));
  }, []);

  const updatePaymentConfig = useCallback((config: Partial<PaymentGatewayConfig>) => {
    setPaymentConfig(prev => ({ ...prev, ...config }));
  }, []);

  // Reset to initial hackathon state
  const resetToDemoData = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setSales(INITIAL_SALES);
    setSuppliers(INITIAL_SUPPLIERS);
    setCurrentUser(DEFAULT_USER_PROFILE);
    setPaymentConfig(INITIAL_PAYMENT_CONFIG);
    setActiveTab('dashboard');
    setCart([]);
    setChatMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Namaste Sethji! 🙏 DukaanAI ready hai. Demo questions try karein jaise: "Aaj kya bik raha hai?", "Atta kitna bacha hai?", ya "Ramesh ka 850 rupaye udhaar hai, reminder bana do."',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.SALES);
    localStorage.removeItem(STORAGE_KEYS.CHAT);
    localStorage.removeItem(STORAGE_KEYS.SUPPLIERS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PAYMENT_CONFIG);
  }, []);

  return (
    <DukaanContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeTab,
        setActiveTab,
        products,
        customers,
        sales,
        summary,
        chatMessages,
        isAiLoading,
        isSpeaking,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        processSale,
        updateProductStock,
        setProductExactStock,
        addNewProduct,
        addNewCustomer,
        recordKhataPayment,
        recordKhataCredit,
        sendAiQuery,
        confirmActionProposal,
        dismissActionProposal,
        speakText,
        stopSpeaking,
        resetToDemoData,
        openWhatsApp,
        suppliers,
        addNewSupplier,
        createPurchaseOrder,
        recordSupplierPayment,
        updatePurchaseOrderStatus,
        totalPendingSupplierPayments,
        overdueSupplierPaymentsCount,
        getPendingSupplierPaymentsCount,
        getTotalSupplierPendingAmount,
        currentUser,
        loginUser,
        logoutUser,
        switchRole,
        updateUserProfile,
        nearbyMerchants,
        paymentConfig,
        updatePaymentConfig,
      }}
    >
      {children}
    </DukaanContext.Provider>
  );
};

export const useDukaan = () => {
  const context = useContext(DukaanContext);
  if (!context) {
    throw new Error('useDukaan must be used within a DukaanProvider');
  }
  return context;
};
