import React from 'react';
import { TESTIMONIALS } from '../data/travelData';
import { Star, Quote, Heart } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="stories" className="py-20 lg:py-28 bg-[#121210] text-white border-b border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="max-w-3xl space-y-4 mb-16 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold uppercase tracking-widest border border-amber-500/25">
            <Heart className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>Real stories</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Trips that <span className="italic font-serif text-amber-300 font-normal">changed everything</span>
          </h2>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            Honest feedback from Indian couples, corporate leaders, and families who trusted us with their most cherished milestones.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="p-8 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-md relative group"
            >
              <div className="space-y-4">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-normal italic">
                  "{review.quote}"
                </p>
              </div>

              {/* Author & Initial */}
              <div className="pt-4 border-t border-stone-800/80 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-600 to-stone-800 text-amber-200 font-serif font-bold text-base flex items-center justify-center border border-amber-500/30 shrink-0">
                  {review.initial}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-base">
                    {review.author}
                  </h4>
                  <p className="text-xs text-amber-400/90 font-medium">
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
