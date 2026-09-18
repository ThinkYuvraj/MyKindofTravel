import React from 'react';
import { MARQUEE_ITEMS } from '../data/travelData';
import { Plane, Compass } from 'lucide-react';

interface MarqueeTickerProps {
  items?: string[];
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ items = MARQUEE_ITEMS }) => {
  const activeItems = items && items.length > 0 ? items : MARQUEE_ITEMS;
  // Duplicate array multiple times for smooth continuous loop
  const repeated = [...activeItems, ...activeItems, ...activeItems, ...activeItems];

  return (
    <div className="w-full bg-[#F4ECE4] dark:bg-[#120D0A] text-[#2A1810] dark:text-[#EADFD5] border-y border-[#EADFD5] dark:border-white/10 overflow-hidden py-3 select-none relative shadow-xs transition-colors">
      <div className="flex w-max items-center animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
        {repeated.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-6 px-4">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#422C1F] dark:text-neutral-200 flex items-center gap-2">
              {idx % 4 === 0 && <Plane className="w-3.5 h-3.5 text-[#8C5528] dark:text-[#E28C38] -rotate-45" />}
              {idx % 4 === 2 && <Compass className="w-3.5 h-3.5 text-[#8C5528] dark:text-[#E28C38]" />}
              <span>{item}</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8C5528]/60 dark:bg-[#E28C38]/60 inline-block shadow-xs" />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
