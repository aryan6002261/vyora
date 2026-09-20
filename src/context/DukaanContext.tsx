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
  SaleItem 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_SALES } from '../data/initialData';

interface DukaanContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
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
}

const DukaanContext = createContext<DukaanContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'dukaan_products_v1',
  CUSTOMERS: 'dukaan_customers_v1',
  SALES: 'dukaan_sales_v1',
  CHAT: 'dukaan_chat_v1',
  LANG: 'dukaan_lang_v1',
};

export const DukaanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'hinglish';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SALES);
      return saved ? JSON.parse(saved) : INITIAL_SALES;
    } catch {
      return INITIAL_SALES;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Namaste Sethji! 🙏 Mai hoon DukaanAI, aapka personal digital munimji. Aap bol kar ya likh kar dukaan ki sale, stock, aur khata ke baare mein kuch bhi pooch sakte hain!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ];
  });

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
  }, [chatMessages]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }, []);

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
          },
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'Sethji, mujhe samajhne mein thodi samasya hui. Kripya punah prayas karein.';

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionProposal: data.actionProposal,
      };

      setChatMessages(prev => [...prev, assistantMsg]);

      // If spoken voice query, read out response automatically
      if (isVoice) {
        speakText(replyText);
      }
    } catch (err) {
      console.error('Error sending query to AI:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: 'Sethji, network connection mein thoda issue hai. Kripya punah prayas karein.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAiLoading(false);
    }
  }, [products, customers, sales, summary, speakText]);

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

  // Reset to initial hackathon state
  const resetToDemoData = useCallback(() => {
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS);
    setSales(INITIAL_SALES);
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
  }, []);

  return (
    <DukaanContext.Provider
      value={{
        language,
        setLanguage,
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
