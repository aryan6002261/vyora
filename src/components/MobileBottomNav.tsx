import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BookOpen, 
  Bot, 
  MapPin, 
  User, 
  Sparkles,
  Truck
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';

export const MobileBottomNav: React.FC<{ onOpenLogin: () => void }> = ({ onOpenLogin }) => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    cart, 
    summary, 
    t,
    getPendingSupplierPaymentsCount
  } = useDukaan();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const pendingSuppliers = getPendingSupplierPaymentsCount();
  const isClient = currentUser.role === 'CLIENT';

  const merchantTabs = [
    {
      id: 'dashboard',
      label: t('nav_dashboard'),
      icon: LayoutDashboard,
    },
    {
      id: 'sales',
      label: t('nav_sales'),
      icon: ShoppingBag,
      badge: cartItemCount > 0 ? cartItemCount : null,
      badgeColor: 'bg-emerald-600',
    },
    {
      id: 'assistant',
      label: 'Munimji',
      icon: Bot,
      isSpecial: true,
    },
    {
      id: 'inventory',
      label: t('nav_inventory'),
      icon: Package,
      badge: summary.lowStockItemsCount > 0 ? summary.lowStockItemsCount : null,
      badgeColor: 'bg-amber-500',
    },
    {
      id: 'khata',
      label: t('nav_khata'),
      icon: BookOpen,
    },
  ];

  const clientTabs = [
    {
      id: 'nearby',
      label: t('nav_nearby'),
      icon: MapPin,
    },
    {
      id: 'assistant',
      label: 'AI Mitra',
      icon: Bot,
      isSpecial: true,
    },
    {
      id: 'khata',
      label: 'My Khata',
      icon: BookOpen,
    },
    {
      id: 'login',
      label: 'Account',
      icon: User,
    },
  ];

  const tabs = isClient ? clientTabs : merchantTabs;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-2 py-1 flex items-center justify-around safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.isSpecial) {
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative -top-3 flex flex-col items-center group focus:outline-none"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 border-2 border-white ${
                isActive 
                  ? 'bg-gradient-to-tr from-purple-700 to-indigo-600 text-white ring-2 ring-purple-300' 
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-700 text-white'
              }`}>
                <Icon className="w-6 h-6 animate-pulse" />
              </div>
              <span className={`text-[10px] font-extrabold mt-0.5 ${isActive ? 'text-purple-700' : 'text-slate-700'}`}>
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'login' && !currentUser.isLoggedIn) {
                onOpenLogin();
              } else {
                setActiveTab(tab.id);
              }
            }}
            className={`flex-1 py-1 flex flex-col items-center justify-center relative transition-colors ${
              isActive ? 'text-emerald-700 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 stroke-[2.5]' : 'text-slate-500'}`} />
              {tab.badge !== null && tab.badge !== undefined && (
                <span className={`absolute -top-1 -right-2 text-[9px] font-black text-white px-1 rounded-full min-w-[15px] h-[15px] flex items-center justify-center ${tab.badgeColor || 'bg-rose-500'}`}>
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[64px]">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

