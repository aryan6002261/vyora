import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  ArrowRight,
  MessageCircle, 
  Check, 
  Copy,
  AlertCircle,
  RotateCcw,
  Store,
  User
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';
import { ActionProposal, ChatMessage } from '../types';

interface AiAssistantProps {
  initialQuery?: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ initialQuery }) => {
  const { 
    chatMessages, 
    sendAiQuery, 
    isAiLoading, 
    confirmActionProposal, 
    dismissActionProposal, 
    speakText, 
    stopSpeaking, 
    isSpeaking,
    openWhatsApp,
    language,
    currentUser,
    t 
  } = useDukaan();

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechLanguage, setSpeechLanguage] = useState<'hi-IN' | 'en-IN'>(
    language === 'english' ? 'en-IN' : 'hi-IN'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const isClient = currentUser.role === 'CLIENT';

  // Sync speech language when language changes
  useEffect(() => {
    setSpeechLanguage(language === 'english' ? 'en-IN' : 'hi-IN');
  }, [language]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiLoading]);

  // Handle external query trigger (e.g. from Dashboard or Demo walkthrough)
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      sendAiQuery(initialQuery, false);
    }
  }, [initialQuery]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = speechLanguage;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [speechLanguage]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome/Edge or text input.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInputText('');
      try {
        recognitionRef.current.lang = speechLanguage;
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isAiLoading) return;

    const query = inputText;
    setInputText('');
    await sendAiQuery(query, isListening);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Dynamic role-specific and language-specific suggestions
  const getPromptSuggestions = () => {
    if (isClient) {
      if (language === 'hindi') {
        return [
          { label: 'आस-पास कौन सी किराना दुकानें खुली हैं?', sub: 'दुकानें खोजें' },
          { label: 'आशीर्वाद आटा और अमुल दूध का क्या भाव है?', sub: 'सामान का भाव' },
          { label: 'मेरा कितना उधार बकाया है?', sub: 'खाता जांचें' },
          { label: 'शर्मा किराना स्टोर से 10kg आटा मंगाना है', sub: 'व्हाट्सएप ऑर्डर' },
        ];
      } else if (language === 'english') {
        return [
          { label: 'Which grocery stores are open near me?', sub: 'Nearby stores' },
          { label: 'What is the price of Aashirvaad Atta & Milk?', sub: 'Price & Stock' },
          { label: 'What is my pending ledger balance?', sub: 'Check udhaar' },
          { label: 'Order 10kg Atta from Sharma Kirana Store', sub: 'WhatsApp order' },
        ];
      } else {
        return [
          { label: 'Aas-paas konsi kirana dukaanein khuli hain?', sub: 'Nearby stores' },
          { label: 'Aashirvaad Atta aur doodh ka price kya hai?', sub: 'Rate check' },
          { label: 'Mera kitna udhaar baki hai?', sub: 'Khata check' },
          { label: 'Sharma Kirana Store se 10kg Atta order karna hai', sub: 'WhatsApp order' },
        ];
      }
    } else {
      // Merchant Role Suggestions
      if (language === 'hindi') {
        return [
          { label: 'आज क्या बिक रहा है?', sub: 'बिक्री का विश्लेषण' },
          { label: 'आटा कितना बचा है?', sub: 'स्टॉक की जांच' },
          { label: 'रमेश का 850 रुपये उधार है, रिमाइंडर बना दो।', sub: 'व्हाट्सएप रिमाइंडर' },
          { label: 'सप्लायर्स का कितना बकाया है?', sub: 'थोक भुगतान' },
          { label: 'आज कितनी बिक्री हुई?', sub: 'मुनाफ़ा & कुल बिक्री' },
          { label: 'क्या कोई सामान खत्म होने वाला है?', sub: 'कम स्टॉक अलर्ट' },
        ];
      } else if (language === 'english') {
        return [
          { label: 'What is selling most today?', sub: 'Demand analysis' },
          { label: 'How much Atta stock is left?', sub: 'Stock check' },
          { label: 'Ramesh owes 850, create a WhatsApp payment reminder.', sub: 'Khata action' },
          { label: 'How much do we owe to suppliers?', sub: 'Wholesale dues' },
          { label: 'What are today’s total sales and profit?', sub: 'Revenue & profit' },
          { label: 'Which items are low in stock?', sub: 'Restock alert' },
        ];
      } else {
        return [
          { label: 'Aaj kya bik raha hai?', sub: 'Top selling analysis' },
          { label: 'Atta kitna bacha hai?', sub: 'Inventory check' },
          { label: 'Ramesh ka 850 rupaye udhaar hai, reminder bana do.', sub: 'WhatsApp reminder' },
          { label: 'Suppliers ka kitna payment baki hai?', sub: 'Wholesale dues' },
          { label: 'Aaj kitni sale hui?', sub: 'Sales & profit' },
          { label: 'Kya stock khatam hone wala hai?', sub: 'Low stock alert' },
        ];
      }
    }
  };

  const promptSuggestions = getPromptSuggestions();

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-170px)] sm:h-[calc(100vh-140px)] min-h-[520px] pb-4">
      {/* Copilot Header */}
      <div className="bg-white p-3.5 sm:p-4 rounded-t-2xl border-x border-t border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs ${
            isClient 
              ? 'bg-gradient-to-tr from-indigo-600 to-blue-600' 
              : 'bg-gradient-to-tr from-purple-600 to-indigo-600'
          }`}>
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {isClient ? 'Vyora AI Shopping Mitra' : t('ai_title')}
              </h3>
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">{t('ai_status_live')}</span>
                <span className="sm:hidden">Live Context</span>
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {language === 'hindi' 
                ? 'हिंदी • हिंग्लिश • इंग्लिश में बोलकर या लिखकर पूछें' 
                : language === 'english'
                ? 'Speak or type in English, Hindi, or Hinglish'
                : 'Hindi • Hinglish • English bolkar ya likhkar poohein'}
            </p>
          </div>
        </div>

        {/* Voice Speech Language Toggle & TTS Status */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 animate-pulse"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('ai_stop_listening')}</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setSpeechLanguage('hi-IN')}
              className={`px-2 py-1 rounded-md transition-all ${
                speechLanguage === 'hi-IN'
                  ? 'bg-white text-purple-700 shadow-2xs font-bold'
                  : 'text-slate-600'
              }`}
              title="Voice recognition in Hindi / Hinglish"
            >
              🇮🇳 हिन्दी
            </button>
            <button
              onClick={() => setSpeechLanguage('en-IN')}
              className={`px-2 py-1 rounded-md transition-all ${
                speechLanguage === 'en-IN'
                  ? 'bg-white text-purple-700 shadow-2xs font-bold'
                  : 'text-slate-600'
              }`}
              title="Voice recognition in Indian English"
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 bg-slate-50/70 border-x border-slate-200 p-3 sm:p-4 overflow-y-auto space-y-4">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2 ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b pb-1 mb-1.5 opacity-80 text-[11px]">
                  <span className="font-bold">
                    {isUser ? `${currentUser.name} (${currentUser.role})` : isClient ? 'Vyora Shopping Mitra' : 'DukaanAI Munimji'}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Message Body */}
                <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                  {msg.text}
                </div>

                {/* Assistant Controls: TTS Speak & Copy */}
                {!isUser && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => speakText(msg.text)}
                      title="Bol kar sunao (Text to Speech)"
                      className="p-1 text-slate-400 hover:text-purple-600 rounded-md transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      title="Copy message"
                      className="p-1 text-slate-400 hover:text-purple-600 rounded-md transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Action Proposal Confirmation Card (Crucial for Demo Flow) */}
              {msg.actionProposal && (
                <div className="mt-2.5 max-w-[90%] sm:max-w-[78%] w-full bg-white border-2 border-amber-300 rounded-2xl p-4 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          {msg.actionProposal.title}
                        </h4>
                        <div className="text-[10px] sm:text-[11px] text-amber-800 font-semibold">
                          {t('ai_action_required')}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      msg.actionProposal.status === 'EXECUTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : msg.actionProposal.status === 'DISMISSED'
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-amber-100 text-amber-900 animate-pulse'
                    }`}>
                      {msg.actionProposal.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    {msg.actionProposal.description}
                  </p>

                  {/* WhatsApp Draft Preview */}
                  {msg.actionProposal.type === 'SEND_WHATSAPP_REMINDER' && msg.actionProposal.details.whatsAppMessage && (
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                        <span className="flex items-center gap-1 truncate max-w-[200px] sm:max-w-none">
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                          <span>WhatsApp Preview to {msg.actionProposal.details.customerName} ({msg.actionProposal.details.phone})</span>
                        </span>
                        <span>₹{msg.actionProposal.details.amount}</span>
                      </div>
                      <div className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-emerald-100">
                        "{msg.actionProposal.details.whatsAppMessage}"
                      </div>
                    </div>
                  )}

                  {/* Confirmation Buttons */}
                  {msg.actionProposal.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        id="btn-confirm-action"
                        onClick={() => confirmActionProposal(msg.actionProposal!.id)}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{t('ai_confirm_action')}</span>
                      </button>

                      <button
                        onClick={() => dismissActionProposal(msg.actionProposal!.id)}
                        className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4 text-slate-400" />
                        <span>{t('ai_cancel_action')}</span>
                      </button>
                    </div>
                  ) : msg.actionProposal.status === 'EXECUTED' ? (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Action confirmed and WhatsApp opened successfully!</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      This action was dismissed.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* AI Loading indicator */}
        {isAiLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold bg-white p-3 rounded-2xl border border-slate-200 max-w-xs shadow-2xs">
            <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
            <span>{t('ai_thinking')}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips (Tailored to role and language) */}
      <div className="bg-slate-50 border-x border-slate-200 px-3 sm:px-4 py-2 flex gap-1.5 overflow-x-auto scrollbar-none">
        {promptSuggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(item.label);
              sendAiQuery(item.label, false);
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-800 text-xs font-bold whitespace-nowrap border border-slate-200 hover:border-purple-300 transition-all shadow-2xs shrink-0"
          >
            "{item.label}"
          </button>
        ))}
      </div>

      {/* Input Form & Voice Controls */}
      <div className="bg-white p-3 sm:p-4 rounded-b-2xl border-x border-b border-slate-200 shadow-md">
        {isListening && (
          <div className="mb-2 flex items-center justify-between bg-purple-50 border border-purple-200 text-purple-900 px-3 py-1.5 rounded-xl text-xs font-semibold animate-pulse">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
              <span>{t('ai_listening')} ({speechLanguage === 'hi-IN' ? 'हिन्दी / Hinglish' : 'English'})</span>
            </span>
            <button
              onClick={toggleListening}
              className="text-rose-600 hover:text-rose-700 font-bold"
            >
              Stop
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          {/* Voice input button */}
          <button
            type="button"
            id="btn-voice-toggle"
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200 shadow-md'
                : 'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200'
            }`}
            title="Bolkar poochhein (Voice input)"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            id="input-ai-query"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('ai_input_placeholder')}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm font-medium"
          />

          {/* Send Button */}
          <button
            type="submit"
            id="btn-send-ai"
            disabled={!inputText.trim() || isAiLoading}
            className="p-2.5 sm:p-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl shadow-xs transition-all shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
