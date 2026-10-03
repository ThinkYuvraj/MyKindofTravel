import React, { useState, useRef, useEffect } from 'react';
import { EXPERIENCE_PILLARS } from '../data/travelData';
import { ExperiencePillar } from '../types';
import { ArrowRight, Sparkles, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface ExperiencesSectionProps {
  pillars?: ExperiencePillar[];
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
  onPlanTripType: (tripType: string) => void;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({
  pillars,
  customBadge,
  customTitle,
  customSubtitle,
  onPlanTripType,
}) => {
  const activePillars = pillars && pillars.length > 0 ? pillars : EXPERIENCE_PILLARS;
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
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
  }, [viewMode, activePillars]);

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -380, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 380, behavior: 'smooth' });
  };

  return (
    <section id="experiences" className="py-12 sm:py-16 lg:py-24 bg-transparent text-[#2A1810] dark:text-white border-b border-[#C2B299]/40 dark:border-white/10 relative transition-colors duration-300">
      <div className="section-container">
        {/* Section Heading & Caret Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md text-[#2A1810] dark:text-[#E3BA91] text-xs font-bold uppercase tracking-widest border border-[#C2B299]/60 dark:border-white/10 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
              <span>{customBadge || 'What we curate'}</span>
            </div>

            {customTitle ? (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white">
                {customTitle}
              </h2>
            ) : (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white">
                Every kind of <span className="italic font-serif text-[#E37500] font-normal">extraordinary</span>
              </h2>
            )}

            <p className="text-[#3D2B22] dark:text-[#D1C2B8] text-base sm:text-lg leading-relaxed font-normal">
              {customSubtitle || 'Tailored journeys created for personal celebrations, multi-city cultural quests, executive gatherings, and spontaneous luxury getaways.'}
            </p>
          </div>

          {/* Caret Controls & Mode Switcher */}
          <div className="flex items-center gap-2 self-start lg:self-end">
            <div className="flex items-center bg-white/85 dark:bg-white/10 p-1 rounded-full border border-[#C2B299]/60 dark:border-white/10 shadow-xs">
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-[#E37500] text-white shadow-xs'
                    : 'text-[#4A3222] dark:text-neutral-300 hover:text-[#E37500]'
                }`}
                title="Caret Carousel"
              >
                Carousel
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#E37500] text-white shadow-xs'
                    : 'text-[#4A3222] dark:text-neutral-300 hover:text-[#E37500]'
                }`}
                title="Grid View"
              >
                Grid
              </button>
            </div>

            {viewMode === 'carousel' && (
              <div className="flex items-center gap-1.5 ml-1">
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#1C1410] border border-[#C2B299]/70 dark:border-white/20 text-[#2A1810] dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95"
                  aria-label="Previous experience"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#1C1410] border border-[#C2B299]/70 dark:border-white/20 text-[#2A1810] dark:text-white flex items-center justify-center hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs active:scale-95"
                  aria-label="Next experience"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 6 Experience Cards Carousel / Grid */}
        <div
          ref={carouselRef}
          className={
            viewMode === 'carousel'
              ? 'flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth no-scrollbar'
              : 'content-grid sm:gap-8'
          }
        >
          {activePillars.map((exp) => (
            <div
              key={exp.number}
              className={`rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-[#16100D]/90 border border-white/80 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-[0_6px_25px_rgba(42,24,16,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 relative ${
                viewMode === 'carousel' ? 'shrink-0 w-[85vw] sm:w-[360px] lg:w-[390px] snap-start' : ''
              }`}
            >
              {/* Pillar Image Header */}
              {exp.image && (
                <div className="relative w-full h-44 overflow-hidden border-b border-[#C2B299]/30 dark:border-white/10">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-3 left-3 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md text-white font-serif font-bold text-xs border border-white/20">
                    {exp.number}
                  </div>
                </div>
              )}

              {/* Background Ambient Number Accent if no image */}
              {!exp.image && (
                <span className="absolute -top-4 -right-2 font-serif text-8xl font-bold text-[#C2B299]/30 dark:text-white/5 select-none pointer-events-none group-hover:text-[#E37500]/15 transition-colors">
                  {exp.number}
                </span>
              )}

              <div className="p-6 sm:p-7 md:p-8 flex-1 flex flex-col justify-between space-y-4 relative z-10">
                <div className="space-y-3.5">
                  {!exp.image && (
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-white/10 text-[#E37500] font-serif font-bold text-sm border border-[#C2B299]/60 dark:border-white/10 shadow-xs">
                      {exp.number}
                    </div>
                  )}

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1810] dark:text-white group-hover:text-[#E37500] transition-colors">
                    {exp.title}
                  </h3>

                  <p className="text-[#4A3222] dark:text-[#D1C2B8] text-sm leading-relaxed font-normal">
                    {exp.description}
                  </p>

                  {/* Micro Highlights */}
                  <div className="pt-2 space-y-1.5 border-t border-[#C2B299]/30 dark:border-white/10">
                    {exp.highlights.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#523B2D] dark:text-[#DFD0C0]">
                        <Check className="w-3.5 h-3.5 text-[#E37500] shrink-0" />
                        <span className="truncate font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Link with #E37500 */}
                <div className="pt-4 relative z-10">
                  <button
                    onClick={() => onPlanTripType(exp.typeKey)}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E37500] hover:text-[#C66500] transition-colors group/link"
                  >
                    <span>{exp.ctaText}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
