import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  'bali': { code: 'DPS', flightTime: '8h 45m · 1-Stop' },
  'paris': { code: 'CDG', flightTime: '9h 15m · Direct' },
  'switzerland': { code: 'ZRH', flightTime: '8h 30m · Direct' },
  'santorini': { code: 'JTR', flightTime: '10h 30m · 1-Stop' },
  'maldives': { code: 'MLE', flightTime: '2h 45m · Direct' },
  'amalfi': { code: 'NAP', flightTime: '9h 40m · 1-Stop' },
  'kyoto': { code: 'HND', flightTime: '8h 20m · Direct' },
  'cappadocia': { code: 'NAV', flightTime: '8h 15m · 1-Stop' },
  'prague': { code: 'PRG', flightTime: '9h 50m · 1-Stop' },
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
  const navigate = useNavigate();
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
    <section id="destinations" className="py-12 sm:py-16 lg:py-24 bg-transparent text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 relative transition-colors duration-300">
      {/* Subtle ambient lighting with website tone */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-neutral-100/50 dark:bg-[#E37500]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Heading - Featured Destinations */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/10 backdrop-blur-md text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-widest border border-neutral-200 dark:border-white/10 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#E37500]" />
            <span>{customBadge || 'Handpicked Guides & Journeys'}</span>
          </div>

          {customTitle ? (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {customTitle}
            </h2>
          ) : (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Featured <span className="italic font-serif text-[#E37500] font-normal">Destinations</span>
            </h2>
          )}

          <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
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
                      : 'bg-white dark:bg-[#0E0E0E] text-neutral-700 dark:text-[#E0E0E0] hover:bg-[#E37500]/10 border border-neutral-200 dark:border-white/10'
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
            <div className="flex items-center bg-white dark:bg-white/10 p-1 rounded-full border border-neutral-200 dark:border-white/10 shadow-xs">
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-[#E37500] text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-[#E37500]'
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
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-[#E37500]'
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
                  className="w-9 h-9 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/20 text-neutral-900 dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95"
                  aria-label="Previous destination"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className="w-9 h-9 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/20 text-neutral-900 dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95"
                  aria-label="Next destination"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            )}

            {/* Link to All Destinations Page */}
            <button
              onClick={() => navigate('/destinations')}
              className="ml-1.5 px-3.5 py-1.5 rounded-full bg-[#E37500] hover:bg-[#C96400] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs shrink-0"
              title="View complete destinations list"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
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
                className={`group rounded-3xl overflow-hidden backdrop-blur-xl bg-white dark:bg-[#0B0B0B]/95 border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 transition-all duration-300 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:-translate-y-1 relative ${
                  viewMode === 'carousel' ? 'shrink-0 w-[85vw] sm:w-[360px] lg:w-[390px] snap-start' : ''
                }`}
              >
                {/* Image with Tag & Price Badge */}
                <div className="relative h-64 overflow-hidden w-full">
                  <GlassImage
                    src={dest.image}
                    alt={dest.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />



                  {/* Bottom Overlay Title with Region Tag */}
                  <div className="absolute bottom-3.5 left-4 right-4 z-10">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#E37500] drop-shadow-sm block mb-0.5">
                      {dest.tag || dest.region}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#E37500] transition-colors leading-tight">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body: Soft-surface typography */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {dest.description}
                  </p>

                  {/* Flight Time & Price Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/8 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white text-[11px] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#E37500] shrink-0" />
                      <span>{meta.flightTime}</span>
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-[#E37500] text-white text-[11px] font-bold shadow-sm shadow-[#E37500]/25 whitespace-nowrap">
                      {dest.priceNote.replace('Starting from ', 'From ')}
                    </span>
                  </div>

                  {/* Highlights List */}
                  <div className="space-y-1.5 pt-3 border-t border-neutral-200 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-white">
                      <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
                      <span>Signature Inclusions:</span>
                    </div>
                    <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                      {(dest.highlights || []).slice(0, 2).map((hl, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E37500] shrink-0" />
                          <span className="truncate">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-3.5 flex items-center justify-between gap-3 border-t border-neutral-200 dark:border-white/10">
                    <button
                      onClick={() => onSelectDestination(dest)}
                      className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-[#E37500] dark:hover:text-[#E37500] flex items-center gap-1 group/btn transition-colors"
                    >
                      <span>View Itinerary</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-[#E37500]" />
                    </button>

                    <button
                      onClick={() => onEnquireDestination(dest.name)}
                      className="px-5 py-2 rounded-full bg-[#E37500] hover:bg-[#C96400] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E37500]/25 hover:scale-105 active:scale-95 shrink-0"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner to Explore All Destinations */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              Looking for a custom multi-country blueprint?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Explore our full portfolio of worldwide destinations with flight times, pricing, and signature inclusions.
            </p>
          </div>
          <button
            onClick={() => navigate('/destinations')}
            className="px-6 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C96400] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#E37500]/25 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Explore All Destinations</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};

