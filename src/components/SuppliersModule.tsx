import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Search, 
  ArrowUpRight, 
  FileText, 
  CreditCard,
  Send,
  Sparkles,
  ChevronRight,
  Package,
  Check,
  X,
  MessageCircle
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';
import { Supplier, PurchaseOrder, PurchaseOrderItem, UnitType } from '../types';

export const SuppliersModule: React.FC = () => {
  const { 
    suppliers, 
    addNewSupplier, 
    createPurchaseOrder, 
    recordSupplierPayment,
    updatePurchaseOrderStatus,
    totalPendingSupplierPayments,
    overdueSupplierPaymentsCount,
    products,
    language,
    openWhatsApp
  } = useDukaan();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(suppliers[0] || null);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showNewPOModal, setShowNewPOModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activePaymentPO, setActivePaymentPO] = useState<PurchaseOrder | null>(null);

  // New Supplier Form State
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Delhi NCR');
  const [newGstin, setNewGstin] = useState('');

  // PO Form State
  const [poDueDate, setPoDueDate] = useState(() => {
    return new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  });
  const [poItems, setPoItems] = useState<PurchaseOrderItem[]>([
    { productName: 'Aashirvaad Shudh Chakki Atta (10kg)', quantity: 10, unit: 'packet', unitCost: 385, subtotal: 3850 }
  ]);

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NEFT' | 'CASH' | 'CHEQUE'>('UPI');
  const [paymentRefId, setPaymentRefId] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  // Filtered suppliers
  const filteredSuppliers = suppliers.filter(s => 
    s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  );

  // Quick PO item addition
  const handleAddPOItem = () => {
    setPoItems(prev => [
      ...prev,
      { productName: '', quantity: 1, unit: 'packet', unitCost: 100, subtotal: 100 }
    ]);
  };

  const handleUpdatePOItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    setPoItems(prev => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };
      if (field === 'quantity' || field === 'unitCost') {
        item.subtotal = Number(item.quantity || 0) * Number(item.unitCost || 0);
      }
      updated[index] = item;
      return updated;
    });
  };

  const handleRemovePOItem = (index: number) => {
    setPoItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateNewSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newPhone.trim()) return;

    const created = addNewSupplier({
      name: newSupplierName.trim() || newCompanyName.trim(),
      companyName: newCompanyName.trim(),
      category: newCategory.trim() || 'General FMCG & Kirana',
      phone: newPhone.trim(),
      email: newEmail.trim() || undefined,
      address: newAddress.trim() || 'Wholesale Market',
      city: newCity.trim(),
      gstin: newGstin.trim() || undefined,
      latitude: 28.6289,
      longitude: 77.2065,
      distanceKm: 2.5,
      rating: 4.8,
      itemsSupplied: ['Daily Kirana Essentials'],
    });

    setSelectedSupplier(created);
    setShowAddSupplierModal(false);
    // Reset
    setNewSupplierName('');
    setNewCompanyName('');
    setNewPhone('');
    setNewAddress('');
    setNewGstin('');
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || poItems.length === 0) return;

    createPurchaseOrder(selectedSupplier.id, poItems, poDueDate);
    setShowNewPOModal(false);
    // Reset
    setPoItems([{ productName: 'Aashirvaad Shudh Chakki Atta (10kg)', quantity: 10, unit: 'packet', unitCost: 385, subtotal: 3850 }]);
    // Re-sync selectedSupplier reference
    const updated = suppliers.find(s => s.id === selectedSupplier.id);
    if (updated) setSelectedSupplier(updated);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !activePaymentPO || paymentAmount <= 0) return;

    recordSupplierPayment(
      selectedSupplier.id,
      activePaymentPO.id,
      paymentAmount,
      paymentMethod,
      paymentRefId || `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`,
      paymentNote
    );

    setShowPaymentModal(false);
    setActivePaymentPO(null);
    setPaymentAmount(0);
    setPaymentRefId('');
    setPaymentNote('');

    // Re-sync selectedSupplier
    const updated = suppliers.find(s => s.id === selectedSupplier.id);
    if (updated) setSelectedSupplier(updated);
  };

  // Check today's overdue alerts
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Top Header & Alert Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-7 h-7 text-indigo-600" />
              {language === 'hindi' ? 'सप्लायर / थोक व्यापारी' : 'Suppliers & Purchase Orders'}
            </h2>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              B2B Wholesale
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {language === 'hindi'
              ? 'सप्लायर्स का हिसाब, पर्चे (PO), और पेंडिंग भुगतान ट्रैक करें'
              : 'Track wholesale vendors, log purchase orders, and monitor pending payments.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-add-supplier"
            onClick={() => setShowAddSupplierModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Naya Supplier Jodo</span>
          </button>
        </div>
      </div>

      {/* Highlights / Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Outstanding Supplier Dues */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Supplier Udhaar (Dues)</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{totalPendingSupplierPayments.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Across {suppliers.filter(s => (s.totalPendingPayment || 0) > 0).length} active wholesale vendors
          </p>
        </div>

        {/* Overdue Payment Alerts */}
        <div className={`border rounded-2xl p-4 shadow-xs ${
          overdueSupplierPaymentsCount > 0 
            ? 'bg-rose-50 border-rose-300 text-rose-900' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
            <span className={overdueSupplierPaymentsCount > 0 ? 'text-rose-700' : 'text-slate-500'}>
              Pending Payment Alerts
            </span>
            <AlertTriangle className={`w-4 h-4 ${overdueSupplierPaymentsCount > 0 ? 'text-rose-600 animate-bounce' : 'text-slate-400'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black">
              {overdueSupplierPaymentsCount} Orders Overdue
            </span>
          </div>
          <p className={`text-xs mt-1 ${overdueSupplierPaymentsCount > 0 ? 'text-rose-700 font-medium' : 'text-slate-500'}`}>
            {overdueSupplierPaymentsCount > 0 ? 'Immediate action required to avoid supply halt' : 'All supplier invoices are within due dates'}
          </p>
        </div>

        {/* Total Active Suppliers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Active Suppliers</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {suppliers.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Nearby Wholesale Mandi & FMCG Distributors
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Suppliers List (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">
              All Suppliers ({filteredSuppliers.length})
            </h3>
            <span className="text-xs text-slate-500">Tap to view ledger</span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search supplier, item, phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Supplier Cards List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredSuppliers.map(supplier => {
              const isSelected = selectedSupplier?.id === supplier.id;
              const hasOverdue = (supplier.purchaseOrders || []).some(
                po => po.paymentStatus === 'OVERDUE' || (po.paymentStatus !== 'PAID' && po.dueDate && po.dueDate < today)
              );

              return (
                <div
                  key={supplier.id}
                  onClick={() => setSelectedSupplier(supplier)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                        {supplier.companyName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Contact: {supplier.name} • {supplier.category}
                      </p>
                    </div>
                    {hasOverdue && (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> Overdue
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
                    <div className="text-slate-500">
                      Orders: <strong className="text-slate-800">{supplier.totalOrdersCount || supplier.purchaseOrders?.length || 0}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 mr-1.5">Pending:</span>
                      <strong className={`font-extrabold ${supplier.totalPendingPayment > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        ₹{(supplier.totalPendingPayment || 0).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Supplier Details & Purchase Orders (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {selectedSupplier ? (
            <>
              {/* Selected Supplier Header Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900">
                        {selectedSupplier.companyName}
                      </h3>
                      {selectedSupplier.rating && (
                        <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                          ★ {selectedSupplier.rating}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Proprietor: <strong className="text-slate-800">{selectedSupplier.name}</strong> • {selectedSupplier.category}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const msg = `Namaste ${selectedSupplier.name} ji! 🙏 Sharma General Kirana Store se baat kar rahe hain. Wholesale stock requirements aur payment ke regarding baat karni thi.`;
                        openWhatsApp(selectedSupplier.phone, msg);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </button>
                    <a
                      href={`tel:${selectedSupplier.phone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <button
                      onClick={() => setShowNewPOModal(true)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> New Order (PO)
                    </button>
                  </div>
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedSupplier.address}, {selectedSupplier.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedSupplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>GST: {selectedSupplier.gstin || 'Unregistered'}</span>
                  </div>
                </div>

                {/* Ledger Financial Summary */}
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Total Purchases</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">
                      ₹{(selectedSupplier.totalPurchases || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Pending Due</div>
                    <div className={`text-base font-black mt-0.5 ${(selectedSupplier.totalPendingPayment || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      ₹{(selectedSupplier.totalPendingPayment || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Next Due Date</div>
                    <div className="text-xs font-extrabold text-slate-700 mt-1">
                      {selectedSupplier.nextPaymentDueDate ? new Date(selectedSupplier.nextPaymentDueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'No dues'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Orders & Transaction History */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      Purchase Orders & Payment History
                    </h4>
                    <p className="text-xs text-slate-500">
                      Record payments made via UPI, NEFT, Cheque or Cash
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewPOModal(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Naya Order
                  </button>
                </div>

                {/* PO List */}
                <div className="space-y-4">
                  {(selectedSupplier.purchaseOrders || []).length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                      No purchase orders recorded yet. Create your first wholesale order.
                    </div>
                  ) : (
                    selectedSupplier.purchaseOrders.map(po => {
                      const isOverdue = po.paymentStatus === 'OVERDUE' || (po.paymentStatus !== 'PAID' && po.dueDate && po.dueDate < today);

                      return (
                        <div
                          key={po.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isOverdue ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-slate-900">
                                  {po.orderNumber}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  po.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {po.status}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  po.paymentStatus === 'PAID'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isOverdue
                                    ? 'bg-rose-100 text-rose-800 font-black'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {isOverdue ? 'OVERDUE' : po.paymentStatus}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Date: {new Date(po.orderDate).toLocaleDateString('en-IN')} • Due: <strong className={isOverdue ? 'text-rose-600' : 'text-slate-700'}>{po.dueDate || 'Immediate'}</strong>
                              </p>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <button
                                onClick={() => {
                                  const itemsList = po.items.map(i => `• ${i.productName}: ${i.quantity} ${i.unit} (₹${i.subtotal})`).join('\n');
                                  const poMsg = `*Purchase Order: ${po.orderNumber}*\nTo: ${selectedSupplier.companyName}\nFrom: Sharma General Kirana Store\n\n*Items:*\n${itemsList}\n\n*Total Amount:* ₹${po.totalAmount}\n*Payment Status:* ${po.paymentStatus} (Due: ₹${po.pendingAmount})\n*Expected By:* ${po.dueDate}\n\nKripya dispatch schedule confirm karein. Dhanyawad!`;
                                  openWhatsApp(selectedSupplier.phone, poMsg);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg transition-colors border border-emerald-200"
                                title="Order copy WhatsApp par bhejein"
                              >
                                <MessageCircle className="w-3.5 h-3.5" /> Share PO
                              </button>
                              {po.pendingAmount > 0 && (
                                <button
                                  onClick={() => {
                                    setActivePaymentPO(po);
                                    setPaymentAmount(po.pendingAmount);
                                    setShowPaymentModal(true);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-all active:scale-95"
                                >
                                  <CreditCard className="w-3.5 h-3.5" /> Pay Now
                                </button>
                              )}
                              {po.status === 'ORDERED' && (
                                <button
                                  onClick={() => updatePurchaseOrderStatus(selectedSupplier.id, po.id, 'RECEIVED')}
                                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                                  title="Mark items received in shop"
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Mark Received
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Items Table */}
                          <div className="py-2.5 space-y-1.5 text-xs">
                            {po.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-slate-700">
                                <div>
                                  <span className="font-semibold text-slate-900">{item.productName}</span>
                                  <span className="text-slate-500 ml-1.5">
                                    ({item.quantity} {item.unit} @ ₹{item.unitCost})
                                  </span>
                                </div>
                                <span className="font-bold text-slate-900">₹{item.subtotal}</span>
                              </div>
                            ))}
                          </div>

                          {/* Financial Footer */}
                          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                            <div className="flex items-center gap-3">
                              <span className="text-slate-600">
                                Total: <strong className="text-slate-900">₹{po.totalAmount}</strong>
                              </span>
                              <span className="text-emerald-700">
                                Paid: <strong>₹{po.paidAmount}</strong>
                              </span>
                              <span className="text-rose-700 font-bold">
                                Due: <strong>₹{po.pendingAmount}</strong>
                              </span>
                            </div>

                            {/* Recorded payments sub-list */}
                            {po.payments && po.payments.length > 0 && (
                              <span className="text-[11px] text-slate-500 font-medium">
                                {po.payments.length} payment(s) logged
                              </span>
                            )}
                          </div>

                          {/* Payment history records dropdown */}
                          {po.payments && po.payments.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                              {po.payments.map(pay => (
                                <div key={pay.id} className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded text-slate-600">
                                  <span>
                                    ✓ Paid <strong>₹{pay.amount}</strong> via {pay.paymentMethod}
                                    {pay.referenceId && ` (${pay.referenceId})`}
                                  </span>
                                  <span>{new Date(pay.date).toLocaleDateString('en-IN')}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              Select a supplier from the left list to view ledger and orders.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add New Supplier */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Add New Wholesale Supplier
              </h3>
              <button
                onClick={() => setShowAddSupplierModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewSupplier} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supplier / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agrawal Grains Wholesale Mandi"
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Agrawal"
                    value={newSupplierName}
                    onChange={e => setNewSupplierName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98112 34567"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category of Goods
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grains, Atta & Pulses"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="07AAAAA0000A1Z5"
                    value={newGstin}
                    onChange={e => setNewGstin(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mandi / Warehouse Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shop 42, Krishi Upaj Mandi, Phase 1"
                  value={newAddress}
                  onChange={e => setNewAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Purchase Order (PO) */}
      {showNewPOModal && selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Create Purchase Order (पर्चा)
                </h3>
                <p className="text-xs text-slate-500">
                  Supplier: <strong className="text-slate-800">{selectedSupplier.companyName}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowNewPOModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Due Date (भुगतान की अंतिम तारीख)
                </label>
                <input
                  type="date"
                  required
                  value={poDueDate}
                  onChange={e => setPoDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Order Items (सामान सूची)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPOItem}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Item Jodo
                  </button>
                </div>

                {poItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Item name (e.g. Atta 10kg packet)"
                        value={item.productName}
                        onChange={e => handleUpdatePOItem(idx, 'productName', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      {poItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePOItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold">Qty</span>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={e => handleUpdatePOItem(idx, 'quantity', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold">Unit Cost (₹)</span>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitCost}
                          onChange={e => handleUpdatePOItem(idx, 'unitCost', Number(e.target.value))}
                          className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold">Subtotal</span>
                        <div className="font-bold text-slate-900 py-1">₹{item.subtotal}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <span className="text-xs font-bold text-indigo-900">Total Purchase Value:</span>
                <span className="text-base font-black text-indigo-900">
                  ₹{poItems.reduce((sum, item) => sum + (item.subtotal || 0), 0)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewPOModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Confirm & Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Supplier Payment */}
      {showPaymentModal && activePaymentPO && selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Record Supplier Payment
                </h3>
                <p className="text-xs text-slate-500">
                  Order: <strong className="text-slate-800">{activePaymentPO.orderNumber}</strong> • Due: ₹{activePaymentPO.pendingAmount}
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={activePaymentPO.pendingAmount}
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-base font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['UPI', 'NEFT', 'CASH', 'CHEQUE'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        paymentMethod === m
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transaction / Reference ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI-98721345 or Cheque #00124"
                  value={paymentRefId}
                  onChange={e => setPaymentRefId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note / Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid via Google Pay to Sharmaji"
                  value={paymentNote}
                  onChange={e => setPaymentNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
