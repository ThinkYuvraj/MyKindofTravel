import React from 'react';
import { COMPANY_INFO } from '../data/travelData';
import { UserCheck, ShieldCheck, PhoneCall, Sparkles, Award, CheckCircle2 } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const pillars = [
    {
      title: 'Dedicated expert',
      description: 'Your own travel specialist, not a call centre.',
      icon: UserCheck,
    },
    {
      title: 'Fully secure',
      description: 'Verified partners, clear pricing, zero hidden costs.',
      icon: ShieldCheck,
    },
    {
      title: '24/7 on-trip support',
      description: 'We\'re always one call away, wherever you are.',
      icon: PhoneCall,
    },
    {
      title: 'Truly bespoke',
      description: 'No two itineraries we create are ever the same.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="why-us" className="py-20 lg:py-28 bg-[#161614] text-white border-b border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold uppercase tracking-widest border border-amber-500/25">
              <Award className="w-3.5 h-3.5" />
              <span>Why us</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              The difference you <br />
              <span className="italic font-serif text-amber-300 font-normal">
                feel, not just see
              </span>
            </h2>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              We've been crafting personalised luxury journeys for Indian travellers for over 7 years. Here's what makes us different.
            </p>

            {/* Our Promise Callout Card */}
            <div className="p-7 rounded-2xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/30 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Our Promise</span>
              </div>
              <p className="font-serif text-lg sm:text-xl italic text-stone-100 font-medium leading-snug">
                "{COMPANY_INFO.promise}"
              </p>
              <p className="text-xs text-stone-400">
                Guaranteed by the founders of My Kind of Travel since 2018.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Key Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-all duration-300 space-y-4 group shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
