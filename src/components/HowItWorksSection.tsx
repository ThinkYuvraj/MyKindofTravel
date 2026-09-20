import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/travelData';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';

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

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-24 bg-transparent text-[#2A1810] dark:text-white border-b border-[#EADFD5] dark:border-white/10 relative transition-colors duration-300">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] text-xs font-bold uppercase tracking-widest border border-[#DFD0C0]/80 dark:border-white/10 backdrop-blur-md shadow-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>{customBadge || 'How it works'}</span>
          </div>

          {customTitle ? (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white">
              {customTitle}
            </h2>
          ) : (
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white">
              From dream to <span className="italic font-serif text-[#8C5528] dark:text-[#E28C38] font-normal">departure</span>
            </h2>
          )}

          <p className="text-[#594336] dark:text-[#D1C2B8] text-base sm:text-lg leading-relaxed font-normal">
            {customSubtitle || 'A simple, seamless process from your first call to your flight home. We handle every detail — you handle the excitement.'}
          </p>
        </div>

        {/* 4 Steps Timeline / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 relative">
          {activeSteps.map((step, index) => (
            <div
              key={step.step}
              className="p-7 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 hover:border-[#8C5528]/60 dark:hover:border-[#E28C38]/60 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-[0_4px_20px_rgba(42,24,16,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-bold text-[#8C5528] dark:text-[#E28C38]">
                    {step.step}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-[#F4ECE4] dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] border border-[#DFD0C0] dark:border-white/15">
                    {step.actionBadge || step.badge || `Step ${index + 1}`}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#2A1810] dark:text-white group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] transition-colors">
                  {step.title}
                </h3>

                <p className="text-[#594336] dark:text-[#D1C2B8] text-sm leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#EADFD5]/80 dark:border-white/10 flex items-center text-xs text-[#8C5528] dark:text-[#E28C38] font-semibold">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-[#8C5528] dark:text-[#E28C38]" />
                <span>Step {index + 1} of {activeSteps.length}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 p-8 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/85 border border-[#DFD0C0] dark:border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-xl font-bold text-[#2A1810] dark:text-white">
              Ready to take the first step?
            </h4>
            <p className="text-[#594336] dark:text-[#D1C2B8] text-xs sm:text-sm font-normal">
              A 15-minute consultation is all it takes to turn ideas into a bespoke itinerary.
            </p>
          </div>

          <button
            onClick={onStartPlanning}
            className="px-6 py-3.5 rounded-xl bg-[#8C5528] dark:bg-[#C87428] hover:bg-[#72421D] dark:hover:bg-[#B86620] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow-md shadow-[#8C5528]/25 active:scale-95 border border-white/20"
          >
            <span>Start Planning Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};
