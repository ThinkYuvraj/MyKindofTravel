import React from 'react';
import { MARQUEE_ITEMS } from '../data/travelData';
import { Sparkles } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  // Duplicate array multiple times for smooth continuous loop
  const repeated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="w-full bg-[#171614] text-amber-200/90 border-y border-amber-900/30 overflow-hidden py-3 select-none relative">
      <div className="flex w-max items-center animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
        {repeated.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-6 px-4">
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-stone-300">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 inline-block" />
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
