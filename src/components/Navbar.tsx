import React, { useState, useEffect, useRef } from 'react';
import { Compass, Search, ChevronDown, Menu, X, ArrowRight, Sun, Moon, MapPin, Sparkles } from 'lucide-react';
import { DESTINATIONS, COMPANY_INFO } from '../data/travelData';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onPlanTripClick: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenSidebar?: () => void;
  onSelectDestination?: (destId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onPlanTripClick,
  onNavigate,
  onOpenSidebar,
  onSelectDestination,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  const filteredDestinations = searchQuery.trim()
    ? DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleDestinationClick = (destId: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    if (onSelectDestination) {
      onSelectDestination(destId);
    } else {
      onNavigate('destinations');
    }
  };

  return (
    <>
      {/* Top Header: Deep Dark Brown (#201109) with Crisp White (#FFFFFF) & Caramel Accent */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#201109]/95 backdrop-blur-xl border-b border-[#3D2315] dark:border-white/10 shadow-[0_10px_35px_rgba(20,10,5,0.6)] py-2.5 sm:py-3'
            : 'bg-[#201109] border-b border-[#331C10] py-3 sm:py-3.5'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Compass Monogram & My Kind of Travel Branding */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('hero')}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
                aria-label="My Kind of Travel Home"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center group-hover:bg-[#C87428]/25 group-hover:border-[#C87428]/50 transition-all shadow-sm">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2] group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-white/90 transition-colors block leading-tight">
                    My Kind of Travel
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.22em] text-[#C87428] font-bold block">
                    Bespoke Luxury Journeys
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Center Navigation Bar: Clean Dark Brown & White Hierarchy */}
            <nav className="hidden lg:flex items-center space-x-5 xl:space-x-6">
              {/* HOME */}
              <button
                onClick={() => onNavigate('hero')}
                className="text-xs font-bold uppercase tracking-wider text-[#C87428] hover:text-[#E28C38] transition-colors py-1 relative"
              >
                HOME
              </button>

              {/* DESTINATIONS Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setActiveDropdown('destinations')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => onNavigate('destinations')}
                  className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white hover:text-[#C87428] transition-colors py-1"
                >
                  <span>DESTINATIONS</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {activeDropdown === 'destinations' && (
                  <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-[#28160D] border border-[#482819] rounded-2xl shadow-2xl p-2.5 backdrop-blur-2xl">
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#C87428]">
                        Curated Destinations
                      </div>
                      <div className="space-y-0.5">
                        {DESTINATIONS.slice(0, 7).map((dest) => (
                          <button
                            key={dest.id}
                            onClick={() => handleDestinationClick(dest.id)}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/90 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-between group/item"
                          >
                            <span>{dest.name}</span>
                            <ArrowRight className="w-3 h-3 text-[#C87428] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setActiveDropdown(null);
                            onNavigate('destinations');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#C87428] hover:bg-[#C87428]/20 transition-colors border-t border-[#482819] mt-1 flex items-center justify-between"
                        >
                          <span>View All Destinations</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PACKAGES */}
              <button
                onClick={() => onNavigate('packages')}
                className="text-xs font-semibold uppercase tracking-wider text-white hover:text-[#C87428] transition-colors py-1"
              >
                PACKAGES
              </button>

              {/* EXPERIENCES Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setActiveDropdown('experiences')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => onNavigate('experiences')}
                  className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white hover:text-[#C87428] transition-colors py-1"
                >
                  <span>EXPERIENCES</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {activeDropdown === 'experiences' && (
                  <div className="absolute top-full left-0 pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-[#28160D] border border-[#482819] rounded-2xl shadow-2xl p-2.5 backdrop-blur-2xl">
                      <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#C87428]">
                        Holiday Pillars
                      </div>
                      <div className="space-y-0.5">
                        {[
                          'Private Pool Villas',
                          'Alpine & Glacial Rail',
                          'Honeymoon Caldera Suites',
                          'Michelin & Wine Tastings',
                          'Island Overwater Bungalows',
                          'Zen Ryokans & Onsens',
                        ].map((exp, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setActiveDropdown(null);
                              onNavigate('experiences');
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            {exp}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* MOMENTS / GALLERY */}
              <button
                onClick={() => onNavigate('gallery')}
                className="text-xs font-semibold uppercase tracking-wider text-white hover:text-[#C87428] transition-colors py-1"
              >
                MOMENTS
              </button>

              {/* HOW IT WORKS */}
              <button
                onClick={() => onNavigate('how-it-works')}
                className="text-xs font-semibold uppercase tracking-wider text-white hover:text-[#C87428] transition-colors py-1"
              >
                HOW IT WORKS
              </button>

              {/* ABOUT */}
              <button
                onClick={() => onNavigate('about')}
                className="text-xs font-semibold uppercase tracking-wider text-white hover:text-[#C87428] transition-colors py-1"
              >
                ABOUT
              </button>

              {/* CONTACT */}
              <button
                onClick={() => onNavigate('contact')}
                className="text-xs font-semibold uppercase tracking-wider text-white hover:text-[#C87428] transition-colors py-1"
              >
                CONTACT
              </button>
            </nav>

            {/* Right: Search, Theme Toggle & Plan Trip Button */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                title="Search destinations & itineraries"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Theme Toggle (Light / Dark) */}
              <button
                onClick={toggleTheme}
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all duration-300 border border-white/15 hover:border-white/30 active:scale-90 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C87428]"
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label="Toggle theme"
              >
                <Sun
                  className={`w-4 h-4 text-amber-300 transition-all duration-500 ease-out transform ${
                    isDark
                      ? 'rotate-0 scale-100 opacity-100'
                      : 'rotate-90 scale-0 opacity-0 absolute pointer-events-none'
                  }`}
                />
                <Moon
                  className={`w-4 h-4 text-white/90 transition-all duration-500 ease-out transform ${
                    !isDark
                      ? 'rotate-0 scale-100 opacity-100'
                      : '-rotate-90 scale-0 opacity-0 absolute pointer-events-none'
                  }`}
                />
              </button>

              {/* Plan Trip Button: Crisp Pure White Button with Dark Brown Text */}
              <button
                onClick={onPlanTripClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FAF7F4] text-[#201109] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 border border-white/20"
              >
                <span>Plan Trip</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Overlay */}
        {searchOpen && (
          <div className="absolute top-full inset-x-0 bg-[#24140D]/98 border-b border-[#442718] p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="relative">
                <Search className="w-5 h-5 text-white/50 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Bali, Switzerland, Paris, Maldives, honeymoon escapes..."
                  className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#C87428] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Preview */}
              {searchQuery.trim() && (
                <div className="max-h-72 overflow-y-auto space-y-1 pt-2">
                  {filteredDestinations.length > 0 ? (
                    filteredDestinations.map((dest) => (
                      <button
                        key={dest.id}
                        onClick={() => handleDestinationClick(dest.id)}
                        className="w-full p-3 rounded-xl hover:bg-white/10 text-left flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-[#C87428]" />
                          <div>
                            <span className="font-semibold text-white text-sm block">{dest.name}</span>
                            <span className="text-xs text-white/70">{dest.region} • {dest.priceNote}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-white/60 text-center py-4">
                      No destinations matching "{searchQuery}". Try "Bali", "Switzerland", or "Santorini".
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#24140D] border-b border-[#3D2315] px-6 py-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('hero');
                }}
                className="text-left font-bold uppercase tracking-wider text-[#C87428] text-sm py-1.5"
              >
                HOME
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('destinations');
                }}
                className="text-left font-semibold uppercase tracking-wider text-white text-sm py-1.5 border-t border-[#3D2315] flex items-center justify-between"
              >
                <span>DESTINATIONS</span>
                <span className="text-[11px] text-[#C87428]">Explore</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('packages');
                }}
                className="text-left font-semibold uppercase tracking-wider text-white text-sm py-1.5 border-t border-[#3D2315]"
              >
                PACKAGES
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('experiences');
                }}
                className="text-left font-semibold uppercase tracking-wider text-white text-sm py-1.5 border-t border-[#3D2315]"
              >
                EXPERIENCES
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('gallery');
                }}
                className="text-left font-semibold uppercase tracking-wider text-white text-sm py-1.5 border-t border-[#3D2315]"
              >
                MOMENTS
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('how-it-works');
                }}
                className="text-left font-semibold uppercase tracking-wider text-white text-sm py-1.5 border-t border-[#3D2315]"
              >
                HOW IT WORKS
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('about');
                }}
                className="text-left font-semibold uppercase tracking-wider text-white text-sm py-1.5 border-t border-[#3D2315]"
              >
                ABOUT
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('contact');
                }}
                className="text-left font-semibold uppercase tracking-wider text-white text-sm py-1.5 border-t border-[#3D2315]"
              >
                CONTACT
              </button>
            </div>

            <div className="pt-3 border-t border-[#3D2315] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSidebar?.();
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold uppercase tracking-wider flex-1"
              >
                Sidebar Menu
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPlanTripClick();
                }}
                className="px-4 py-2.5 rounded-xl bg-white text-[#201109] text-xs font-bold uppercase tracking-wider flex-1"
              >
                Plan Trip
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
