import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  Bot, 
  MessageCircle, 
  Package, 
  TrendingUp, 
  CheckCircle,
  Play,
  Volume2
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';

interface DemoFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteDemoStep: (query: string) => void;
}

export const DemoFlowModal: React.FC<DemoFlowModalProps> = ({
  isOpen,
  onClose,
  onExecuteDemoStep,
}) => {
  const { speakText, customers } = useDukaan();
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const ramesh = customers.find(c => c.name.toLowerCase().includes('ramesh')) || {
    name: 'Ramesh Kumar',
    phone: '9876543210',
    udhaarBalance: 850,
  };

  const steps = [
    {
      step: 1,
      title: 'Analyze Sales Velocity',
      titleHindi: 'आज क्या बिक रहा है?',
      prompt: 'Aaj kya bik raha hai?',
      icon: TrendingUp,
      color: 'emerald',
      description: 'The shopkeeper asks about morning sales patterns and top-performing products.',
      whatAiDoes: 'AI scans current POS sales, highlights top sellers (Atta, Milk, Maggi, Parle-G), and delivers actionable bundle advice.',
    },
    {
      step: 2,
      title: 'Check Inventory & Low Stock',
      titleHindi: 'आटा कितना बचा है?',
      prompt: 'Atta kitna bacha hai?',
      icon: Package,
      color: 'amber',
      description: 'The shopkeeper checks exact stock count for high-velocity staple commodities.',
      whatAiDoes: 'AI checks live inventory: finds only 4 packets of Aashirvaad Atta remaining (below threshold 10), and warns of evening rush stockout.',
    },
    {
      step: 3,
      title: 'Digital Khata & WhatsApp Action',
      titleHindi: 'रमेश का उधार और रिमाइंडर',
      prompt: 'Ramesh ka 850 rupaye udhaar hai, reminder bana do.',
      icon: MessageCircle,
      color: 'rose',
      description: 'Shopkeeper directs AI to take an action: look up Ramesh Kumar and draft a payment reminder.',
      whatAiDoes: 'AI locates Ramesh Kumar (₹850 balance), generates a polite Hinglish WhatsApp reminder message, and requests confirmation before sending!',
    },
  ];

  const handleRunStep = (prompt: string, stepNumber: number) => {
    setActiveStep(stepNumber);
    onExecuteDemoStep(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                DukaanAI Hackathon Demo Flow
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Official 3-step test scenario specified in the prompt
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Cards */}
        <div className="space-y-3 pt-1">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.step;

            return (
              <div
                key={s.step}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent 
                    ? 'border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-500/20' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {s.title}
                      </h4>
                      <div className="text-xs font-bold text-emerald-700 font-mono">
                        "{s.prompt}"
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => speakText(s.prompt)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                      title="Speak query aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRunStep(s.prompt, s.step)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run Live</span>
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <p>{s.description}</p>
                  <p className="text-[11px] text-slate-500 italic bg-white/70 p-2 rounded-lg border border-slate-200/60">
                    🤖 <strong>AI Action:</strong> {s.whatAiDoes}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
          <span>Hindi, Hinglish, & English natural language parsing</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
