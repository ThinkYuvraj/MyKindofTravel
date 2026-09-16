import React, { useState } from 'react';
import { POPULAR_PACKAGES } from '../data/travelData';
import { TravelPackage } from '../types';
import { Check, ArrowRight, Eye, Clock, Plane, Ticket } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface PackagesSectionProps {
  onEnquirePackage: (pkg: TravelPackage) => void;
  onViewPackageDetails: (pkg: TravelPackage) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  onEnquirePackage,
  onViewPackageDetails,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filters = ['All', 'Honeymoon', 'Europe', 'Bali', 'Luxury Escape'];

  const filteredPackages = POPULAR_PACKAGES.filter((pkg) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Honeymoon') return pkg.tag.includes('Honeymoon') || pkg.id.includes('romance') || pkg.id.includes('santorini');
    if (activeFilter === 'Europe') return pkg.destination.includes('France') || pkg.destination.includes('Switzerland') || pkg.destination.includes('Greece');
    if (activeFilter === 'Bali') return pkg.destination.includes('Bali');
    if (activeFilter === 'Luxury Escape') return pkg.tag.includes('Luxury') || pkg.tag.includes('Alpine');
    return true;
  });

  return (
    <section id="packages" className="py-12 sm:py-16 lg:py-24 bg-[#FFFFFF] dark:bg-[#0A0706] text-[#2A1810] dark:text-white border-b border-[#EADFD5] dark:border-white/10 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] text-xs font-bold uppercase tracking-widest border border-[#DFD0C0]/80 dark:border-white/10 backdrop-blur-md shadow-xs">
              <Ticket className="w-3.5 h-3.5" />
              <span>Popular packages</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white">
              Curated journeys <span className="italic font-serif text-[#8C5528] dark:text-[#E28C38] font-normal">ready to personalise</span>
            </h2>

            <p className="text-[#594336] dark:text-[#D1C2B8] text-sm sm:text-base leading-relaxed font-normal">
              Proven itineraries designed for discerning travelers. Every package can be modified, upgraded, and reshuffled to match your exact dates and preferences.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs backdrop-blur-md ${
                  activeFilter === f
                    ? 'bg-[#8C5528] dark:bg-[#C87428] text-white shadow-md'
                    : 'bg-white/80 dark:bg-[#16100D]/80 text-[#6E4424] dark:text-[#D4A276] hover:bg-[#A0683B]/10 dark:hover:bg-[#B36D33]/15 border border-[#DFD0C0] dark:border-[#B36D33]/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 hover:border-[#8C5528]/60 dark:hover:border-[#E28C38]/60 transition-all duration-500 overflow-hidden flex flex-col justify-between group shadow-[0_4px_20px_rgba(42,24,16,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 relative"
            >
              <div>
                {/* Image & Badges with Glassmorphic Skeleton */}
                <div className="relative h-56 overflow-hidden w-full">
                  <GlassImage
                    src={pkg.image}
                    alt={pkg.title}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0706]/90 via-[#0A0706]/20 to-transparent pointer-events-none" />

                  {/* Secondary Brown Tag Pill */}
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

                  {/* Destination Overlay */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-[#FAF7F2] font-medium z-10">
                    <Plane className="w-3.5 h-3.5 text-[#E28C38] -rotate-45" />
                    <span>{pkg.destination}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#2A1810] dark:text-white group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] transition-colors">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[#A0683B] dark:text-[#D4A276] font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#8C5528] dark:text-[#E28C38]" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  {/* 4 Feature Bullet Points */}
                  <ul className="space-y-2 py-2 border-t border-b border-[#EADFD5]/80 dark:border-white/10">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#594336] dark:text-[#DFD0C0]">
                        <Check className="w-4 h-4 text-[#A0683B] dark:text-[#D4A276] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price Tag with Boarding Pass Aesthetic */}
                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-[#A0683B] dark:text-[#D4A276] uppercase tracking-widest block font-bold">Investment</span>
                      <span className="text-xs text-[#8C7769] dark:text-neutral-400 uppercase tracking-wider font-medium">Starting at</span>
                    </div>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-[#8C5528] dark:text-[#E28C38]">
                      {pkg.startingPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions with Secondary Brown Itinerary Button */}
              <div className="px-6 pb-6 pt-2 border-t border-dashed border-[#EADFD5]/80 dark:border-white/15 flex items-center gap-3">
                <button
                  onClick={() => onViewPackageDetails(pkg)}
                  className="flex-1 py-2.5 rounded-xl bg-[#A0683B]/10 dark:bg-[#B36D33]/15 hover:bg-[#A0683B]/20 dark:hover:bg-[#B36D33]/25 text-[#A0683B] dark:text-[#D4A276] text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#A0683B]/30 dark:border-[#B36D33]/40"
                >
                  <Eye className="w-3.5 h-3.5 text-[#A0683B] dark:text-[#D4A276]" />
                  <span>Itinerary</span>
                </button>

                <button
                  onClick={() => onEnquirePackage(pkg)}
                  className="flex-1 py-2.5 rounded-xl bg-[#8C5528] dark:bg-[#C87428] hover:bg-[#72421D] dark:hover:bg-[#B86620] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#8C5528]/25 active:scale-98 border border-white/20"
                >
                  <span>Enquire</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
