import React from 'react';
import { PATTERNS } from '../constants';
import { X, Lock, Paintbrush, Sliders } from 'lucide-react';
import { AppPreferences } from '../types';

interface SettingsModalProps {
  preferences: AppPreferences;
  onUpdatePreferences: (prefs: AppPreferences) => void;
  onOpenAdmin: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  preferences, 
  onUpdatePreferences, 
  onOpenAdmin, 
  onClose 
}) => {
  
  const handlePatternSelect = (url: string) => {
    onUpdatePreferences({ ...preferences, backgroundPattern: url });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdatePreferences({ ...preferences, backgroundOpacity: val });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-babil-card border border-gold-600/30 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
        
        {/* Header */}
        <div className="bg-neutral-900/80 p-5 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gold-500 flex items-center gap-2">
            <Sliders className="w-5 h-5" />
            تفضيلات العرض
          </h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
          
          {/* Background Selection */}
          <section>
            <h3 className="text-gray-300 font-bold mb-4 flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-gold-500" />
              نمط النقش
            </h3>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => handlePatternSelect(pattern.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 group ${preferences.backgroundPattern === pattern.url ? 'border-gold-500 scale-105 shadow-[0_0_15px_rgba(255,193,7,0.3)]' : 'border-gray-700 hover:border-gray-500'}`}
                >
                  <div className="absolute inset-0 bg-neutral-800"></div>
                  <div 
                    className="absolute inset-0 opacity-50" 
                    style={{ backgroundImage: `url(${pattern.url})` }}
                  ></div>
                  
                  {preferences.backgroundPattern === pattern.url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gold-500/20 backdrop-blur-[1px]">
                      <div className="w-2 h-2 bg-gold-500 rounded-full shadow-[0_0_8px_#FFC107]"></div>
                    </div>
                  )}
                  
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-gray-300 py-1 text-center truncate px-1">
                    {pattern.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Opacity Slider */}
            <div className="bg-neutral-900/50 p-4 rounded-xl border border-gray-800">
               <div className="flex justify-between text-xs text-gray-400 mb-2">
                 <span>شفافية الخلفية</span>
                 <span>{Math.round(preferences.backgroundOpacity * 100)}%</span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="0.3" 
                 step="0.01"
                 value={preferences.backgroundOpacity} 
                 onChange={handleOpacityChange}
                 className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
               />
            </div>
          </section>

          {/* Admin Access Link */}
          <section className="pt-4 border-t border-gray-800">
            <button 
              onClick={() => { onClose(); onOpenAdmin(); }}
              className="w-full flex items-center justify-between p-4 bg-neutral-900 border border-gray-800 rounded-xl hover:border-gold-500/30 hover:bg-neutral-800 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-500/10 rounded-full group-hover:bg-gold-500/20 transition-colors">
                  <Lock className="w-5 h-5 text-gold-500" />
                </div>
                <div className="text-right">
                  <span className="block text-gray-200 font-bold text-sm">بوابة الإدارة</span>
                  <span className="block text-gray-500 text-xs">للمسؤولين فقط</span>
                </div>
              </div>
              <div className="text-gray-500 group-hover:text-gold-500 transition-colors">←</div>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
