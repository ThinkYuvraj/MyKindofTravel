import React from 'react';
import { DestinationItem } from '../types';
import { X, Calendar, Heart, Sparkles, Check, ArrowRight } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface DestinationModalProps {
  destination: DestinationItem | null;
  onClose: () => void;
  onEnquire: (destName: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onEnquire,
}) => {
  if (!destination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-[#16100D]/95 backdrop-blur-2xl border border-white/80 dark:border-white/15 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col text-[#2A1810] dark:text-white transition-colors">
        {/* Header Image with Glassmorphic Skeleton */}
        <div className="relative h-60 sm:h-64 overflow-hidden shrink-0 w-full">
          <GlassImage
            src={destination.image}
            alt={destination.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover filter brightness-95"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0706] via-[#0A0706]/40 to-transparent pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-[#16100D]/80 hover:bg-[#8C5528] dark:hover:bg-[#E28C38] text-[#2A1810] dark:text-white hover:text-white border border-white/40 dark:border-white/20 transition-colors shadow-sm backdrop-blur-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 z-10">
            <span className="px-2.5 py-1 rounded-md bg-[#A0683B] dark:bg-[#B36D33] text-white text-[11px] uppercase tracking-wider font-bold shadow-xs">
              {destination.region}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 drop-shadow-sm">
              {destination.name}
            </h2>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[60vh] bg-transparent">
          <p className="text-[#594336] dark:text-[#D1C2B8] text-sm sm:text-base leading-relaxed font-normal">
            {destination.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Best Season */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD5] dark:border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#A0683B] dark:text-[#D4A276]">
                <Calendar className="w-4 h-4" />
                <span>Best Time to Visit</span>
              </div>
              <p className="text-xs text-[#2A1810] dark:text-white font-medium">
                {destination.bestTime}
              </p>
            </div>

            {/* Ideal For */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD5] dark:border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#A0683B] dark:text-[#D4A276]">
                <Heart className="w-4 h-4" />
                <span>Ideal For</span>
              </div>
              <p className="text-xs text-[#2A1810] dark:text-white font-medium">
                {destination.idealFor}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-[#8C5528] dark:text-[#E28C38] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Signature Experiences We Curate</span>
            </h4>
            <div className="space-y-2">
              {destination.highlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#594336] dark:text-[#DFD0C0] p-2.5 rounded-xl bg-[#FAF7F2] dark:bg-white/5 border border-[#EADFD5] dark:border-white/10">
                  <Check className="w-4 h-4 text-[#A0683B] dark:text-[#D4A276] shrink-0 mt-0.5" />
                  <span className="font-medium">{hl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#FAF7F2] dark:bg-[#100B09] border-t border-[#EADFD5] dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-[#A0683B] dark:text-[#D4A276] uppercase tracking-wider block font-bold">Estimated Investment</span>
            <span className="font-serif font-bold text-[#8C5528] dark:text-[#E28C38] text-base">
              {destination.priceNote}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#A0683B]/10 dark:bg-[#B36D33]/15 hover:bg-[#A0683B]/20 dark:hover:bg-[#B36D33]/25 text-[#A0683B] dark:text-[#D4A276] text-xs font-bold border border-[#A0683B]/30 dark:border-[#B36D33]/40 transition-all"
            >
              Close
            </button>
            <button
              onClick={() => onEnquire(destination.name)}
              className="px-5 py-2.5 rounded-xl bg-[#8C5528] dark:bg-[#C87428] hover:bg-[#72421D] dark:hover:bg-[#B86620] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#8C5528]/25 border border-white/20"
            >
              <span>Enquire for {destination.name.split(',')[0]}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
