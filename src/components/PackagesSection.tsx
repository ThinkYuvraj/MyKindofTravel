import React, { useState } from 'react';
import { POPULAR_PACKAGES } from '../data/travelData';
import { TravelPackage } from '../types';
import { Check, ArrowRight, Eye, Clock, Plane, Ticket, PackageOpen } from 'lucide-react';
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
// Each filter has an explicit predicate — no fragile string-contains guessing.
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
// Splits e.g. "From ₹1,85,000 /pp" → { amount: '₹1,85,000', suffix: '/pp' }
function parsePrice(raw: string): { amount: string; suffix: string } {
  const stripped = raw.replace(/^from\s*/i, '').trim();
  const match = stripped.match(/^(.*?)\s*(\/pp|per\s*person|\/pax)?$/i);
  return {
    amount: match?.[1]?.trim() || stripped,
    suffix: match?.[2] ? match[2].toLowerCase().replace('per person', '/pp') : '/pp',
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

  // Attach counts so the badge next to each tab label stays accurate
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
      className="py-12 sm:py-16 lg:py-24 bg-[#FFFFFF] dark:bg-[#0A0706] text-[#2A1810] dark:text-white border-b border-[#EADFD5] dark:border-white/10 relative transition-colors duration-300"
    >
      <div className="section-container">

        {/* ── Header & Filter Tabs ──────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] text-xs font-bold uppercase tracking-widest border border-[#DFD0C0]/80 dark:border-white/10 backdrop-blur-md shadow-xs">
              <Ticket className="w-3.5 h-3.5" />
              <span>{customBadge || 'Popular packages'}</span>
            </div>

            {customTitle ? (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white">
                {customTitle}
              </h2>
            ) : (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white">
                Curated journeys{' '}
                <span className="italic font-serif text-[#8C5528] dark:text-[#E28C38] font-normal">
                  ready to personalise
                </span>
              </h2>
            )}

            <p className="text-[#594336] dark:text-[#D1C2B8] text-sm sm:text-base leading-relaxed font-normal">
              {customSubtitle || 'Proven itineraries designed for discerning travelers. Every package can be modified, upgraded, and reshuffled to match your exact dates and preferences.'}
            </p>
          </div>

          {/* ── Filter pill row ─────────────────────────────────────────── */}
          <div className="flex-shrink-0">
            <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[#F5EDE4] dark:bg-[#16100D] border border-[#DFD0C0] dark:border-white/10 shadow-inner">
              {filtersWithCounts.map((f) => {
                const isActive = activeFilter === f.label;
                return (
                  <button
                    key={f.label}
                    onClick={() => setActiveFilter(f.label)}
                    disabled={f.count === 0}
                    aria-pressed={isActive}
                    className={`
                      relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold
                      transition-all duration-300 whitespace-nowrap
                      disabled:opacity-35 disabled:cursor-not-allowed
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5528]
                      ${isActive
                        ? 'bg-[#8C5528] dark:bg-[#C87428] text-white shadow-md shadow-[#8C5528]/30 dark:shadow-[#C87428]/25 scale-[1.02]'
                        : 'text-[#6E4424] dark:text-[#D4A276] hover:bg-white/60 dark:hover:bg-white/5 hover:scale-[1.01]'
                      }
                    `}
                  >
                    <span>{f.label}</span>
                    {f.label !== 'All' && (
                      <span
                        className={`
                          inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-extrabold
                          transition-colors duration-300
                          ${isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#8C5528]/12 dark:bg-[#C87428]/20 text-[#8C5528] dark:text-[#E28C38]'
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
          </div>
        </div>

        {/* ── Packages Grid ──────────────────────────────────────────────── */}
        {filteredPackages.length > 0 ? (
          <div className="content-grid">
            {filteredPackages.map((pkg) => {
              const { amount, suffix } = parsePrice(pkg.startingPrice);
              return (
                <div
                  key={pkg.id}
                  className="rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 hover:border-[#8C5528]/60 dark:hover:border-[#E28C38]/60 transition-all duration-500 overflow-hidden flex flex-col justify-between group shadow-[0_4px_20px_rgba(42,24,16,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 relative"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0706]/90 via-[#0A0706]/20 to-transparent pointer-events-none" />

                      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                        <span className="px-3 py-1 rounded-lg bg-[#A0683B]/90 dark:bg-[#B36D33]/90 backdrop-blur-md text-white text-[11px] uppercase tracking-wider font-bold border border-white/20 shadow-xs">
                          {pkg.tag}
                        </span>
                        {pkg.badge && (
                          <span className="px-2.5 py-1 rounded-lg bg-[#8C5528] dark:bg-[#C87428] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm border border-white/20">
                            {pkg.badge}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-[#FAF7F2] font-medium z-10">
                        <Plane className="w-3.5 h-3.5 text-[#E28C38] -rotate-45" />
                        <span>{pkg.destination}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 space-y-3.5 sm:space-y-4">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1810] dark:text-white group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] transition-colors">
                          {pkg.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#A0683B] dark:text-[#D4A276] font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#8C5528] dark:text-[#E28C38]" />
                          <span>{pkg.duration}</span>
                        </div>
                      </div>

                      {/* Feature bullets */}
                      <ul className="space-y-2 py-2 border-t border-b border-[#EADFD5]/80 dark:border-white/10">
                        {(pkg.features || []).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#594336] dark:text-[#DFD0C0]">
                            <Check className="w-4 h-4 text-[#A0683B] dark:text-[#D4A276] shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* ── Price Row ───────────────────────────────────── */}
                      <div className="pt-1 flex items-center justify-between gap-3">
                        {/* Left: labels */}
                        <div className="flex flex-col leading-tight">
                          <span className="text-[10px] text-[#A0683B] dark:text-[#D4A276] uppercase tracking-widest font-bold">
                            Investment
                          </span>
                          <span className="text-[11px] text-[#8C7769] dark:text-neutral-400 font-medium">
                            Starting at
                          </span>
                        </div>

                        {/* Right: price amount + suffix */}
                        <div className="flex items-baseline gap-1">
                          <span className="font-serif text-xl sm:text-2xl font-bold text-[#8C5528] dark:text-[#E28C38] leading-none">
                            {amount}
                          </span>
                          <span className="text-[11px] text-[#A0683B] dark:text-[#D4A276] font-semibold leading-none self-end pb-0.5">
                            {suffix}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── CTA Buttons ─────────────────────────────────────── */}
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-dashed border-[#EADFD5]/80 dark:border-white/15 flex items-center gap-3">
                    <button
                      onClick={() => onViewPackageDetails(pkg)}
                      className="flex-1 py-2.5 rounded-xl bg-[#A0683B]/10 dark:bg-[#B36D33]/15 hover:bg-[#A0683B]/20 dark:hover:bg-[#B36D33]/25 text-[#A0683B] dark:text-[#D4A276] text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#A0683B]/30 dark:border-[#B36D33]/40"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Itinerary</span>
                    </button>

                    <button
                      onClick={() => onEnquirePackage(pkg)}
                      className="flex-1 py-2.5 rounded-xl bg-[#8C5528] dark:bg-[#C87428] hover:bg-[#72421D] dark:hover:bg-[#B86620] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#8C5528]/25 active:scale-95 border border-white/20"
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
            <div className="w-16 h-16 rounded-2xl bg-[#F5EDE4] dark:bg-[#16100D] flex items-center justify-center border border-[#DFD0C0] dark:border-white/10">
              <PackageOpen className="w-7 h-7 text-[#A0683B] dark:text-[#D4A276]" />
            </div>
            <div className="space-y-1">
              <p className="text-[#2A1810] dark:text-white font-semibold text-sm">No packages in this category yet</p>
              <p className="text-[#594336] dark:text-[#D1C2B8] text-xs">Try a different filter or browse all packages below.</p>
            </div>
            <button
              onClick={() => setActiveFilter('All')}
              className="px-5 py-2.5 rounded-full bg-[#8C5528] dark:bg-[#C87428] text-white text-xs font-bold uppercase tracking-wider transition-all hover:bg-[#72421D] dark:hover:bg-[#B86620] shadow-md"
            >
              View All Packages
            </button>
          </div>
        )}
      </div>
    </section>
  );
};


