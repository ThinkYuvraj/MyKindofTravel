import React from 'react';
import { TravelPackage } from '../types';
import { X, Check, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface PackageModalProps {
  pkg: TravelPackage | null;
  onClose: () => void;
  onCustomise: (pkg: TravelPackage) => void;
}

export const PackageModal: React.FC<PackageModalProps> = ({ pkg, onClose, onCustomise }) => {
  if (!pkg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white/95 dark:bg-[#16100D]/95 backdrop-blur-2xl border border-white/80 dark:border-white/15 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col text-[#2A1810] dark:text-white transition-colors">
        {/* Modal Header with Glassmorphic Skeleton Image */}
        <div className="relative h-60 sm:h-72 shrink-0 overflow-hidden w-full">
          <GlassImage
            src={pkg.image}
            alt={pkg.title}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover filter brightness-95"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0706] via-[#0A0706]/40 to-transparent pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-[#16100D]/80 hover:bg-[#8C5528] dark:hover:bg-[#E28C38] text-[#2A1810] dark:text-white hover:text-white border border-white/40 dark:border-white/20 transition-colors shadow-sm backdrop-blur-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Info */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1 z-10">
            <span className="px-2.5 py-1 rounded-md bg-[#A0683B] dark:bg-[#B36D33] text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
              {pkg.tag}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
              {pkg.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#EADFD5] pt-1 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#E28C38]" />
                {pkg.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E28C38]" />
                {pkg.destination}
              </span>
              <span className="font-serif font-bold text-[#E28C38] text-sm">
                {pkg.startingPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-transparent">
          {/* Inclusions */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-[#2A1810] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8C5528] dark:text-[#E28C38]" />
              <span>Bespoke Inclusions & Perks</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pkg.inclusions.map((inc, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#594336] dark:text-[#DFD0C0] p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD5] dark:border-white/10">
                  <Check className="w-4 h-4 text-[#A0683B] dark:text-[#D4A276] shrink-0 mt-0.5" />
                  <span className="font-medium">{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day by Day Itinerary */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif text-lg font-bold text-[#2A1810] dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8C5528] dark:text-[#E28C38]" />
              <span>Day-by-Day Flow (Customisable)</span>
            </h3>
            <div className="space-y-3">
              {pkg.dayHighlights.map((item) => (
                <div key={item.day} className="p-3.5 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD5] dark:border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#A0683B]/10 dark:bg-[#B36D33]/15 text-[#A0683B] dark:text-[#D4A276] font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-[#A0683B]/25 dark:border-[#B36D33]/30">
                    D{item.day}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#2A1810] dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#594336] dark:text-[#D1C2B8] leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#FAF7F2] dark:bg-[#100B09] border-t border-[#EADFD5] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#7C685B] dark:text-neutral-400">
            <span>Starting at </span>
            <span className="font-serif font-bold text-[#8C5528] dark:text-[#E28C38] text-base">
              {pkg.startingPrice}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#A0683B]/10 dark:bg-[#B36D33]/15 hover:bg-[#A0683B]/20 dark:hover:bg-[#B36D33]/25 text-[#A0683B] dark:text-[#D4A276] text-xs font-bold border border-[#A0683B]/30 dark:border-[#B36D33]/40 transition-all"
            >
              Close
            </button>
            <button
              onClick={() => onCustomise(pkg)}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#8C5528] dark:bg-[#C87428] hover:bg-[#72421D] dark:hover:bg-[#B86620] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#8C5528]/25 border border-white/20"
            >
              <span>Customise This Package</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
