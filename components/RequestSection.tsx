import React, { useState, useEffect } from 'react';
import { ClientRequest, ContactInfo } from '../types';
import { saveRequest, getRequests, deleteRequest } from '../services/storage';
import { Send, Clock, Trash2, PlusCircle, History, MessageCircle, Hammer, RefreshCw, PenTool, ClipboardList } from 'lucide-react';

interface RequestSectionProps {
  contact: ContactInfo;
}

export const RequestSection: React.FC<RequestSectionProps> = ({ contact }) => {
  const [activeView, setActiveView] = useState<'form' | 'list'>('form');
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  
  // Form State
  const [formData, setFormData] = useState<Partial<ClientRequest>>({
    type: 'custom',
    karat: 21,
    weightApprox: 0,
    category: 'ring',
    notes: ''
  });

  useEffect(() => {
    setRequests(getRequests());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: ClientRequest = {
      id: Date.now().toString(),
      type: formData.type || 'custom',
      category: formData.category || 'ring',
      weightApprox: formData.weightApprox || 0,
      karat: formData.karat || 21,
      notes: formData.notes || '',
      date: new Date().toLocaleDateString('ar-YE'),
      status: 'pending'
    };

    const updatedRequests = saveRequest(newRequest);
    setRequests(updatedRequests);
    
    // Switch to history view and maybe trigger whatsapp immediately
    sendToWhatsApp(newRequest);
    setActiveView('list');
    
    // Reset form
    setFormData({
      type: 'custom',
      karat: 21,
      weightApprox: 0,
      category: 'ring',
      notes: ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل تريد حذف هذا الطلب من السجل؟')) {
      const updated = deleteRequest(id);
      setRequests(updated);
    }
  };

  const sendToWhatsApp = (req: ClientRequest) => {
    const typeLabel = getTypeLabel(req.type);
    const catLabel = getCategoryLabel(req.category);
    
    // Professional Atelier Message Format
    const message = `تحية طيبة،%0Aأرغب في حجز خدمة لدى *مشغل بابل*:%0A%0A` +
                    `📌 *نوع الخدمة:* ${typeLabel}%0A` +
                    `💍 *الصنف:* ${catLabel}%0A` +
                    `⚖️ *الوزن التقريبي:* ${req.weightApprox > 0 ? req.weightApprox + ' جم' : 'غير محدد'}%0A` +
                    `✨ *العيار:* ${req.karat}%0A` +
                    `📝 *تفاصيل:* ${req.notes}%0A%0A` +
                    `أرجو تأكيد استلام الطلب.`;
                    
    const url = `https://wa.me/967${contact.manager}?text=${message}`;
    window.open(url, '_blank');
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
        case 'custom': return 'تفصيل خاص';
        case 'repair': return 'صيانة وتلميع';
        case 'exchange': return 'استبدال ذهب';
        case 'preorder': return 'حجز مسبق';
        default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
      switch(type) {
          case 'custom': return <PenTool className="w-4 h-4" />;
          case 'repair': return <Hammer className="w-4 h-4" />;
          case 'exchange': return <RefreshCw className="w-4 h-4" />;
          default: return <ClipboardList className="w-4 h-4" />;
      }
  };

  const getCategoryLabel = (cat: string) => {
    const mapping: Record<string, string> = {
      'ring': 'خاتم',
      'set': 'طقم كامل',
      'necklace': 'عقد/سلسلة',
      'bracelet': 'سوار/بنجرة',
      'earring': 'أقراط'
    };
    return mapping[cat] || cat;
  };

  return (
    <div className="animate-fade-in pb-12">
      
      {/* View Toggle */}
      <div className="flex bg-[#0F0F0F] p-1.5 rounded-2xl mb-8 border border-white/[0.03]">
        <button
          onClick={() => setActiveView('form')}
          className={`flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-500 ${activeView === 'form' ? 'bg-[#1A1A1A] text-gold-400 border border-white/[0.05]' : 'text-gray-600 hover:text-gray-400'}`}
        >
          <PlusCircle className="w-4 h-4" />
          خدمة صياغة
        </button>
        <button
          onClick={() => setActiveView('list')}
          className={`flex-1 py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-500 ${activeView === 'list' ? 'bg-[#1A1A1A] text-gold-400 border border-white/[0.05]' : 'text-gray-600 hover:text-gray-400'}`}
        >
          <History className="w-4 h-4" />
          الأرشيف
        </button>
      </div>

      {activeView === 'form' ? (
        <form onSubmit={handleSubmit} className="bg-babil-card p-8 rounded-[2rem] border border-white/[0.03] shadow-luxury animate-slide-up relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/[0.02] rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <h3 className="text-xl font-serif text-gold-100 mb-2 flex items-center gap-3">
            <span className="w-1 h-8 bg-gold-600/40 rounded-full"></span>
            مشغل بابل
          </h3>
          <p className="text-[10px] text-gray-500 mb-8 pr-4">حيث تصاغ أفكارك بذهب خالص.. بدقة متناهية</p>

          <div className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-3 tracking-wider">نوع الخدمة المطلوبة</label>
              <div className="grid grid-cols-2 gap-3">
                {['custom', 'repair', 'exchange', 'preorder'].map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, type: type as any})}
                        className={`py-4 px-2 rounded-2xl text-xs font-bold border transition-all duration-500 flex flex-col items-center gap-2 ${formData.type === type ? 'bg-gold-500/[0.05] border-gold-500/20 text-gold-400' : 'bg-[#141414] border-transparent text-gray-600 hover:bg-[#1A1A1A]'}`}
                    >
                        {getTypeIcon(type)}
                        {getTypeLabel(type)}
                    </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-bold text-gray-500 mb-3 tracking-wider">صنف القطعة</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#141414] border border-transparent rounded-2xl p-4 text-gray-300 focus:border-gold-500/10 focus:bg-[#1A1A1A] outline-none appearance-none transition-all duration-500"
                >
                  <option value="ring">خاتم</option>
                  <option value="set">طقم</option>
                  <option value="necklace">عقد</option>
                  <option value="bracelet">سوار</option>
                  <option value="earring">أقراط</option>
                </select>
              </div> 
              <div>
                 <label className="block text-xs font-bold text-gray-500 mb-3 tracking-wider">العيار المفضل</label>
                 <select 
                   value={formData.karat}
                   onChange={(e) => setFormData({...formData, karat: parseInt(e.target.value) as any})}
                   className="w-full bg-[#141414] border border-transparent rounded-2xl p-4 text-gray-300 focus:border-gold-500/10 focus:bg-[#1A1A1A] outline-none appearance-none transition-all duration-500"
                 >
                   <option value="18">عيار 18</option>
                   <option value="21">عيار 21</option>
                   <option value="24">عيار 24</option>
                 </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-3 tracking-wider">الوزن التقريبي (جرام) - اختياري</label>
              <input 
                type="number"
                step="0.1"
                value={formData.weightApprox || ''}
                onChange={(e) => setFormData({...formData, weightApprox: parseFloat(e.target.value)})}
                placeholder="مثال: 15.5"
                className="w-full bg-[#141414] border border-transparent rounded-2xl p-4 text-gray-300 focus:border-gold-500/10 focus:bg-[#1A1A1A] outline-none transition-all duration-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-3 tracking-wider">ملاحظات للمصمم</label>
              <textarea 
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="صف لنا التصميم الذي في مخيلتك، أو التفاصيل الدقيقة..."
                className="w-full bg-[#141414] border border-transparent rounded-2xl p-4 text-gray-300 focus:border-gold-500/10 focus:bg-[#1A1A1A] outline-none resize-none transition-all duration-500"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-gold-600/10 border border-gold-600/20 hover:bg-gold-600/20 text-gold-400 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 font-serif"
            >
              <Send className="w-5 h-5" />
              <span>اعتماد طلب الصياغة</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 animate-slide-up">
           {requests.length === 0 ? (
             <div className="text-center py-24 border border-dashed border-gray-900 rounded-[2rem] bg-[#0F0F0F]/50">
               <History className="w-10 h-10 text-gray-700 mx-auto mb-4" />
               <p className="text-gray-500 font-serif">سجل طلباتك فارغ حالياً</p>
               <button onClick={() => setActiveView('form')} className="mt-4 text-gold-600 text-sm hover:text-gold-400 transition-colors">ابدأ خدمة جديدة</button>
             </div>
           ) : (
             requests.map((req) => (
               <div key={req.id} className="bg-babil-card p-6 rounded-[2rem] border border-white/[0.02] hover:border-gold-500/10 transition-all duration-500 group">
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                     <span className={`p-3 rounded-xl bg-[#141414] text-gold-500/80`}>
                        {getTypeIcon(req.type)}
                     </span>
                     <div>
                       <h4 className="font-bold text-gray-200 text-sm mb-1">{getTypeLabel(req.type)}</h4>
                       <span className="text-[10px] text-gray-600 flex items-center gap-1 font-mono">
                         <Clock className="w-3 h-3" /> {req.date}
                       </span>
                     </div>
                   </div>
                   <button 
                     onClick={() => handleDelete(req.id)}
                     className="text-gray-700 hover:text-red-500/70 p-2 transition-colors duration-300"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>

                 <div className="bg-[#141414] rounded-xl p-4 text-sm text-gray-400 space-y-3 mb-6">
                    <div className="flex justify-between border-b border-white/[0.03] pb-2">
                        <span>الصنف: <span className="text-gray-300">{getCategoryLabel(req.category)}</span></span>
                        <span>العيار: <span className="text-gold-500/80">{req.karat}</span></span>
                    </div>
                    {req.weightApprox > 0 && (
                        <div className="text-xs text-gray-500">الوزن المطلوب: {req.weightApprox} جرام</div>
                    )}
                    {req.notes && (
                        <p className="text-xs text-gray-500 italic leading-relaxed">"{req.notes}"</p>
                    )}
                 </div>

                 <button 
                   onClick={() => sendToWhatsApp(req)}
                   className="w-full py-4 bg-green-900/10 hover:bg-green-900/20 text-green-700 hover:text-green-600 border border-green-900/20 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-500"
                 >
                   <MessageCircle className="w-4 h-4" />
                   <span>متابعة حالة الطلب</span>
                 </button>
               </div>
             ))
           )}
        </div>
      )}
    </div>
  );
};