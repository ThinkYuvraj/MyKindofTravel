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
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-xl bg-white/60 dark:bg-black/60 border border-white/40 dark:border-white/10 animate-glass-shimmer ${skeletonClassName}`}
          aria-hidden="true"
        >
          {/* Watermark with Signature Accent #E37500 */}
          <div className="flex flex-col items-center gap-2 text-[#E37500] select-none">
            <div className="w-10 h-10 rounded-2xl bg-[#E37500]/10 dark:bg-[#E37500]/15 flex items-center justify-center border border-[#E37500]/25 dark:border-[#E37500]/30 shadow-xs">
              <Compass className="w-5 h-5 animate-spin [animation-duration:8s]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono text-[#E37500]">
              Curating Visual
            </span>
          </div>

          {/* Accent glow lines */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E37500]/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#E37500]/40 to-transparent" />
        </div>
      )}

      {/* Fallback Screen if image fails */}
      {hasError ? (
        <div className="w-full h-full min-h-[160px] flex flex-col items-center justify-center bg-neutral-50 dark:bg-[#0E0E0E] text-neutral-400 p-4 text-center border border-neutral-200 dark:border-white/10">
          <ImageOff className="w-8 h-8 mb-2 opacity-60 text-neutral-400" />
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">{alt || 'Luxury Voyage'}</span>
          <span className="text-[10px] text-neutral-400 mt-1">Image preview unavailable</span>
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
