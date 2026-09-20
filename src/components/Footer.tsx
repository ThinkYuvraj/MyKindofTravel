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
    <footer className="bg-[#140E0A] dark:bg-[#070504] text-[#EADFD5] border-t border-[#362217] dark:border-white/10 pt-16 pb-12 transition-colors">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#362217] dark:border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8C5528] dark:bg-[#C87428] text-[#FCFBF9] flex items-center justify-center border border-[#70421D] dark:border-white/20 shadow-md">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  My Kind of Travel
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-[#C5A059] dark:text-[#E28C38] font-bold">
                  Bespoke Luxury Journeys
                </span>
              </div>
            </div>

            <p className="text-[#BFAEA0] dark:text-[#A8988B] text-xs sm:text-sm leading-relaxed max-w-sm">
              Bespoke luxury travel experiences designed around you — not a brochure. For Indian travellers who believe the journey is as important as the destination.
            </p>

            <div className="pt-2 space-y-2 text-xs text-[#BFAEA0] dark:text-[#A8988B]">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center gap-2 hover:text-[#C5A059] dark:hover:text-[#E28C38] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059] dark:text-[#E28C38]" />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2 hover:text-[#C5A059] dark:hover:text-[#E28C38] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C5A059] dark:text-[#E28C38]" />
                <span>{COMPANY_INFO.email}</span>
              </a>
            </div>
          </div>

          {/* Column: Experiences */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              Experiences
            </h4>
            <ul className="space-y-2 text-xs text-[#BFAEA0]">
              <li>
                <button
                  onClick={() => onSelectTripType('Honeymoon')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Honeymoon trips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Luxury Europe Tour')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Europe tours
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Quick Getaway')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Bali escapes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Corporate Travel')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Corporate travel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Family Holiday')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Family holidays
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Quick Getaway')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Quick getaways
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Destinations */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              Destinations
            </h4>
            <ul className="space-y-2 text-xs text-[#BFAEA0]">
              <li>
                <button
                  onClick={() => onSelectDestination('Bali, Indonesia')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Bali, Indonesia
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Switzerland')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Switzerland
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Paris, France')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Paris, France
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Santorini')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Santorini
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Maldives')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Maldives
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="text-[#C5A059] hover:underline font-semibold transition-colors"
                >
                  All destinations →
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Company */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-[#BFAEA0]">
              <li>
                <button
                  onClick={() => onNavigate('philosophy')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  About us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  How it works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stories')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Client stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packages')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Visual gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  Contact us
                </button>
              </li>
              <li>
                <button
                  onClick={onPlanTrip}
                  className="text-[#C5A059] hover:underline font-semibold transition-colors"
                >
                  Plan my trip →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E8C7F]">
          <div className="space-y-1 text-center sm:text-left">
            <p>© {COMPANY_INFO.currentYear} My Kind of Travel. All rights reserved. Crafting extraordinary journeys since {COMPANY_INFO.establishedYear}.</p>
            <p className="text-[#BFAEA0]">
              Designed with bespoke care for India's luxury travellers,{' '}
              <a
                href={COMPANY_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5A059] hover:underline"
              >
                {COMPANY_INFO.website}
              </a>
            </p>
            <div className="pt-2">
              <a href="/admin/login" className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[#9E8C7F] hover:text-[#C5A059] transition-colors border border-[#3D251A] hover:border-[#C5A059]/30 rounded-md px-2 py-1 bg-[#1A110B]">
                Admin CMS Login
              </a>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#271911] text-[#EADFD5] hover:text-white transition-colors border border-[#3D251A]"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
