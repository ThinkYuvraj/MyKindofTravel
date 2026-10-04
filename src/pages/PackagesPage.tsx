import React, { useState, useMemo } from 'react';
import { POPULAR_PACKAGES } from '../data/travelData';
import { TravelPackage } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PackageModal } from '../components/PackageModal';
import { EnquiryModal } from '../components/EnquiryModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { GlassImage } from '../components/GlassImage';
import { useWishlist } from '../context/WishlistContext';
import { WishlistModal } from '../components/WishlistModal';
import { Search, Clock, Check, Plane, Heart, Eye, ArrowRight, Ticket, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Honeymoon', 'Alpine Luxury', 'Scenic Rail', 'Cultural & Heritage', 'Tropical & Beach'];

export default function PackagesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [enquiryDestination, setEnquiryDestination] = useState('');
  const [enquiryTripType, setEnquiryTripType] = useState('');
  const [enquiryPackageName, setEnquiryPackageName] = useState('');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const { togglePackageWishlist, isPackageSaved } = useWishlist();

  const filteredPackages = useMemo(() => {
    return POPULAR_PACKAGES.filter((pkg) => {
      const matchesSearch =
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.tag && pkg.tag.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesCategory = true;
      if (selectedCategory === 'Honeymoon') {
        matchesCategory = pkg.tag.toLowerCase().includes('honeymoon') || pkg.title.toLowerCase().includes('honeymoon') || pkg.destination.includes('Santorini') || pkg.destination.includes('Maldives');
      } else if (selectedCategory === 'Alpine Luxury') {
        matchesCategory = pkg.destination.includes('Switzerland') || pkg.tag.toLowerCase().includes('alpine');
      } else if (selectedCategory === 'Scenic Rail') {
        matchesCategory = pkg.title.toLowerCase().includes('rail') || pkg.features.some(f => f.toLowerCase().includes('train') || f.toLowerCase().includes('rail'));
      } else if (selectedCategory === 'Cultural & Heritage') {
        matchesCategory = pkg.destination.includes('Paris') || pkg.destination.includes('Prague') || pkg.destination.includes('Kyoto');
      } else if (selectedCategory === 'Tropical & Beach') {
        matchesCategory = pkg.destination.includes('Bali') || pkg.destination.includes('Maldives');
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleEnquire = (pkg: TravelPackage) => {
    setEnquiryDestination(pkg.destination);
    setEnquiryTripType(pkg.tag.includes('Honeymoon') ? 'Honeymoon' : 'Luxury Europe Tour');
    setEnquiryPackageName(pkg.title);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-black text-[#24130A] dark:text-white flex flex-col font-sans transition-colors duration-300">
      <Navbar onPlanTrip={() => setIsEnquiryOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="section-container space-y-10">
          
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111111] border border-[#E8DFD5] dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
              <Ticket className="w-3.5 h-3.5" />
              <span>Proven Luxury Itineraries</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#24130A] dark:text-white">
              Curated <span className="italic font-serif text-[#E37500] font-normal">Travel Packages</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6F5B4E] dark:text-[#C5B7AC] leading-relaxed">
              Every package is an insider blueprint crafted with private transfers, boutique 5-star suites, and handpicked local moments. Fully flexible to your dates and preferences.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#0E0E0E] border border-[#E8DFD5] dark:border-white/10 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages (e.g. Swiss Glacier, Maldives Lagoon, Paris Chic)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm text-[#24130A] dark:text-white placeholder-[#8C7667] focus:outline-none focus:ring-1 focus:ring-[#E37500]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#E37500] text-white shadow-xs'
                        : 'text-[#6F5B4E] dark:text-[#A7978A] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Packages Grid */}
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredPackages.map((pkg) => {
                const isSaved = isPackageSaved(pkg.id);

                return (
                  <div
                    key={pkg.id}
                    className="group rounded-3xl overflow-hidden bg-white dark:bg-[#0B0B0B] border border-[#E8DFD5] dark:border-white/10 shadow-[0_8px_30px_rgba(42,24,16,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image Header */}
                    <div>
                      <div className="relative h-60 overflow-hidden w-full">
                        <GlassImage
                          src={pkg.image}
                          alt={pkg.title}
                          containerClassName="w-full h-full"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0706]/90 via-[#0A0706]/20 to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-end gap-2 z-10">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePackageWishlist(pkg.id);
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
                          </div>
                        </div>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-[#FAF7F2] font-medium z-10">
                          <Plane className="w-3.5 h-3.5 text-[#E37500] -rotate-45" />
                          <span>{pkg.destination}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6 space-y-3.5">
                        <div className="flex items-center gap-1 text-xs text-[#E37500] font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{pkg.duration}</span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#24130A] dark:text-white group-hover:text-[#E37500] transition-colors leading-snug">
                          {pkg.title}
                        </h3>
                        <p className="text-xs text-[#6F5B4E] dark:text-[#C5B7AC] font-normal leading-relaxed line-clamp-2">
                          {pkg.subtitle}
                        </p>

                        {/* Features Bullet List */}
                        <div className="space-y-2 pt-3 border-t border-[#E8DFD5] dark:border-white/10">
                          {pkg.features.slice(0, 3).map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#594336] dark:text-[#C5B7AC]">
                              <div className="w-4 h-4 rounded-full bg-[#E37500]/15 dark:bg-[#E37500]/25 flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 text-[#E37500] stroke-[3]" />
                              </div>
                              <span className="truncate font-medium">{feat}</span>
                            </div>
                          ))}
                        </div>

                        {/* Pricing */}
                        <div className="pt-2">
                          <span className="text-[11px] text-[#8C7667] dark:text-[#A7978A] block font-medium">Starting from</span>
                          <span className="text-xl sm:text-2xl font-bold font-serif text-[#24130A] dark:text-white tracking-tight">
                            {pkg.startingPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#E8DFD5] dark:border-white/10 flex items-center gap-3">
                      <button
                        onClick={() => setSelectedPackage(pkg)}
                        className="flex-1 py-2.5 rounded-full bg-white dark:bg-[#141414] hover:bg-[#FAF7F2] text-[#24130A] dark:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-[#E8DFD5] dark:border-white/20 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#E37500]" />
                        <span>Itinerary</span>
                      </button>

                      <button
                        onClick={() => handleEnquire(pkg)}
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
            <div className="text-center py-20 bg-white dark:bg-[#0E0E0E] rounded-3xl border border-[#E8DFD5] dark:border-white/10 p-8">
              <Compass className="w-10 h-10 text-[#8C7667] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold">No packages match your search</h3>
              <p className="text-xs text-[#6F5B4E] dark:text-[#C5B7AC] mt-1 mb-4">
                Try resetting your filters or search keywords.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2 rounded-full bg-[#E37500] text-white text-xs font-bold uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Package Modal */}
      {selectedPackage && (
        <PackageModal
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onCustomise={(pkg) => {
            setSelectedPackage(null);
            handleEnquire(pkg);
          }}
        />
      )}

      {/* Popup Enquiry Card */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialDestination={enquiryDestination}
        initialTripType={enquiryTripType}
        initialPackageName={enquiryPackageName}
      />

      {/* Wishlist Drawer */}
      <WishlistModal />

      <Footer
        onNavigate={(path) => {
          if (path === 'contact') setIsEnquiryOpen(true);
          else if (path === 'destinations') navigate('/destinations');
          else if (path === 'places') navigate('/places');
          else if (path === 'stories') navigate('/stories');
          else navigate(`/#${path}`);
        }}
        onSelectDestination={(name) => {
          setEnquiryDestination(name);
          setEnquiryPackageName('');
          setIsEnquiryOpen(true);
        }}
        onSelectTripType={(type) => {
          setEnquiryTripType(type);
          setEnquiryPackageName('');
          setIsEnquiryOpen(true);
        }}
        onPlanTrip={() => setIsEnquiryOpen(true)}
      />

      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}
