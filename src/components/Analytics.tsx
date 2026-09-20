import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  AlertCircle, 
  Lightbulb, 
  Calendar, 
  IndianRupee, 
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';

export const Analytics: React.FC = () => {
  const { sales, products, summary, language, setActiveTab } = useDukaan();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Top selling products calculated from sales records
  const topSelling = useMemo(() => {
    const productSalesMap: Record<string, { name: string; quantity: number; revenue: number; profit: number }> = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
            profit: 0,
          };
        }
        productSalesMap[item.productId].quantity += item.quantity;
        productSalesMap[item.productId].revenue += item.subtotal;
        productSalesMap[item.productId].profit += (item.unitPrice - item.unitCost) * item.quantity;
      });
    });

    return Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  // Slow moving products: items that have NOT been sold in recent sales
  const slowMoving = useMemo(() => {
    const soldProductIds = new Set<string>();
    sales.forEach(s => s.items.forEach(i => soldProductIds.add(i.productId)));

    return products.filter(p => !soldProductIds.has(p.id) || p.stock > p.minStockThreshold * 2);
  }, [sales, products]);

  // Category revenue breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, { revenue: number; itemsCount: number }> = {};
    sales.forEach(s => {
      s.items.forEach(i => {
        const prod = products.find(p => p.id === i.productId);
        const cat = prod?.category || 'Grains & Atta';
        if (!map[cat]) map[cat] = { revenue: 0, itemsCount: 0 };
        map[cat].revenue += i.subtotal;
        map[cat].itemsCount += i.quantity;
      });
    });
    return Object.entries(map).map(([cat, data]) => ({ category: cat, ...data }));
  }, [sales, products]);

  // Visual Mock Daily Bar Data (Today + past 6 days for visual trend)
  const weeklyTrends = [
    { day: 'Mon', revenue: 2450, profit: 380 },
    { day: 'Tue', revenue: 1980, profit: 290 },
    { day: 'Wed', revenue: 3100, profit: 460 },
    { day: 'Thu', revenue: 2750, profit: 395 },
    { day: 'Fri', revenue: 3420, profit: 510 },
    { day: 'Sat', revenue: 4150, profit: 620 },
    { day: 'Today', revenue: summary.todayRevenue || 1838, profit: summary.todayProfit || 266, active: true },
  ];

  const maxRevenue = Math.max(...weeklyTrends.map(t => t.revenue));

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>{language === 'hindi' ? 'दुकान की रिपोर्ट और मुनाफा' : 'Business Insights & Analytics'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track revenue velocity, margin breakdowns, fast & slow moving inventory.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-2xs self-start sm:self-auto">
          {(['daily', 'weekly', 'monthly'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                timeframe === tf
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* AI Business Insights Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-5 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Munimji AI Business Recommendations</span>
        </div>
        <h3 className="text-lg font-black tracking-tight">
          3 Actionable Insights to Increase Dukaan Profits
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <div className="text-xs font-bold text-emerald-300">1. Fast Moving Milk & Atta</div>
            <p className="text-xs text-slate-200">
              Aashirvaad Atta is selling out before evening rush. Re-order 15 packets right now to avoid ₹2,000 lost revenue.
            </p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <div className="text-xs font-bold text-amber-300">2. Udhaar Collection Drive</div>
            <p className="text-xs text-slate-200">
              ₹4,570 is stuck in customer udhaar. Ramesh Kumar & Suresh Sharma are overdue. Send gentle WhatsApp reminders today.
            </p>
          </div>

          <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
            <div className="text-xs font-bold text-cyan-300">3. High Margin Pairing</div>
            <p className="text-xs text-slate-200">
              Red Label Tea + Parle-G bundle gives an average 22% margin. Display them near the checkout counter!
            </p>
          </div>
        </div>
      </div>

      {/* Revenue & Profit Trends Visualizer */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Weekly Revenue & Profit Velocity
            </h3>
            <p className="text-xs text-slate-500">
              Daily revenue comparison with net profit margin
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-600" />
              <span>Revenue (₹)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-500" />
              <span>Profit (₹)</span>
            </div>
          </div>
        </div>

        {/* Clean SVG/CSS Bar Chart */}
        <div className="pt-6 pb-2">
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 px-2">
            {weeklyTrends.map((t, idx) => {
              const revHeight = Math.round((t.revenue / maxRevenue) * 100);
              const profitHeight = Math.round((t.profit / maxRevenue) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="text-[10px] font-black text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{t.revenue}
                  </div>

                  <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className={`w-1/2 rounded-t-md transition-all ${
                        t.active ? 'bg-emerald-600 ring-2 ring-emerald-300' : 'bg-emerald-500/80 group-hover:bg-emerald-600'
                      }`}
                    />
                    {/* Profit Bar */}
                    <div
                      style={{ height: `${Math.max(10, profitHeight * 1.5)}%` }}
                      className="w-1/2 bg-blue-500 rounded-t-md opacity-80 group-hover:opacity-100 transition-all"
                    />
                  </div>

                  <span className={`text-xs font-bold ${t.active ? 'text-emerald-700 font-black' : 'text-slate-500'}`}>
                    {t.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Section: Top Selling Products vs Slow Moving Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Best-Selling Products (टॉप बिकने वाला सामान)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Today's Sales</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topSelling.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">No sales recorded yet.</div>
            ) : (
              topSelling.slice(0, 5).map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-xs font-black text-slate-400">#{idx + 1}</span>
                    <div>
                      <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.quantity} units sold today
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-black text-slate-900">
                      ₹{item.revenue}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      +₹{Math.round(item.profit)} profit
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Slow Moving Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Slow-Moving Stock (धीमी बिक्री वाला सामान)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Capital Locked</span>
          </div>

          <div className="divide-y divide-slate-100">
            {slowMoving.slice(0, 5).map((prod) => (
              <div key={prod.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {prod.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    Stock: {prod.stock} {prod.unit}s • Category: {prod.category}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-amber-800">
                    ₹{prod.stock * prod.purchasePrice} locked
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Consider discount/bundle
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
