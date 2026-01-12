import React, { useEffect, useRef, useState } from 'react';
import { GoldPrice } from '../types';
import { ArrowDownLeft, ArrowUpRight, Activity } from 'lucide-react';

interface GoldTickerProps {
  prices: GoldPrice[];
}

const PriceRow: React.FC<{ price: GoldPrice }> = ({ price }) => {
  const prevBuy = useRef(price.buy);
  const prevSell = useRef(price.sell);
  const [buyAnim, setBuyAnim] = useState('');
  const [sellAnim, setSellAnim] = useState('');

  useEffect(() => {
    if (price.buy > prevBuy.current) {
      setBuyAnim('animate-flash-green');
    } else if (price.buy < prevBuy.current) {
      setBuyAnim('animate-flash-red');
    } else {
      setBuyAnim('');
    }
    prevBuy.current = price.buy;

    const timer = setTimeout(() => setBuyAnim(''), 2000);
    return () => clearTimeout(timer);
  }, [price.buy]);

  useEffect(() => {
    if (price.sell > prevSell.current) {
      setSellAnim('animate-flash-green');
    } else if (price.sell < prevSell.current) {
      setSellAnim('animate-flash-red');
    } else {
      setSellAnim('');
    }
    prevSell.current = price.sell;

    const timer = setTimeout(() => setSellAnim(''), 2000);
    return () => clearTimeout(timer);
  }, [price.sell]);

  return (
    <tr className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors duration-700">
      <td className="py-6 px-4">
        <div className="flex items-center justify-center">
          <div className="bg-white/[0.02] text-gold-400 font-bold px-4 py-2 rounded-full border border-white/[0.05]">
            <span className="text-sm font-serif">عيار {price.karat}</span>
          </div>
        </div>
      </td>
      <td className={`py-6 px-4 text-center transition-all duration-1000 ${buyAnim}`}>
        <span className="font-mono text-xl font-light text-gray-300 block tracking-wider">
          {price.buy.toLocaleString()}
        </span>
      </td>
      <td className={`py-6 px-4 text-center transition-all duration-1000 ${sellAnim}`}>
        <span className="font-mono text-xl font-light text-gold-200 block tracking-wider drop-shadow-lg">
          {price.sell.toLocaleString()}
        </span>
      </td>
    </tr>
  );
};

export const GoldTicker: React.FC<GoldTickerProps> = ({ prices }) => {
  return (
    <div className="w-full bg-[#0F0F0F]/40 backdrop-blur-3xl border border-white/[0.03] rounded-[2rem] shadow-luxury mb-12 overflow-hidden relative group transition-all duration-1000">
       
      {/* Header */}
      <div className="bg-white/[0.01] p-6 border-b border-white/[0.03] flex items-center justify-between relative">
         <div className="flex items-center gap-3">
            <div className="bg-gold-500/10 p-2 rounded-full animate-pulse-slow">
              <Activity className="w-4 h-4 text-gold-500/80" />
            </div>
            <h3 className="text-gold-100/90 font-serif text-xl tracking-wide">أسعار الذهب اليوم</h3>
         </div>
         
         {/* Live Indicator */}
         <div className="flex items-center gap-2 px-3 py-1 bg-red-500/5 border border-red-500/10 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50 duration-1000"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500/80"></span>
            </span>
            <span className="text-[9px] font-medium text-red-400/80 tracking-widest uppercase">Live</span>
         </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[10px] text-gray-600 border-b border-white/[0.02]">
              <th className="py-4 font-normal tracking-widest uppercase">العيار</th>
              <th className="py-4 font-normal tracking-widest uppercase">
                <div className="flex items-center justify-center gap-2">
                  <span>شراء</span>
                  <ArrowDownLeft className="w-3 h-3 text-gray-700" />
                </div>
              </th>
              <th className="py-4 font-normal tracking-widest uppercase">
                <div className="flex items-center justify-center gap-2">
                  <span>بيع</span>
                  <ArrowUpRight className="w-3 h-3 text-gold-800" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => (
              <PriceRow key={price.karat} price={price} />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Info */}
      <div className="bg-[#080808]/50 p-3 text-center border-t border-white/[0.02]">
        <p className="text-[9px] text-gray-600 flex items-center justify-center gap-2 font-light tracking-wide">
          <span className="w-1 h-1 bg-gold-600/50 rounded-full"></span>
           تحديث لحظي حسب السوق العالمي
        </p>
      </div>
    </div>
  );
};