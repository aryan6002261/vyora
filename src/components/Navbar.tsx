import React from 'react';
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
  HelpCircle
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';
import { Language } from '../types';

interface NavbarProps {
  onOpenDemoGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemoGuide }) => {
  const { 
    activeTab, 
    setActiveTab, 
    cart, 
    summary, 
    language, 
    setLanguage, 
    resetToDemoData 
  } = useDukaan();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      labelHindi: 'डैशबोर्ड', 
      icon: LayoutDashboard 
    },
    { 
      id: 'sales', 
      label: 'Sales (POS)', 
      labelHindi: 'नयी बिक्री', 
      icon: ShoppingBag, 
      badge: cartItemCount > 0 ? cartItemCount : null,
      badgeColor: 'bg-emerald-600'
    },
    { 
      id: 'inventory', 
      label: 'Inventory', 
      labelHindi: 'स्टॉक / सामान', 
      icon: Package,
      badge: summary.lowStockItemsCount > 0 ? summary.lowStockItemsCount : null,
      badgeColor: 'bg-amber-500'
    },
    { 
      id: 'khata', 
      label: 'Digital Khata', 
      labelHindi: 'उधार खाता', 
      icon: BookOpen 
    },
    { 
      id: 'assistant', 
      label: 'AI Assistant', 
      labelHindi: 'AI मुनीमजी', 
      icon: Bot,
      highlight: true
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      labelHindi: 'रिपोर्ट & मुनाफा', 
      icon: BarChart3 
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner & Shop Identity */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs font-bold text-xl">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                Dukaan<span className="text-emerald-600">AI</span>
              </h1>
              <span className="hidden sm:inline-flex text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                🇮🇳 Made for Bharat Kirana
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {language === 'hindi' ? 'स्मार्ट बिज़नेस साथी' : 'AI Business Copilot & Digital Khata'}
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2">
          {/* Demo Guide Button */}
          <button
            id="btn-demo-guide"
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 rounded-lg transition-colors shadow-2xs"
            title="Open Demo Flow walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span className="hidden xs:inline">Demo Flow</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setLanguage('hinglish')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'hinglish'
                  ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hinglish
            </button>
            <button
              onClick={() => setLanguage('hindi')}
              className={`px-2 py-1 rounded-md transition-all ${
                language === 'hindi'
                  ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('english')}
              className={`px-2 py-1 rounded-md transition-all hidden sm:block ${
                language === 'english'
                  ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>

          {/* Reset Demo Data Button */}
          <button
            id="btn-reset-demo"
            onClick={() => {
              if (window.confirm('Reset all demo data back to initial state?')) {
                resetToDemoData();
              }
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset to initial Hackathon Demo Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Quick Voice trigger */}
          <button
            id="btn-nav-voice"
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Bol kar Poocho</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 overflow-x-auto scrollbar-none border-t border-slate-100">
        <div className="flex space-x-1 py-1.5 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all select-none ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                } ${tab.highlight && !isActive ? 'ring-1 ring-emerald-400/40 text-emerald-800 bg-emerald-50/70' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-emerald-600' : 'text-slate-500'}`} />
                <span>{language === 'hindi' ? tab.labelHindi : tab.label}</span>

                {tab.badge !== null && tab.badge !== undefined && (
                  <span className={`inline-flex items-center justify-center text-[10px] font-extrabold text-white px-1.5 py-0.2 min-w-[18px] h-[18px] rounded-full ${isActive ? 'bg-white text-emerald-800' : tab.badgeColor || 'bg-slate-700'}`}>
                    {tab.badge}
                  </span>
                )}

                {tab.highlight && (
                  <span className="flex h-2 w-2 relative ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
