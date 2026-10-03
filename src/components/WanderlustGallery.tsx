import React, { useState, useEffect } from 'react';
import { GALLERY_ITEMS } from '../data/travelData';
import { GalleryItem } from '../types';
import { Camera, MapPin, X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface WanderlustGalleryProps {
  items?: GalleryItem[];
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
  onPlanTripForLocation?: (location: string) => void;
}

export const WanderlustGallery: React.FC<WanderlustGalleryProps> = ({
  items,
  customBadge,
  customTitle,
  customSubtitle,
  onPlanTripForLocation,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Stays', 'Journeys', 'Moments', 'Gourmet'];
  const sourceItems = items && items.length > 0 ? items : GALLERY_ITEMS;

  const filteredItems =
    activeCategory === 'All'
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
    <section id="gallery" className="py-20 sm:py-24 bg-white dark:bg-black relative overflow-hidden transition-colors duration-300">
      <div className="section-container relative z-10">
        
        {/* Section Header: Clean & Uncluttered */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest mb-3 shadow-xs">
              <Camera className="w-3.5 h-3.5" />
              <span>{customBadge || 'Moments & Memories'}</span>
            </div>
            {customTitle ? (
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                {customTitle}
              </h2>
            ) : (
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                Curated by Us, <br className="hidden sm:inline" />
                <span className="text-[#E37500] italic font-normal">Experienced by You</span>
              </h2>
            )}
          </div>

          <p className="max-w-md text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {customSubtitle || 'Real travel snapshots captured across our private chalets, cliffside villas, overwater bungalows, and bespoke European journeys.'}
          </p>
        </div>

        {/* Minimalist Tactile Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-[#111111] rounded-2xl w-fit mb-8 overflow-x-auto no-scrollbar shadow-xs">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-[#222222] text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Harmonized, Clean Editorial Grid (No awkward chaotic bento spans) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => setActiveLightboxIndex(idx)}
              className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col"
            >
              {/* Image Frame with Clean Aspect Ratio */}
              <div className="w-full aspect-[4/3] overflow-hidden relative bg-neutral-100 dark:bg-[#111111]">
                <GlassImage
                  src={item.image}
                  alt={item.title}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-md">
                    <ArrowUpRight className="w-4 h-4 text-[#E37500]" />
                    <span>View Photo</span>
                  </span>
                </div>
              </div>

              {/* Clean Uncluttered Typography Footer */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-[#A7978A]">
                  <span className="flex items-center gap-1 font-medium text-[#E37500]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </span>
                  <span>{item.category}</span>
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-snug">
                  {item.title}
                </h3>

                {item.caption && (
                  <p className="text-xs text-neutral-600 dark:text-[#C5B7AC] line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sleek Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
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
              aria-label="Close image preview"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Nav Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Image Container */}
            <div className="w-full h-[50vh] sm:h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Details Footer */}
            <div className="p-4 sm:p-6 bg-white dark:bg-[#0A0A0A] border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-[#A7978A] mb-1">
                  <span className="font-semibold text-[#E37500] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {activePhoto.location}
                  </span>
                  <span>·</span>
                  <span>{activePhoto.category}</span>
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

              {onPlanTripForLocation && (
                <button
                  onClick={() => {
                    onPlanTripForLocation(activePhoto.location);
                    setActiveLightboxIndex(null);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
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
