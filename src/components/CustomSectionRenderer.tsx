import React, { useState } from 'react';
import { CustomSection } from '../types';
import { Sparkles, ChevronDown, ArrowRight, ShieldCheck, Star, HeartHandshake, Compass, Plane, CheckCircle2 } from 'lucide-react';
import { GlassImage } from './GlassImage';

interface CustomSectionRendererProps {
  section: CustomSection;
  onCtaClick?: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  ShieldCheck,
  Star,
  HeartHandshake,
  Compass,
  Plane,
  CheckCircle2,
};

export const CustomSectionRenderer: React.FC<CustomSectionRendererProps> = ({
  section,
  onCtaClick,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!section.enabled) return null;

  const getThemeClasses = () => {
    switch (section.theme) {
      case 'dark':
        return {
          bg: 'bg-[#140E0A] text-[#FAF7F2] border-y border-[#362217]',
          card: 'bg-[#1E140F]/90 border-[#3D251A] text-white hover:border-[#C87428]/50',
          badge: 'bg-white/10 text-[#E28C38] border-white/15',
          heading: 'text-white',
          subtext: 'text-[#D1C2B8]',
          accent: 'text-[#E28C38]',
        };
      case 'caramel':
        return {
          bg: 'bg-gradient-to-b from-[#2B170E] via-[#351D12] to-[#2B170E] text-[#FAF7F2] border-y border-[#522D1B]',
          card: 'bg-[#23120A]/80 border-[#5E341F] text-white hover:border-[#E28C38]/60',
          badge: 'bg-[#C87428]/25 text-[#FFB677] border-[#C87428]/40',
          heading: 'text-white',
          subtext: 'text-[#F3DFD2]',
          accent: 'text-[#FFB677]',
        };
      case 'light':
      default:
        return {
          bg: 'bg-transparent text-[#24130A] dark:text-white border-y border-[#EADFD5] dark:border-white/10',
          card: 'bg-white/80 dark:bg-[#16100D]/80 border-white/80 dark:border-white/10 text-[#24130A] dark:text-white hover:border-[#8C5528]/50 dark:hover:border-[#E28C38]/50',
          badge: 'bg-white/80 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] border-[#DFD0C0]/80 dark:border-white/10',
          heading: 'text-[#24130A] dark:text-white',
          subtext: 'text-[#594336] dark:text-[#D1C2B8]',
          accent: 'text-[#8C5528] dark:text-[#E28C38]',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <section
      id={`section-${section.id}`}
      className={`py-12 sm:py-16 lg:py-20 relative overflow-hidden transition-colors duration-300 ${theme.bg}`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          {section.badgeText && (
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-xs border ${theme.badge}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{section.badgeText}</span>
            </div>
          )}

          <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme.heading}`}>
            {section.title}
          </h2>

          {section.subtitle && (
            <p className={`text-sm sm:text-base lg:text-lg leading-relaxed font-normal max-w-2xl mx-auto ${theme.subtext}`}>
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Layout: Grid of Cards */}
        {section.layout === 'grid-cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {section.items.map((item) => {
              const IconComponent = (item.icon && ICON_MAP[item.icon]) || Sparkles;

              return (
                <div
                  key={item.id}
                  className={`group rounded-3xl p-6 sm:p-7 backdrop-blur-xl border transition-all duration-300 shadow-[0_8px_30px_rgba(42,24,16,0.06)] hover:-translate-y-1 flex flex-col justify-between ${theme.card}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white/70 dark:bg-white/10 flex items-center justify-center border border-current/20 text-[#8C5528] dark:text-[#E28C38] group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#8C5528]/10 dark:bg-[#C87428]/20 text-[#8C5528] dark:text-[#E28C38]">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-xs font-semibold text-[#8C5528] dark:text-[#E28C38]">
                        {item.subtitle}
                      </p>
                    )}
                    <p className={`text-xs sm:text-sm leading-relaxed ${theme.subtext}`}>
                      {item.description}
                    </p>
                  </div>

                  {item.linkText && (
                    <div className="pt-5 mt-4 border-t border-current/10">
                      <button
                        onClick={onCtaClick}
                        className={`text-xs font-bold flex items-center gap-1.5 transition-colors group-hover:underline ${theme.accent}`}
                      >
                        <span>{item.linkText}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Layout: Banner CTA */}
        {section.layout === 'banner-cta' && (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-[#1F120A] text-white">
            {section.items[0]?.image && (
              <div className="absolute inset-0 z-0">
                <GlassImage
                  src={section.items[0].image}
                  alt={section.title}
                  className="w-full h-full object-cover filter brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
              </div>
            )}

            <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl space-y-6">
              {section.items[0]?.badge && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#C87428] text-white shadow-md">
                  {section.items[0].badge}
                </span>
              )}

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                {section.items[0]?.title || section.title}
              </h3>

              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                {section.items[0]?.description || section.subtitle}
              </p>

              <div className="pt-2">
                <button
                  onClick={onCtaClick}
                  className="px-8 py-3.5 rounded-full bg-[#C87428] hover:bg-[#E28C38] text-white text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>{section.items[0]?.linkText || 'Enquire About Privileges'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Layout: Accordion FAQs */}
        {section.layout === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-3.5">
            {section.items.map((item, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-200 ${theme.card}`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-serif font-bold text-base sm:text-lg">
                      {item.title}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 ' + theme.accent : 'text-neutral-400'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t border-current/10 opacity-90 animate-in fade-in duration-200">
                      <p className={theme.subtext}>{item.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Layout: Split Story */}
        {section.layout === 'split-story' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6 space-y-5">
              {section.items[0]?.badge && (
                <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${theme.badge}`}>
                  {section.items[0].badge}
                </span>
              )}
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold">
                {section.items[0]?.title || section.title}
              </h3>
              <p className={`text-sm sm:text-base leading-relaxed ${theme.subtext}`}>
                {section.items[0]?.description || section.subtitle}
              </p>
              {section.items[0]?.linkText && (
                <button
                  onClick={onCtaClick}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8C5528] dark:bg-[#C87428] text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  <span>{section.items[0].linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="lg:col-span-6">
              {section.items[0]?.image ? (
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-current/20 h-80 sm:h-96">
                  <GlassImage
                    src={section.items[0].image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`p-8 rounded-3xl border ${theme.card} space-y-4`}>
                  <p className="font-serif italic text-lg sm:text-xl">
                    "Every journey with My Kind of Travel is treated as an intimate masterpiece. We protect your privacy, elevate your stays, and handle every detail with discreet perfection."
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8C5528] dark:text-[#E28C38]">
                    — Founder & Private Travel Curator
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
