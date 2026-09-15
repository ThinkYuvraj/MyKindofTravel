import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../data/travelData';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onStartPlanning: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStartPlanning }) => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#121210] text-white border-b border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold uppercase tracking-widest border border-amber-500/25">
            <Compass className="w-3.5 h-3.5" />
            <span>How it works</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            From dream to <span className="italic font-serif text-amber-300 font-normal">departure</span>
          </h2>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
            A simple, seamless process from your first call to your flight home. We handle every detail — you handle the excitement.
          </p>
        </div>

        {/* 4 Steps Timeline / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div
              key={step.step}
              className="p-7 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-md relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-bold text-amber-400">
                    {step.step}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 border border-stone-700/60">
                    {step.actionBadge}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {step.title}
                </h3>

                <p className="text-stone-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center text-xs text-amber-400/80 font-medium">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-amber-500" />
                <span>Step {index + 1} of 4</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-xl font-bold text-white">
              Ready to take the first step?
            </h4>
            <p className="text-stone-400 text-xs sm:text-sm">
              A 15-minute consultation is all it takes to turn ideas into a bespoke itinerary.
            </p>
          </div>

          <button
            onClick={onStartPlanning}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-amber-950/50"
          >
            <span>Start Planning Now</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
};
