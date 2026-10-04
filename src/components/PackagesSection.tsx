import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { POPULAR_PACKAGES } from '../data/travelData';
import { TravelPackage } from '../types';
import { Check, ArrowRight, Eye, Clock, Plane, Ticket, PackageOpen, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
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
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('All');
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
  }, [activeFilter, data]);

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
      className="py-12 sm:py-16 lg:py-24 bg-transparent text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 relative transition-colors duration-300"
    >
      {/* Subtle ambient lighting with website tone */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-neutral-100/50 dark:bg-[#E37500]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">

        {/* ── Section Heading ────────────────────────────────────────────── */}
        <div className="max-w-3xl space-y-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111111] text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-widest border border-neutral-200 dark:border-white/10 backdrop-blur-md shadow-xs">
            <Ticket className="w-3.5 h-3.5 text-[#E37500]" />
            <span>{customBadge || 'Popular packages'}</span>
          </div>

          {customTitle ? (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {customTitle}
            </h2>
          ) : (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Curated journeys{' '}
              <span className="italic font-serif text-[#E37500] font-normal">
                ready to personalise
              </span>
            </h2>
          )}

          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
            {customSubtitle || 'Proven itineraries designed for discerning travelers. Every package can be modified, upgraded, and reshuffled to match your exact dates and preferences.'}
          </p>
        </div>

        {/* ── Control Bar Below Heading in Flex Row ───────────────────────── */}
        <div className="flex flex-row items-center justify-between gap-4 mb-8 w-full overflow-x-auto no-scrollbar pb-1">
          {/* Filter pills in smooth horizontal flex-row */}
          <div className="flex flex-row items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 shadow-xs backdrop-blur-md shrink-0">
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
                    transition-all duration-200 whitespace-nowrap shrink-0
                    disabled:opacity-35 disabled:cursor-not-allowed
                    ${isActive
                      ? 'bg-[#E37500] text-white shadow-md shadow-[#E37500]/25 scale-[1.02]'
                      : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
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
                          : 'bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300'
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

          {/* Caret Navigation & View All link in clean flex-row */}
          <div className="flex flex-row items-center gap-2 p-1.5 rounded-full bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 shadow-xs backdrop-blur-md shrink-0">
            {/* Prev / Next caret arrows */}
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/8 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
              aria-label="Previous package"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/8 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
              aria-label="Next package"
              title="Next"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Link to All Packages Page */}
            <span className="w-px h-5 bg-neutral-200 dark:bg-white/15 mx-0.5 shrink-0" />
            <button
              onClick={() => navigate('/packages')}
              className="px-3.5 py-1.5 rounded-full bg-[#E37500] hover:bg-[#C96400] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs shrink-0"
              title="View all itineraries & packages"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Pure Caret Carousel of Packages ────────────────────────────── */}
        {filteredPackages.length > 0 ? (
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {filteredPackages.map((pkg) => {
              const { amount, suffix } = parsePrice(pkg.startingPrice);
              return (
                <div
                  key={pkg.id}
                  className="rounded-3xl backdrop-blur-xl bg-white dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 relative shrink-0 w-[88vw] sm:w-[380px] lg:w-[410px] snap-start"
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



                      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white font-medium z-10">
                        <Plane className="w-3.5 h-3.5 text-[#E37500] -rotate-45" />
                        <span>{pkg.destination}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 space-y-3.5 sm:space-y-4">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-snug">
                          {pkg.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-[#E37500] font-semibold mt-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{pkg.duration}</span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-normal line-clamp-2">
                          {pkg.subtitle}
                        </p>
                      </div>


                      {/* Features Bullet List */}
                      <div className="space-y-2 pt-3 border-t border-neutral-200 dark:border-white/10">
                        {pkg.features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-neutral-800 dark:text-neutral-200">
                            <div className="w-4 h-4 rounded-full bg-[#E37500]/15 dark:bg-[#E37500]/25 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-[#E37500] stroke-[3]" />
                            </div>
                            <span className="truncate font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pricing Tag */}
                      <div className="pt-2">
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-medium">Starting from</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-bold font-serif text-neutral-900 dark:text-white tracking-tight">
                            {amount}
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {suffix}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── CTA Buttons with #E37500 ───────────────────────────── */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-neutral-200 dark:border-white/10 flex items-center gap-3">
                    <button
                      onClick={() => onViewPackageDetails(pkg)}
                      className="flex-1 py-2.5 rounded-full bg-neutral-100 dark:bg-[#141414] hover:bg-neutral-200/70 dark:hover:bg-white/10 text-neutral-900 dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-neutral-200 dark:border-white/15 shadow-xs"
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
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0E0E0E] flex items-center justify-center border border-neutral-200 dark:border-white/10 shadow-xs">
              <PackageOpen className="w-7 h-7 text-[#E37500]" />
            </div>
            <div className="space-y-1">
              <p className="text-neutral-900 dark:text-white font-semibold text-sm">No packages in this category yet</p>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs">Try a different filter or browse all packages below.</p>
            </div>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-5 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E37500]/25 active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Banner to Explore All Packages */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              Want a fully customized multi-city itinerary?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              Browse all curated holiday packages with day-by-day highlights, inclusions, and bespoke personalization.
            </p>
          </div>
          <button
            onClick={() => navigate('/packages')}
            className="px-6 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#E37500]/25 hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Explore All Packages</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};
