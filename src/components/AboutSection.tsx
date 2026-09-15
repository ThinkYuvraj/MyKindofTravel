import React from 'react';
import { Compass, Sparkles, UserCheck, HeartHandshake } from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

export const AboutSection: React.FC = () => {
  return (
    <section id="philosophy" className="py-20 lg:py-28 bg-[#FFFFFF] dark:bg-[#0A0706] text-[#2A1810] dark:text-white border-b border-[#EADFD5] dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Subtle Decorative Ambient Warm Glow */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#8C5528]/10 dark:bg-[#D47A2A]/10 rounded-full blur-3xl pointer-events-none animate-ambient-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] border border-[#DFD0C0]/80 dark:border-white/10 text-xs uppercase tracking-widest font-bold backdrop-blur-md shadow-xs">
                About My Kind of Travel
              </span>
              <span className="text-[#B5A496] text-xs">•</span>
              <span className="text-[#7C685B] dark:text-neutral-400 text-xs font-semibold">
                {COMPANY_INFO.yearsCrafting} Years of crafting journeys
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white leading-tight">
              Our philosophy — <br />
              <span className="italic text-[#8C5528] dark:text-[#E28C38] font-serif font-normal">
                Travel that fits who you are
              </span>
            </h2>

            <p className="text-[#594336] dark:text-[#D1C2B8] text-base sm:text-lg leading-relaxed font-normal">
              {COMPANY_INFO.philosophy}
            </p>

            <div className="pt-2 p-6 rounded-2xl bg-[#FAF7F2] dark:bg-[#16100D]/80 backdrop-blur-xl border border-[#EADFD5] dark:border-white/10 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-[#8C5528] dark:text-[#E28C38] font-serif font-bold text-base">
                <Compass className="w-5 h-5" />
                <span>The My Kind of Travel Standard</span>
              </div>
              <p className="text-[#594336] dark:text-[#D1C2B8] text-sm leading-relaxed">
                Whether you are dreaming of floating breakfasts in an Ubud jungle villa, private Louvre access after public hours, or business-class train journeys through the Swiss Alps, our specialists orchestrate every transfer, reservation, and local nuance.
              </p>
            </div>
          </div>

          {/* Right Column: 3 Pillars */}
          <div className="lg:col-span-6 space-y-5">
            {/* Pillar 1 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white/80 dark:bg-[#16100D]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 hover:border-[#8C5528]/60 dark:hover:border-[#E28C38]/60 transition-all duration-300 group shadow-[0_4px_20px_rgba(42,24,16,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/70 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] flex items-center justify-center border border-[#DFD0C0]/80 dark:border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#2A1810] dark:text-white group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] transition-colors">
                    Bespoke by design
                  </h3>
                  <p className="text-[#594336] dark:text-[#D1C2B8] text-sm sm:text-base leading-relaxed">
                    Every itinerary is built from scratch — no templates, no copy-paste packages. We tailor pacing, stay categories, and dining around your personal tastes.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white/80 dark:bg-[#16100D]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 hover:border-[#8C5528]/60 dark:hover:border-[#E28C38]/60 transition-all duration-300 group shadow-[0_4px_20px_rgba(42,24,16,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/70 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] flex items-center justify-center border border-[#DFD0C0]/80 dark:border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#2A1810] dark:text-white group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] transition-colors">
                    White-glove support
                  </h3>
                  <p className="text-[#594336] dark:text-[#D1C2B8] text-sm sm:text-base leading-relaxed">
                    A dedicated travel expert who's reachable before, during, and after your trip. No anonymous customer call queues — direct personal access on WhatsApp and phone.
                  </p>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white/80 dark:bg-[#16100D]/80 backdrop-blur-xl border border-white/80 dark:border-white/10 hover:border-[#8C5528]/60 dark:hover:border-[#E28C38]/60 transition-all duration-300 group shadow-[0_4px_20px_rgba(42,24,16,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/70 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] flex items-center justify-center border border-[#DFD0C0]/80 dark:border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-[#2A1810] dark:text-white group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] transition-colors">
                    Zero stress, full joy
                  </h3>
                  <p className="text-[#594336] dark:text-[#D1C2B8] text-sm sm:text-base leading-relaxed">
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
