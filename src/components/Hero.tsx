import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Clock, MapPin, Award } from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

interface HeroProps {
  onPlanTrip: () => void;
  onExploreDestinations: () => void;
  onSelectHighlight: (destinationName: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onPlanTrip,
  onExploreDestinations,
  onSelectHighlight,
}) => {
  const quickHighlights = [
    { label: 'Bali Luxury Villas', target: 'Bali, Indonesia' },
    { label: 'Swiss Alps & Paris', target: 'Switzerland' },
    { label: 'Santorini Honeymoons', target: 'Santorini' },
    { label: 'Maldives Overwater', target: 'Maldives' },
    { label: 'Prague & Central Europe', target: 'Prague & Central Europe' },
  ];

  return (
    <section id="hero" className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-stone-950 text-white">
      {/* Background Image with Dark Vignette & Amber Accent */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury travel scenery"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.38] contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center sm:text-left flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>7+ Years of Crafting Extraordinary Journeys</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 leading-[1.15]">
            Bespoke luxury travel experiences designed around you —{' '}
            <span className="italic font-normal text-amber-300/90 font-serif">not a brochure.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl">
            For Indian travellers who believe the journey is as important as the destination. Handcrafted itineraries, private 5-star villas, and a dedicated travel specialist who is reachable before, during, and after your trip.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onPlanTrip}
              className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-950/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Design My Journey</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onExploreDestinations}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 font-medium text-sm transition-all hover:border-stone-500"
            >
              <span>Explore Destinations</span>
            </button>
          </div>

          {/* Quick Destination Pill Highlights */}
          <div className="pt-4 flex flex-wrap items-center gap-2 text-xs text-stone-400">
            <span className="font-medium text-stone-500">Trending Escapes:</span>
            {quickHighlights.map((item) => (
              <button
                key={item.label}
                onClick={() => onSelectHighlight(item.target)}
                className="px-2.5 py-1 rounded-md bg-stone-900/70 hover:bg-amber-950/60 text-stone-300 hover:text-amber-300 border border-stone-800 hover:border-amber-700/50 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Trust Metrics Bar */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-white">7+ Years</span>
              <span className="text-xs text-stone-400">Crafting bespoke itineraries</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-white">100% Custom</span>
              <span className="text-xs text-stone-400">Zero template packages</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-white">24/7 Concierge</span>
              <span className="text-xs text-stone-400">Dedicated on-trip support</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold text-white">Zero Stress</span>
              <span className="text-xs text-stone-400">Visas, transfers & VIP access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
