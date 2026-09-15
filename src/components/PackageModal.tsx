import React from 'react';
import { TravelPackage } from '../types';
import { X, Check, Clock, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface PackageModalProps {
  pkg: TravelPackage | null;
  onClose: () => void;
  onCustomise: (pkg: TravelPackage) => void;
}

export const PackageModal: React.FC<PackageModalProps> = ({ pkg, onClose, onCustomise }) => {
  if (!pkg) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col text-white">
        {/* Modal Header with Image */}
        <div className="relative h-60 sm:h-72 shrink-0 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-300 hover:text-white border border-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Info */}
          <div className="absolute bottom-4 left-6 right-6 space-y-1">
            <span className="px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 font-bold text-[10px] uppercase tracking-wider">
              {pkg.tag}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {pkg.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {pkg.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {pkg.destination}
              </span>
              <span className="font-serif font-bold text-amber-400 text-sm">
                {pkg.startingPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Inclusions */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Bespoke Inclusions & Perks</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {pkg.inclusions.map((inc, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-stone-300 p-2.5 rounded-xl bg-stone-800/60 border border-stone-800">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Day by Day Itinerary */}
          <div className="space-y-4 pt-2">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Day-by-Day Flow (Customisable)</span>
            </h3>
            <div className="space-y-3">
              {pkg.dayHighlights.map((item) => (
                <div key={item.day} className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/20">
                    D{item.day}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-200">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-400">
            <span>Starting at </span>
            <span className="font-serif font-bold text-amber-400 text-base">
              {pkg.startingPrice}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => onCustomise(pkg)}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
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
