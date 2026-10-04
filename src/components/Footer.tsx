import React from 'react';
import { Compass, Phone, Mail, ArrowUp } from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onPlanTrip: () => void;
  onSelectDestination: (destName: string) => void;
  onSelectTripType: (type: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onPlanTrip,
  onSelectDestination,
  onSelectTripType,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 dark:bg-black text-neutral-300 dark:text-neutral-400 border-t border-neutral-800 dark:border-white/10 pt-10 pb-6 sm:pb-8 transition-colors">
      <div className="section-container">
        {/* Compact Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 pb-7 border-b border-neutral-800 dark:border-white/10">
          {/* Brand Col */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 space-y-3 pr-0 lg:pr-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E37500] text-white flex items-center justify-center shadow-sm shrink-0">
                <Compass className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                  My Kind of Travel
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider text-[#E37500] font-semibold">
                  • Bespoke Luxury
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Bespoke luxury journeys designed for discerning Indian travellers. Handcrafted itineraries with white-glove care from departure to return.
            </p>

            {/* Contact Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-[#E37500] hover:border-[#E37500]/40 transition-colors"
                title="Call us"
              >
                <Phone className="w-3 h-3 text-[#E37500]" />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-[#E37500] hover:border-[#E37500]/40 transition-colors"
                title="Email us"
              >
                <Mail className="w-3 h-3 text-[#E37500]" />
                <span>{COMPANY_INFO.email}</span>
              </a>
            </div>
          </div>

          {/* Column: Experiences */}
          <div className="space-y-2.5">
            <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider">
              Experiences
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onSelectTripType('Honeymoon')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Honeymoon Trips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Luxury Europe Tour')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Europe Tours
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Corporate Travel')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Corporate Travel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Family Holiday')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Family Holidays
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packages')}
                  className="text-[#E37500] hover:underline font-semibold transition-colors text-left inline-block"
                >
                  All Packages →
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Destinations */}
          <div className="space-y-2.5">
            <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider">
              Destinations
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onSelectDestination('Bali, Indonesia')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Bali, Indonesia
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Switzerland')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Switzerland
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Santorini')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Santorini, Greece
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Maldives')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Maldives
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="text-[#E37500] hover:underline font-semibold transition-colors text-left inline-block"
                >
                  All Destinations →
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Company */}
          <div className="space-y-2.5 col-span-2 sm:col-span-1">
            <h4 className="font-serif font-bold text-white text-xs uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stories')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Client Stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Visual Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#E37500] transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={onPlanTrip}
                  className="text-[#E37500] hover:underline font-semibold transition-colors text-left inline-block"
                >
                  Plan My Trip →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            <span>© {COMPANY_INFO.currentYear} My Kind of Travel</span>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <span>Est. {COMPANY_INFO.establishedYear}</span>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <a
              href="/admin/login"
              className="hover:text-[#E37500] transition-colors underline decoration-dotted"
            >
              Admin CMS
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors border border-white/10 text-xs shrink-0 active:scale-95"
            title="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
