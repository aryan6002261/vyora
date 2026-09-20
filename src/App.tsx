import React, { useState } from 'react';
import { DukaanProvider, useDukaan } from './context/DukaanContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SalesPOS } from './components/SalesPOS';
import { Inventory } from './components/Inventory';
import { Khata } from './components/Khata';
import { AiAssistant } from './components/AiAssistant';
import { Analytics } from './components/Analytics';
import { DemoFlowModal } from './components/DemoFlowModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { Mic, Sparkles, MessageCircle, Store } from 'lucide-react';

function AppContent() {
  const { activeTab, setActiveTab } = useDukaan();
  const [showDemoGuide, setShowDemoGuide] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [assistantTriggerQuery, setAssistantTriggerQuery] = useState<string>('');

  const handleOpenAssistantWithQuery = (query: string) => {
    setAssistantTriggerQuery(query);
    setActiveTab('assistant');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Navigation Bar */}
      <Navbar onOpenDemoGuide={() => setShowDemoGuide(true)} />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
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

        {activeTab === 'assistant' && (
          <AiAssistant initialQuery={assistantTriggerQuery} />
        )}

        {activeTab === 'analytics' && <Analytics />}
      </main>

      {/* Floating Bottom Quick Action Bar for Mobile View */}
      <div className="sm:hidden fixed bottom-3 right-3 z-30 flex flex-col gap-2">
        <button
          onClick={() => setShowDemoGuide(true)}
          className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white"
          title="Demo Flow Guide"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
        </button>
        <button
          onClick={() => setActiveTab('assistant')}
          className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white"
          title="Ask AI Voice Assistant"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

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
