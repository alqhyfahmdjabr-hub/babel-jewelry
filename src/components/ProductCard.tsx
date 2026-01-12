
import React, { useState } from 'react';
import { Product } from '../types';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isFav: boolean;
  onToggleFav: (id: string) => void;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isFav, onToggleFav, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className="group relative bg-babil-card rounded-[2.5rem] overflow-hidden transition-all duration-700 ease-out-expo hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.1)] hover:scale-[1.02] cursor-pointer border border-transparent hover:border-gold-500/10"
      onClick={() => onClick(product)}
    >
      {/* Background/Base structure */}
      <div className="relative aspect-[4/5] overflow-hidden">
        
        {/* Placeholder Animation */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#0F0F0F] animate-pulse"></div>
        )}

        {/* Product Image - Very Subtle Slow Zoom */}
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out-expo ${
            isLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0 scale-105'
          }`}
          loading="lazy"
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-1000 group-hover:opacity-80"></div>
        
        {/* Favorite Button - Top Right, Minimalist */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(product.id);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/20 backdrop-blur-md border border-white/[0.05] hover:bg-gold-500/10 hover:border-gold-500/30 transition-all duration-500 group/fav"
        >
          <Heart 
            className={`w-3.5 h-3.5 transition-colors duration-500 ${isFav ? 'fill-gold-400 text-gold-400' : 'text-gray-400 group-hover/fav:text-gold-200'}`} 
            strokeWidth={1}
          />
        </button>

        {/* Karat Badge - Top Left, Elegant */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-black/30 backdrop-blur-xl border border-white/[0.05] text-gold-100 text-[9px] font-serif tracking-widest shadow-sm">
            {product.karat}k
          </span>
        </div>

        {/* Content - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-1000">
          <div className="flex flex-col items-center text-center space-y-2">
            
            {/* Category & Weight Pill */}
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
               <span className="text-[9px] text-gray-400 uppercase tracking-widest font-light">{product.weight}g</span>
               <span className="w-0.5 h-0.5 rounded-full bg-gold-500/50"></span>
               <span className="text-[9px] text-gold-400 uppercase tracking-widest font-light">
                 {product.category === 'ring' ? 'خاتم' : 
                  product.category === 'set' ? 'طقم' : 
                  product.category === 'bracelet' ? 'سوار' : 
                  product.category === 'earring' ? 'أقراط' : 'عقد'}
               </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-lg text-gray-100 font-normal tracking-wide leading-snug drop-shadow-lg">
              {product.name}
            </h3>

            {/* Subtle Line */}
            <div className="w-6 h-[1px] bg-gold-500/30 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-200"></div>
            
            {/* Trust Badge - Small */}
            <p className="text-[8px] text-gray-500 font-light opacity-0 group-hover:opacity-80 transition-opacity duration-1000 delay-300 tracking-wider">
              أصالة مضمونة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
