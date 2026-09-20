import React, { useState, useEffect } from 'react';
import { GALLERY_ITEMS } from '../data/travelData';
import { GalleryItem } from '../types';
import { Camera, MapPin, Sparkles, X, ChevronLeft, ChevronRight, Eye, ArrowUpRight } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface WanderlustGalleryProps {
  items?: GalleryItem[];
  onPlanTripForLocation?: (location: string) => void;
}

export const WanderlustGallery: React.FC<WanderlustGalleryProps> = ({
  items,
  onPlanTripForLocation,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Stays', 'Journeys', 'Moments', 'Gourmet'];

  const sourceItems = (items && items.length > 0) ? items : GALLERY_ITEMS;

  const filteredItems = activeCategory === 'All'
    ? sourceItems
    : sourceItems.filter((item) => item.category === activeCategory);

  const activePhoto = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handleNext = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeLightboxIndex, filteredItems.length]);

  return (
    <section id="gallery" className="py-20 sm:py-28 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient lighting orbs for glassmorphism */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[#8C5528]/10 dark:bg-[#D47A2A]/10 blur-3xl pointer-events-none animate-ambient-glow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#C5A059]/10 dark:bg-[#C87428]/10 blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-[#EADFD5]/80 dark:border-white/15 text-[#8C5528] dark:text-[#E28C38] text-xs font-bold uppercase tracking-widest mb-3 shadow-xs">
              <Camera className="w-3.5 h-3.5" />
              <span>Visual Wanderlust & Real Moments</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white leading-[1.15]">
              Curated by Us, <br className="hidden sm:inline" />
              <span className="text-[#8C5528] dark:text-[#E28C38] italic font-normal">Experienced by You</span>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base text-[#594336] dark:text-[#D1C2B8] leading-relaxed">
            Real snapshots from the destinations, private chalets, overwater lagoons, and bespoke journeys we craft for our travelers.
          </p>
        </div>

        {/* Modern Glassmorphic Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap backdrop-blur-md ${
                  isActive
                    ? 'bg-[#8C5528] dark:bg-[#C87428] text-white shadow-md shadow-[#8C5528]/25 scale-105 border border-transparent'
                    : 'bg-white/70 dark:bg-[#16100D]/70 hover:bg-[#A0683B]/10 dark:hover:bg-[#B36D33]/15 text-[#6E4424] dark:text-[#D4A276] border border-[#DFD0C0] dark:border-[#B36D33]/30'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Modernistic Bento Mosaic Grid with Glassmorphic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredItems.map((item, idx) => {
            const isFeatured = idx === 0 || idx === 4;
            return (
              <div
                key={item.id}
                onClick={() => setActiveLightboxIndex(idx)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-1.5 backdrop-blur-xl bg-white/70 dark:bg-[#16100D]/75 border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgba(42,24,16,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${
                  isFeatured ? 'sm:col-span-2 sm:row-span-2' : 'col-span-1'
                }`}
              >
                {/* Image Container with Glassmorphic Skeleton to prevent layout shifts */}
                <div className={`w-full overflow-hidden relative ${isFeatured ? 'h-72 sm:h-[420px]' : 'h-64 sm:h-72'}`}>
                  <GlassImage
                    src={item.image}
                    alt={item.title}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0706]/85 via-[#0A0706]/25 to-transparent opacity-75 group-hover:opacity-90 transition-opacity pointer-events-none" />

                  {/* Top Glass Category Pill with Secondary Brown border */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md text-white border border-white/20 shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Top Right Quick View Icon */}
                  <div className="absolute top-3.5 right-3.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-md">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom Content Card (Glassmorphic Tray) */}
                  <div className="absolute bottom-3 inset-x-3 p-3.5 sm:p-4 rounded-xl backdrop-blur-xl bg-black/45 dark:bg-black/65 border border-white/20 text-white transition-all duration-300 z-10">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#E28C38] font-semibold mb-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-[#F3D7BD] transition-colors leading-snug truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-1 mt-1 font-normal">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modern Glassmorphic Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-fade-in"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-[#16100D]/90 backdrop-blur-2xl border border-white/20 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#8C5528] text-white border border-white/20 flex items-center justify-center transition-all"
              aria-label="Close image preview"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Lightbox Navigation */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-[#8C5528] text-white border border-white/20 flex items-center justify-center transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-[#8C5528] text-white border border-white/20 flex items-center justify-center transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Image with Glassmorphic Skeleton */}
            <div className="w-full max-h-[60vh] sm:max-h-[65vh] h-[45vh] sm:h-[55vh] overflow-hidden bg-black flex items-center justify-center">
              <GlassImage
                src={activePhoto.image}
                alt={activePhoto.title}
                containerClassName="w-full h-full"
                className="w-full h-full max-h-[65vh] object-contain"
                priority={true}
              />
            </div>

            {/* Details Footer with Secondary Brown Accents */}
            <div className="p-4 sm:p-6 bg-[#16100D] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#A0683B] dark:bg-[#B36D33] text-white">
                    {activePhoto.category}
                  </span>
                  <span className="text-xs text-[#E28C38] flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {activePhoto.location}
                  </span>
                  <span className="text-[11px] text-white/50 ml-2 hidden sm:inline">
                    {activeLightboxIndex + 1} of {filteredItems.length} • ← / → to browse
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-white">
                  {activePhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#D4A276] mt-0.5 sm:mt-1 max-w-xl">
                  {activePhoto.caption}
                </p>
              </div>

              {onPlanTripForLocation && (
                <button
                  onClick={() => {
                    onPlanTripForLocation(activePhoto.location);
                    setActiveLightboxIndex(null);
                  }}
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#8C5528] hover:bg-[#70421D] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#8C5528]/30 transition-all"
                >
                  <span>Experience This</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
