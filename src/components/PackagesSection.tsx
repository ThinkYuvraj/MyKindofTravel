import React, { useState } from 'react';
import { POPULAR_PACKAGES } from '../data/travelData';
import { TravelPackage } from '../types';
import { Sparkles, Check, ArrowRight, Eye, Clock, MapPin } from 'lucide-react';

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
    <section id="packages" className="py-20 lg:py-28 bg-[#161614] text-white border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold uppercase tracking-widest border border-amber-500/25">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Popular packages</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Curated journeys <span className="italic font-serif text-amber-300 font-normal">ready to personalise</span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Proven itineraries designed for discerning travelers. Every package can be modified, upgraded, and reshuffled to match your exact dates and preferences.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === f
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-900/40'
                    : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800 hover:border-stone-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:shadow-amber-950/20 relative"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-transparent" />

                  {/* Tag Pill */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-md bg-stone-950/80 backdrop-blur-md text-amber-300 text-[11px] uppercase tracking-wider font-bold border border-amber-500/30">
                      {pkg.tag}
                    </span>
                    {pkg.badge && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 text-[11px] font-extrabold uppercase tracking-wider">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  {/* Destination Overlay */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-stone-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{pkg.destination}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-stone-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  {/* 4 Feature Bullet Points */}
                  <ul className="space-y-2 py-2 border-t border-b border-stone-800">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-stone-300">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price Tag */}
                  <div className="pt-1 flex items-baseline justify-between">
                    <span className="text-xs text-stone-400 uppercase tracking-wider">Starting at</span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-amber-400">
                      {pkg.startingPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 pb-6 pt-2 flex items-center gap-3">
                <button
                  onClick={() => onViewPackageDetails(pkg)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-stone-700"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Itinerary</span>
                </button>

                <button
                  onClick={() => onEnquirePackage(pkg)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
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
