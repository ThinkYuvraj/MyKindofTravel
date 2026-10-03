import React, { useState, useEffect, useRef } from 'react';
import { Compass, Search, ChevronDown, Menu, X, ArrowRight, Sun, Moon, MapPin, Sparkles, Heart } from 'lucide-react';
import { DESTINATIONS, COMPANY_INFO } from '../data/travelData';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';

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
  const { items: wishlistItems, setIsOpen: setWishlistOpen } = useWishlist();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
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
      {/* Floating Pill-Shaped Navbar Container */}
      <header className="fixed top-3 sm:top-5 inset-x-0 mx-auto w-[94%] max-w-5xl z-50 transition-all duration-300 pointer-events-auto">
        <div
          className={`w-full rounded-full transition-all duration-300 px-3.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-3 ${
            scrolled
              ? 'bg-white/95 dark:bg-[#18110D]/95 backdrop-blur-2xl border border-[#DFD0C0]/90 dark:border-white/15 shadow-[0_14px_40px_rgba(36,19,10,0.12)] dark:shadow-[0_16px_45px_rgba(0,0,0,0.7)]'
              : 'bg-white/90 dark:bg-[#18110D]/90 backdrop-blur-xl border border-[#E4D7CB]/80 dark:border-white/10 shadow-[0_8px_30px_rgba(36,19,10,0.07)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Left: Compass Monogram & Branding */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none"
              aria-label="My Kind of Travel Home"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E37500]/15 dark:bg-[#E37500]/25 border border-[#E37500]/30 text-[#E37500] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#E37500] group-hover:text-white transition-all shadow-xs">
                <Compass className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2] transition-transform duration-300 group-hover:rotate-45" />
              </div>
              <div>
                <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#24130A] dark:text-white group-hover:text-[#E37500] transition-colors block leading-tight">
                  My Kind of Travel
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-[#E37500] font-bold block leading-none">
                  Bespoke Luxury
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Center Navigation Bar */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 text-xs font-bold uppercase tracking-wider">
            {/* HOME */}
            <button
              onClick={() => onNavigate('hero')}
              className="px-3 py-1.5 rounded-full text-[#E37500] hover:bg-[#E37500]/10 transition-colors"
            >
              Home
            </button>

            {/* DESTINATIONS Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('destinations')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => onNavigate('destinations')}
                className="px-3 py-1.5 rounded-full text-[#382318] dark:text-neutral-200 hover:text-[#E37500] dark:hover:text-[#E37500] hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
              >
                <span>Destinations</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8D7466] group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {activeDropdown === 'destinations' && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white/95 dark:bg-[#1C130E]/95 border border-[#DFD0C0] dark:border-white/15 rounded-2xl shadow-2xl p-2.5 backdrop-blur-2xl text-left">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#E37500]">
                      Curated Destinations
                    </div>
                    <div className="space-y-0.5">
                      {DESTINATIONS.slice(0, 7).map((dest) => (
                        <button
                          key={dest.id}
                          onClick={() => handleDestinationClick(dest.id)}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#2A1810] dark:text-white hover:bg-[#E37500]/10 hover:text-[#E37500] transition-colors flex items-center justify-between group/item"
                        >
                          <span className="font-semibold">{dest.name}</span>
                          <ArrowRight className="w-3 h-3 text-[#E37500] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          onNavigate('destinations');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#E37500] hover:bg-[#E37500]/15 transition-colors border-t border-[#EADFD5] dark:border-white/10 mt-1 flex items-center justify-between"
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
              className="px-3 py-1.5 rounded-full text-[#382318] dark:text-neutral-200 hover:text-[#E37500] dark:hover:text-[#E37500] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Packages
            </button>

            {/* EXPERIENCES Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setActiveDropdown('experiences')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => onNavigate('experiences')}
                className="px-3 py-1.5 rounded-full text-[#382318] dark:text-neutral-200 hover:text-[#E37500] dark:hover:text-[#E37500] hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
              >
                <span>Experiences</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8D7466] group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {activeDropdown === 'experiences' && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white/95 dark:bg-[#1C130E]/95 border border-[#DFD0C0] dark:border-white/15 rounded-2xl shadow-2xl p-2.5 backdrop-blur-2xl text-left">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#E37500]">
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
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#2A1810] dark:text-white hover:bg-[#E37500]/10 hover:text-[#E37500] transition-colors font-medium"
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MOMENTS */}
            <button
              onClick={() => onNavigate('gallery')}
              className="px-3 py-1.5 rounded-full text-[#382318] dark:text-neutral-200 hover:text-[#E37500] dark:hover:text-[#E37500] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Moments
            </button>

            {/* ABOUT */}
            <button
              onClick={() => onNavigate('about')}
              className="px-3 py-1.5 rounded-full text-[#382318] dark:text-neutral-200 hover:text-[#E37500] dark:hover:text-[#E37500] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              About
            </button>

            {/* CONTACT */}
            <button
              onClick={() => onNavigate('contact')}
              className="px-3 py-1.5 rounded-full text-[#382318] dark:text-neutral-200 hover:text-[#E37500] dark:hover:text-[#E37500] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Right: Search, Wishlist, Theme Toggle & Plan Trip Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#24130A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Search destinations & itineraries"
              aria-label="Search"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Wishlist Pill Button (Web App Feature) */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#24130A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="View Saved Journeys"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 stroke-[2.2] ${wishlistItems.length > 0 ? 'fill-[#E37500] text-[#E37500]' : ''}`} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E37500] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#24130A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#5A3825]" />
              )}
            </button>

            {/* Plan Trip Button: Pill-shaped with requested #E37500 colour */}
            <button
              onClick={onPlanTripClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#E37500] hover:bg-[#C66500] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#E37500]/25 hover:shadow-lg border border-[#E37500]/40 shrink-0"
            >
              <span>Plan Trip</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-[#24130A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Live Search Floating Card Dropdown */}
        {searchOpen && (
          <div className="mt-2 w-full max-w-2xl mx-auto bg-white/95 dark:bg-[#1C130E]/95 border border-[#DFD0C0] dark:border-white/15 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="relative">
              <Search className="w-5 h-5 text-[#8D7466] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Bali, Switzerland, Paris, Maldives, honeymoon escapes..."
                className="w-full pl-12 pr-10 py-3 rounded-2xl bg-[#FAF6F1] dark:bg-white/10 border border-[#EADFD5] dark:border-white/15 text-[#24130A] dark:text-white placeholder-[#8D7466] text-sm focus:outline-none focus:ring-2 focus:ring-[#E37500] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-[#24130A] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results Preview */}
            {searchQuery.trim() && (
              <div className="max-h-72 overflow-y-auto space-y-1 pt-3">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => handleDestinationClick(dest.id)}
                      className="w-full p-3 rounded-2xl hover:bg-[#E37500]/10 text-left flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#E37500]" />
                        <div>
                          <span className="font-semibold text-[#24130A] dark:text-white text-sm block">
                            {dest.name}
                          </span>
                          <span className="text-xs text-[#6E5548] dark:text-neutral-300">
                            {dest.region} • {dest.priceNote}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8D7466] group-hover:text-[#E37500] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-[#8D7466] text-center py-4">
                    No destinations matching "{searchQuery}". Try "Bali", "Switzerland", or "Santorini".
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation Floating Pill Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 w-full bg-white/95 dark:bg-[#1C130E]/95 border border-[#DFD0C0] dark:border-white/15 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('hero');
                }}
                className="text-left text-[#E37500] py-2 px-3 rounded-xl hover:bg-[#E37500]/10"
              >
                Home
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('destinations');
                }}
                className="text-left text-[#24130A] dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-between"
              >
                <span>Destinations</span>
                <span className="text-[10px] text-[#E37500] normal-case font-semibold">Explore</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('packages');
                }}
                className="text-left text-[#24130A] dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
              >
                Packages
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('experiences');
                }}
                className="text-left text-[#24130A] dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
              >
                Experiences
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('gallery');
                }}
                className="text-left text-[#24130A] dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
              >
                Moments
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('how-it-works');
                }}
                className="text-left text-[#24130A] dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
              >
                How It Works
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('about');
                }}
                className="text-left text-[#24130A] dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
              >
                About
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('contact');
                }}
                className="text-left text-[#24130A] dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
              >
                Contact
              </button>
            </div>

            <div className="pt-3 border-t border-[#DFD0C0] dark:border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSidebar?.();
                }}
                className="px-4 py-2.5 rounded-full bg-[#FAF6F1] dark:bg-white/10 text-[#24130A] dark:text-white text-xs font-bold uppercase tracking-wider flex-1 text-center"
              >
                Menu Drawer
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPlanTripClick();
                }}
                className="px-4 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex-1 text-center shadow-md shadow-[#E37500]/25"
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
