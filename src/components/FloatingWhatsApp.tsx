import React from 'react';
import { MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <a
        href={`https://wa.me/${COMPANY_INFO.phoneRaw}?text=Hi%20My%20Kind%20of%20Travel%2C%20I%20am%20interested%20in%20planning%20a%20luxury%20holiday.`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2 p-3 sm:px-4 sm:py-3.5 rounded-full bg-[#2E7D32] hover:bg-[#256529] text-white shadow-xl shadow-[#2E7D32]/25 hover:scale-105 active:scale-95 transition-all focus:outline-none"
        aria-label="Chat on WhatsApp with My Kind of Travel"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#2E7D32]" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
          Chat on WhatsApp
        </span>
        <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[#8C5528] rounded-full border-2 border-[#FAF7F2] animate-pulse" />
      </a>
    </div>
  );
};
