import React, { useState } from 'react';
import { 
  MessageCircle, 
  Share2, 
  X, 
  Copy, 
  Check, 
  Users, 
  Tag, 
  Gift, 
  AlertCircle 
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose }) => {
  const { customers, openWhatsApp } = useDukaan();
  const [selectedRecipient, setSelectedRecipient] = useState(customers[0]?.phone || '');
  const [messageType, setMessageType] = useState<'reminder' | 'offer' | 'bill'>('reminder');
  const [customOfferText, setCustomOfferText] = useState('Diwali dhamaka! Har 10kg Atta par ₹30 ki chhoot!');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCustomer = customers.find(c => c.phone === selectedRecipient) || customers[0];

  let generatedMessage = '';
  if (messageType === 'reminder') {
    generatedMessage = `Namaste ${currentCustomer?.name || 'Grahak'} ji! 🙏 Dukaan se aapka ₹${currentCustomer?.udhaarBalance || 850} ka udhaar baaki hai. Kripya samay par UPI ya cash se clear kar dein. Dhanyawad! - Dukaan`;
  } else if (messageType === 'offer') {
    generatedMessage = `Namaste ${currentCustomer?.name || 'Grahak'} ji! 🎉 Dukaan se khaas offer:\n"${customOfferText}"\nAaj hi visit karein ya WhatsApp par order likhwayein! - Aapki Dukaan`;
  } else {
    generatedMessage = `Namaste ${currentCustomer?.name || 'Grahak'} ji! Dukaan par kharidari ke liye dhanyawad. Aapka bill receipt DukaanAI par darj ho gaya hai. Agli baar zaroor aana!`;
  }

  const handleSendWhatsApp = () => {
    openWhatsApp(selectedRecipient || '9876543210', generatedMessage);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              WhatsApp Customer Messages
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Type Selector */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setMessageType('reminder')}
            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
              messageType === 'reminder'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Payment Reminder
          </button>
          <button
            onClick={() => setMessageType('offer')}
            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
              messageType === 'offer'
                ? 'bg-amber-50 text-amber-900 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Offers & Discount
          </button>
          <button
            onClick={() => setMessageType('bill')}
            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
              messageType === 'bill'
                ? 'bg-blue-50 text-blue-900 border-blue-500 ring-2 ring-blue-500/20'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Bill Confirmation
          </button>
        </div>

        {/* Recipient Selector */}
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">Select Customer</label>
          <select
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
            className="w-full p-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl"
          >
            {customers.map(c => (
              <option key={c.id} value={c.phone}>
                {c.name} ({c.phone}) - Udhaar: ₹{c.udhaarBalance}
              </option>
            ))}
          </select>
        </div>

        {/* Custom offer input if offer selected */}
        {messageType === 'offer' && (
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Offer Details</label>
            <input
              type="text"
              value={customOfferText}
              onChange={(e) => setCustomOfferText(e.target.value)}
              className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
            />
          </div>
        )}

        {/* Preview message box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">Live Message Preview</label>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 whitespace-pre-line leading-relaxed font-medium">
            {generatedMessage}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="px-5 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold rounded-xl text-xs shadow-xs flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Send on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
