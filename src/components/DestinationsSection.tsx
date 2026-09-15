import React from 'react';
import { DESTINATIONS } from '../data/travelData';
import { DestinationItem } from '../types';
import { MapPin, ArrowUpRight, Compass, Sparkles, Calendar, Heart } from 'lucide-react';

interface DestinationsSectionProps {
  onSelectDestination: (dest: DestinationItem) => void;
  onEnquireDestination: (destName: string) => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  onSelectDestination,
  onEnquireDestination,
}) => {
  return (
    <section id="destinations" className="py-20 lg:py-28 bg-[#121210] text-white border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold uppercase tracking-widest border border-amber-500/25">
            <Compass className="w-3.5 h-3.5" />
            <span>Where we take you</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100">
            Destinations that <span className="italic font-serif text-amber-300 font-normal">stay with you</span>
          </h2>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            From the canals of Venice to the cliff sunsets of Santorini — handpicked destinations for the discerning traveller.
          </p>
        </div>

        {/* Grid of Destinations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="group rounded-2xl overflow-hidden bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-amber-950/20"
            >
              {/* Image with Tag & Price Badge */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                {/* Region Pill */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-md bg-stone-950/80 backdrop-blur-md text-stone-300 text-[11px] uppercase tracking-wider font-semibold border border-stone-800">
                    {dest.region}
                  </span>
                </div>

                {/* Tag / Price Pill */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-md bg-amber-500/90 text-stone-950 text-xs font-bold shadow-md">
                    {dest.priceNote}
                  </span>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-stone-300 text-sm leading-relaxed line-clamp-3">
                  {dest.description}
                </p>

                {/* Highlights List */}
                <div className="space-y-2 pt-2 border-t border-stone-800/80">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Signature Inclusions:</span>
                  </div>
                  <ul className="grid grid-cols-1 gap-1 text-xs text-stone-300">
                    {dest.highlights.slice(0, 2).map((hl, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500" />
                        <span className="truncate">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 flex items-center justify-between gap-3 border-t border-stone-800">
                  <button
                    onClick={() => onSelectDestination(dest)}
                    className="text-xs font-semibold text-stone-300 hover:text-white flex items-center gap-1 group/btn"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-amber-400" />
                  </button>

                  <button
                    onClick={() => onEnquireDestination(dest.name)}
                    className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-amber-600 text-stone-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Enquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
