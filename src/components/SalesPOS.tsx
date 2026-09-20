import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle, 
  IndianRupee, 
  QrCode, 
  CreditCard, 
  Wallet, 
  BookOpen, 
  ArrowRight,
  Share2,
  Printer,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';
import { Product, PaymentMode, ProductCategory, Sale } from '../types';

export const SalesPOS: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    processSale, 
    customers, 
    language,
    openWhatsApp 
  } = useDukaan();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('CASH');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = ['All', 'Grains & Atta', 'Dairy & Eggs', 'Oils & Ghee', 'Spices & Masala', 'Snacks & Biscuits', 'Beverages', 'Cleaning & Household', 'Personal Care'];

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchQuery));
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  }, [cart]);

  const cartEstimatedProfit = useMemo(() => {
    return cart.reduce((sum, item) => {
      const cost = item.product.purchasePrice * item.quantity;
      const rev = item.product.sellingPrice * item.quantity;
      return sum + (rev - cost);
    }, 0);
  }, [cart]);

  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId);
  }, [customers, selectedCustomerId]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (paymentMode === 'UDHAAR' && !selectedCustomerId) {
      alert('Kripya udhaar ke liye grahak select karein.');
      return;
    }

    setIsProcessing(true);
    try {
      const sale = await processSale(
        paymentMode,
        paymentMode === 'UDHAAR' ? selectedCustomer?.id : undefined,
        paymentMode === 'UDHAAR' ? selectedCustomer?.name : undefined
      );
      setCompletedSale(sale);
    } catch (err: any) {
      alert(err.message || 'Sale process karne mein truti hui');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareWhatsAppBill = (sale: Sale) => {
    const itemsText = sale.items.map(i => `• ${i.productName} (${i.quantity} ${i.unit}) - ₹${i.subtotal}`).join('\n');
    const msg = `🧾 *DukaanAI Digital Bill: ${sale.invoiceNo}*\n` +
      `📅 Tareekh: ${new Date(sale.timestamp).toLocaleDateString()} ${new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n\n` +
      `*Kharidari Summary:*\n${itemsText}\n\n` +
      `💰 *Kul Yog: ₹${sale.totalAmount}*\n` +
      `💳 Bhugtan Mode: ${sale.paymentMode}\n` +
      (sale.paymentMode === 'UDHAAR' ? `📝 Khata Udhaar Balance: ₹${(selectedCustomer?.udhaarBalance || 0)}\n` : '') +
      `\nAapki dukaan par aane ke liye dhanyawad! 🙏`;

    const targetPhone = selectedCustomer?.phone || '9876543210';
    openWhatsApp(targetPhone, msg);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            <span>{language === 'hindi' ? 'बिक्री और नया बिल (POS Billing)' : 'Quick POS & New Sale'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Select items to bill, calculate instant profit, and update stock automatically.
          </p>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="self-start sm:self-auto text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        )}
      </div>

      {/* Main 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Catalog & Search (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              id="input-product-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product (Atta, Doodh, Biscuit, Salt, barcode...)"
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium shadow-2xs"
            />
          </div>

          {/* Category Chips Filter */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredProducts.map(product => {
              const inCart = cart.find(c => c.product.id === product.id);
              const isLow = product.stock <= product.minStockThreshold;
              const isOut = product.stock === 0;

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                    inCart 
                      ? 'border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-50/20' 
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {product.name}
                      </h4>
                      {isLow && !isOut && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm shrink-0">
                          Low: {product.stock}
                        </span>
                      )}
                      {isOut && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-sm shrink-0">
                          Out of stock
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mb-2">
                      {product.nameHindi}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                    <div>
                      <div className="text-base font-black text-slate-900">
                        ₹{product.sellingPrice}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        Margin: ₹{product.sellingPrice - product.purchasePrice}
                      </div>
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-1 bg-emerald-700 text-white rounded-lg p-1">
                        <button
                          onClick={() => updateCartQuantity(product.id, inCart.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-emerald-800 rounded font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black px-2">{inCart.quantity}</span>
                        <button
                          disabled={inCart.quantity >= product.stock}
                          onClick={() => updateCartQuantity(product.id, inCart.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-emerald-800 rounded font-bold disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-add-${product.id}`}
                        disabled={isOut}
                        onClick={() => addToCart(product)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-lg shadow-2xs transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Jodo
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Billing Cart Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs sticky top-24 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-black text-slate-900 text-base">
                Current Bill
              </h3>
              <p className="text-xs text-slate-500">
                {cart.length} unique products in cart
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Est. Profit: +₹{cartEstimatedProfit}
              </div>
            </div>
          </div>

          {/* Cart Item list */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                Cart is empty. Tap items on the left to add.
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-2.5 flex items-center justify-between text-sm">
                  <div className="flex-1 pr-2">
                    <div className="font-bold text-slate-800 text-xs sm:text-sm leading-tight">
                      {product.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ₹{product.sellingPrice} × {quantity} {product.unit}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-md">
                      <button
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                        className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-1.5">{quantity}</span>
                      <button
                        disabled={quantity >= product.stock}
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        className="px-1.5 py-0.5 text-slate-600 hover:bg-slate-100 font-bold disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-sm font-black text-slate-900 w-16 text-right">
                      ₹{product.sellingPrice * quantity}
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Mode Selector */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Payment Mode (भुगतान का तरीका)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMode('CASH')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all ${
                  paymentMode === 'CASH'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Wallet className="w-4 h-4 mb-1 text-emerald-600" />
                <span>Cash (नकद)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all ${
                  paymentMode === 'UPI'
                    ? 'bg-blue-50 text-blue-900 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 mb-1 text-blue-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('UDHAAR')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all ${
                  paymentMode === 'UDHAAR'
                    ? 'bg-rose-50 text-rose-900 border-rose-500 ring-2 ring-rose-500/20'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4 mb-1 text-rose-600" />
                <span>Udhaar (खाता)</span>
              </button>
            </div>
          </div>

          {/* Customer Picker for Udhaar Mode */}
          {paymentMode === 'UDHAAR' && (
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                <span>Select Khata Customer</span>
                {selectedCustomer && (
                  <span>Current Udhaar: ₹{selectedCustomer.udhaarBalance}</span>
                )}
              </div>
              <select
                id="select-khata-customer"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full p-2 text-xs font-semibold bg-white border border-rose-300 rounded-lg text-slate-800"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - Udhaar: ₹{c.udhaarBalance}
                  </option>
                ))}
              </select>
              {selectedCustomer && (
                <div className="text-[11px] text-rose-800 font-medium">
                  Is bill ke baad naya udhaar balance hoga: <strong>₹{selectedCustomer.udhaarBalance + cartSubtotal}</strong>
                </div>
              )}
            </div>
          )}

          {/* Total & Checkout Action */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-bold text-slate-600">Grand Total (कुल राशि)</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                ₹{cartSubtotal}
              </span>
            </div>

            <button
              id="btn-complete-sale"
              disabled={cart.length === 0 || isProcessing}
              onClick={handleCheckout}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Generating Bill...</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Bill Banayein (₹{cartSubtotal})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bill Success Modal */}
      {completedSale && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Bill Successfully Created!</h3>
              <p className="text-xs text-slate-500 font-medium">
                {completedSale.invoiceNo} • Inventory updated automatically
              </p>
            </div>

            {/* Bill Preview Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-700 border-b border-slate-200 pb-1.5">
                <span>Items ({completedSale.items.length})</span>
                <span>Amount</span>
              </div>
              {completedSale.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-600">
                  <span>{it.quantity}x {it.productName}</span>
                  <span className="font-semibold">₹{it.subtotal}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                <span>Total Paid ({completedSale.paymentMode})</span>
                <span>₹{completedSale.totalAmount}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleShareWhatsAppBill(completedSale)}
                className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp par Bill Bhejein</span>
              </button>

              <button
                onClick={() => setCompletedSale(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Close & Next Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
