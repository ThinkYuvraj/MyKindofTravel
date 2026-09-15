import React from 'react';
import { Compass, Phone, Mail, MessageCircle, ArrowUp, Sparkles, Heart } from 'lucide-react';
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
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100 flex items-center justify-center border border-amber-500/30">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                  My Kind of Travel
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-amber-400 font-semibold">
                  Bespoke Luxury Journeys
                </span>
              </div>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Bespoke luxury travel experiences designed around you — not a brochure. For Indian travellers who believe the journey is as important as the destination.
            </p>

            <div className="pt-2 space-y-2 text-xs text-stone-400">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center gap-2 hover:text-amber-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{COMPANY_INFO.email}</span>
              </a>
            </div>
          </div>

          {/* Column: Experiences */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              Experiences
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onSelectTripType('Honeymoon')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Honeymoon trips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Luxury Europe Tour')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Europe tours
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Quick Getaway')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Bali escapes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Corporate Travel')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Corporate travel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Family Holiday')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Family holidays
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTripType('Quick Getaway')}
                  className="hover:text-amber-400 transition-colors"
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
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onSelectDestination('Bali, Indonesia')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Bali, Indonesia
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Switzerland')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Switzerland
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Paris, France')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Paris, France
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Santorini')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Santorini
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDestination('Maldives')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Maldives
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('destinations')}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
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
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onNavigate('philosophy')}
                  className="hover:text-amber-400 transition-colors"
                >
                  About us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-amber-400 transition-colors"
                >
                  How it works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stories')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Client stories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packages')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Packages
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact us
                </button>
              </li>
              <li>
                <button
                  onClick={onPlanTrip}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  Plan my trip →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="space-y-1 text-center sm:text-left">
            <p>© {COMPANY_INFO.currentYear} My Kind of Travel. All rights reserved. Crafting extraordinary journeys since {COMPANY_INFO.establishedYear}.</p>
            <p className="text-stone-400">
              Designed with ♥ for India's luxury travellers,{' '}
              <a
                href={COMPANY_INFO.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline"
              >
                {COMPANY_INFO.website}
              </a>
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-white transition-colors border border-stone-800"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
