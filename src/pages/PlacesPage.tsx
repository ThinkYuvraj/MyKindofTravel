import React, { useState, useMemo } from 'react';
import { GALLERY_ITEMS, DESTINATIONS, COMPANY_INFO } from '../data/travelData';
import { GalleryItem } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { EnquiryModal } from '../components/EnquiryModal';
import { WishlistModal } from '../components/WishlistModal';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { GlassImage } from '../components/GlassImage';
import { useWishlist } from '../context/WishlistContext';
import {
  Search,
  MapPin,
  Camera,
  Compass,
  ArrowUpRight,
  Heart,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ListFilter,
  SlidersHorizontal,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Comprehensive enriched places dataset
interface PlaceEntry extends GalleryItem {
  region: string;
  country: string;
  tag?: string;
  bestTime?: string;
}

const ALL_PLACES: PlaceEntry[] = [
  ...GALLERY_ITEMS.map((item) => {
    let region = 'Europe';
    let country = 'Europe';
    const locLower = item.location.toLowerCase();
    if (locLower.includes('maldives')) {
      region = 'Indian Ocean';
      country = 'Maldives';
    } else if (locLower.includes('bali') || locLower.includes('indonesia')) {
      region = 'Southeast Asia';
      country = 'Indonesia';
    } else if (locLower.includes('japan') || locLower.includes('kyoto')) {
      region = 'East Asia';
      country = 'Japan';
    } else if (locLower.includes('cappadocia') || locLower.includes('turkey')) {
      region = 'Europe & Asia';
      country = 'Turkey';
    } else if (locLower.includes('switzerland') || locLower.includes('zermatt')) {
      region = 'Europe';
      country = 'Switzerland';
    } else if (locLower.includes('france') || locLower.includes('paris')) {
      region = 'Europe';
      country = 'France';
    } else if (locLower.includes('italy') || locLower.includes('amalfi') || locLower.includes('positano') || locLower.includes('venice')) {
      region = 'Europe';
      country = 'Italy';
    } else if (locLower.includes('santorini') || locLower.includes('greece')) {
      region = 'Europe';
      country = 'Greece';
    } else if (locLower.includes('jet')) {
      region = 'Worldwide';
      country = 'Global';
    }

    return {
      ...item,
      region,
      country,
      tag: item.category,
      bestTime: 'Curated Year-Round',
    };
  }),
  // Extra curated signature places from destinations
  {
    id: 'place-jungfrau',
    title: 'Jungfraujoch Glacier Observatory',
    location: 'Interlaken, Switzerland',
    category: 'Journeys',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Top of Europe 3,454m cogwheel rail summit carving through eternal Aletsch glacier ice caves.',
    aspect: 'wide',
    region: 'Europe',
    country: 'Switzerland',
    tag: 'Alpine High Peak',
    bestTime: 'May to October',
  },
  {
    id: 'place-nusa-penida',
    title: 'Kelingking Secret Cove & T-Rex Ridge',
    location: 'Nusa Penida, Bali',
    category: 'Moments',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    caption: 'Cobalt ocean swells breaking against towering dinosaur-shaped sea cliffs and secluded turquoise bays.',
    aspect: 'tall',
    region: 'Southeast Asia',
    country: 'Indonesia',
    tag: 'Coastal Wonder',
    bestTime: 'April to October',
  },
  {
    id: 'place-louvre-night',
    title: 'Louvre Pyramids at Twilight',
    location: 'Paris, France',
    category: 'Moments',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Private after-dark stroll along illuminated glass courtyards without the daytime museum crowds.',
    aspect: 'wide',
    region: 'Europe',
    country: 'France',
    tag: 'Historic Landmark',
    bestTime: 'Year-Round',
  },
  {
    id: 'place-charles-bridge',
    title: 'Charles Bridge Gothic Twilight Walk',
    location: 'Prague, Czech Republic',
    category: 'Journeys',
    image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80',
    caption: 'Atmospheric cobblestone bridge adorned with 30 baroque saint statues overlooking Vltava river mist.',
    aspect: 'wide',
    region: 'Europe',
    country: 'Czech Republic',
    tag: 'Fairy Tale Europe',
    bestTime: 'May to September',
  },
];

const CATEGORIES = ['All', 'Stays', 'Journeys', 'Moments', 'Gourmet'];
const REGIONS = ['All', 'Europe', 'Southeast Asia', 'Indian Ocean', 'East Asia'];

export default function PlacesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryDestination, setEnquiryDestination] = useState('');
  const [enquiryTripType, setEnquiryTripType] = useState('');

  const { toggleDestinationWishlist, isDestinationSaved } = useWishlist();

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return ALL_PLACES.filter((place) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        place.title.toLowerCase().includes(q) ||
        place.location.toLowerCase().includes(q) ||
        place.country.toLowerCase().includes(q) ||
        (place.caption && place.caption.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'All' || place.category === selectedCategory;

      const matchesRegion =
        selectedRegion === 'All' || place.region === selectedRegion;

      return matchesSearch && matchesCat && matchesRegion;
    });
  }, [searchQuery, selectedCategory, selectedRegion]);

  const activePhoto =
    activeLightboxIndex !== null ? filteredPlaces[activeLightboxIndex] : null;

  const handleNext = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredPlaces.length);
    }
  };

  const handlePrev = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex(
        (activeLightboxIndex - 1 + filteredPlaces.length) % filteredPlaces.length
      );
    }
  };

  const handlePlanForPlace = (location: string) => {
    setEnquiryDestination(location);
    setIsEnquiryOpen(true);
    setActiveLightboxIndex(null);
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
                <Camera className="w-3.5 h-3.5" />
                <span>The Global Places Portfolio</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#24130A] dark:text-white">
                Curated Places & <span className="italic font-serif text-[#E37500] font-normal">Hideaways</span>
              </h1>
              <p className="text-sm sm:text-base text-[#6F5B4E] dark:text-[#C5B7AC] leading-relaxed">
                Discover our handpicked collection of cliffside infinity villas, private overwater bungalows, scenic glacier rail passages, and Michelin viewpoints across the world.
              </p>
            </div>

            {/* Quick stats or CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/destinations')}
                className="px-5 py-2.5 rounded-full bg-white dark:bg-[#141414] hover:bg-neutral-100 dark:hover:bg-white/10 text-[#24130A] dark:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border border-[#E8DFD5] dark:border-white/10 shadow-xs"
              >
                <Compass className="w-4 h-4 text-[#E37500]" />
                <span>Browse Full Itineraries</span>
              </button>
            </div>
          </div>

          {/* Search & Filters Control Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#0E0E0E] border border-[#E8DFD5] dark:border-white/10 shadow-xs">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C7667]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places by name, country, or experience (e.g., Maldives, Zermatt, villa)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm text-[#24130A] dark:text-white placeholder-[#8C7667] focus:outline-none focus:ring-1 focus:ring-[#E37500]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
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

            {/* Region Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0 border-t lg:border-t-0 lg:border-l border-[#E8DFD5] dark:border-white/10 pt-2 lg:pt-0 lg:pl-3">
              {REGIONS.map((region) => {
                const isActive = selectedRegion === region;
                return (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold'
                        : 'text-[#8C7667] dark:text-[#999999] hover:text-[#24130A] dark:hover:text-white'
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Places Grid */}
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {filteredPlaces.map((place, idx) => {
                const isSaved = isDestinationSaved(place.id);

                return (
                  <div
                    key={place.id}
                    onClick={() => setActiveLightboxIndex(idx)}
                    className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-[#0B0B0B] border border-[#E8DFD5] dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 shadow-[0_8px_30px_rgba(42,24,16,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col relative"
                  >
                    {/* Image */}
                    <div className="w-full aspect-[4/3] overflow-hidden relative bg-neutral-100 dark:bg-[#111111]">
                      <GlassImage
                        src={place.image}
                        alt={place.title}
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                        <span className="text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-md">
                          <ArrowUpRight className="w-4 h-4 text-[#E37500]" />
                          <span>View Full Photo</span>
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium border border-white/20">
                          {place.category}
                        </span>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-xs">
                          {place.category}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDestinationWishlist(place.id);
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

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-[#8C7667] dark:text-[#A7978A]">
                          <span className="flex items-center gap-1 font-semibold text-[#E37500]">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{place.location}</span>
                          </span>
                          <span className="text-[11px] text-neutral-400">{place.region}</span>
                        </div>

                        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#24130A] dark:text-white group-hover:text-[#E37500] transition-colors leading-snug">
                          {place.title}
                        </h3>

                        {place.caption && (
                          <p className="text-xs text-[#6F5B4E] dark:text-[#C5B7AC] line-clamp-2 leading-relaxed">
                            {place.caption}
                          </p>
                        )}
                      </div>

                      {/* Bottom action row */}
                      <div className="pt-3 border-t border-[#E8DFD5] dark:border-white/10 flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLightboxIndex(idx);
                          }}
                          className="text-xs font-semibold text-[#6F5B4E] dark:text-[#C5B7AC] hover:text-[#E37500] dark:hover:text-[#E37500] flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#E37500]" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlanForPlace(place.location);
                          }}
                          className="px-4 py-1.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:scale-105 active:scale-95"
                        >
                          Plan Here
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-[#0E0E0E] rounded-3xl border border-[#E8DFD5] dark:border-white/10 p-8 space-y-3">
              <Compass className="w-10 h-10 text-[#8C7667] mx-auto mb-2" />
              <h3 className="font-serif text-lg font-bold">No places found</h3>
              <p className="text-xs text-[#6F5B4E] dark:text-[#C5B7AC]">
                Try adjusting your search query or reset your category and region filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
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

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-white dark:bg-[#0A0A0A] border border-neutral-200 dark:border-white/10 shadow-2xl text-neutral-900 dark:text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all"
              aria-label="Close photo"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Nav Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Container */}
            <div className="w-full h-[50vh] sm:h-[62vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details Footer */}
            <div className="p-5 sm:p-6 bg-white dark:bg-[#0A0A0A] border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-[#A7978A] mb-1">
                  <span className="font-semibold text-[#E37500] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {activePhoto.location}
                  </span>
                  <span>·</span>
                  <span>{activePhoto.category}</span>
                  <span>·</span>
                  <span>{activePhoto.region}</span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                  {activePhoto.title}
                </h3>
                {activePhoto.caption && (
                  <p className="text-xs text-neutral-600 dark:text-[#C5B7AC] mt-1 max-w-xl">
                    {activePhoto.caption}
                  </p>
                )}
              </div>

              <button
                onClick={() => handlePlanForPlace(activePhoto.location)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
              >
                <span>Plan Trip Here</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialDestination={enquiryDestination}
        initialTripType={enquiryTripType}
      />

      {/* Wishlist Drawer */}
      <WishlistModal />

      {/* Footer */}
      <Footer
        onNavigate={(path) => {
          if (path === 'contact') setIsEnquiryOpen(true);
          else if (path === 'destinations') navigate('/destinations');
          else if (path === 'packages') navigate('/packages');
          else if (path === 'stories') navigate('/stories');
          else navigate(`/#${path}`);
        }}
        onSelectDestination={(name) => {
          setEnquiryDestination(name);
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
