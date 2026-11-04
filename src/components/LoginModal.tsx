import React, { useState } from 'react';
import { 
  LogIn, 
  Store, 
  User, 
  Truck, 
  Smartphone, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  X,
  Sparkles,
  Lock
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginUser, currentUser } = useDukaan();

  const [selectedRole, setSelectedRole] = useState<UserRole>('MERCHANT');
  const [authMethod, setAuthMethod] = useState<'phone' | 'google'>('phone');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('4582');
  const [otpSent, setOtpSent] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('ramesh.sharma.kirana@gmail.com');
  const [clientName, setClientName] = useState('Priya Verma');
  const [merchantName, setMerchantName] = useState('Ramesh Sharma');
  const [supplierName, setSupplierName] = useState('Gupta Wholesale Distributors');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      alert('Kripya 10 ankon ka mobile number dalein');
      return;
    }
    setOtpSent(true);
  };

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      let name = merchantName;
      if (selectedRole === 'CLIENT') name = clientName || 'Priya Verma';
      if (selectedRole === 'SUPPLIER') name = supplierName || 'Gupta Wholesale';
      
      const emailOrPhone = `+91 ${phone}`;
      loginUser(selectedRole, 'phone', name, emailOrPhone);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      let name = 'Ramesh Sharma (Merchant)';
      if (selectedRole === 'CLIENT') name = `${clientName || 'Priya Verma'} (Customer)`;
      if (selectedRole === 'SUPPLIER') name = `${supplierName || 'Gupta Wholesale'} (Supplier)`;

      loginUser(selectedRole, 'google', name, googleEmail);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                DukaanAI Multi-Role Portal
              </h3>
              <p className="text-xs text-slate-500">
                Choose your portal & account memory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Role Selection: 3 Ways (Merchant, Customer, Supplier) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Step 1: Choose Account Type (आप कौन हैं?)
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Merchant Role Option */}
            <div
              onClick={() => {
                setSelectedRole('MERCHANT');
                setGoogleEmail('ramesh.sharma.kirana@gmail.com');
              }}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedRole === 'MERCHANT'
                  ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-emerald-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Store className="w-3.5 h-3.5" />
                </div>
                {selectedRole === 'MERCHANT' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">Merchant</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                POS, stock & khata
              </p>
            </div>

            {/* Client / Customer Role Option */}
            <div
              onClick={() => {
                setSelectedRole('CLIENT');
                setGoogleEmail('priya.verma.client@gmail.com');
              }}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedRole === 'CLIENT'
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-indigo-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <User className="w-3.5 h-3.5" />
                </div>
                {selectedRole === 'CLIENT' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                )}
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">Customer</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                Udhaar & nearby shops
              </p>
            </div>

            {/* Supplier / Wholesaler Role Option */}
            <div
              onClick={() => {
                setSelectedRole('SUPPLIER');
                setGoogleEmail('gupta.wholesale@gmail.com');
              }}
              className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedRole === 'SUPPLIER'
                  ? 'border-amber-600 bg-amber-50/60 shadow-xs'
                  : 'border-slate-200 hover:border-amber-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                {selectedRole === 'SUPPLIER' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                )}
              </div>
              <h4 className="font-extrabold text-xs text-slate-900">Supplier</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                PO & pending dues
              </p>
            </div>
          </div>
        </div>

        {/* 2. Auth Provider Toggle: Phone Number OTP vs Google */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Step 2: Sign In Method
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setAuthMethod('phone')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'phone'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mobile OTP</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('google')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                authMethod === 'google'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google SSO</span>
            </button>
          </div>
        </div>

        {/* Form Details */}
        {authMethod === 'phone' ? (
          <form onSubmit={handlePhoneLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {selectedRole === 'MERCHANT' ? 'Shop / Merchant Name' : selectedRole === 'CLIENT' ? 'Customer Name' : 'Wholesale Business Name'}
              </label>
              <input
                type="text"
                required
                value={selectedRole === 'MERCHANT' ? merchantName : selectedRole === 'CLIENT' ? clientName : supplierName}
                onChange={e => {
                  if (selectedRole === 'MERCHANT') setMerchantName(e.target.value);
                  else if (selectedRole === 'CLIENT') setClientName(e.target.value);
                  else setSupplierName(e.target.value);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number (10 Digits)
              </label>
              <div className="flex gap-2">
                <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {otpSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span>Enter 4-digit OTP:</span>
                  <span className="text-[10px] text-emerald-700">Auto-filled for demo</span>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full text-center text-lg font-black tracking-widest px-3 py-2 bg-white border border-emerald-300 rounded-lg text-emerald-900"
                />
              </div>
            )}

            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Send Verification OTP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                {isSubmitting ? 'Verifying OTP...' : `Login as ${selectedRole}`}
              </button>
            )}
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Account Email
              </label>
              <input
                type="email"
                required
                value={googleEmail}
                onChange={e => setGoogleEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGoogleLogin}
              className="w-full py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google as {selectedRole}</span>
            </button>
          </div>
        )}

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Account Session with Independent Memory</span>
        </div>
      </div>
    </div>
  );
};
