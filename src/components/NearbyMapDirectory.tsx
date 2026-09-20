import React, { useState } from 'react';
import { 
  MapPin, 
  Store, 
  Building2, 
  Phone, 
  MessageCircle, 
  Star, 
  Navigation, 
  Search, 
  Filter, 
  Sparkles,
  ExternalLink,
  Layers,
  Clock,
  ArrowRight,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';
import { NearbyMerchant, Supplier } from '../types';

export const NearbyMapDirectory: React.FC = () => {
  const { 
    currentUser, 
    nearbyMerchants, 
    suppliers, 
    openWhatsApp, 
    language,
    switchRole 
  } = useDukaan();

  // Mode: if currentUser is CLIENT, show merchants. If MERCHANT, show both merchants & nearby suppliers!
  const isMerchant = currentUser.role === 'MERCHANT';
  const [filterType, setFilterType] = useState<'ALL' | 'MERCHANTS' | 'SUPPLIERS'>(
    isMerchant ? 'ALL' : 'MERCHANTS'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<NearbyMerchant | null>(nearbyMerchants[0] || null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Filtered merchants
  const filteredMerchants = nearbyMerchants.filter(m =>
    m.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.popularItems.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filtered suppliers
  const filteredSuppliers = suppliers.filter(s =>
    s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.itemsSupplied && s.itemsSupplied.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleContactWhatsApp = (phone: string, storeName: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const msg = `Namaste ${storeName}! 🙏 Maine aapki dukaan DukaanAI Nearby par dekhi. Kya aapke paas daily items / grocery stock uplabdh hai?`;
    openWhatsApp(cleanPhone, msg);
  };

  const handleOrderWholesaleWhatsApp = (supplier: Supplier) => {
    const cleanPhone = supplier.phone.replace(/\D/g, '');
    const msg = `Namaste ${supplier.name} ji (${supplier.companyName})! 🙏 Hum Sharma Kirana Store se baat kar rahe hain. Wholesale stock purchase order ke regarding enquiry karni thi.`;
    openWhatsApp(cleanPhone, msg);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Orientation */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-xs flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              {isMerchant ? 'Merchant B2B & Retail Radius' : 'Customer Hyperlocal Store Discovery'}
            </span>
            <span className="text-xs font-semibold text-emerald-300">
              📍 Current Location: Mayur Vihar, Delhi
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isMerchant 
              ? 'Find Wholesale Suppliers & Fellow Merchants Near You' 
              : 'Discover Local Kirana Stores & Supermarkets Near You'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            {isMerchant
              ? 'Locate agricultural mandis, FMCG distributors, and check product availability directly over WhatsApp or phone call.'
              : 'Browse verified neighborhood grocery stores, check open status, compare popular items, and order directly on WhatsApp.'}
          </p>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => switchRole(isMerchant ? 'CLIENT' : 'MERCHANT')}
              className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
            >
              Switch to {isMerchant ? 'Customer / Client View' : 'Merchant View'}
            </button>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={isMerchant ? "Search nearby stores, FMCG distributors, Atta, Milk..." : "Search groceries, atta, dairy, stores near you..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
              filterType === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Locations
          </button>
          <button
            onClick={() => setFilterType('MERCHANTS')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              filterType === 'MERCHANTS'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Kirana Stores ({filteredMerchants.length})</span>
          </button>

          {isMerchant && (
            <button
              onClick={() => setFilterType('SUPPLIERS')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'SUPPLIERS'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Wholesale Suppliers ({filteredSuppliers.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Map Visualizer & Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Map Preview Canvas (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600 animate-spin-slow" />
              <h3 className="text-sm font-black text-slate-900">
                Live Radar & Map Pins
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              GPS Radius: 5 km
            </span>
          </div>

          {/* Stylized Interactive Map Canvas Component */}
          <div className="relative w-full h-80 rounded-2xl bg-[#E5E9EC] overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner group">
            {/* Map Roads & Blocks Mock Graphic */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 400 320">
              <path d="M 0,80 Q 200,90 400,60" fill="none" stroke="#CBD5E1" strokeWidth="12" />
              <path d="M 0,220 Q 200,200 400,240" fill="none" stroke="#CBD5E1" strokeWidth="16" />
              <path d="M 120,0 Q 140,160 130,320" fill="none" stroke="#CBD5E1" strokeWidth="14" />
              <path d="M 280,0 Q 260,160 290,320" fill="none" stroke="#CBD5E1" strokeWidth="18" />
              <circle cx="200" cy="160" r="110" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="200" cy="160" r="60" fill="none" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
            </svg>

            {/* Central User Location Pin */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-400/40 animate-ping absolute" />
              <div className="w-5 h-5 rounded-full bg-blue-600 ring-4 ring-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
                📍
              </div>
              <span className="text-[9px] font-extrabold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                You (Your Store)
              </span>
            </div>

            {/* Pins for Nearby Merchants */}
            {filteredMerchants.map((m, idx) => {
              const offsets = [
                { top: '28%', left: '35%' },
                { top: '38%', left: '72%' },
                { top: '65%', left: '26%' },
                { top: '74%', left: '68%' },
              ];
              const pos = offsets[idx % offsets.length];
              const isSelected = selectedMerchant?.id === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMerchant(m);
                    setSelectedSupplier(null);
                  }}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 ${
                    isSelected ? 'scale-110 z-30' : ''
                  }`}
                >
                  <div className={`p-1.5 rounded-full shadow-md flex items-center justify-center ${
                    isSelected ? 'bg-emerald-600 text-white ring-4 ring-emerald-300' : 'bg-white text-emerald-700 border border-emerald-400'
                  }`}>
                    <Store className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[9px] font-black bg-white/90 backdrop-blur-2xs text-slate-800 px-1 py-0.5 rounded shadow-2xs mt-0.5 whitespace-nowrap border border-slate-200">
                    {m.storeName.split(' ')[0]} ({m.distanceKm}km)
                  </div>
                </div>
              );
            })}

            {/* Pins for Suppliers if Merchant role */}
            {isMerchant && filteredSuppliers.map((s, idx) => {
              const sOffsets = [
                { top: '18%', left: '60%' },
                { top: '80%', left: '42%' },
                { top: '22%', left: '18%' },
              ];
              const sPos = sOffsets[idx % sOffsets.length];
              const isSelected = selectedSupplier?.id === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedSupplier(s);
                    setSelectedMerchant(null);
                  }}
                  style={{ top: sPos.top, left: sPos.left }}
                  className={`absolute z-20 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 ${
                    isSelected ? 'scale-110 z-30' : ''
                  }`}
                >
                  <div className={`p-1.5 rounded-full shadow-md flex items-center justify-center ${
                    isSelected ? 'bg-indigo-600 text-white ring-4 ring-indigo-300' : 'bg-white text-indigo-700 border border-indigo-400'
                  }`}>
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[9px] font-black bg-indigo-50/95 text-indigo-900 px-1 py-0.5 rounded shadow-2xs mt-0.5 whitespace-nowrap border border-indigo-200">
                    {s.companyName.split(' ')[0]} Mandi
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              Kirana Retailers
            </span>
            {isMerchant && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                Wholesale Mandi Suppliers
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              You
            </span>
          </div>
        </div>

        {/* Right: Listings Directory Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Verified Partners Near You ({filteredMerchants.length + (filterType !== 'MERCHANTS' ? filteredSuppliers.length : 0)})
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Sorted by nearest distance
            </span>
          </div>

          <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
            {/* Merchants List */}
            {(filterType === 'ALL' || filterType === 'MERCHANTS') &&
              filteredMerchants.map(merchant => (
                <div
                  key={merchant.id}
                  onClick={() => {
                    setSelectedMerchant(merchant);
                    setSelectedSupplier(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedMerchant?.id === merchant.id
                      ? 'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
                          <Store className="w-4 h-4" />
                        </span>
                        <h4 className="font-black text-base text-slate-900">
                          {merchant.storeName}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          merchant.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {merchant.isOpen ? 'Open Now' : 'Closed'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        Proprietor: <strong>{merchant.name}</strong> • {merchant.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {merchant.rating}
                      </span>
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {merchant.distanceKm} km
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{merchant.address}</span>
                  </div>

                  {/* Popular items chips */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500">In Stock:</span>
                    {merchant.popularItems.map((item, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      UPI VPA: <code className="font-mono font-bold text-slate-700">{merchant.upiId}</code>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${merchant.phone}`}
                        className="px-3 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactWhatsApp(merchant.phone, merchant.storeName);
                        }}
                        className="px-3.5 py-1 text-xs font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg shadow-2xs transition-all flex items-center gap-1 active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Order on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {/* Wholesale Suppliers List (Shown when relevant) */}
            {isMerchant && (filterType === 'ALL' || filterType === 'SUPPLIERS') &&
              filteredSuppliers.map(supplier => (
                <div
                  key={supplier.id}
                  onClick={() => {
                    setSelectedSupplier(supplier);
                    setSelectedMerchant(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedSupplier?.id === supplier.id
                      ? 'border-indigo-500 bg-indigo-50/20 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-indigo-100 text-indigo-800">
                          <Building2 className="w-4 h-4" />
                        </span>
                        <h4 className="font-black text-base text-slate-900">
                          {supplier.companyName}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          Wholesale
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        Contact: <strong>{supplier.name}</strong> • {supplier.category}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md self-start sm:self-auto">
                      {supplier.distanceKm || 2.5} km away
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{supplier.address}, {supplier.city}</span>
                  </div>

                  {/* Supplied Items */}
                  {supplier.itemsSupplied && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-2.5 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500">Wholesale Line:</span>
                      {supplier.itemsSupplied.map((item, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-100 px-2 py-0.5 rounded-md"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-3 pt-2.5 border-t border-slate-100">
                    <a
                      href={`tel:${supplier.phone}`}
                      className="px-3 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> Call Mandi
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderWholesaleWhatsApp(supplier);
                      }}
                      className="px-3.5 py-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-2xs transition-all flex items-center gap-1 active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Request Wholesale Quote
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
