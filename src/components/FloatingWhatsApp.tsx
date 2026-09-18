import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleOpenWhatsApp = () => {
    window.open(
      `https://wa.me/${COMPANY_INFO.phoneRaw}?text=Hi%20My%20Kind%20of%20Travel%2C%20I%20am%20interested%20in%20planning%20a%20luxury%20holiday.`,
      '_blank'
    );
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2">
      {showTooltip && (
        <div className="bg-white/95 dark:bg-[#16100D]/95 backdrop-blur-xl border border-[#EADFD5] dark:border-white/15 text-[#2A1810] dark:text-white text-xs p-2.5 sm:p-3 rounded-2xl shadow-[0_10px_30px_rgba(42,24,16,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[240px] sm:max-w-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-[#2E7D32] dark:text-emerald-400 block text-[10px] sm:text-[11px] uppercase tracking-wider">
              Concierge Online
            </span>
            <p className="text-[#594336] dark:text-[#D1C2B8] text-[10px] sm:text-[11px] leading-tight font-normal">
              Chat directly with our luxury travel specialist on WhatsApp.
            </p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#A8988B] hover:text-[#2A1810] dark:text-neutral-400 dark:hover:text-white p-1 transition-colors shrink-0"
            aria-label="Dismiss WhatsApp popup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <button
        onClick={handleOpenWhatsApp}
        className="group relative flex items-center gap-2 p-3 sm:px-4 sm:py-3.5 rounded-full bg-[#2E7D32] hover:bg-[#256529] text-white shadow-xl shadow-[#2E7D32]/25 hover:scale-105 active:scale-95 transition-all focus:outline-none"
        aria-label="Chat on WhatsApp with My Kind of Travel"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#2E7D32]" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
          Chat on WhatsApp
        </span>
        <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#8C5528] rounded-full border-2 border-[#FAF7F2] animate-pulse" />
      </button>
    </div>
  );
};
