import React from 'react';
import { 
  TrendingUp, 
  IndianRupee, 
  AlertTriangle, 
  BookOpen, 
  ShoppingBag, 
  Mic, 
  Plus, 
  ArrowRight,
  Package, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  MessageCircle,
  QrCode
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';

interface DashboardProps {
  onOpenNewSale: () => void;
  onOpenKhata: () => void;
  onOpenInventory: () => void;
  onOpenAssistantWithQuery: (query: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenNewSale,
  onOpenKhata,
  onOpenInventory,
  onOpenAssistantWithQuery,
}) => {
  const { summary, products, sales, customers, language, setActiveTab, openWhatsApp } = useDukaan();

  const lowStockProducts = products.filter(p => p.stock <= p.minStockThreshold);

  const demoFlowQuestions = [
    {
      step: '1',
      title: 'Sales Analysis',
      query: 'Aaj kya bik raha hai?',
      desc: 'Analyze top sellers & morning trends'
    },
    {
      step: '2',
      title: 'Inventory Check',
      query: 'Atta kitna bacha hai?',
      desc: 'Check remaining Atta stock & alert'
    },
    {
      step: '3',
      title: 'Udhaar Reminder',
      query: 'Ramesh ka 850 rupaye udhaar hai, reminder bana do.',
      desc: 'Generate Hinglish WhatsApp draft with confirmation'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner: Quick Voice AI Hackathon Prompt Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-2xl p-4 sm:p-6 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>DukaanAI Hackathon Demo Showcase</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {language === 'hindi' ? 'नमस्ते सेठजी! आज की दुकान का हाल' : 'Namaste Sethji! Store Overview'}
            </h2>
            <p className="text-sm text-emerald-100/90 max-w-2xl">
              Tap any demo question below to test the AI copilot live with Hindi, Hinglish, inventory, and Khata actions.
            </p>
          </div>

          <button
            id="btn-hero-voice-ask"
            onClick={() => setActiveTab('assistant')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-emerald-800 font-bold rounded-xl shadow-md hover:bg-emerald-50 active:scale-98 transition-all shrink-0 text-sm"
          >
            <Mic className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>{language === 'hindi' ? 'बोल कर पूछें (Voice AI)' : 'Ask DukaanAI (Voice / Text)'}</span>
          </button>
        </div>

        {/* 3-Step Demo Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-emerald-600/50">
          {demoFlowQuestions.map((q) => (
            <button
              key={q.step}
              onClick={() => onOpenAssistantWithQuery(q.query)}
              className="text-left bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl p-3 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-200 mb-1">
                  <span>Step {q.step}: {q.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                  "{q.query}"
                </div>
              </div>
              <div className="text-[11px] text-emerald-200/80 mt-1">
                {q.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4 Core Business Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'hindi' ? 'आज की कुल बिक्री' : "Today's Sales"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{summary.todayRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>{summary.todaySalesCount} bills kat chuke</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14% vs kal
            </span>
          </div>
        </div>

        {/* Gross Profit / Munafa */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'hindi' ? 'आज का मुनाफा' : "Gross Profit"}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-700">
              ₹{summary.todayProfit.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Margin: {summary.todayRevenue > 0 ? Math.round((summary.todayProfit / summary.todayRevenue) * 100) : 15}%</span>
            <span className="text-blue-600 font-medium">Net income</span>
          </div>
        </div>

        {/* Low Stock Items */}
        <div 
          onClick={onOpenInventory}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'hindi' ? 'खत्म होने वाला स्टॉक' : 'Low Stock Items'}
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${summary.lowStockItemsCount > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-black ${summary.lowStockItemsCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {summary.lowStockItemsCount}
            </span>
            <span className="text-xs font-medium text-slate-500">items critically low</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-amber-700 font-semibold pt-2 border-t border-slate-100 group-hover:text-amber-800">
            <span>Atta, Mirch & Toothpaste</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Outstanding Udhaar */}
        <div 
          onClick={onOpenKhata}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'hindi' ? 'कुल बकाया उधार' : 'Total Udhaar'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-rose-600">
              ₹{summary.totalUdhaar.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-rose-700 font-semibold pt-2 border-t border-slate-100 group-hover:text-rose-800">
            <span>{customers.filter(c => c.udhaarBalance > 0).length} grahak baki hain</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Quick Action Bar for Non-Technical Shopkeepers */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          {language === 'hindi' ? 'त्वरित काम (Quick Actions)' : 'Quick Operations'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="btn-quick-sale"
            onClick={onOpenNewSale}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold transition-all text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold leading-tight">Nayi Sale</div>
              <div className="text-[11px] text-emerald-700 font-medium">Quick POS Bill</div>
            </div>
          </button>

          <button
            id="btn-quick-khata"
            onClick={onOpenKhata}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 font-bold transition-all text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold leading-tight">Udhaar Khata</div>
              <div className="text-[11px] text-rose-700 font-medium">Jama / Udhaar</div>
            </div>
          </button>

          <button
            id="btn-quick-stock"
            onClick={onOpenInventory}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold transition-all text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold leading-tight">Stock Update</div>
              <div className="text-[11px] text-amber-800 font-medium">Restock items</div>
            </div>
          </button>

          <button
            id="btn-quick-ai"
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold transition-all text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold leading-tight">Voice Copilot</div>
              <div className="text-[11px] text-purple-700 font-medium">Bol kar poochhein</div>
            </div>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Low Stock Alerts + Today's Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <h3 className="font-extrabold text-slate-900 text-base">
                  {language === 'hindi' ? 'स्टॉक अलर्ट (तुरंत मंगाएं)' : 'Low Stock Watchlist'}
                </h3>
              </div>
              <button
                onClick={onOpenInventory}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                View All Stock →
              </button>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                All stock levels are healthy!
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map(p => (
                  <div 
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200/70"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">
                        {p.nameHindi} • Selling: ₹{p.sellingPrice}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-black">
                        Only {p.stock} {p.unit} left
                      </div>
                      <div className="text-[10px] text-amber-700 mt-0.5">
                        Min threshold: {p.minStockThreshold}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>💡 Tip: AI predicts Atta stock will run out by 7 PM tonight.</span>
            <button 
              onClick={() => onOpenAssistantWithQuery("Atta kitna bacha hai?")}
              className="text-emerald-700 font-bold hover:underline"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* Today's Sales Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{language === 'hindi' ? 'आज के हालिया बिल' : "Recent Sales (Today)"}</span>
            </h3>
            <button
              onClick={onOpenNewSale}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              + Create Bill
            </button>
          </div>

          <div className="space-y-3">
            {sales.slice(0, 4).map(sale => (
              <div 
                key={sale.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{sale.invoiceNo}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      sale.paymentMode === 'UPI' 
                        ? 'bg-blue-100 text-blue-800'
                        : sale.paymentMode === 'CASH'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {sale.paymentMode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-xs mt-0.5">
                    {sale.items.map(i => `${i.quantity}x ${i.productName.split(' ')[0]}`).join(', ')}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-sm text-slate-900">
                    ₹{sale.totalAmount}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold">
                    +₹{sale.profit} munafa
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Payments: ₹{summary.cashRevenue} Cash • ₹{summary.upiRevenue} UPI</span>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-emerald-700 font-bold hover:underline"
            >
              View Analytics →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
