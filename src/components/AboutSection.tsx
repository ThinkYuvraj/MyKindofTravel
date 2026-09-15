import React from 'react';
import { Compass, Sparkles, UserCheck, HeartHandshake, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

export const AboutSection: React.FC = () => {
  return (
    <section id="philosophy" className="py-20 lg:py-28 bg-[#161614] text-stone-200 border-b border-stone-800/80 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs uppercase tracking-widest font-semibold">
                About My Kind of Travel
              </span>
              <span className="text-stone-500 text-xs">•</span>
              <span className="text-stone-400 text-xs font-medium">
                {COMPANY_INFO.yearsCrafting} Years of crafting journeys
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Our philosophy — <br />
              <span className="italic text-amber-300/90 font-serif font-normal">
                Travel that fits who you are
              </span>
            </h2>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-normal">
              {COMPANY_INFO.philosophy}
            </p>

            <div className="pt-2 p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
                <Compass className="w-5 h-5" />
                <span>The My Kind of Travel Standard</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                Whether you are dreaming of floating breakfasts in an Ubud jungle villa, private Louvre access after public hours, or business-class train journeys through the Swiss Alps, our specialists orchestrate every transfer, reservation, and local nuance.
              </p>
            </div>
          </div>

          {/* Right Column: 3 Pillars */}
          <div className="lg:col-span-6 space-y-5">
            {/* Pillar 1 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-stone-900/90 border border-stone-800/80 hover:border-amber-500/40 transition-all duration-300 group shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    Bespoke by design
                  </h3>
                  <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                    Every itinerary is built from scratch — no templates, no copy-paste packages. We tailor pacing, stay categories, and dining around your personal tastes.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-stone-900/90 border border-stone-800/80 hover:border-amber-500/40 transition-all duration-300 group shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    White-glove support
                  </h3>
                  <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                    A dedicated travel expert who's reachable before, during, and after your trip. No anonymous customer call queues — direct personal access on WhatsApp and phone.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-stone-900/90 border border-stone-800/80 hover:border-amber-500/40 transition-all duration-300 group shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0 group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    Zero stress, full joy
                  </h3>
                  <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                    From visa to villa — every detail handled so you can simply enjoy. Flight bookings, chauffeur cars, local SIM cards, and handpicked restaurants, completely organized.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
