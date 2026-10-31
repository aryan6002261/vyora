import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  UserPlus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MessageCircle, 
  Phone, 
  History, 
  Check, 
  X,
  Share2,
  AlertCircle
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';
import { Customer } from '../types';

export const Khata: React.FC = () => {
  const { 
    customers, 
    addNewCustomer, 
    recordKhataPayment, 
    recordKhataCredit, 
    openWhatsApp, 
    language 
  } = useDukaan();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const isClient = currentUser.role === 'CLIENT';
  const [showClientPayModal, setShowClientPayModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Find client record matching logged-in user or default to sample
  const clientCustomerRecord = useMemo(() => {
    return customers.find(c => 
      c.name.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      (currentUser.phone && c.phone.includes(currentUser.phone.replace(/\D/g, '')))
    ) || customers[0];
  }, [customers, currentUser]);

  // Form states
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustInitialUdhaar, setNewCustInitialUdhaar] = useState<number>(0);
  const [newCustAddress, setNewCustAddress] = useState('');

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNote, setPaymentNote] = useState('Cash payment received');

  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditNote, setCreditNote] = useState('New ration / groceries');

  const [reminderTone, setReminderTone] = useState<'gentle' | 'standard' | 'formal'>('gentle');

  const totalOutstandingUdhaar = useMemo(() => {
    return customers.reduce((sum, c) => sum + (c.udhaarBalance || 0), 0);
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
    );
  }, [customers, searchQuery]);

  const activeCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0];
  }, [customers, selectedCustomerId]);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    const created = addNewCustomer(
      newCustName,
      newCustPhone,
      Number(newCustInitialUdhaar),
      newCustAddress
    );
    setSelectedCustomerId(created.id);
    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustInitialUdhaar(0);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || paymentAmount <= 0) return;
    recordKhataPayment(activeCustomer.id, Number(paymentAmount), paymentNote);
    setShowPaymentModal(false);
    setPaymentAmount(0);
  };

  const handleRecordCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || creditAmount <= 0) return;
    recordKhataCredit(activeCustomer.id, Number(creditAmount), creditNote);
    setShowCreditModal(false);
    setCreditAmount(0);
  };

  const sendWhatsAppReminder = (tone: 'gentle' | 'standard' | 'formal') => {
    if (!activeCustomer) return;
    const amount = activeCustomer.udhaarBalance;
    let msg = '';

    if (tone === 'gentle') {
      msg = `Namaste ${activeCustomer.name} ji! 🙏 Asha hai aap kushal mangal hain. Dukaan se aapka ₹${amount} ka purana hisaab baki chal raha hai. Jab bhi suvidha ho, kripya aakar ya UPI se clear karwa dein. Dhanyawad! - Aapki Dukaan`;
    } else if (tone === 'standard') {
      msg = `Namaste ${activeCustomer.name} ji. Dukaan ka ₹${amount} ka pending payment reminder hai. Kripya samay par payment karein taaki humari sewayein suvidhajanak rahein. UPI ID: dukaan@upi. Dhanyawad!`;
    } else {
      msg = `Shree ${activeCustomer.name} ji, aapke khate mein ₹${amount} ka udhaar baki hai. Kripya is hafte payment clear kar lein. Dhanyawad - Dukaan Vyapar`;
    }

    openWhatsApp(activeCustomer.phone, msg);
  };

    if (isClient) {
    const clientBalance = clientCustomerRecord?.udhaarBalance || 0;
    const clientTransactions = clientCustomerRecord?.transactions || [];

    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-xs inline-flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              Customer Digital Passbook (मेरा उधार खाता)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Namaste {currentUser.name}! 🙏
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Here is your transparent ledger with <strong className="text-white">Sharma General Kirana Store</strong>. Track every bill, credit given, and pay online with zero extra fees.
            </p>
          </div>
        </div>

        {/* Balance & Instant UPI Payment Card */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Current Udhaar Balance (कुल बकाया उधार)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-rose-600 mt-1">
                ₹{clientBalance.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {clientBalance > 0 
                  ? 'Kindly clear via UPI or Cash to maintain high trust score.' 
                  : 'Your account is completely clear! Thank you.'}
              </p>
            </div>

            {clientBalance > 0 && (
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowClientPayModal(true)}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Pay ₹{clientBalance} via UPI / QR</span>
                </button>

                <button
                  onClick={() => {
                    const phone = '9876543210';
                    const msg = `Namaste Sharma ji! 🙏 Mai ${currentUser.name} bol raha hoon. Mere khate ka balance ₹${clientBalance} clear karne ke regarding payment slip bhej raha hoon.`;
                    openWhatsApp(phone, msg);
                  }}
                  className="py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            )}
          </div>

          <div className="sm:col-span-6 bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Kirana Merchant Details
              </span>
              <h4 className="text-base font-extrabold text-slate-900">
                Sharma General Kirana Store
              </h4>
              <p className="text-xs text-slate-600">
                📍 Shop 14, Pocket B Market, Mayur Vihar, Delhi
              </p>
              <p className="text-xs text-slate-600">
                📞 +91 98765 43210 • UPI ID: `dukaan.sharma@okaxis`
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" /> 100% Verified Digital Khata
              </span>
              <span>Updated Just Now</span>
            </div>
          </div>
        </div>

        {/* Transaction History Timeline */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <span>Bill & Payment History (लेनदेन का इतिहास)</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {clientTransactions.length} records
            </span>
          </div>

          {clientTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No transactions recorded yet in your personal passbook.
            </div>
          ) : (
            <div className="space-y-3">
              {clientTransactions.map(tx => {
                const isCredit = tx.type === 'CREDIT_GIVEN';
                return (
                  <div 
                    key={tx.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isCredit ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isCredit ? 'DR' : 'CR'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {tx.note || (isCredit ? 'Groceries taken on Udhaar' : 'Payment Received')}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {tx.date}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-black ${isCredit ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {isCredit ? '+' : '-'}₹{tx.amount}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Bal: ₹{tx.balanceAfter}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Customer UPI Payment Modal */}
        {showClientPayModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-500">UPI Payment Gateway</span>
                <button onClick={() => setShowClientPayModal(false)} className="text-slate-400 hover:text-slate-700 font-bold text-sm">✕</button>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900">Pay Sharma General Kirana Store</h4>
                <div className="text-2xl font-black text-emerald-600 mt-1">₹{clientBalance}</div>
              </div>

              {/* QR Code */}
              <div className="w-48 h-48 mx-auto bg-slate-100 rounded-2xl p-3 border-2 border-slate-200 flex flex-col items-center justify-center">
                <QrCode className="w-36 h-36 text-slate-800" />
                <span className="text-[10px] font-bold text-slate-600 mt-1">Scan with any UPI App</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-700 font-bold truncate">dukaan.sharma@okaxis</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('dukaan.sharma@okaxis');
                    setCopiedUpi(true);
                    setTimeout(() => setCopiedUpi(false), 2000);
                  }}
                  className="text-emerald-700 font-bold hover:underline shrink-0 ml-2"
                >
                  {copiedUpi ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                onClick={() => {
                  recordKhataPayment(clientCustomerRecord.id, clientBalance, 'Online UPI Payment by Grahak');
                  setShowClientPayModal(false);
                  alert('Payment recorded successfully! Balance updated.');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
              >
                I have paid ₹{clientBalance} (Confirm)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-rose-600" />
            <span>{language === 'hindi' ? 'डिजिटल खाता (Customer Ledger)' : 'Digital Khata & Udhaar'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep track of customer credits, record cash/UPI payments, and send instant WhatsApp reminders.
          </p>
        </div>

        <button
          id="btn-add-customer"
          onClick={() => setShowAddCustomerModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>Naya Grahak Jodein</span>
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
            Total Udhaar in Market (बाज़ार में कुल बाकी)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-rose-950 mt-0.5">
            ₹{totalOutstandingUdhaar.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-rose-600 mt-0.5">
            {customers.filter(c => c.udhaarBalance > 0).length} customers currently have outstanding balances.
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeCustomer && activeCustomer.udhaarBalance > 0 && (
            <button
              onClick={() => sendWhatsAppReminder('gentle')}
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reminder to {activeCustomer.name.split(' ')[0]} (₹{activeCustomer.udhaarBalance})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Khata Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer Directory (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              id="input-customer-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer by name or phone..."
              className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
            {filteredCustomers.map(customer => {
              const isSelected = activeCustomer?.id === customer.id;
              const hasUdhaar = customer.udhaarBalance > 0;

              return (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'bg-rose-50/80 border border-rose-300' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      hasUdhaar ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900 leading-tight">
                        {customer.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {customer.phone}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-sm font-black ${hasUdhaar ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {hasUdhaar ? `₹${customer.udhaarBalance}` : 'Settled'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {customer.transactions.length} txns
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer Ledger & Actions (7 Cols) */}
        {activeCustomer ? (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
            {/* Customer Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">
                    {activeCustomer.name}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeCustomer.udhaarBalance > 0 
                      ? 'bg-rose-100 text-rose-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {activeCustomer.udhaarBalance > 0 ? 'Udhaar Baki' : 'Hisab Barabar'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Phone: {activeCustomer.phone} • {activeCustomer.address || 'Local Customer'}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Outstanding Balance</span>
                <div className="text-2xl font-black text-rose-600">
                  ₹{activeCustomer.udhaarBalance}
                </div>
              </div>
            </div>

            {/* Quick Record Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-khata-jama"
                onClick={() => {
                  setPaymentAmount(activeCustomer.udhaarBalance || 100);
                  setShowPaymentModal(true);
                }}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                <span>Payment Jama Karein (-)</span>
              </button>

              <button
                id="btn-khata-udhaar"
                onClick={() => {
                  setCreditAmount(500);
                  setShowCreditModal(true);
                }}
                className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-xl text-rose-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
                <span>Naya Udhaar Dein (+)</span>
              </button>
            </div>

            {/* WhatsApp Reminder Toolbar */}
            {activeCustomer.udhaarBalance > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    WhatsApp Payment Reminder Template
                  </span>
                  <span className="text-[10px] text-slate-500">1-Click Direct Link</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => sendWhatsAppReminder('gentle')}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-bold text-slate-800 transition-colors"
                  >
                    🌱 Polite Hinglish (Polite Request)
                  </button>
                  <button
                    onClick={() => sendWhatsAppReminder('standard')}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-bold text-slate-800 transition-colors"
                  >
                    📋 Standard (With UPI Details)
                  </button>
                  <button
                    onClick={() => sendWhatsAppReminder('formal')}
                    className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-bold text-slate-800 transition-colors"
                  >
                    ⚠️ Due Reminder (Pending This Week)
                  </button>
                </div>
              </div>
            )}

            {/* Transaction Ledger History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Ledger History (लेन-देन का विवरण)</span>
                </h4>
                <span className="text-xs text-slate-400">
                  {activeCustomer.transactions.length} entries
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {activeCustomer.transactions.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No transactions recorded yet.
                  </div>
                ) : (
                  activeCustomer.transactions.map((tx) => (
                    <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          {tx.type === 'CREDIT_GIVEN' ? (
                            <span className="text-rose-600 font-black">Udhaar Diya (+)</span>
                          ) : (
                            <span className="text-emerald-600 font-black">Payment Jama (-)</span>
                          )}
                          <span className="text-slate-400 font-normal">• {tx.date}</span>
                        </div>
                        {tx.note && (
                          <div className="text-slate-500 text-[11px] truncate max-w-xs">
                            {tx.note}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className={`font-black text-sm ${
                          tx.type === 'CREDIT_GIVEN' ? 'text-rose-600' : 'text-emerald-600'
                        }`}>
                          {tx.type === 'CREDIT_GIVEN' ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Balance: ₹{tx.balanceAfter}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            Select a customer to view ledger.
          </div>
        )}
      </div>

      {/* Modal: Add New Customer */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                Naya Grahak Jodein (New Customer)
              </h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Mobile Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Opening Udhaar Balance (₹)</label>
                <input
                  type="number"
                  value={newCustInitialUdhaar}
                  onChange={(e) => setNewCustInitialUdhaar(Number(e.target.value))}
                  placeholder="0"
                  className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Address / Landmark (Optional)</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="e.g. Near Shiv Mandir"
                  className="w-full p-2.5 text-xs font-medium border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-xs"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Payment Received (Jama) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">
              Payment Jama Karein ({activeCustomer?.name})
            </h3>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Amount Received (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-3 text-lg font-black text-emerald-700 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Note (Payment Type)</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="e.g. Cash, GPay, PhonePe"
                  className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-extrabold rounded-xl text-xs shadow-xs"
                >
                  Jama Karein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Udhaar Diya (Credit Given) */}
      {showCreditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900">
              Naya Udhaar Likhein ({activeCustomer?.name})
            </h3>

            <form onSubmit={handleRecordCredit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Udhaar Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(Number(e.target.value))}
                  className="w-full p-3 text-lg font-black text-rose-700 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Description / Items</label>
                <input
                  type="text"
                  value={creditNote}
                  onChange={(e) => setCreditNote(e.target.value)}
                  placeholder="e.g. Atta 10kg + Tel 1L"
                  className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreditModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white font-extrabold rounded-xl text-xs shadow-xs"
                >
                  Udhaar Likhein
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
