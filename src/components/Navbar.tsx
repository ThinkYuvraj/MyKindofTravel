import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, Compass, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

interface NavbarProps {
  onPlanTripClick: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onPlanTripClick, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Philosophy', id: 'philosophy' },
    { label: 'Destinations', id: 'destinations' },
    { label: 'What We Curate', id: 'experiences' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Packages', id: 'packages' },
    { label: 'Stories', id: 'stories' },
    { label: 'Why Us', id: 'why-us' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#141412]/95 backdrop-blur-md border-b border-stone-800/80 shadow-xl py-3.5'
          : 'bg-[#181816] border-b border-stone-800/50 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleItemClick('hero')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100 flex items-center justify-center shadow-lg shadow-amber-900/20 group-hover:scale-105 transition-transform border border-amber-500/30">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-100 group-hover:text-amber-300 transition-colors">
                My Kind of Travel
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-amber-400/90 font-medium">
                Bespoke Luxury Journeys
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="text-xs tracking-wider uppercase font-medium text-stone-300 hover:text-amber-300 transition-colors py-1 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-amber-400 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`https://wa.me/${COMPANY_INFO.phoneRaw}?text=Hi%20My%20Kind%20of%20Travel%2C%20I%20would%20like%20to%20plan%20a%20luxury%20holiday.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-700/40 transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">{COMPANY_INFO.phone}</span>
              <span className="xl:hidden">WhatsApp</span>
            </a>

            <button
              onClick={onPlanTripClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-amber-500/20 active:scale-98"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`https://wa.me/${COMPANY_INFO.phoneRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-emerald-400 bg-emerald-950/50 border border-emerald-600/30"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-300 hover:text-white bg-stone-800/80 border border-stone-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161614] border-b border-stone-800 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="text-left px-3 py-2.5 rounded-lg text-xs font-semibold text-stone-300 hover:text-amber-300 hover:bg-stone-800/60"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-800 flex flex-col gap-2.5">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-stone-800 text-stone-200 text-xs font-semibold"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call +91 87696 88369</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onPlanTripClick();
              }}
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
