import React, { useState, useRef } from 'react';
import { Product, GoldPrice } from '../types';
import { api } from '../services/api';
import { X, Save, Plus, Trash2, Edit2, TrendingUp, Package, Image as ImageIcon, Upload, Tag, Ruler, Loader2, Database, WifiOff } from 'lucide-react';
import { db } from '../firebase-config';

interface AdminPanelProps {
  prices: GoldPrice[];
  products: Product[];
  onUpdatePrices: () => void;
  onUpdateProducts: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ prices, products, onUpdatePrices, onUpdateProducts, onClose }) => {
  const [activeTab, setActiveTab] = useState<'prices' | 'products'>('prices');
  const isOnline = db !== null;
  
  // Local state for editing
  const [editingPrices, setEditingPrices] = useState<GoldPrice[]>(JSON.parse(JSON.stringify(prices)));
  
  const [showProductForm, setShowProductForm] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePriceChange = (index: number, field: 'buy' | 'sell', value: string) => {
    const updated = [...editingPrices];
    updated[index] = { ...updated[index], [field]: parseInt(value) || 0 };
    setEditingPrices(updated);
  };

  const handleSavePrices = async () => {
    setIsSaving(true);
    try {
      await api.updatePrices(editingPrices);
      onUpdatePrices(); // Refresh parent
      if (isOnline) {
        alert('تم حفظ الأسعار بنجاح في قاعدة البيانات (مزامنة للجميع)');
      } else {
        alert('تم حفظ الأسعار محلياً (وضع تجريبي/أوفلاين)');
      }
    } catch (e) {
      alert('حدث خطأ أثناء الحفظ، تم الحفظ محلياً فقط');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && showProductForm) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShowProductForm({
          ...showProductForm,
          imageUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showProductForm) return;

    setIsSaving(true);
    try {
       const productToSave = {
         ...showProductForm,
         id: showProductForm.id || Date.now().toString()
       };
       await api.saveProduct(productToSave);
       onUpdateProducts(); // Refresh parent
       setShowProductForm(null);
    } catch (e) {
      alert('تم الحفظ محلياً فقط');
      onUpdateProducts();
      setShowProductForm(null);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setIsSaving(true);
      try {
        await api.deleteProduct(id);
        onUpdateProducts();
      } catch (e) {
        alert('حدث خطأ أثناء الحذف');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const getCategoryLabel = (cat: string) => {
    const mapping: Record<string, string> = {
      'ring': 'خاتم',
      'set': 'طقم',
      'necklace': 'عقد',
      'bracelet': 'سوار',
      'earring': 'أقراط'
    };
    return mapping[cat] || cat;
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-neutral-900 p-4 border-b border-gold-900/30 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-gold-500">لوحة التحكم</h2>
          <div className="flex items-center gap-1.5 mt-1">
             <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
             <span className="text-[10px] text-gray-400">
               {isOnline ? 'متصل بقاعدة البيانات' : 'وضع محلي (غير متزامن)'}
             </span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors duration-300">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-neutral-900/50 backdrop-blur-sm border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('prices')}
          className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition-all duration-300 ease-out ${activeTab === 'prices' ? 'text-gold-400 border-b-2 border-gold-400 bg-gold-500/5' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <TrendingUp className="w-5 h-5" /> الأسعار
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition-all duration-300 ease-out ${activeTab === 'products' ? 'text-gold-400 border-b-2 border-gold-400 bg-gold-500/5' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Package className="w-5 h-5" /> المنتجات
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 bg-gradient-to-b from-black to-neutral-900">
        {!isOnline && (
          <div className="max-w-lg mx-auto mb-6 bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg flex items-center gap-3">
             <WifiOff className="w-5 h-5 text-blue-400 flex-shrink-0" />
             <p className="text-xs text-blue-200">
               أنت تعمل حالياً في الوضع المحلي. التغييرات التي تجريها ستحفظ على هذا الجهاز فقط ولن تظهر للزبائن إلا إذا قمت بربط التطبيق بـ Firebase.
             </p>
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="space-y-6 max-w-lg mx-auto animate-slide-up">
            <div className="bg-babil-card p-6 rounded-2xl border border-gold-900/20 shadow-xl">
              <h3 className="text-gold-200 mb-6 font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> تحديث الأسعار اللحظية
              </h3>
              {editingPrices.map((p, idx) => (
                <div key={p.karat} className="mb-8 last:mb-0 p-4 bg-black/40 rounded-xl border border-gray-800/50">
                  <p className="text-gold-500 font-bold mb-3 text-lg">ذهب عيار {p.karat}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 mr-1">شراء (من الزبون)</label>
                      <input 
                        type="number"
                        value={p.buy}
                        onChange={(e) => handlePriceChange(idx, 'buy', e.target.value)}
                        className="w-full bg-neutral-900 border border-gray-700 rounded-xl p-3 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all duration-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5 mr-1">بيع (للزبون)</label>
                      <input 
                        type="number"
                        value={p.sell}
                        onChange={(e) => handlePriceChange(idx, 'sell', e.target.value)}
                        className="w-full bg-neutral-900 border border-gray-700 rounded-xl p-3 text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all duration-300 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={handleSavePrices}
                disabled={isSaving}
                className="w-full bg-gold-600 text-black font-bold py-4 rounded-xl mt-6 flex items-center justify-center gap-2 shadow-lg shadow-gold-600/20 active:scale-95 transition-transform duration-200 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? 'جاري الحفظ...' : 'حفظ جميع الأسعار'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-4 max-w-lg mx-auto animate-slide-up">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-gray-400 text-sm">إجمالي القطع: <span className="text-gold-500 font-bold">{products.length}</span></span>
              <button 
                onClick={() => setShowProductForm({ id: '', name: '', category: 'ring', weight: 0, priceEstimate: 0, imageUrl: '', description: '', karat: 21 })}
                className="bg-gold-600/10 text-gold-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-gold-600/30 hover:bg-gold-600/20 transition-colors duration-300"
              >
                <Plus className="w-4 h-4" /> إضافة جديد
              </button>
            </div>

            <div className="grid gap-3">
              {products.map(product => (
                <div key={product.id} className="bg-babil-card p-3 rounded-xl border border-gray-800/60 flex items-center gap-4 hover:border-gold-900/40 transition-colors duration-300 group">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700 shadow-inner">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ImageIcon className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-bold truncate text-base mb-1">{product.name}</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Ruler className="w-3 h-3 text-gold-600" />
                        <span>{product.weight} جم</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gold-500 font-bold px-1.5 py-0.5 bg-gold-500/10 rounded">
                        <span>عيار {product.karat}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Tag className="w-3 h-3 text-blue-400" />
                        <span>{getCategoryLabel(product.category)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowProductForm(product)} 
                      className="p-2.5 text-blue-400 bg-blue-400/5 hover:bg-blue-400/20 rounded-xl transition-colors duration-200"
                      title="تعديل"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      disabled={isSaving}
                      className="p-2.5 text-red-500 bg-red-500/5 hover:bg-red-500/20 rounded-xl transition-colors duration-200 disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-20 bg-neutral-900/30 rounded-3xl border border-dashed border-gray-800">
                <Package className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد منتجات حالياً</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="fixed inset-0 z-[80] bg-black flex flex-col animate-fade-in">
          <div className="bg-neutral-900 p-4 border-b border-gray-800 flex justify-between items-center shadow-md">
            <h3 className="text-white font-bold flex items-center gap-2">
              {showProductForm.id ? <Edit2 className="w-4 h-4 text-gold-500" /> : <Plus className="w-4 h-4 text-gold-500" />}
              {showProductForm.id ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
            </h3>
            <button onClick={() => setShowProductForm(null)} className="p-2 text-gray-400 hover:text-white transition-colors"><X /></button>
          </div>
          <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 space-y-6 max-w-lg mx-auto w-full animate-slide-up">
            {/* Image Upload Area */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-300 mr-1">صورة القطعة</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square max-w-[240px] mx-auto bg-neutral-900 border-2 border-dashed border-gray-700 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-gold-500/50 transition-all duration-300 overflow-hidden relative group shadow-2xl hover:shadow-gold-500/10"
              >
                {showProductForm.imageUrl ? (
                  <>
                    <img src={showProductForm.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                      <Upload className="w-10 h-10 text-white mb-2" />
                      <span className="text-white text-sm font-bold">تغيير الصورة</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-6 bg-neutral-800 rounded-full mb-3 text-gold-500 transition-transform duration-300 group-hover:scale-110">
                      <Upload className="w-10 h-10" />
                    </div>
                    <span className="text-sm text-gray-400 font-bold">اضغط هنا لرفع الصورة</span>
                    <span className="text-[10px] text-gray-600 mt-1">PNG, JPG حتى 5MB</span>
                  </>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1.5 mr-1">اسم المنتج</label>
                <input 
                  required
                  type="text"
                  placeholder="مثال: طقم ملكي عيار 21"
                  value={showProductForm.name}
                  onChange={e => setShowProductForm({...showProductForm, name: e.target.value})}
                  className="w-full bg-neutral-900 border border-gray-700 rounded-xl p-4 text-white focus:border-gold-500 outline-none transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1.5 mr-1">الوزن (جرام)</label>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={showProductForm.weight || ''}
                    onChange={e => setShowProductForm({...showProductForm, weight: parseFloat(e.target.value) || 0})}
                    className="w-full bg-neutral-900 border border-gray-700 rounded-xl p-4 text-white focus:border-gold-500 outline-none font-mono transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1.5 mr-1">العيار</label>
                  <select 
                    value={showProductForm.karat}
                    onChange={e => setShowProductForm({...showProductForm, karat: parseInt(e.target.value) as any})}
                    className="w-full bg-neutral-900 border border-gray-700 rounded-xl p-4 text-white focus:border-gold-500 outline-none appearance-none transition-all duration-300"
                  >
                    <option value={18}>عيار 18</option>
                    <option value={21}>عيار 21</option>
                    <option value={24}>عيار 24</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1.5 mr-1">التصنيف</label>
                <select 
                  value={showProductForm.category}
                  onChange={e => setShowProductForm({...showProductForm, category: e.target.value as any})}
                  className="w-full bg-neutral-900 border border-gray-700 rounded-xl p-4 text-white focus:border-gold-500 outline-none appearance-none transition-all duration-300"
                >
                  <option value="ring">خواتم</option>
                  <option value="set">أطقم كاملة</option>
                  <option value="necklace">عقود وسلاسل</option>
                  <option value="bracelet">أساور</option>
                  <option value="earring">أقراط / حلق</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1.5 mr-1">الوصف (اختياري)</label>
                <textarea 
                  rows={3}
                  placeholder="وصف تفصيلي للقطعة..."
                  value={showProductForm.description}
                  onChange={e => setShowProductForm({...showProductForm, description: e.target.value})}
                  className="w-full bg-neutral-900 border border-gray-700 rounded-xl p-4 text-white focus:border-gold-500 outline-none resize-none transition-all duration-300"
                ></textarea>
              </div>
            </div>

            <div className="pt-4 pb-10">
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-gold-600 text-black font-extrabold py-5 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-gold-600/10 active:scale-95 transition-all duration-300 ease-out-back disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات نهائياً'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};