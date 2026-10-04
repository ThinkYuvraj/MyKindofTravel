import React, { useState, useMemo } from 'react';
import { EXPERIENCE_PILLARS, DESTINATIONS, COMPANY_INFO } from '../data/travelData';
import { ExperiencePillar } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EnquiryModal } from '../components/EnquiryModal';
import { WishlistModal } from '../components/WishlistModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { Sparkles, Check, ArrowRight, Compass, Search, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EXTENDED_EXPERIENCES = [
  ...EXPERIENCE_PILLARS,
  {
    number: '07',
    title: 'Alpine Rail & Glacier Expeditions',
    subtitle: 'Panoramic mountain routes and top-of-the-world summits',
    description: 'First-class Glacier Express, Bernina Express, and Jungfraujoch cogwheel journeys carved across Swiss peaks, viaducts, and pristine alpine lakes.',
    ctaText: 'Explore rail trips',
    typeKey: 'Alpine Rail',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
    highlights: ['First-class panoramic glass dome seats', 'Matterhorn view chalet accommodations', 'Luggage transfer between Swiss stations', 'Private glacier guides & chocolate tasting'],
  },
  {
    number: '08',
    title: 'Michelin Dining & Private Wine Trails',
    subtitle: 'Epicurean journeys for discerning palates',
    description: 'After-hours access to Bordeaux vineyards, private Tuscan olive mills, and reserved chef’s tables facing iconic skylines in Paris and Tokyo.',
    ctaText: 'Discover gourmet',
    typeKey: 'Gourmet & Wine',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80',
    highlights: ['Private sommelier vineyard tastings', 'Eiffel Tower private terrace dinner', 'Truffle hunting in Piedmont', 'Michelin 3-star omakase dining in Kyoto'],
  },
];

export default function ExperiencesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryTripType, setEnquiryTripType] = useState('');

  const types = ['All', 'Honeymoon', 'Luxury Europe', 'Corporate', 'Family', 'Wellness', 'Rail', 'Gourmet'];

  const filtersWithCounts = useMemo(() => {
    return types.map((type) => {
      let count = 0;
      if (type === 'All') {
        count = EXTENDED_EXPERIENCES.length;
      } else {
        count = EXTENDED_EXPERIENCES.filter((exp) => {
          const text = (exp.title + ' ' + exp.typeKey).toLowerCase();
          return text.includes(type.toLowerCase());
        }).length;
      }
      return { label: type, count };
    });
  }, []);

  const filteredExperiences = useMemo(() => {
    return EXTENDED_EXPERIENCES.filter((exp) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        exp.title.toLowerCase().includes(q) ||
        exp.description.toLowerCase().includes(q) ||
        exp.highlights.some((h) => h.toLowerCase().includes(q));

      let matchesType = true;
      if (selectedType !== 'All') {
        const text = (exp.title + ' ' + exp.typeKey).toLowerCase();
        matchesType = text.includes(selectedType.toLowerCase());
      }

      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const handleStartPlanning = (tripType: string) => {
    setEnquiryTripType(tripType);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-black text-[#24130A] dark:text-white flex flex-col font-sans transition-colors duration-300">
      {/* Navbar */}
      <Navbar onPlanTrip={() => setIsEnquiryOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="section-container space-y-10">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111111] border border-[#E8DFD5] dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bespoke Travel Pillars</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#24130A] dark:text-white">
                Every Kind of <span className="italic font-serif text-[#E37500] font-normal">Extraordinary</span>
              </h1>
              <p className="text-sm sm:text-base text-[#6F5B4E] dark:text-[#C5B7AC] leading-relaxed">
                Whether you seek intimate honeymoon romance, multi-generational family ease, executive team retreats, or adrenaline in the Swiss Alps, explore our curated holiday pillars below.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/places')}
                className="px-5 py-2.5 rounded-full bg-white dark:bg-[#141414] hover:bg-neutral-100 dark:hover:bg-white/10 text-[#24130A] dark:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border border-[#E8DFD5] dark:border-white/10 shadow-xs"
              >
                <Compass className="w-4 h-4 text-[#E37500]" />
                <span>Explore Curated Places</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#0E0E0E] border border-[#E8DFD5] dark:border-white/10 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search experiences (e.g., honeymoon, villa, rail, corporate)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm text-[#24130A] dark:text-white placeholder-[#8C7667] focus:outline-none focus:ring-1 focus:ring-[#E37500]"
              />
            </div>

            {/* Filter Pills in continuous capsule */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 shadow-xs backdrop-blur-md overflow-x-auto no-scrollbar shrink-0">
              {filtersWithCounts.map((f) => {
                const isActive = selectedType === f.label;
                return (
                  <button
                    key={f.label}
                    onClick={() => setSelectedType(f.label)}
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
          </div>

          {/* Experiences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8">
            {filteredExperiences.map((exp) => (
              <div
                key={exp.number}
                className="rounded-3xl overflow-hidden bg-white dark:bg-[#0B0B0B] border border-[#E8DFD5] dark:border-white/10 shadow-[0_8px_30px_rgba(42,24,16,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative"
              >
                <div>
                  {/* Image with Pillar Number */}
                  {exp.image && (
                    <div className="relative w-full h-52 overflow-hidden border-b border-[#E8DFD5] dark:border-white/10">
                      <img
                        src={exp.image}
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute top-3.5 left-3.5 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md text-white font-serif font-bold text-xs border border-white/20">
                        {exp.number}
                      </div>
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#24130A] dark:text-white group-hover:text-[#E37500] transition-colors leading-snug">
                      {exp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6F5B4E] dark:text-[#C5B7AC] leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Highlights */}
                    <div className="pt-3 border-t border-[#E8DFD5] dark:border-white/10 space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#E37500] block">
                        Signature Highlights:
                      </span>
                      {exp.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#24130A] dark:text-[#E8DDD2]">
                          <div className="w-4 h-4 rounded-full bg-[#E37500]/10 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-[#E37500] stroke-[3]" />
                          </div>
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="p-6 sm:p-7 pt-0">
                  <button
                    onClick={() => handleStartPlanning(exp.typeKey)}
                    className="w-full py-3 rounded-full bg-[#E37500] hover:bg-[#C96400] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#E37500]/25 hover:scale-[1.02] active:scale-95"
                  >
                    <span>{exp.ctaText}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#24130A] via-[#351D12] to-[#1C1009] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Have a completely custom travel concept in mind?
              </h3>
              <p className="text-xs sm:text-sm text-[#D1C2B8] leading-relaxed">
                Our private concierge crafts unique itineraries blending multiple experiences, private aviation, and luxury villas.
              </p>
            </div>

            <button
              onClick={() => handleStartPlanning('Custom Itinerary')}
              className="px-8 py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#E37500]/30 transition-all shrink-0 active:scale-95"
            >
              <span>Design Your Blueprint</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </main>

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialTripType={enquiryTripType}
      />

      <WishlistModal />

      <Footer
        onNavigate={(path) => {
          if (path === 'destinations') navigate('/destinations');
          else if (path === 'packages') navigate('/packages');
          else if (path === 'places') navigate('/places');
          else if (path === 'stories') navigate('/stories');
          else if (path === 'contact') setIsEnquiryOpen(true);
          else navigate(`/#${path}`);
        }}
        onSelectDestination={(name) => {
          setIsEnquiryOpen(true);
        }}
        onSelectTripType={(type) => {
          setEnquiryTripType(type);
          setIsEnquiryOpen(true);
        }}
        onPlanTrip={() => setIsEnquiryOpen(true)}
      />

      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}
