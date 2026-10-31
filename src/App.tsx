import React, { useState } from 'react';
import { DukaanProvider, useDukaan } from './context/DukaanContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SalesPOS } from './components/SalesPOS';
import { Inventory } from './components/Inventory';
import { Khata } from './components/Khata';
import { SuppliersModule } from './components/SuppliersModule';
import { NearbyMapDirectory } from './components/NearbyMapDirectory';
import { AiAssistant } from './components/AiAssistant';
import { Analytics } from './components/Analytics';
import { DemoFlowModal } from './components/DemoFlowModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { activeTab, setActiveTab, currentUser } = useDukaan();
  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [assistantTriggerQuery, setAssistantTriggerQuery] = useState<string>('');

  const handleOpenAssistantWithQuery = (query: string) => {
    setAssistantTriggerQuery(query);
    setActiveTab('assistant');
  };

  // If user is explicitly logged out or on 'login' tab, render dedicated LoginScreen
  const isLoginView = activeTab === 'login' || !currentUser.isLoggedIn;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Navigation Bar */}
      <Navbar 
        onOpenDemoGuide={() => setShowDemoGuide(true)} 
        onOpenLoginModal={() => setShowLoginModal(true)} 
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24 sm:pb-8">
        {isLoginView ? (
          <LoginScreen 
            onSuccess={() => setActiveTab(currentUser.role === 'CLIENT' ? 'nearby' : 'dashboard')} 
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                onOpenNewSale={() => setActiveTab('sales')}
                onOpenKhata={() => setActiveTab('khata')}
                onOpenInventory={() => setActiveTab('inventory')}
                onOpenAssistantWithQuery={handleOpenAssistantWithQuery}
              />
            )}

            {activeTab === 'sales' && <SalesPOS />}

            {activeTab === 'inventory' && <Inventory />}

            {activeTab === 'khata' && <Khata />}

            {activeTab === 'suppliers' && <SuppliersModule />}

            {activeTab === 'nearby' && <NearbyMapDirectory />}

            {activeTab === 'assistant' && (
              <AiAssistant initialQuery={assistantTriggerQuery} />
            )}

            {activeTab === 'analytics' && <Analytics />}
          </>
        )}
      </main>

      {/* Floating Demo Flow button for mobile */}
      {!isLoginView && (
        <div className="sm:hidden fixed bottom-18 right-3 z-30">
          <button
            onClick={() => setShowDemoGuide(true)}
            className="w-11 h-11 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white active:scale-95 transition-transform"
            title="Demo Flow Guide"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
          </button>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      {!isLoginView && (
        <MobileBottomNav onOpenLogin={() => setShowLoginModal(true)} />
      )}

      {/* Hackathon Demo Flow Walkthrough Modal */}
      <DemoFlowModal
        isOpen={showDemoGuide}
        onClose={() => setShowDemoGuide(false)}
        onExecuteDemoStep={handleOpenAssistantWithQuery}
      />

      {/* General WhatsApp Messenger Modal */}
      <WhatsAppModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
      />

      {/* Role-Based Authentication & Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <DukaanProvider>
      <AppContent />
    </DukaanProvider>
  );
}
