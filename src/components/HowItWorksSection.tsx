import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/travelData';
import { Compass, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onStartPlanning: () => void;
  steps?: typeof HOW_IT_WORKS_STEPS;
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onStartPlanning,
  steps,
  customBadge,
  customTitle,
  customSubtitle,
}) => {
  const activeSteps = steps && steps.length > 0 ? steps : HOW_IT_WORKS_STEPS;
  const N = activeSteps.length;

  // Tripled items array for seamless infinite sliding in both directions
  const extendedSteps = [...activeSteps, ...activeSteps, ...activeSteps];

  // Start in the middle section (index N)
  const [currentIndex, setCurrentIndex] = useState<number>(N);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [itemsPerView, setItemsPerView] = useState<number>(3);

  // Responsive items-per-view tracking
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Seamless infinite repositioning when transition ends
  const handleTransitionEnd = () => {
    if (currentIndex >= 2 * N) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - N);
    } else if (currentIndex < N) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + N);
    }
  };

  // Re-enable transition after instantaneous repositioning
  useEffect(() => {
    if (!isTransitioning) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isTransitioning]);

  // Auto-swipe functionality: auto-slides smoothly every 3.5s unless hovered or dragging
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  // Touch & pointer swipe drag support
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 40) {
      if (touchDeltaX.current < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setIsPaused(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPaused(true);
    setIsDragging(true);
    touchStartX.current = e.clientX;
    touchDeltaX.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && touchStartX.current !== null) {
      touchDeltaX.current = e.clientX - touchStartX.current;
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      if (Math.abs(touchDeltaX.current) > 50) {
        if (touchDeltaX.current < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
      setIsDragging(false);
      touchStartX.current = null;
      touchDeltaX.current = 0;
      setIsPaused(false);
    }
  };

  // Determine current active step (0 to N-1) for indicators
  const activeDotIndex = ((currentIndex % N) + N) % N;

  const handleSelectDot = (targetIdx: number) => {
    setIsTransitioning(true);
    setCurrentIndex(N + targetIdx);
  };

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 lg:py-24 bg-transparent text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 relative transition-colors duration-300"
    >
      <div className="section-container relative">
        {/* Section Header */}
        <div className="mb-12">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-widest border border-neutral-200 dark:border-white/10 backdrop-blur-md shadow-xs">
              <Compass className="w-3.5 h-3.5 text-[#E37500]" />
              <span>{customBadge || 'How it works'}</span>
            </div>

            {customTitle ? (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {customTitle}
              </h2>
            ) : (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                From dream to <span className="italic font-serif text-[#E37500] font-normal">departure</span>
              </h2>
            )}

            <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
              {customSubtitle ||
                'A simple, seamless process from your first call to your flight home. We handle every detail — you handle the excitement.'}
            </p>
          </div>
        </div>

        {/* Interactive Caret Carousel Container with Side Floating Carets on tablet/desktop */}
        <div className="relative group/carousel">
          {/* Floating Left Side Caret */}
          <button
            onClick={handlePrev}
            className="hidden sm:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-[#111111]/95 border border-neutral-200 dark:border-white/20 text-neutral-900 dark:text-white hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all items-center justify-center shadow-lg active:scale-90 cursor-pointer backdrop-blur-md group-hover/carousel:opacity-100 opacity-90 sm:opacity-80"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Floating Right Side Caret */}
          <button
            onClick={handleNext}
            className="hidden sm:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-[#111111]/95 border border-neutral-200 dark:border-white/20 text-neutral-900 dark:text-white hover:bg-[#E37500] hover:text-white hover:border-[#E37500] transition-all items-center justify-center shadow-lg active:scale-90 cursor-pointer backdrop-blur-md group-hover/carousel:opacity-100 opacity-90 sm:opacity-80"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Overflow Track Viewport */}
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              handleMouseUp();
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={`relative overflow-hidden py-3 select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Sliding Track with exact responsive 1-card offset translation */}
            <div
              onTransitionEnd={handleTransitionEnd}
              className={`flex ${
                isTransitioning
                  ? 'transition-transform duration-500 ease-out'
                  : 'transition-none'
              }`}
              style={{
                transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
              }}
            >
              {extendedSteps.map((step, index) => {
                const stepIdx = index % N;
                const isCurrentActive = stepIdx === activeDotIndex;

                return (
                  <div
                    key={`${step.step}-${index}`}
                    className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2.5 sm:px-3.5"
                  >
                    <div
                      className={`h-full p-7 sm:p-8 rounded-3xl backdrop-blur-xl bg-white dark:bg-[#0B0B0B]/95 border transition-all duration-300 flex flex-col justify-between space-y-6 relative group ${
                        isCurrentActive
                          ? 'border-[#E37500]/70 dark:border-[#E37500]/70 shadow-[0_12px_36px_rgba(227,117,0,0.12)] -translate-y-1'
                          : 'border-neutral-200 dark:border-white/10 hover:border-[#E37500]/40 dark:hover:border-[#E37500]/40 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Step Number & Badge */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-serif text-3xl sm:text-4xl font-bold transition-colors ${
                              isCurrentActive
                                ? 'text-[#E37500]'
                                : 'text-[#E37500]/90 group-hover:text-[#E37500]'
                            }`}
                          >
                            {step.step}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/10 text-[#E37500] border border-neutral-200 dark:border-white/15 shadow-xs">
                            {step.actionBadge || `Step ${stepIdx + 1}`}
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors leading-tight">
                            {step.title}
                          </h3>
                          {step.subtitle && (
                            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wider">
                              {step.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed font-normal">
                          {step.description}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-xs text-[#E37500] font-semibold">
                        <div className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1.5 text-[#E37500]" />
                          <span>
                            Step {stepIdx + 1} of {N}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                          Bespoke Fluidity
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 p-7 sm:p-8 rounded-3xl backdrop-blur-xl bg-white dark:bg-[#0B0B0B]/90 border border-neutral-200 dark:border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              Ready to take the first step?
            </h4>
            <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm font-normal">
              A 15-minute consultation is all it takes to turn ideas into a bespoke itinerary.
            </p>
          </div>

          <button
            onClick={onStartPlanning}
            className="px-6 py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow-md shadow-[#E37500]/25 active:scale-95 border border-white/20 cursor-pointer"
          >
            <span>Start Planning Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};
