import React, { useState } from 'react';
import { DESTINATIONS } from '../data/travelData';
import { DestinationItem } from '../types';
import { ArrowUpRight, Compass, Sparkles, Clock, Globe } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface DestinationsSectionProps {
  data?: DestinationItem[];
  onSelectDestination: (dest: DestinationItem) => void;
  onEnquireDestination: (destName: string) => void;
}

const DESTINATION_META: Record<string, { code: string; flightTime: string }> = {
  'bali': { code: 'DPS', flightTime: '8h 45m from India' },
  'paris': { code: 'CDG', flightTime: '9h 15m Direct' },
  'switzerland': { code: 'ZRH', flightTime: '8h 30m Direct' },
  'santorini': { code: 'JTR', flightTime: '10h 30m 1-Stop' },
  'maldives': { code: 'MLE', flightTime: '2h 45m Short Flight' },
  'amalfi': { code: 'NAP', flightTime: '9h 40m 1-Stop' },
  'kyoto': { code: 'HND', flightTime: '8h 20m Direct' },
  'cappadocia': { code: 'NAV', flightTime: '8h 15m 1-Stop' },
  'prague': { code: 'PRG', flightTime: '9h 50m 1-Stop' },
};

const REGION_FILTERS = [
  'All',
  'Europe',
  'Southeast Asia',
  'Islands & Beaches',
  'East Asia',
];

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  data = DESTINATIONS,
  onSelectDestination,
  onEnquireDestination,
}) => {
  const [selectedRegion, setSelectedRegion] = useState('All');

  const filteredData = data.filter((dest) => {
    if (selectedRegion === 'All') return true;
    const regLower = (dest.region || '').toLowerCase();
    const idLower = (dest.id || '').toLowerCase();
    const nameLower = (dest.name || '').toLowerCase();

    if (selectedRegion === 'Europe') {
      return (
        regLower.includes('europe') ||
        ['paris', 'switzerland', 'amalfi', 'santorini', 'prague', 'cappadocia'].includes(idLower)
      );
    }
    if (selectedRegion === 'Southeast Asia') {
      return (
        regLower.includes('indonesia') ||
        regLower.includes('south-east') ||
        regLower.includes('southeast') ||
        ['bali'].includes(idLower)
      );
    }
    if (selectedRegion === 'Islands & Beaches') {
      return (
        ['bali', 'maldives', 'santorini', 'amalfi'].includes(idLower) ||
        regLower.includes('ocean') ||
        regLower.includes('sea') ||
        nameLower.includes('maldives') ||
        nameLower.includes('bali') ||
        nameLower.includes('santorini')
      );
    }
    if (selectedRegion === 'East Asia') {
      return (
        regLower.includes('east asia') ||
        ['kyoto'].includes(idLower) ||
        nameLower.includes('japan') ||
        nameLower.includes('kyoto') ||
        nameLower.includes('tokyo')
      );
    }
    return true;
  });

  return (
    <section id="destinations" className="py-12 sm:py-16 lg:py-24 bg-transparent text-[#2A1810] dark:text-white border-b border-[#EADFD5] dark:border-white/10 relative transition-colors duration-300">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#8C5528]/10 dark:bg-[#D47A2A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Section Heading - Featured Destinations directly below Torn Paper */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md text-[#8C5528] dark:text-[#E28C38] text-xs font-bold uppercase tracking-widest border border-[#DFD0C0]/80 dark:border-white/10 shadow-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Handpicked Guides & Journeys</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2A1810] dark:text-white">
            Featured <span className="italic font-serif text-[#8C5528] dark:text-[#E28C38] font-normal">Destinations</span>
          </h2>

          <p className="text-[#594336] dark:text-[#D1C2B8] text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
            Explore world-renowned wonders, secret terraced hills, private island villas, and bucket-list cultural expeditions.
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {REGION_FILTERS.map((region) => {
            const isActive = selectedRegion === region;
            return (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 backdrop-blur-md shadow-xs ${
                  isActive
                    ? 'bg-[#8C5528] dark:bg-[#C87428] text-white shadow-md shadow-[#8C5528]/25 scale-105 border border-transparent'
                    : 'bg-white/80 dark:bg-[#16100D]/80 text-[#6E4424] dark:text-[#D4A276] hover:bg-[#A0683B]/10 dark:hover:bg-[#B36D33]/15 border border-[#DFD0C0] dark:border-[#B36D33]/30'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>

        {/* Grid of Destinations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          {filteredData.map((dest) => {
            const meta = DESTINATION_META[dest.id] || { code: 'INT', flightTime: 'Curated Route' };

            return (
              <div
                key={dest.id}
                className="group rounded-3xl overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 hover:border-[#8C5528]/60 dark:hover:border-[#E28C38]/60 transition-all duration-500 flex flex-col shadow-[0_8px_30px_rgba(42,24,16,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 relative"
              >
                {/* Image with Tag & Price Badge & Glassmorphic Skeleton */}
                <div className="relative h-64 overflow-hidden w-full">
                  <GlassImage
                    src={dest.image}
                    alt={dest.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0706]/90 via-[#0A0706]/30 to-transparent pointer-events-none" />

                  {/* Responsive Header Badges Bar: Clean, non-colliding flex container */}
                  <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 z-10 pointer-events-none">
                    <div className="flex items-center gap-1.5 flex-wrap pointer-events-auto">
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/55 backdrop-blur-md text-[#F4ECE4] text-[11px] sm:text-xs font-mono font-bold border border-white/20 shadow-xs shrink-0">
                        {meta.code}
                      </span>
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/55 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-medium border border-white/20 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-[#E28C38]" />
                        <span>{meta.flightTime}</span>
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-lg bg-[#8C5528] dark:bg-[#C87428] text-white text-[11px] sm:text-xs font-bold shadow-md border border-white/20 shrink-0 whitespace-nowrap ml-auto pointer-events-auto">
                      {dest.priceNote}
                    </span>
                  </div>

                  {/* Bottom Overlay Title */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-baseline justify-between z-10">
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#F3D7BD] transition-colors">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3.5 sm:space-y-4">
                  <p className="text-[#594336] dark:text-[#D1C2B8] text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {dest.description}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-[#EADFD5]/80 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#A0683B] dark:text-[#D4A276]">
                      <Sparkles className="w-3.5 h-3.5 text-[#8C5528] dark:text-[#E28C38]" />
                      <span>Signature Inclusions:</span>
                    </div>
                    <ul className="grid grid-cols-1 gap-1 text-xs text-[#594336] dark:text-[#DFD0C0]">
                      {(dest.highlights || []).slice(0, 2).map((hl, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A0683B] dark:bg-[#B36D33] shrink-0" />
                          <span className="truncate">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Actions with Secondary Brown Button */}
                  <div className="pt-3.5 sm:pt-4 flex items-center justify-between gap-2 sm:gap-3 border-t border-[#EADFD5]/80 dark:border-white/10">
                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="text-xs font-semibold text-[#594336] dark:text-[#D1C2B8] hover:text-[#8C5528] dark:hover:text-white flex items-center gap-1 group/btn transition-colors truncate"
                    >
                      <span className="truncate">View Itinerary & Perks</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-[#8C5528] dark:text-[#E28C38]" />
                    </button>

                    <button
                      onClick={() => onEnquireDestination(dest.name)}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-[#A0683B]/10 dark:bg-[#B36D33]/15 hover:bg-[#8C5528] dark:hover:bg-[#E28C38] text-[#A0683B] dark:text-[#D4A276] hover:text-white dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-all border border-[#A0683B]/30 dark:border-[#B36D33]/40 backdrop-blur-md shrink-0"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
