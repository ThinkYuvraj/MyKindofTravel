import React from 'react';
import { TESTIMONIALS } from '../data/travelData';
import { TestimonialItem } from '../types';
import { Star, Heart } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const activeReviews = testimonials && testimonials.length > 0 ? testimonials : TESTIMONIALS;

  return (
    <section id="stories" className="py-12 sm:py-16 lg:py-24 bg-transparent text-[#2A1810] dark:text-white border-b border-[#EADFD5] dark:border-white/10 relative transition-colors duration-300">
      <div className="section-container">
        {/* Heading */}
        <div className="max-w-3xl space-y-4 mb-16 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] text-xs font-bold uppercase tracking-widest border border-[#DFD0C0]/80 dark:border-white/10 backdrop-blur-md shadow-xs">
            <Heart className="w-3.5 h-3.5 fill-[#8C5528]/20 dark:fill-[#E28C38]/20 text-[#8C5528] dark:text-[#E28C38]" />
            <span>Real stories</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white">
            Trips that <span className="italic font-serif text-[#8C5528] dark:text-[#E28C38] font-normal">changed everything</span>
          </h2>

          <p className="text-[#594336] dark:text-[#D1C2B8] text-base sm:text-lg leading-relaxed font-normal">
            Honest feedback from Indian couples, corporate leaders, and families who trusted us with their most cherished milestones.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8">
          {activeReviews.map((review) => (
            <div
              key={review.id}
              className="p-8 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 hover:border-[#8C5528]/50 dark:hover:border-[#E28C38]/50 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-[0_4px_20px_rgba(42,24,16,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 relative group"
            >
              <div className="space-y-4">
                {/* 5 Stars in rich cognac/gold */}
                <div className="flex items-center gap-1 text-[#8C5528] dark:text-[#E28C38]">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#8C5528] dark:fill-[#E28C38] text-[#8C5528] dark:text-[#E28C38]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#3D2B22] dark:text-[#EADFD5] text-sm sm:text-base leading-relaxed font-normal italic">
                  "{review.quote}"
                </p>
              </div>

              {/* Author & Avatar */}
              <div className="pt-4 border-t border-[#EADFD5]/80 dark:border-white/10 flex items-center gap-3">
                {review.avatar ? (
                  <GlassImage
                    src={review.avatar}
                    alt={review.author}
                    containerClassName="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-[#DFD0C0] dark:border-white/20 shadow-xs"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#A0683B]/15 dark:bg-[#B36D33]/20 text-[#A0683B] dark:text-[#D4A276] font-serif font-bold text-base flex items-center justify-center border border-[#A0683B]/30 dark:border-[#B36D33]/30 shrink-0">
                    {review.initial}
                  </div>
                )}
                <div>
                  <h4 className="font-serif font-bold text-[#2A1810] dark:text-white text-base">
                    {review.author}
                  </h4>
                  <p className="text-xs text-[#A0683B] dark:text-[#D4A276] font-semibold">
                    {review.tripInfo}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
