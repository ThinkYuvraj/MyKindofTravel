import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CarouselControlPillProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  viewAllLink?: string;
  onViewAll?: () => void;
  viewAllText?: string;
  className?: string;
}

export const CarouselControlPill: React.FC<CarouselControlPillProps> = ({
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  viewAllLink,
  onViewAll,
  viewAllText = 'VIEW ALL',
  className = '',
}) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else if (viewAllLink) {
      navigate(viewAllLink);
    }
  };

  const hasViewAll = Boolean(viewAllLink || onViewAll);

  return (
    <div
      className={`inline-flex items-center gap-2 p-1.5 rounded-full bg-white dark:bg-[#0E0E0E] border border-neutral-200/90 dark:border-white/10 shadow-xs backdrop-blur-md shrink-0 ${className}`}
    >
      {/* Prev Caret */}
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/8 text-neutral-800 dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-white/15 hover:text-neutral-900 dark:hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer touch-manipulation"
        aria-label={prevLabel}
        title={prevLabel}
      >
        <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Next Caret */}
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/8 text-neutral-800 dark:text-neutral-200 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-white/15 hover:text-neutral-900 dark:hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer touch-manipulation"
        aria-label={nextLabel}
        title={nextLabel}
      >
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* Divider & View All action */}
      {hasViewAll && (
        <>
          <span className="w-px h-5 bg-neutral-200 dark:bg-white/15 mx-0.5 shrink-0" />
          <button
            type="button"
            onClick={handleViewAll}
            className="px-4 py-1.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer active:scale-95 hover:shadow-sm touch-manipulation"
            title={viewAllText}
          >
            <span>{viewAllText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </>
      )}
    </div>
  );
};
