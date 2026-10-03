import React, { useState, useRef, useEffect } from 'react';
import { POPULAR_PACKAGES } from '../data/travelData';
import { TravelPackage } from '../types';
import { Check, ArrowRight, Eye, Clock, Plane, Ticket, PackageOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface PackagesSectionProps {
  data?: TravelPackage[];
  onEnquirePackage: (pkg: TravelPackage) => void;
  onViewPackageDetails: (pkg: TravelPackage) => void;
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
}

// ── Filter definitions ────────────────────────────────────────────────────────
const FILTER_DEFS: { label: string; match: (pkg: TravelPackage) => boolean }[] = [
  { label: 'All',           match: () => true },
  { label: 'Honeymoon',     match: (p) => p.tag.toLowerCase().includes('honeymoon') },
  { label: 'Europe',        match: (p) =>
      p.destination.includes('France')       ||
      p.destination.includes('Switzerland')  ||
      p.destination.includes('Greece')       ||
      p.tag.toLowerCase().includes('alpine') ||
      p.tag.toLowerCase().includes('europe')
  },
  { label: 'Bali',          match: (p) => p.destination.toLowerCase().includes('bali') },
  { label: 'Luxury Escape', match: (p) => p.tag.toLowerCase().includes('luxury') },
];

// ── Price parser ──────────────────────────────────────────────────────────────
function parsePrice(raw: string): { amount: string; suffix: string } {
  const stripped = raw.replace(/^starting\s+from\s*/i, '').replace(/^from\s*/i, '').trim();
  const match = stripped.match(/^(.*?)\s*(\/pp|per\s*person|\/pax|\/\s*person)?$/i);
  return {
    amount: match?.[1]?.trim() || stripped,
    suffix: '/ Person',
  };
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  data = POPULAR_PACKAGES,
  onEnquirePackage,
  onViewPackageDetails,
  customBadge,
  customTitle,
  customSubtitle,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
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
  }, [activeFilter, viewMode, data]);

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  const filtersWithCounts = FILTER_DEFS.map((f) => ({
    ...f,
    count: data.filter(f.match).length,
  }));

  const filteredPackages = data.filter(
    FILTER_DEFS.find((f) => f.label === activeFilter)?.match ?? (() => true),
  );

  return (
    <section
      id="packages"
      className="py-12 sm:py-16 lg:py-24 bg-transparent text-[#24130A] dark:text-white border-b border-[#E8DFD5] dark:border-white/10 relative transition-colors duration-300"
    >
      {/* Subtle ambient lighting with website tone */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#E8DFD5]/30 dark:bg-[#E37500]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">

        {/* ── Header & Filter Tabs + Caret Carousel Controls ──────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#111111] text-[#24130A] dark:text-white text-xs font-bold uppercase tracking-widest border border-[#E8DFD5] dark:border-white/10 backdrop-blur-md shadow-xs">
              <Ticket className="w-3.5 h-3.5 text-[#E37500]" />
              <span>{customBadge || 'Popular packages'}</span>
            </div>

            {customTitle ? (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24130A] dark:text-white">
                {customTitle}
              </h2>
            ) : (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24130A] dark:text-white">
                Curated journeys{' '}
                <span className="italic font-serif text-[#E37500] font-normal">
                  ready to personalise
                </span>
              </h2>
            )}

            <p className="text-[#6F5B4E] dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
              {customSubtitle || 'Proven itineraries designed for discerning travelers. Every package can be modified, upgraded, and reshuffled to match your exact dates and preferences.'}
            </p>
          </div>

          {/* ── Filter Row & Caret Navigation ────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Filter pills */}
            <div className="flex flex-wrap gap-1.5 p-1.5 rounded-full bg-white/90 dark:bg-[#0E0E0E] border border-[#E8DFD5] dark:border-white/10 shadow-xs backdrop-blur-md">
              {filtersWithCounts.map((f) => {
                const isActive = activeFilter === f.label;
                return (
                  <button
                    key={f.label}
                    onClick={() => setActiveFilter(f.label)}
                    disabled={f.count === 0}
                    aria-pressed={isActive}
                    className={`
                      relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold
                      transition-all duration-200 whitespace-nowrap
                      disabled:opacity-35 disabled:cursor-not-allowed
                      ${isActive
                        ? 'bg-[#E37500] text-white shadow-md shadow-[#E37500]/25 scale-[1.02]'
                        : 'text-[#6F5B4E] dark:text-neutral-300 hover:text-[#24130A] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                      }
                    `}
                  >
                    <span>{f.label}</span>
                    {f.label !== 'All' && (
                      <span
                        className={`
                          inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-extrabold
                          transition-colors duration-200
                          ${isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-black/5 dark:bg-white/10 text-[#6F5B4E] dark:text-neutral-300'
                          }
                        `}
                      >
                        {f.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* View Mode & Carets */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white/90 dark:bg-[#0E0E0E] p-1 rounded-full border border-[#E8DFD5] dark:border-white/10 shadow-xs">
                <button
                  onClick={() => setViewMode('carousel')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    viewMode === 'carousel'
                      ? 'bg-[#E37500] text-white shadow-xs'
                      : 'text-[#6F5B4E] dark:text-neutral-400 hover:text-[#24130A] dark:hover:text-white'
                  }`}
                  title="Caret Carousel"
                >
                  Carousel
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#E37500] text-white shadow-xs'
                      : 'text-[#6F5B4E] dark:text-neutral-400 hover:text-[#24130A] dark:hover:text-white'
                  }`}
                  title="Grid View"
                >
                  Grid
                </button>
              </div>

              {viewMode === 'carousel' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className="w-9 h-9 rounded-full bg-white dark:bg-[#111111] border border-[#E8DFD5] dark:border-white/15 text-[#24130A] dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95"
                    aria-label="Previous package"
                    title="Previous"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className="w-9 h-9 rounded-full bg-white dark:bg-[#111111] border border-[#E8DFD5] dark:border-white/15 text-[#24130A] dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95"
                    aria-label="Next package"
                    title="Next"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Packages Carousel / Grid ───────────────────────────────────── */}
        {filteredPackages.length > 0 ? (
          <div
            ref={carouselRef}
            className={
              viewMode === 'carousel'
                ? 'flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar'
                : 'content-grid'
            }
          >
            {filteredPackages.map((pkg) => {
              const { amount, suffix } = parsePrice(pkg.startingPrice);
              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl backdrop-blur-xl bg-white dark:bg-[#0B0B0B] border border-[#E8DFD5] dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-[0_8px_30px_rgba(36,19,10,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 relative ${
                    viewMode === 'carousel' ? 'shrink-0 w-[88vw] sm:w-[380px] lg:w-[410px] snap-start' : ''
                  }`}
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative h-56 overflow-hidden w-full">
                      <GlassImage
                        src={pkg.image}
                        alt={pkg.title}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                        <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] uppercase tracking-wider font-bold border border-white/20 shadow-xs">
                          {pkg.tag}
                        </span>
                        {pkg.badge && (
                          <span className="px-2.5 py-1 rounded-full bg-[#E37500] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm border border-white/20">
                            {pkg.badge}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white font-medium z-10">
                        <Plane className="w-3.5 h-3.5 text-[#E37500] -rotate-45" />
                        <span>{pkg.destination}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 space-y-3.5 sm:space-y-4">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-[#E37500] font-semibold mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{pkg.duration}</span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#24130A] dark:text-white group-hover:text-[#E37500] transition-colors leading-snug">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-[#6F5B4E] dark:text-neutral-400 mt-1 font-normal line-clamp-2">
                          {pkg.subtitle}
                        </p>
                      </div>

                      {/* Features Bullet List */}
                      <div className="space-y-2 pt-3 border-t border-[#E8DFD5] dark:border-white/10">
                        {pkg.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[#24130A] dark:text-neutral-200">
                            <div className="w-4 h-4 rounded-full bg-[#E37500]/15 dark:bg-[#E37500]/25 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-[#E37500] stroke-[3]" />
                            </div>
                            <span className="truncate font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pricing Tag */}
                      <div className="pt-2">
                        <span className="text-[11px] text-[#8C7667] dark:text-neutral-400 block font-medium">Starting from</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-bold font-serif text-[#24130A] dark:text-white tracking-tight">
                            {amount}
                          </span>
                          <span className="text-xs text-[#8C7667] dark:text-neutral-400">
                            {suffix}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── CTA Buttons with #E37500 ───────────────────────────── */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#E8DFD5] dark:border-white/10 flex items-center gap-3">
                    <button
                      onClick={() => onViewPackageDetails(pkg)}
                      className="flex-1 py-2.5 rounded-full bg-[#FAF7F2] dark:bg-[#141414] hover:bg-black/5 dark:hover:bg-white/10 text-[#24130A] dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#E8DFD5] dark:border-white/15 shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#E37500]" />
                      <span>Itinerary</span>
                    </button>

                    <button
                      onClick={() => onEnquirePackage(pkg)}
                      className="flex-1 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#E37500]/25 active:scale-95 border border-white/20"
                    >
                      <span>Enquire</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Empty state ──────────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0E0E0E] flex items-center justify-center border border-[#E8DFD5] dark:border-white/10 shadow-xs">
              <PackageOpen className="w-7 h-7 text-[#E37500]" />
            </div>
            <div className="space-y-1">
              <p className="text-[#24130A] dark:text-white font-semibold text-sm">No packages in this category yet</p>
              <p className="text-[#6F5B4E] dark:text-neutral-400 text-xs">Try a different filter or browse all packages below.</p>
            </div>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-5 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E37500]/25 active:scale-95"
            >
              View All Packages
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
