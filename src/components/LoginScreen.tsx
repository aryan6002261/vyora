import React, { useState } from 'react';
import { 
  LogIn, 
  Store, 
  User, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Lock,
  ShoppingBag,
  MapPin,
  Clock,
  Check,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';
import { UserRole } from '../types';

interface LoginScreenProps {
  onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const { loginUser, language, setLanguage, t } = useDukaan();

  const [selectedRole, setSelectedRole] = useState<UserRole>('MERCHANT');
  const [authMethod, setAuthMethod] = useState<'phone' | 'google'>('phone');
  
  // Phone form state
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('4582');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);

  // Profile details
  const [name, setName] = useState('Ramesh Sharma');
  const [storeName, setStoreName] = useState('Sharma General Kirana Store');
  const [locality, setLocality] = useState('Pocket B Market, Mayur Vihar, Delhi');
  const [googleEmail, setGoogleEmail] = useState('ramesh.sharma.kirana@gmail.com');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // When changing roles, switch sensible pre-filled presets
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'MERCHANT') {
      setName('Ramesh Sharma');
      setStoreName('Sharma General Kirana Store');
      setLocality('Pocket B Market, Mayur Vihar, Delhi');
      setPhone('9876543210');
      setGoogleEmail('ramesh.sharma.kirana@gmail.com');
    } else {
      setName('Priya Verma');
      setLocality('Flat 402, Rosewood Apartments, Mayur Vihar, Delhi');
      setPhone('9899122334');
      setGoogleEmail('priya.verma.client@gmail.com');
    }
    setOtpSent(false);
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      alert(language === 'hindi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpSent(true);
    setResendCountdown(30);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '4582' && otp.length < 4) {
      alert(language === 'hindi' ? 'कृपया 4 अंकों का OTP दर्ज करें' : 'Please enter 4-digit OTP');
      return;
    }
    submitLogin('phone', `+91 ${phone}`);
  };

  const handleGoogleSubmit = () => {
    submitLogin('google', googleEmail);
  };

  const submitLogin = (provider: 'phone' | 'google', phoneOrEmail: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      loginUser(selectedRole, provider, name, phoneOrEmail);
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 500);
    }, 450);
  };

  // Instant 1-Click Demo Logins
  const handleOneClickMerchant = () => {
    setSelectedRole('MERCHANT');
    setName('Ramesh Sharma');
    loginUser('MERCHANT', 'phone', 'Ramesh Sharma', '+91 98765 43210');
    if (onSuccess) onSuccess();
  };

  const handleOneClickClient = () => {
    setSelectedRole('CLIENT');
    setName('Priya Verma');
    loginUser('CLIENT', 'google', 'Priya Verma', 'priya.verma.client@gmail.com');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-6 px-3 sm:px-6">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Left Side: Brand Narrative & Hyperlocal Context (Visible on lg, compact on mobile) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            {/* Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                <Store className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  Vyora <span className="text-emerald-400">DukaanAI</span>
                </h1>
                <p className="text-xs text-emerald-200 font-medium">
                  {t('login_tagline')}
                </p>
              </div>
            </div>

            {/* Language Quick Switcher */}
            <div className="inline-flex items-center gap-1 bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setLanguage('hinglish')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  language === 'hinglish' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
                }`}
              >
                Hinglish
              </button>
              <button
                onClick={() => setLanguage('hindi')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  language === 'hindi' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  language === 'english' ? 'bg-white text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Merchant Portal (दुकानदार)</h4>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed mt-0.5">
                    Fast POS billing, live stock threshold alerts, customer digital khata ledger & WhatsApp reminders.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Customer Portal (ग्राहक)</h4>
                  <p className="text-[11px] text-indigo-200/80 leading-relaxed mt-0.5">
                    Find nearby kirana stores, check item prices, track your udhaar balance, and order on WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">AI Munimji Copilot</h4>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                    Speak or type in Hindi, Hinglish, or English for instant business insights and 1-click actions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Footer */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-300/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Encrypted & Local Memory
            </span>
            <span>🇮🇳 Made for Bharat</span>
          </div>
        </div>

        {/* Right Side: Interactive Login Portal */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {t('login_title')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  {selectedRole === 'MERCHANT' ? t('login_merchant_desc') : t('login_client_desc')}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700">
                {selectedRole}
              </span>
            </div>

            {/* Step 1: Select Role (Merchant vs Client) */}
            <div className="space-y-2 mb-6">
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider">
                {t('login_step_role')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Merchant Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('MERCHANT')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                    selectedRole === 'MERCHANT'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Store className="w-5 h-5" />
                    </div>
                    {selectedRole === 'MERCHANT' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {t('login_merchant_title')}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    POS, Stock & Khata
                  </p>
                </button>

                {/* Client Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('CLIENT')}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all relative ${
                    selectedRole === 'CLIENT'
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-indigo-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    {selectedRole === 'CLIENT' && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {t('login_client_title')}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Nearby Kirana & My Udhaar
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Choose Auth Method (Phone OTP vs Gmail) */}
            <div className="space-y-3 mb-5">
              <label className="block text-xs font-black text-slate-600 uppercase tracking-wider">
                {t('login_step_method')}
              </label>
              
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                    authMethod === 'phone'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>{t('login_method_phone')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('google')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                    authMethod === 'google'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{t('login_method_google')}</span>
                </button>
              </div>
            </div>

            {/* Auth Forms */}
            {authMethod === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('login_name_label')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Mobile Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('login_phone_label')}
                  </label>
                  <div className="flex gap-2">
                    <div className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 flex items-center shrink-0">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder={t('login_phone_placeholder')}
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white tracking-wider"
                    />
                  </div>
                </div>

                {/* Role-Specific Field: Store Name or Area */}
                {selectedRole === 'MERCHANT' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('login_store_label')}
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Sharma General Kirana Store"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('login_address_label')}
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Pocket B Market, Mayur Vihar, Delhi"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                )}

                {/* OTP Section */}
                {otpSent ? (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl space-y-2.5 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between text-xs font-black text-emerald-900">
                      <span>{t('login_enter_otp')}</span>
                      <span className="text-[11px] font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md">
                        Demo OTP: 4582
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full py-2.5 text-center text-xl font-black font-mono tracking-widest bg-white border border-emerald-300 rounded-xl text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>SMS sent to +91 {phone}</span>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        {t('login_resend_otp')}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Verifying OTP...' : t('login_verify_otp')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t('login_send_otp')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </form>
            ) : (
              /* Google Sign-in Option */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('login_name_label')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Google Account (Gmail)
                  </label>
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                {selectedRole === 'MERCHANT' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('login_store_label')}
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('login_address_label')}
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                )}

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleGoogleSubmit}
                  className="w-full py-3 bg-white hover:bg-slate-50 active:scale-98 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-extrabold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2.5"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isSubmitting ? 'Signing in...' : `${t('login_google_btn')} as ${selectedRole}`}</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick 1-Click Demo Accounts */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider">
              <span>{t('login_demo_presets_title')}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleOneClickMerchant}
                className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 font-bold text-xs rounded-xl transition-all flex items-center justify-between group shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <span>🏪</span>
                  <span>{t('login_demo_merchant_btn')}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleOneClickClient}
                className="py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-950 font-bold text-xs rounded-xl transition-all flex items-center justify-between group shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <span>👤</span>
                  <span>{t('login_demo_client_btn')}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

