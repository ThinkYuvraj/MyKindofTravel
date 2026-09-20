import React from 'react';
import { EXPERIENCE_PILLARS } from '../data/travelData';
import { ExperiencePillar } from '../types';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

interface ExperiencesSectionProps {
  pillars?: ExperiencePillar[];
  onPlanTripType: (tripType: string) => void;
}

export const ExperiencesSection: React.FC<ExperiencesSectionProps> = ({
  pillars,
  onPlanTripType,
}) => {
  const activePillars = pillars && pillars.length > 0 ? pillars : EXPERIENCE_PILLARS;

  return (
    <section id="experiences" className="py-12 sm:py-16 lg:py-24 bg-[#FFFFFF] dark:bg-[#0A0706] text-[#2A1810] dark:text-white border-b border-[#EADFD5] dark:border-white/10 relative transition-colors duration-300">
      <div className="section-container">
        {/* Section Heading */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md text-[#8C5528] dark:text-[#E28C38] text-xs font-bold uppercase tracking-widest border border-[#DFD0C0]/80 dark:border-white/10 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>What we curate</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white">
            Every kind of <span className="italic font-serif text-[#8C5528] dark:text-[#E28C38] font-normal">extraordinary</span>
          </h2>

          <p className="text-[#594336] dark:text-[#D1C2B8] text-base sm:text-lg leading-relaxed font-normal">
            Tailored journeys created for personal celebrations, multi-city cultural quests, executive gatherings, and spontaneous luxury getaways.
          </p>
        </div>

        {/* 6 Experience Cards Grid */}
        <div className="content-grid sm:gap-8">
          {activePillars.map((exp) => (
            <div
              key={exp.number}
              className="rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 hover:border-[#8C5528]/60 dark:hover:border-[#E28C38]/60 p-6 sm:p-7 md:p-8 flex flex-col justify-between group transition-all duration-500 shadow-[0_4px_20px_rgba(42,24,16,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Background Ambient Number Accent */}
              <span className="absolute -top-4 -right-2 font-serif text-8xl font-bold text-[#EADFD5]/30 dark:text-white/5 select-none pointer-events-none group-hover:text-[#8C5528]/15 dark:group-hover:text-[#E28C38]/15 transition-colors">
                {exp.number}
              </span>

              <div className="space-y-3.5 sm:space-y-4 relative z-10">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#F4ECE4] dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] font-serif font-bold text-sm border border-[#DFD0C0] dark:border-white/10">
                  {exp.number}
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1810] dark:text-white group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] transition-colors">
                  {exp.title}
                </h3>

                <p className="text-[#594336] dark:text-[#D1C2B8] text-sm leading-relaxed font-normal">
                  {exp.description}
                </p>

                {/* Micro Highlights */}
                <div className="pt-2 space-y-1.5 border-t border-[#EADFD5]/80 dark:border-white/10">
                  {exp.highlights.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#7C685B] dark:text-[#DFD0C0]">
                      <Check className="w-3.5 h-3.5 text-[#8C5528] dark:text-[#E28C38] shrink-0" />
                      <span className="truncate font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-6 relative z-10">
                <button
                  onClick={() => onPlanTripType(exp.typeKey)}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C5528] dark:text-[#E28C38] hover:text-[#72421D] dark:hover:text-white transition-colors"
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
