import React from 'react';
import { DestinationItem } from '../types';
import { X, MapPin, Calendar, Heart, Sparkles, Check, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Header Image */}
        <div className="relative h-60 sm:h-64 overflow-hidden shrink-0">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white border border-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-md text-amber-400 text-[11px] uppercase tracking-wider font-semibold border border-stone-800">
              {destination.region}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              {destination.name}
            </h2>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[60vh]">
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            {destination.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Best Season */}
            <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Calendar className="w-4 h-4" />
                <span>Best Time to Visit</span>
              </div>
              <p className="text-xs text-stone-300 font-medium">
                {destination.bestTime}
              </p>
            </div>

            {/* Ideal For */}
            <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Heart className="w-4 h-4" />
                <span>Ideal For</span>
              </div>
              <p className="text-xs text-stone-300 font-medium">
                {destination.idealFor}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Signature Experiences We Curate</span>
            </h4>
            <div className="space-y-2">
              {destination.highlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-stone-300 p-2.5 rounded-lg bg-stone-800/40 border border-stone-800/80">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-stone-400 uppercase tracking-wider block">Estimated Investment</span>
            <span className="font-serif font-bold text-amber-400 text-base">
              {destination.priceNote}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => onEnquire(destination.name)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
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
