import React from 'react';
import { EXPERIENCE_PILLARS } from '../data/travelData';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface ExperiencesSectionProps {
  onPlanTripType: (tripType: string) => void;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({ onPlanTripType }) => {
  return (
    <section id="experiences" className="py-20 lg:py-28 bg-[#181816] text-white border-b border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold uppercase tracking-widest border border-amber-500/25">
            <Sparkles className="w-3.5 h-3.5" />
            <span>What we curate</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Every kind of <span className="italic font-serif text-amber-300 font-normal">extraordinary</span>
          </h2>

          <p className="text-stone-400 text-base sm:text-lg leading-relaxed">
            Tailored journeys created for personal celebrations, multi-city cultural quests, executive gatherings, and spontaneous luxury getaways.
          </p>
        </div>

        {/* 6 Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXPERIENCE_PILLARS.map((exp) => (
            <div
              key={exp.number}
              className="rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 p-8 flex flex-col justify-between group transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-stone-950/60 relative overflow-hidden"
            >
              {/* Background Ambient Number Accent */}
              <span className="absolute -top-4 -right-2 font-serif text-8xl font-bold text-stone-800/40 select-none pointer-events-none group-hover:text-amber-500/10 transition-colors">
                {exp.number}
              </span>

              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 font-serif font-bold text-sm border border-amber-500/20">
                  {exp.number}
                </div>

                <h3 className="font-serif text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {exp.title}
                </h3>

                <p className="text-stone-300 text-sm leading-relaxed font-normal">
                  {exp.description}
                </p>

                {/* Micro Highlights */}
                <div className="pt-2 space-y-1.5 border-t border-stone-800">
                  {exp.highlights.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-stone-400">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-6 relative z-10">
                <button
                  onClick={() => onPlanTripType(exp.typeKey)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors"
                >
                  <span>{exp.ctaText}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
