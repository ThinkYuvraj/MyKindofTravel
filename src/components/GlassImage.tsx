import React, { useState, useEffect, useRef } from 'react';
import { Compass, ImageOff } from 'lucide-react';

interface GlassImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  containerClassName?: string;
  skeletonClassName?: string;
  priority?: boolean;
}

export const GlassImage: React.FC<GlassImageProps> = ({
  src,
  alt,
  containerClassName = '',
  skeletonClassName = '',
  className = '',
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver for genuine lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const currentElem = containerRef.current;
    if (!currentElem) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        // Begin fetching 250px before entering viewport for smooth seamless scrolling
        rootMargin: '250px 0px',
        threshold: 0.01,
      }
    );

    observer.observe(currentElem);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);

    if (isInView && src) {
      // Check if already in browser cache
      const img = new Image();
      img.src = src;
      if (img.complete && img.naturalWidth > 0) {
        setIsLoaded(true);
      }
    }
  }, [src, isInView]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${containerClassName}`}>
      {/* Glassmorphic Loading Skeleton Screen */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-xl bg-white/60 dark:bg-[#150E0A]/75 border border-white/60 dark:border-[#B36D33]/20 animate-glass-shimmer ${skeletonClassName}`}
          aria-hidden="true"
        >
          {/* Watermark with Secondary Brown Styling in both modes */}
          <div className="flex flex-col items-center gap-2 text-[#A0683B]/70 dark:text-[#B36D33]/80 select-none">
            <div className="w-10 h-10 rounded-2xl bg-[#A0683B]/10 dark:bg-[#B36D33]/15 flex items-center justify-center border border-[#A0683B]/25 dark:border-[#B36D33]/30 shadow-xs">
              <Compass className="w-5 h-5 animate-spin [animation-duration:8s]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-[#A0683B] dark:text-[#D4A276]">
              Curating Visual
            </span>
          </div>

          {/* Secondary brown subtle glow lines */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#A0683B]/30 dark:via-[#B36D33]/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#A0683B]/40 dark:via-[#B36D33]/50 to-transparent" />
        </div>
      )}

      {/* Fallback Screen if image fails */}
      {hasError ? (
        <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center bg-[#FAF7F2] dark:bg-[#16100D] text-[#A0683B] dark:text-[#B36D33] p-4 text-center border border-[#DFD0C0] dark:border-white/10">
          <ImageOff className="w-8 h-8 mb-2 opacity-60" />
          <span className="text-xs font-semibold">{alt || 'Luxury Voyage'}</span>
          <span className="text-[10px] opacity-70 mt-1">Image preview unavailable</span>
        </div>
      ) : isInView ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`${className} transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      ) : null}
    </div>
  );
};
