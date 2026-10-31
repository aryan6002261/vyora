import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  Check, 
  Edit3, 
  Filter, 
  ArrowUpDown,
  PlusCircle,
  MinusCircle,
  X
} from 'lucide-react';
import { useDukaan } from '../context/DukaanContext';
import { Product, ProductCategory, UnitType } from '../types';

export const Inventory: React.FC = () => {
  const { products, updateProductStock, addNewProduct, setProductExactStock, language, t } = useDukaan();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'OK'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdNameHindi, setNewProdNameHindi] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('Grains & Atta');
  const [newProdPurchasePrice, setNewProdPurchasePrice] = useState<number>(100);
  const [newProdSellingPrice, setNewProdSellingPrice] = useState<number>(120);
  const [newProdStock, setNewProdStock] = useState<number>(20);
  const [newProdThreshold, setNewProdThreshold] = useState<number>(5);
  const [newProdUnit, setNewProdUnit] = useState<UnitType>('packet');

  const categories = ['All', 'Grains & Atta', 'Dairy & Eggs', 'Oils & Ghee', 'Spices & Masala', 'Snacks & Biscuits', 'Beverages', 'Cleaning & Household', 'Personal Care'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameHindi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const isLow = p.stock <= p.minStockThreshold;

      if (stockFilter === 'LOW') return matchesSearch && matchesCategory && isLow;
      if (stockFilter === 'OK') return matchesSearch && matchesCategory && !isLow;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    addNewProduct({
      name: newProdName,
      nameHindi: newProdNameHindi || newProdName,
      category: newProdCategory,
      purchasePrice: Number(newProdPurchasePrice),
      sellingPrice: Number(newProdSellingPrice),
      stock: Number(newProdStock),
      minStockThreshold: Number(newProdThreshold),
      unit: newProdUnit,
    });

    setShowAddModal(false);
    // Reset form
    setNewProdName('');
    setNewProdNameHindi('');
    setNewProdPurchasePrice(100);
    setNewProdSellingPrice(120);
    setNewProdStock(20);
  };

  const lowStockCount = products.filter(p => p.stock <= p.minStockThreshold).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-600" />
            <span>{t('inv_title')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Total {products.length} products • {lowStockCount} items low in stock
          </p>
        </div>

        <button
          id="btn-add-product"
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Naya Samaan Jodein</span>
        </button>
      </div>

      {/* Low Stock Alert Strip if any */}
      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-amber-900">
                {lowStockCount} items ka stock khatam hone wala hai!
              </div>
              <div className="text-xs text-amber-700">
                Aashirvaad Atta, MDH Masala and Colgate toothpaste are below safety thresholds.
              </div>
            </div>
          </div>
          <button
            onClick={() => setStockFilter('LOW')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors shrink-0"
          >
            Show Low Stock Only
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product by name or Hindi name..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setStockFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                stockFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setStockFilter('LOW')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                stockFilter === 'LOW' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-700'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              Low Stock ({lowStockCount})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pt-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Cost / Selling</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.map(p => {
                const isLow = p.stock <= p.minStockThreshold;
                const margin = p.sellingPrice - p.purchasePrice;
                const marginPercent = Math.round((margin / p.sellingPrice) * 100);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {p.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {p.nameHindi}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        ₹{p.sellingPrice} <span className="text-xs font-normal text-slate-400">/ {p.unit}</span>
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium">
                        Cost: ₹{p.purchasePrice} ({marginPercent}% margin)
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-black ${isLow ? 'text-amber-600' : 'text-slate-800'}`}>
                          {p.stock}
                        </span>
                        <span className="text-xs text-slate-500">{p.unit}s</span>

                        {isLow && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Min threshold: {p.minStockThreshold}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          title="Reduce 1"
                          onClick={() => updateProductStock(p.id, -1)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md"
                        >
                          -1
                        </button>
                        <button
                          title="Add 1"
                          onClick={() => updateProductStock(p.id, 1)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md border border-emerald-200"
                        >
                          +1
                        </button>
                        <button
                          title="Add 5"
                          onClick={() => updateProductStock(p.id, 5)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md"
                        >
                          +5
                        </button>
                        <button
                          title="Add 10 (Restock)"
                          onClick={() => updateProductStock(p.id, 10)}
                          className="hidden sm:inline-block px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-md"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">
                Naya Samaan Jodein (Add New Product)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Product Name (English)</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Good Day Biscuits"
                    className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Hindi / Local Name</label>
                  <input
                    type="text"
                    value={newProdNameHindi}
                    onChange={(e) => setNewProdNameHindi(e.target.value)}
                    placeholder="e.g. गुड डे बिस्कुट"
                    className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Unit</label>
                  <select
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value as UnitType)}
                    className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
                  >
                    <option value="packet">packet (पैकेट)</option>
                    <option value="kg">kg (किलो)</option>
                    <option value="liter">liter (लीटर)</option>
                    <option value="piece">piece (नग)</option>
                    <option value="box">box (डिब्बा)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Kharid Bhav (Purchase ₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdPurchasePrice}
                    onChange={(e) => setNewProdPurchasePrice(Number(e.target.value))}
                    className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Bikri Bhav (Selling ₹)</label>
                  <input
                    type="number"
                    required
                    value={newProdSellingPrice}
                    onChange={(e) => setNewProdSellingPrice(Number(e.target.value))}
                    className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Current Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Low Stock Alert Limit</label>
                  <input
                    type="number"
                    required
                    value={newProdThreshold}
                    onChange={(e) => setNewProdThreshold(Number(e.target.value))}
                    className="w-full p-2 text-xs font-medium border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
