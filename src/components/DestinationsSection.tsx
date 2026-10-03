import React, { useState, useRef, useEffect } from 'react';
import { DESTINATIONS } from '../data/travelData';
import { DestinationItem } from '../types';
import { ArrowUpRight, Compass, Sparkles, Clock, ChevronLeft, ChevronRight, LayoutGrid, Sliders } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface DestinationsSectionProps {
  data?: DestinationItem[];
  onSelectDestination: (dest: DestinationItem) => void;
  onEnquireDestination: (destName: string) => void;
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
}

const DESTINATION_META: Record<string, { code: string; flightTime: string }> = {
  'bali': { code: 'DPS', flightTime: 'Direct & Connecting Flights · 8 Hours 45 Minutes' },
  'paris': { code: 'CDG', flightTime: 'Direct Flight · 9 Hours 15 Minutes' },
  'switzerland': { code: 'ZRH', flightTime: 'Direct Flight · 8 Hours 30 Minutes' },
  'santorini': { code: 'JTR', flightTime: 'Connecting Flight · 10 Hours 30 Minutes' },
  'maldives': { code: 'MLE', flightTime: 'Direct Flight · 2 Hours 45 Minutes' },
  'amalfi': { code: 'NAP', flightTime: 'Connecting Flight · 9 Hours 40 Minutes' },
  'kyoto': { code: 'HND', flightTime: 'Direct Flight · 8 Hours 20 Minutes' },
  'cappadocia': { code: 'NAV', flightTime: 'Connecting Flight · 8 Hours 15 Minutes' },
  'prague': { code: 'PRG', flightTime: 'Connecting Flight · 9 Hours 50 Minutes' },
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
  customBadge,
  customTitle,
  customSubtitle,
}) => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [selectedRegion, viewMode, data]);

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -380, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 380, behavior: 'smooth' });
  };

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
    <section id="destinations" className="py-12 sm:py-16 lg:py-24 bg-transparent text-[#2A1810] dark:text-white border-b border-[#C2B299]/40 dark:border-white/10 relative transition-colors duration-300">
      {/* Subtle ambient lighting with website tone */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-[#C2B299]/25 dark:bg-[#E37500]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Heading - Featured Destinations */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md text-[#2A1810] dark:text-[#E3BA91] text-xs font-bold uppercase tracking-widest border border-[#C2B299]/60 dark:border-white/10 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#E37500]" />
            <span>{customBadge || 'Handpicked Guides & Journeys'}</span>
          </div>

          {customTitle ? (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2A1810] dark:text-white">
              {customTitle}
            </h2>
          ) : (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2A1810] dark:text-white">
              Featured <span className="italic font-serif text-[#E37500] font-normal">Destinations</span>
            </h2>
          )}

          <p className="text-[#3D2B22] dark:text-[#D1C2B8] text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
            {customSubtitle || 'Explore world-renowned wonders, secret terraced hills, private island villas, and bucket-list cultural expeditions.'}
          </p>
        </div>

        {/* Filter Row + Caret Carousel Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Region Filter Buttons */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {REGION_FILTERS.map((region) => {
              const isActive = selectedRegion === region;
              return (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 backdrop-blur-md shadow-xs ${
                    isActive
                      ? 'bg-[#E37500] text-white shadow-md shadow-[#E37500]/30 scale-105 border border-transparent'
                      : 'bg-white/85 dark:bg-[#16100D]/85 text-[#4A3222] dark:text-[#D4A276] hover:bg-[#E37500]/10 border border-[#C2B299]/60 dark:border-white/10'
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>

          {/* Carousel Caret Controls & Layout Switcher */}
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-white/80 dark:bg-white/10 p-1 rounded-full border border-[#C2B299]/60 dark:border-white/10 shadow-xs">
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-[#E37500] text-white shadow-xs'
                    : 'text-[#4A3222] dark:text-neutral-300 hover:text-[#E37500]'
                }`}
                title="Caret Carousel View"
              >
                Carousel
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#E37500] text-white shadow-xs'
                    : 'text-[#4A3222] dark:text-neutral-300 hover:text-[#E37500]'
                }`}
                title="Grid View"
              >
                Grid
              </button>
            </div>

            {/* Caret Navigation Buttons */}
            {viewMode === 'carousel' && (
              <div className="flex items-center gap-1.5 ml-1">
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#1C1410] border border-[#C2B299]/70 dark:border-white/20 text-[#2A1810] dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95"
                  aria-label="Previous destination"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#1C1410] border border-[#C2B299]/70 dark:border-white/20 text-[#2A1810] dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95"
                  aria-label="Next destination"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel or Grid of Destinations */}
        <div
          ref={carouselRef}
          className={
            viewMode === 'carousel'
              ? 'flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar'
              : 'content-grid'
          }
        >
          {filteredData.map((dest) => {
            const meta = DESTINATION_META[dest.id] || { code: 'Direct', flightTime: 'Curated Flight Route' };

            return (
              <div
                key={dest.id}
                className={`group rounded-3xl overflow-hidden backdrop-blur-xl bg-white/90 dark:bg-[#16100D]/90 border border-white/80 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 transition-all duration-300 flex flex-col shadow-[0_8px_30px_rgba(42,24,16,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 relative ${
                  viewMode === 'carousel' ? 'shrink-0 w-[85vw] sm:w-[360px] lg:w-[390px] snap-start' : ''
                }`}
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

                  {/* Header Badges Bar: Clean, flight route & clear pricing with NO shortcuts */}
                  <div className="absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 flex items-center gap-1.5 shadow-sm pointer-events-auto">
                      <Clock className="w-3.5 h-3.5 text-[#E37500]" />
                      <span className="truncate max-w-[190px] sm:max-w-none">{meta.flightTime}</span>
                    </span>

                    <span className="px-3 py-1 rounded-full bg-[#E37500] text-white text-[11px] sm:text-xs font-bold shadow-md shadow-[#E37500]/30 border border-white/20 shrink-0 whitespace-nowrap ml-auto pointer-events-auto">
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
                  <p className="text-[#4A3222] dark:text-[#D1C2B8] text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {dest.description}
                  </p>

                  {/* Highlights List */}
                  <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-[#C2B299]/30 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#2A1810] dark:text-[#D4A276]">
                      <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
                      <span>Signature Inclusions:</span>
                    </div>
                    <ul className="grid grid-cols-1 gap-1 text-xs text-[#523B2D] dark:text-[#DFD0C0]">
                      {(dest.highlights || []).slice(0, 2).map((hl, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E37500] shrink-0" />
                          <span className="truncate">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Actions with Vibrant #E37500 Button */}
                  <div className="pt-3.5 sm:pt-4 flex items-center justify-between gap-2 sm:gap-3 border-t border-[#C2B299]/30 dark:border-white/10">
                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="text-xs font-semibold text-[#4A3222] dark:text-[#D1C2B8] hover:text-[#E37500] dark:hover:text-[#E37500] flex items-center gap-1 group/btn transition-colors truncate"
                    >
                      <span className="truncate">View Complete Itinerary</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-[#E37500]" />
                    </button>

                    <button
                      onClick={() => onEnquireDestination(dest.name)}
                      className="px-4 py-2 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E37500]/25 hover:scale-105 active:scale-95 shrink-0 border border-white/20"
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

