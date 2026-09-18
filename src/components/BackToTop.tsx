import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  threshold?: number;
  inactivityDelayMs?: number;
}

export const BackToTop: React.FC<BackToTopProps> = ({
  threshold = 300,
  inactivityDelayMs = 3200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(progress);
      }
      return scrollTop;
    };

    const resetInactivityTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        // Auto-hide only if the user is not currently hovering over the button
        setIsVisible((prev) => (isHovered ? true : false));
      }, inactivityDelayMs);
    };

    const handleUserActivity = () => {
      const scrollY = updateScrollProgress();

      if (scrollY > threshold) {
        setIsVisible(true);
        resetInactivityTimer();
      } else {
        setIsVisible(false);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      }
    };

    // Listen to user interactions to wake up / show the button and refresh the inactivity timer
    window.addEventListener('scroll', handleUserActivity, { passive: true });
    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });

    // Initial check
    handleUserActivity();

    return () => {
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [threshold, inactivityDelayMs, isHovered]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 transition-all duration-300 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      <button
        id="back-to-top-btn"
        onClick={scrollToTop}
        onMouseEnter={() => {
          setIsHovered(true);
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          // Restart inactivity countdown when cursor leaves
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            setIsVisible(false);
          }, inactivityDelayMs);
        }}
        aria-label="Back to top"
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-[#1C120C]/90 text-[#8C5528] dark:text-[#E28C38] hover:text-white dark:hover:text-white hover:bg-[#8C5528] dark:hover:bg-[#C87428] backdrop-blur-xl border border-[#DFD0C0] dark:border-white/15 shadow-[0_8px_25px_rgba(42,24,16,0.18)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C5528]"
      >
        {/* Subtle circular SVG progress meter */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5"
          viewBox="0 0 48 48"
        >
          <circle
            cx="24"
            cy="24"
            r="21"
            className="stroke-[#EADFD5]/50 dark:stroke-white/10 fill-none"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="24"
            r="21"
            className="stroke-[#8C5528] dark:stroke-[#E28C38] group-hover:stroke-white fill-none transition-colors duration-300"
            strokeWidth="2.5"
            strokeDasharray="131.95"
            strokeDashoffset={131.95 - (131.95 * scrollProgress) / 100}
            strokeLinecap="round"
          />
        </svg>

        {/* Upward icon */}
        <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 relative z-10 stroke-[2.5]" />

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 px-2.5 py-1 rounded-lg bg-[#2A1810] text-[#FAF7F4] text-[11px] font-bold tracking-wider uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md border border-white/10 hidden sm:block">
          Back to Top
        </span>
      </button>
    </div>
  );
};
