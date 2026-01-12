import React, { useState, useEffect } from 'react';
import { CONTACT_INFO, QURAN_VERSE, BACKGROUND_LOGO_URL } from './constants';
import { Product, ViewState, GoldPrice, AppPreferences } from './types';
import { getFavorites, toggleFavorite, getAppPreferences, saveAppPreferences } from './services/storage';
import { api } from './services/api'; 
import { GoldTicker } from './components/GoldTicker';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { AdminPanel } from './components/AdminPanel';
import { RequestSection } from './components/RequestSection';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { Home, Grid, Heart, Search, Settings, Lock, Sparkles, ClipboardList } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewState>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [preferences, setPreferences] = useState<AppPreferences>({
    backgroundPattern: 'https://www.transparenttextures.com/patterns/arabesque.png',
    backgroundOpacity: 0.03
  });

  const [bgState, setBgState] = useState({
    layers: [preferences.backgroundPattern, preferences.backgroundPattern],
    activeIdx: 0
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [currentPrices, setCurrentPrices] = useState<GoldPrice[]>([]);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<'settings' | 'admin'>('settings');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFavorites(getFavorites());
        const loadedPrefs = getAppPreferences();
        setPreferences(loadedPrefs);
        setBgState({
          layers: [loadedPrefs.backgroundPattern, loadedPrefs.backgroundPattern],
          activeIdx: 0
        });

        const [fetchedPrices, fetchedProducts] = await Promise.all([
          api.getPrices(),
          api.getProducts()
        ]);

        setCurrentPrices(fetchedPrices);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to load app data", error);
      } finally {
        setTimeout(() => setIsLoading(false), 1500);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const currentActivePattern = bgState.layers[bgState.activeIdx];
    
    if (preferences.backgroundPattern !== currentActivePattern) {
      const img = new Image();
      img.src = preferences.backgroundPattern;
      
      img.onload = () => {
        setBgState(prev => {
          const nextIdx = prev.activeIdx === 0 ? 1 : 0;
          const newLayers = [...prev.layers];
          newLayers[nextIdx] = preferences.backgroundPattern;
          return {
            layers: newLayers,
            activeIdx: nextIdx
          };
        });
      };
    }
  }, [preferences.backgroundPattern, bgState.layers, bgState.activeIdx]);

  const handleToggleFavorite = (id: string) => {
    const newFavs = toggleFavorite(id);
    setFavorites(newFavs);
  };

  const handleUpdatePreferences = (newPrefs: AppPreferences) => {
    setPreferences(newPrefs);
    saveAppPreferences(newPrefs);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '7777') {
      setIsPasswordModalOpen(false);
      setPassword('');
      setPasswordError(false);
      
      if (passwordTarget === 'settings') {
        setIsSettingsOpen(true);
      } else {
        setIsAdminOpen(true);
      }
    } else {
      setPasswordError(true);
    }
  };

  const openPasswordFor = (target: 'settings' | 'admin') => {
    setPasswordTarget(target);
    setIsPasswordModalOpen(true);
  };

  const refreshData = async () => {
    const [updatedPrices, updatedProducts] = await Promise.all([
      api.getPrices(),
      api.getProducts()
    ]);
    setCurrentPrices(updatedPrices);
    setProducts(updatedProducts);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.includes(searchTerm) || p.description.includes(searchTerm);
    if (activeTab === 'favorites') return favorites.includes(p.id) && matchesSearch;
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
           <img src={BACKGROUND_LOGO_URL} className="w-[80vw] max-w-[500px] animate-pulse-slow grayscale" alt="" />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-6xl font-serif text-gold-400/80 mb-6 tracking-wide drop-shadow-2xl">
            بابل
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-600/50 to-transparent"></div>
          <p className="text-gold-200/40 mt-4 font-serif text-lg tracking-[0.3em] uppercase">Luxury Jewelry</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans pb-32 selection:bg-gold-900/30 selection:text-gold-100 relative overflow-hidden animate-fade-in text-gray-200">
      
      {/* Background Layer - Reduced noise, more focus */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]"></div>
        
        {/* Main Logo Background - Subtle */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{ 
            backgroundImage: `url('${BACKGROUND_LOGO_URL}')`,
            backgroundPosition: 'center 20%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '80%',
          }}
        />

        {/* Texture - Very Subtle */}
        {bgState.layers.map((patternUrl, index) => (
          <div 
            key={index}
            className="absolute inset-0 z-20 bg-repeat transition-opacity duration-[2000ms]"
            style={{ 
              backgroundImage: `url('${patternUrl}')`,
              opacity: bgState.activeIdx === index ? 0.015 : 0, // Very low opacity
              filter: 'invert(1)',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        
        {/* Header */}
        <header className="relative pt-10 pb-10 px-6 text-center">
          
          {/* Top Controls */}
          <div className="flex justify-between items-start mb-8">
             <button 
              onClick={() => openPasswordFor('settings')}
              className="p-3 text-gold-600/30 hover:text-gold-400 transition-colors duration-500"
            >
              <Settings className="w-5 h-5" strokeWidth={1} />
            </button>

             {/* Logo Top Right - Subtle Glow */}
             <div className="relative w-16 h-16 bg-white/[0.02] rounded-full border border-white/[0.03] p-3 backdrop-blur-3xl shadow-glow">
               <img src={BACKGROUND_LOGO_URL} alt="Babil" className="w-full h-full object-contain opacity-80" />
             </div>
          </div>

          {/* Main Title Area */}
          <div className="flex flex-col items-center justify-center animate-slide-up">
            <h1 className="font-serif text-5xl md:text-7xl text-gold-100/90 mb-4 drop-shadow-2xl tracking-wide">
              بابل
            </h1>
            <div className="flex items-center gap-4 text-gold-400/40 text-[10px] tracking-[0.5em] uppercase font-serif">
               <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold-800/40"></span>
               <span>للمجوهرات الملكية</span>
               <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold-800/40"></span>
            </div>
          </div>
          
          {/* Verse */}
          <div className="mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
             <p className="text-center font-serif text-xl md:text-2xl leading-loose max-w-2xl mx-auto gold-text-gradient opacity-90 drop-shadow-sm">
               {QURAN_VERSE}
             </p>
          </div>
        </header>

        {/* Body */}
        <main className="max-w-xl mx-auto px-6 relative z-10 space-y-12">
          
          {activeTab === 'home' && <GoldTicker prices={currentPrices} />}

          {/* Search Bar - Integrated & Soft */}
          {(activeTab === 'home' || activeTab === 'catalog' || activeTab === 'favorites') && (
             <div className="relative mx-2 animate-slide-up group">
              <input 
                type="text" 
                placeholder="ابحث عن قطعة نادرة..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0F0F0F]/50 border border-white/[0.03] rounded-2xl py-5 pr-14 pl-6 text-gray-300 focus:outline-none focus:bg-[#141414] focus:border-gold-500/10 transition-all duration-700 placeholder-gray-700 text-sm font-serif shadow-inner-light"
              />
              <Search className="absolute right-6 top-5 w-4 h-4 text-gray-700 group-hover:text-gold-500/50 transition-colors duration-500" />
             </div>
          )}

          {/* Section Headers */}
          {activeTab !== 'requests' && (
            <div className="animate-fade-in border-b border-white/[0.02] pb-4 px-2">
              <div className="flex items-end justify-between">
                <h2 className="text-3xl font-serif text-gold-100/90 flex items-center gap-3">
                  {activeTab === 'home' ? 'مختارات بابل' : 
                   activeTab === 'favorites' ? 'المقتنيات المحفوظة' : 'الكتالوج العام'}
                </h2>
                {activeTab === 'home' && (
                  <button 
                    onClick={() => setActiveTab('catalog')}
                    className="text-[10px] text-gold-600 hover:text-gold-400 font-serif tracking-widest transition-all duration-500"
                  >
                    تصفح المزيد
                  </button>
                )}
              </div>
              {/* Trust Subtitle */}
              <p className="text-[10px] text-gold-500/40 font-serif mt-2 tracking-wider">
                {activeTab === 'home' ? 'إبداع في الصياغة.. ودقة في التفاصيل' : 
                 activeTab === 'favorites' ? 'قائمتك المنتقاة بعناية فائقة' : 
                 'تصفح إرثنا من الذهب والمجوهرات'}
              </p>
            </div>
          )}

          {/* Grid */}
          {activeTab === 'requests' ? (
            <RequestSection contact={CONTACT_INFO} />
          ) : (
            filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 md:gap-8 pb-8 animate-fade-in">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isFav={favorites.includes(product.id)}
                    onToggleFav={handleToggleFavorite}
                    onClick={setSelectedProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 text-gray-700 border border-dashed border-gray-900 rounded-[2rem] animate-fade-in">
                <p className="font-serif text-lg tracking-wide">لا توجد قطع مطابقة للبحث</p>
              </div>
            )
          )}

          {activeTab !== 'requests' && <Footer contact={CONTACT_INFO} />}
        </main>
      </div>

      {/* Navigation - Floating Glass */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/[0.05] rounded-full z-40 shadow-luxury max-w-md mx-auto">
        <div className="flex justify-around items-center h-full px-2">
          {[
            { id: 'home', icon: Home, label: 'الرئيسية' },
            { id: 'catalog', icon: Grid, label: 'المعرض' },
            { id: 'requests', icon: ClipboardList, label: 'الخدمات' },
            { id: 'favorites', icon: Heart, label: 'المفضلة' }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as ViewState)}
              className={`flex flex-col items-center justify-center w-16 h-full space-y-1.5 transition-all duration-700 group ${activeTab === item.id ? 'text-gold-400' : 'text-gray-600 hover:text-gray-400'}`}
            >
              <item.icon 
                className={`w-5 h-5 transition-transform duration-700 ${activeTab === item.id ? '-translate-y-1 scale-110' : 'group-hover:-translate-y-0.5'}`} 
                strokeWidth={activeTab === item.id ? 1.5 : 1} 
                fill={activeTab === item.id && item.id === 'favorites' ? 'currentColor' : 'none'}
              />
              <span className={`text-[9px] font-medium tracking-wide ${activeTab === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} transition-all duration-500`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          preferences={preferences}
          onUpdatePreferences={handleUpdatePreferences}
          onOpenAdmin={() => { setIsSettingsOpen(false); setIsAdminOpen(true); }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0F0F0F] border border-white/[0.05] p-10 rounded-[2.5rem] w-full max-w-xs text-center shadow-2xl animate-scale-up">
            <Lock className="w-8 h-8 text-gold-600/60 mx-auto mb-8 opacity-80" strokeWidth={0.5} />
            <h3 className="text-lg font-serif text-gold-100 mb-2 tracking-wide">
               منطقة خاصة
            </h3>
            <p className="text-gray-600 text-[10px] mb-10 font-light tracking-wider">تتطلب هذه المنطقة تصريح دخول</p>
            <form onSubmit={handlePasswordSubmit}>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className={`w-full bg-black/40 border-b ${passwordError ? 'border-red-900/50 text-red-500' : 'border-gold-900/20 text-gold-100'} text-center text-xl py-4 mb-10 focus:outline-none focus:border-gold-500/30 tracking-[0.5em] transition-all font-serif placeholder-gray-800`}
                placeholder="••••"
              />
              <button 
                  type="submit"
                  className="w-full bg-gold-600/10 hover:bg-gold-600/20 border border-gold-600/20 text-gold-400 font-bold py-4 rounded-2xl transition-all duration-500 font-serif"
                >
                  دخول
              </button>
              <button 
                  type="button"
                  onClick={() => { setIsPasswordModalOpen(false); setPassword(''); setPasswordError(false); }}
                  className="mt-6 text-gray-700 hover:text-gray-500 text-[10px]"
                >
                  إلغاء
              </button>
            </form>
          </div>
        </div>
      )}

      {isAdminOpen && (
        <AdminPanel 
          prices={currentPrices}
          products={products}
          onUpdatePrices={() => refreshData()}
          onUpdateProducts={() => refreshData()}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          contact={CONTACT_INFO}
        />
      )}
      
    </div>
  );
};

export default App;
