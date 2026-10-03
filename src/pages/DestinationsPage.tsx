import React, { useState, useMemo } from 'react';
import { DESTINATIONS } from '../data/travelData';
import { DestinationItem } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DestinationModal } from '../components/DestinationModal';
import { EnquiryModal } from '../components/EnquiryModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { GlassImage } from '../components/GlassImage';
import { useWishlist } from '../context/WishlistContext';
import { WishlistModal } from '../components/WishlistModal';
import { Search, MapPin, Clock, Sparkles, ArrowUpRight, Heart, Filter, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DESTINATION_META: Record<string, { code: string; flightTime: string }> = {
  bali: { code: 'DPS', flightTime: '8h 45m · 1-Stop' },
  paris: { code: 'CDG', flightTime: '9h 15m · Direct' },
  switzerland: { code: 'ZRH', flightTime: '8h 30m · Direct' },
  santorini: { code: 'JTR', flightTime: '10h 30m · 1-Stop' },
  maldives: { code: 'MLE', flightTime: '2h 45m · Direct' },
  amalfi: { code: 'NAP', flightTime: '9h 40m · 1-Stop' },
  kyoto: { code: 'HND', flightTime: '8h 20m · Direct' },
  cappadocia: { code: 'NAV', flightTime: '8h 15m · 1-Stop' },
  prague: { code: 'PRG', flightTime: '9h 50m · 1-Stop' },
};

const REGIONS = ['All', 'Europe', 'Southeast Asia', 'Islands & Beaches', 'East Asia'];

export default function DestinationsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
  const [enquiryDestination, setEnquiryDestination] = useState('');
  const [enquiryTripType, setEnquiryTripType] = useState('');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const { toggleDestinationWishlist, isDestinationSaved } = useWishlist();

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesRegion = true;
      if (selectedRegion === 'Europe') {
        matchesRegion = ['France', 'Switzerland', 'Greece', 'Italy', 'Czech Republic'].includes(item.country);
      } else if (selectedRegion === 'Southeast Asia') {
        matchesRegion = item.country === 'Indonesia';
      } else if (selectedRegion === 'Islands & Beaches') {
        matchesRegion = ['Maldives', 'Indonesia', 'Greece'].includes(item.country);
      } else if (selectedRegion === 'East Asia') {
        matchesRegion = ['Japan'].includes(item.country);
      }

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  const handleEnquire = (destName: string) => {
    setEnquiryDestination(destName);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-black text-[#24130A] dark:text-white flex flex-col font-sans transition-colors duration-300">
      {/* Floating Navbar */}
      <Navbar onPlanTrip={() => setIsEnquiryOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="section-container space-y-10">
          
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111111] border border-[#E8DFD5] dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
              <Compass className="w-3.5 h-3.5" />
              <span>Worldwide Luxury Blueprints</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#24130A] dark:text-white">
              Handcrafted <span className="italic font-serif text-[#E37500] font-normal">Destinations</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6F5B4E] dark:text-[#C5B7AC] leading-relaxed">
              Explore our portfolio of private chalets, overwater lagoons, clifftop villas, and iconic scenic routes. Every destination is fully customizable around your schedule and travel rhythm.
            </p>
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
                placeholder="Search by city, country, or vibe (e.g. Bali, Alps, romantic)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm text-[#24130A] dark:text-white placeholder-[#8C7667] focus:outline-none focus:ring-1 focus:ring-[#E37500]"
              />
            </div>

            {/* Region Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {REGIONS.map((region) => {
                const isActive = selectedRegion === region;
                return (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#E37500] text-white shadow-xs'
                        : 'text-[#6F5B4E] dark:text-[#A7978A] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Destinations Grid */}
          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredDestinations.map((dest) => {
                const meta = DESTINATION_META[dest.id] || { code: 'Direct', flightTime: 'Curated Route' };
                const isSaved = isDestinationSaved(dest.id);

                return (
                  <div
                    key={dest.id}
                    className="group rounded-3xl overflow-hidden bg-white dark:bg-[#0B0B0B] border border-[#E8DFD5] dark:border-white/10 shadow-[0_8px_30px_rgba(42,24,16,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative"
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden w-full">
                      <GlassImage
                        src={dest.image}
                        alt={dest.name}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0706]/90 via-[#0A0706]/25 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium border border-white/20 flex items-center gap-1.5 shadow-xs">
                          <Clock className="w-3 h-3 text-[#E37500]" />
                          <span>{meta.flightTime}</span>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDestinationWishlist(dest.id);
                            }}
                            className={`p-1.5 rounded-full backdrop-blur-md border border-white/20 transition-all ${
                              isSaved
                                ? 'bg-[#E37500] text-white'
                                : 'bg-black/50 text-white hover:bg-black/75'
                            }`}
                            title={isSaved ? 'Remove from shortlist' : 'Save to shortlist'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                          </button>

                          <span className="px-2.5 py-1 rounded-full bg-[#E37500] text-white text-[11px] font-bold shadow-md shadow-[#E37500]/30 border border-white/20 shrink-0 whitespace-nowrap">
                            {dest.priceNote.replace('Starting from ', 'From ')}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Overlay Title */}
                      <div className="absolute bottom-3.5 left-4 right-4 z-10">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#E3BA91] drop-shadow-sm block mb-0.5">
                          {dest.tag || dest.region}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#F3D7BD] transition-colors leading-tight">
                          {dest.name}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-[#594336] dark:text-[#C5B7AC] text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {dest.description}
                      </p>

                      {/* Inclusions */}
                      <div className="space-y-1.5 pt-3 border-t border-[#E8DFD5] dark:border-white/10">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#24130A] dark:text-[#E8DDD2]">
                          <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
                          <span>Signature Inclusions:</span>
                        </div>
                        <ul className="space-y-1 text-xs text-[#6F5B4E] dark:text-[#C5B7AC]">
                          {(dest.highlights || []).slice(0, 2).map((hl, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#E37500] shrink-0" />
                              <span className="truncate">{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Bottom Actions */}
                      <div className="pt-3.5 flex items-center justify-between gap-3 border-t border-[#E8DFD5] dark:border-white/10">
                        <button
                          onClick={() => setSelectedDestination(dest)}
                          className="text-xs font-semibold text-[#6F5B4E] dark:text-[#C5B7AC] hover:text-[#E37500] dark:hover:text-[#E37500] flex items-center gap-1 group/btn transition-colors"
                        >
                          <span>View Itinerary</span>
                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-[#E37500]" />
                        </button>

                        <button
                          onClick={() => handleEnquire(dest.name)}
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
          ) : (
            <div className="text-center py-20 bg-white dark:bg-[#0E0E0E] rounded-3xl border border-[#E8DFD5] dark:border-white/10 p-8">
              <Compass className="w-10 h-10 text-[#8C7667] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold">No destinations found</h3>
              <p className="text-xs text-[#6F5B4E] dark:text-[#C5B7AC] mt-1 mb-4">
                Try searching for a different country, or reset your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRegion('All');
                }}
                className="px-5 py-2 rounded-full bg-[#E37500] text-white text-xs font-bold uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Destination Modal */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onEnquire={(name) => {
            setSelectedDestination(null);
            handleEnquire(name);
          }}
        />
      )}

      {/* Popup Enquiry Card */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialDestination={enquiryDestination}
        initialTripType={enquiryTripType}
      />

      {/* Wishlist Drawer */}
      <WishlistModal />

      <Footer
        onNavigate={(path) => {
          if (path === 'contact') setIsEnquiryOpen(true);
          else if (path === 'packages') navigate('/packages');
          else if (path === 'stories') navigate('/stories');
          else navigate(`/#${path}`);
        }}
        onSelectDestination={(name) => handleEnquire(name)}
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
