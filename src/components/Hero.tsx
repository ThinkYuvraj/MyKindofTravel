import React, { useState } from 'react';
import { Play, Pause, Compass, ArrowRight } from 'lucide-react';
import heroBgImage from '../assets/images/hero-terraces.jpg';
import { TornPaperDivider } from './TornPaperDivider';

interface HeroProps {
  onPlanTrip: () => void;
  onExploreDestinations: () => void;
  onSelectHighlight?: (destinationName: string) => void;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  bgImage?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export const Hero: React.FC<HeroProps> = ({
  onPlanTrip,
  onExploreDestinations,
  title = 'EXPLORE. DREAM. DISCOVER.',
  subtitle = "Handcrafted luxury holidays, private European chalets, honeymoon cliffside villas, and bespoke journeys tailored for India's discerning travellers.",
  badgeText = 'My Kind of Travel • Bespoke Journeys',
  bgImage,
  primaryButtonText = 'START EXPLORING',
  secondaryButtonText = 'PLAN TRIP',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  const activeBg = bgImage && bgImage.trim() ? bgImage : heroBgImage;

  const togglePlayback = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[90vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#1A0E08] text-white select-none"
    >
      {/* Background Image Container with Ken Burns effect */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={activeBg}
          alt="Lush emerald mountain terraces and scenic paths"
          loading="lazy"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2400&q=85';
            setImgLoaded(true);
          }}
          className={`w-full h-full object-cover object-center transition-transform duration-1000 ease-out ${
            isPlaying ? 'scale-105 transition-transform duration-[22000ms]' : 'scale-100'
          } ${imgLoaded ? 'opacity-100 filter brightness-95' : 'opacity-0'}`}
        />

        {/* Fallback skeleton if image is loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1009] via-[#2A170F] to-[#120B06] animate-pulse" />
        )}

        {/* Subtle Vignette & Gradient Overlays for Crystal-Clear Text Contrast */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65 pointer-events-none" />
      </div>

      {/* Hero Centered Content: Clean, High-Contrast Typography for My Kind of Travel */}
      <div className="relative z-10 w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-16 text-center flex flex-col items-center justify-center pt-8 pb-20 sm:pb-24">
        {/* Subtle Brand Pill */}
        <div className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#201109]/75 backdrop-blur-md border border-white/20 text-[#FAF7F4] text-xs font-bold uppercase tracking-[0.25em] shadow-lg mb-5 animate-in fade-in duration-500">
          <Compass className="w-3.5 h-3.5 text-[#C87428]" />
          <span>{badgeText}</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-sans font-extrabold uppercase text-white tracking-[0.04em] sm:tracking-[0.08em] text-3xl sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.25rem] leading-[1.08] drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)] max-w-4xl">
          {title}
        </h1>

        {/* Descriptive Subtitle for My Kind of Travel */}
        <p className="mt-4 sm:mt-5 text-white/95 text-sm sm:text-base md:text-lg lg:text-xl font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] whitespace-pre-line">
          {subtitle}
        </p>

        {/* Slogan and Play/Pause Toggle */}
        <div className="mt-5 sm:mt-6 flex flex-col items-center gap-2">
          <span className="text-white/90 text-sm sm:text-base font-normal tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            Your personal travel designer awaits
          </span>
        </div>

        {/* Action Buttons: Clean Dark Brown & White Styling */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={onExploreDestinations}
            className="w-full sm:w-auto inline-block px-8 sm:px-10 py-3 sm:py-3.5 border-2 border-white bg-transparent hover:bg-white text-white hover:text-[#201109] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-xl shadow-black/40 hover:shadow-2xl active:scale-95 text-center"
          >
            {primaryButtonText}
          </button>

          <button
            onClick={onPlanTrip}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-[#201109] hover:bg-[#FAF7F4] font-bold text-xs sm:text-sm tracking-[0.18em] uppercase transition-all duration-300 shadow-xl shadow-black/40 hover:shadow-2xl active:scale-95 rounded-none text-center"
          >
            <span>{secondaryButtonText}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Torn Paper Jagged Edge Divider at the bottom transitioning seamlessly */}
      <TornPaperDivider position="bottom" />
    </section>
  );
};
