import React from 'react';
import { COMPANY_INFO } from '../data/travelData';
import { UserCheck, ShieldCheck, PhoneCall, Sparkles, Award, CheckCircle2 } from 'lucide-react';

interface WhyUsSectionProps {
  companyInfo?: typeof COMPANY_INFO;
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
  pillars?: { title: string; description: string; iconName?: string; stat?: string }[];
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({
  companyInfo,
  customBadge,
  customTitle,
  customSubtitle,
  pillars: customPillars,
}) => {
  const info = companyInfo || COMPANY_INFO;

  const defaultPillars = [
    {
      title: 'Dedicated expert',
      description: 'Your own travel specialist, not an impersonal call centre.',
      icon: UserCheck,
      stat: 'Dedicated Specialist',
    },
    {
      title: 'Fully secure',
      description: 'Verified 5-star partners, clear pricing, zero hidden costs.',
      icon: ShieldCheck,
      stat: '100% Verified',
    },
    {
      title: '24/7 on-trip support',
      description: 'We\'re always one call away, wherever you are in the world.',
      icon: PhoneCall,
      stat: '< 5 Min Response',
    },
    {
      title: 'Truly bespoke',
      description: 'No two itineraries we create are ever the same.',
      icon: Sparkles,
      stat: 'Zero Cookie-Cutter',
    },
  ];

  const iconOptions = [UserCheck, ShieldCheck, PhoneCall, Sparkles];

  const activePillars = customPillars && customPillars.length > 0
    ? customPillars.map((p, idx) => ({
        title: p.title,
        description: p.description,
        icon: iconOptions[idx % iconOptions.length],
        stat: p.stat,
      }))
    : defaultPillars;

  return (
    <section id="why-us" className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-black text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 relative transition-colors duration-300">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/10 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-widest border border-neutral-200 dark:border-white/10 backdrop-blur-md shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#E37500]" />
              <span>{customBadge || 'Why us'}</span>
            </div>

            {customTitle ? (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                {customTitle}
              </h2>
            ) : (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                The difference you <br />
                <span className="italic font-serif text-[#E37500] font-normal">
                  feel, not just see
                </span>
              </h2>
            )}

            <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg leading-relaxed font-normal">
              {customSubtitle || `We've been crafting personalised luxury journeys for Indian travellers for over ${info.yearsCrafting || '7+'} years. Here's what makes us different.`}
            </p>

            {/* Our Promise Callout Card in Pure White */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 space-y-3 shadow-[0_6px_25px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 text-[#E37500] font-bold uppercase tracking-wider text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#E37500]" />
                <span>Our Promise</span>
              </div>
              <p className="font-serif text-lg sm:text-xl italic text-neutral-900 dark:text-white font-medium leading-snug">
                "{info.promise || COMPANY_INFO.promise}"
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Guaranteed by the founders of {info.name || 'My Kind of Travel'} since {info.establishedYear || '2018'}.
              </p>
            </div>
          </div>

          {/* Right Column: 4 Key Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {activePillars.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-3xl bg-white dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 hover:border-[#E37500]/60 dark:hover:border-[#E37500]/60 transition-all duration-300 space-y-4 group shadow-[0_6px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-white/10 text-[#E37500] flex items-center justify-center border border-neutral-200 dark:border-white/10 group-hover:scale-110 transition-transform">
                      <IconComp className="w-6 h-6" />
                    </div>
                    {item.stat && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-white dark:bg-white/10 text-[#E37500] border border-neutral-200 dark:border-white/15 shadow-xs">
                        {item.stat}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-white group-hover:text-[#E37500] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed font-normal">
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
