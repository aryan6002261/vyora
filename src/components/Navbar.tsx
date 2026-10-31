import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  BookOpen, 
  Bot, 
  BarChart3, 
  Mic, 
  Sparkles, 
  RotateCcw,
  Store,
  Truck,
  MapPin,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';

interface NavbarProps {
  onOpenDemoGuide: () => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemoGuide, onOpenLoginModal }) => {
  const { 
    activeTab, 
    setActiveTab, 
    cart, 
    summary, 
    language, 
    setLanguage, 
    resetToDemoData,
    currentUser,
    logoutUser,
    switchRole,
    getPendingSupplierPaymentsCount,
    t
  } = useDukaan();

  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const pendingSupplierPaymentsCount = getPendingSupplierPaymentsCount();
  const isMerchant = currentUser.role === 'MERCHANT';

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
    { 
      id: 'suppliers', 
      label: t('nav_suppliers'), 
      icon: Truck,
      badge: pendingSupplierPaymentsCount > 0 ? pendingSupplierPaymentsCount : null,
      badgeColor: 'bg-rose-500',
    },
    { 
      id: 'nearby', 
      label: t('nav_nearby'), 
      icon: MapPin,
    },
    { 
      id: 'assistant', 
      label: t('nav_assistant'), 
      icon: Bot,
      highlight: true,
    },
    { 
      id: 'analytics', 
      label: t('nav_analytics'), 
      icon: BarChart3,
    },
  ];

  const clientTabs = [
    { 
      id: 'nearby', 
      label: t('nav_nearby'), 
      icon: MapPin,
      highlight: true,
    },
    { 
      id: 'khata', 
      label: 'My Udhaar / Khata', 
      icon: BookOpen,
    },
    { 
      id: 'assistant', 
      label: 'AI Shopping Mitra', 
      icon: Bot,
    },
    { 
      id: 'login', 
      label: 'My Account / Switch', 
      icon: User,
    },
  ];

  const visibleTabs = isMerchant ? merchantTabs : clientTabs;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner & Shop Identity */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        
        {/* Brand / Store Logo */}
        <div 
          onClick={() => setActiveTab(isMerchant ? 'dashboard' : 'nearby')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-xs font-bold text-lg sm:text-xl group-hover:scale-102 transition-transform">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1">
                Vyora <span className="text-emerald-600">DukaanAI</span>
              </h1>
              <span className={`text-[10px] sm:text-[11px] font-extrabold px-2 py-0.2 rounded-full border ${
                isMerchant 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-indigo-50 text-indigo-800 border-indigo-200'
              }`}>
                {isMerchant ? '🏪 Merchant' : '👤 Customer'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px] sm:max-w-none">
              {currentUser.storeName || (isMerchant ? 'Sharma General Kirana Store' : 'Hyperlocal Shopping Portal')}
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* User Profile / Login Toggle */}
          {currentUser.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs transition-colors"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                  isMerchant ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {isMerchant ? '🏪' : '👤'}
                </div>
                <div className="hidden md:block text-left max-w-[120px] truncate">
                  <div className="font-extrabold text-slate-900 leading-tight truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {showUserDropdown && (
                <div 
                  onClick={() => setShowUserDropdown(false)}
                  className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                >
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email || currentUser.phone}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      Logged in as {currentUser.role}
                    </span>
                  </div>

                  {/* 1-Click Role Switch */}
                  <button
                    onClick={() => switchRole(isMerchant ? 'CLIENT' : 'MERCHANT')}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Switch to {isMerchant ? 'Customer Portal (ग्राहक)' : 'Merchant Portal (दुकानदार)'}</span>
                  </button>

                  {/* Open Full Login Screen */}
                  <button
                    onClick={() => setActiveTab('login')}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Open Login / Account Page</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  {/* Logout */}
                  <button
                    onClick={logoutUser}
                    className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout (लॉगआउट)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('nav_login')}</span>
            </button>
          )}

          {/* Quick 1-Click Role Toggle Pill (visible on desktop) */}
          <button
            onClick={() => switchRole(isMerchant ? 'CLIENT' : 'MERCHANT')}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-colors"
            title="Toggle between Merchant and Customer view mode"
          >
            <span>{isMerchant ? '👤 View as Client' : '🏪 View as Merchant'}</span>
          </button>

          {/* Demo Guide Button */}
          <button
            id="btn-demo-guide"
            onClick={onOpenDemoGuide}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 rounded-lg transition-colors shadow-2xs"
            title="Open Demo Flow walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="hidden md:inline">{t('nav_demo_flow')}</span>
          </button>

          {/* Language Selector (English / Hindi / Hinglish) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setLanguage('hinglish')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'hinglish'
                  ? 'bg-white text-emerald-800 font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Hinglish language"
            >
              Hinglish
            </button>
            <button
              onClick={() => setLanguage('hindi')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'hindi'
                  ? 'bg-white text-emerald-800 font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="हिंदी (Hindi)"
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('english')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'english'
                  ? 'bg-white text-emerald-800 font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Reset Demo Data Button */}
          <button
            id="btn-reset-demo"
            onClick={() => {
              if (window.confirm('Reset all demo data back to initial hackathon state?')) {
                resetToDemoData();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors hidden sm:block"
            title={t('nav_reset_demo')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Voice trigger */}
          <button
            id="btn-nav-voice"
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden md:inline">{t('nav_voice')}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation (Desktop / Tablet view) */}
      <nav className="hidden sm:block max-w-7xl mx-auto px-2 sm:px-6 overflow-x-auto scrollbar-none border-t border-slate-100">
        <div className="flex space-x-1 py-1.5 min-w-max">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${tab.highlight && !isActive ? 'ring-1 ring-emerald-400/50 text-emerald-900 bg-emerald-50/70' : ''}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.highlight ? 'text-emerald-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>

                {tab.badge !== null && tab.badge !== undefined && (
                  <span className={`inline-flex items-center justify-center text-[10px] font-extrabold text-white px-1.5 py-0.2 min-w-[17px] h-[17px] rounded-full ${isActive ? 'bg-white text-emerald-800' : tab.badgeColor || 'bg-slate-700'}`}>
                    {tab.badge}
                  </span>
                )}

                {tab.highlight && (
                  <span className="flex h-1.5 w-1.5 relative ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick tab for Login / Account if not already in list */}
          <button
            onClick={() => setActiveTab('login')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all select-none ${
              activeTab === 'login'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{currentUser.isLoggedIn ? 'Account / Portal' : 'Login'}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
