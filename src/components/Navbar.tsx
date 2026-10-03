import React, { useState, useEffect, useRef } from 'react';
import { Compass, Search, ChevronDown, Menu, X, ArrowRight, Sun, Moon, MapPin, Heart } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  onPlanTripClick?: () => void;
  onPlanTrip?: () => void;
  onNavigate?: (sectionId: string) => void;
  onOpenSidebar?: () => void;
  onSelectDestination?: (destId: string) => void;
  onOpenMapsAgent?: (prompt?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onPlanTripClick,
  onPlanTrip,
  onNavigate,
  onOpenSidebar,
  onSelectDestination,
  onOpenMapsAgent,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const { totalSavedCount, openWishlist } = useWishlist();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handlePlanClick = () => {
    if (onPlanTripClick) {
      onPlanTripClick();
    } else if (onPlanTrip) {
      onPlanTrip();
    } else {
      navigate('/plan');
    }
  };

  const handleNavClick = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      navigate('/destinations');
    }
  };

  return (
    <>
      {/* Floating Slim Luxury Navbar */}
      <header className="fixed top-2.5 sm:top-3.5 inset-x-0 mx-auto w-[95%] max-w-6xl z-50 transition-all duration-300 pointer-events-auto">
        <div
          className={`w-full h-13 sm:h-14 rounded-full transition-all duration-300 px-3.5 sm:px-5 flex items-center justify-between gap-3 ${
            scrolled
              ? 'bg-[#FAF7F2]/95 dark:bg-[#16100D]/95 backdrop-blur-2xl border border-[#E8DFD5] dark:border-white/10 shadow-[0_8px_30px_rgba(36,19,10,0.08)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)]'
              : 'bg-[#FAF7F2]/85 dark:bg-[#16100D]/85 backdrop-blur-xl border border-[#EAE2D8]/80 dark:border-white/10 shadow-[0_4px_20px_rgba(36,19,10,0.04)] dark:shadow-[0_6px_25px_rgba(0,0,0,0.4)]'
          }`}
        >
          {/* Left: Compass Monogram & Branding */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-2 group focus:outline-none"
              aria-label="My Kind of Travel Home"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E37500]/10 text-[#E37500] border border-[#E37500]/25 flex items-center justify-center group-hover:bg-[#E37500] group-hover:text-white transition-all shadow-xs shrink-0">
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] transition-transform duration-300 group-hover:rotate-45" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-sm sm:text-base font-bold tracking-tight text-[#24130A] dark:text-white group-hover:text-[#E37500] transition-colors leading-none">
                  My Kind of Travel
                </span>
                <span className="hidden md:inline text-[9px] uppercase tracking-widest text-[#8C7667] dark:text-[#A7978A] font-medium">
                  · Bespoke
                </span>
              </div>
            </button>
          </div>

          {/* Center: Sleek Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-[12px] xl:text-[13px] font-medium text-[#4A3225] dark:text-[#E2D4C8]">
            {/* DESTINATIONS Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('destinations')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => onNavigate('destinations')}
                className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors flex items-center gap-1 group"
              >
                <span>Destinations</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'destinations' ? 'rotate-180 text-[#E37500]' : 'text-[#8D7466]'}`} />
              </button>

              {activeDropdown === 'destinations' && (
                <div className="absolute top-full left-0 pt-2 w-60 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-[#FAF7F2] dark:bg-[#1C130E] border border-[#E8DFD5] dark:border-white/10 rounded-2xl shadow-xl p-2 backdrop-blur-2xl text-left">
                    <div className="px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-[#E37500]">
                      Curated Destinations
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {DESTINATIONS.slice(0, 7).map((dest) => (
                        <button
                          key={dest.id}
                          onClick={() => handleDestinationClick(dest.id)}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-[#2A1810] dark:text-white hover:bg-[#E37500]/10 hover:text-[#E37500] transition-colors flex items-center justify-between group/item"
                        >
                          <span>{dest.name}</span>
                          <ArrowRight className="w-3 h-3 text-[#E37500] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setActiveDropdown(null);
                          onNavigate('destinations');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#E37500] hover:bg-[#E37500]/15 transition-colors border-t border-[#E8DFD5] dark:border-white/10 mt-1 flex items-center justify-between"
                      >
                        <span>View All Destinations</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PACKAGES */}
            <button
              onClick={() => onNavigate('packages')}
              className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors"
            >
              Packages
            </button>

            {/* EXPERIENCES Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('experiences')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => onNavigate('experiences')}
                className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors flex items-center gap-1 group"
              >
                <span>Experiences</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'experiences' ? 'rotate-180 text-[#E37500]' : 'text-[#8D7466]'}`} />
              </button>

              {activeDropdown === 'experiences' && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-[#FAF7F2] dark:bg-[#1C130E] border border-[#E8DFD5] dark:border-white/10 rounded-2xl shadow-xl p-2 backdrop-blur-2xl text-left">
                    <div className="px-2.5 py-1 text-[9px] uppercase font-bold tracking-widest text-[#E37500]">
                      Holiday Pillars
                    </div>
                    <div className="space-y-0.5 mt-1">
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
                          className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-[#2A1810] dark:text-white hover:bg-[#E37500]/10 hover:text-[#E37500] transition-colors"
                        >
                          {exp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LIVE MAPS AGENT */}
            {onOpenMapsAgent && (
              <button
                onClick={() => onOpenMapsAgent()}
                className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors flex items-center gap-1.5"
                title="Google Maps Route & Places Concierge"
              >
                <Compass className="w-3.5 h-3.5 text-[#E37500]" />
                <span>Live Map</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            )}

            {/* MOMENTS */}
            <button
              onClick={() => onNavigate('gallery')}
              className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors"
            >
              Moments
            </button>

            {/* ABOUT */}
            <button
              onClick={() => onNavigate('about')}
              className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors"
            >
              About
            </button>

            {/* CONTACT */}
            <button
              onClick={() => onNavigate('contact')}
              className="px-2.5 py-1 rounded-lg hover:text-[#E37500] dark:hover:text-[#E37500] transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Right: Quick Utilities & Plan Trip CTA */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#24130A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Search destinations"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#24130A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Saved Journeys"
              aria-label="Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2] ${wishlistItems.length > 0 ? 'fill-[#E37500] text-[#E37500]' : ''}`} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#E37500] text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistItems.length}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[#24130A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#5A3825]" />
              )}
            </button>

            {/* Refined Plan Trip CTA */}
            <button
              onClick={onPlanTripClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E37500] hover:bg-[#C96400] active:scale-95 text-white font-semibold text-[11px] uppercase tracking-wider transition-all shadow-xs shrink-0"
            >
              <span>Plan Trip</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-[#24130A] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-0.5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Live Search Floating Card Dropdown */}
        {searchOpen && (
          <div className="mt-2 w-full max-w-xl mx-auto bg-[#FAF7F2] dark:bg-[#1C130E] border border-[#E8DFD5] dark:border-white/10 rounded-2xl p-3 shadow-xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8D7466] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Bali, Switzerland, Paris, Maldives, Santorini..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-white dark:bg-white/10 border border-[#E5DCD2] dark:border-white/10 text-[#24130A] dark:text-white placeholder-[#8D7466] text-xs focus:outline-none focus:ring-1 focus:ring-[#E37500] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-[#24130A] dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Preview */}
            {searchQuery.trim() && (
              <div className="max-h-60 overflow-y-auto space-y-1 pt-2">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => handleDestinationClick(dest.id)}
                      className="w-full p-2 rounded-xl hover:bg-[#E37500]/10 text-left flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E37500]" />
                        <div>
                          <span className="font-semibold text-[#24130A] dark:text-white text-xs block">
                            {dest.name}
                          </span>
                          <span className="text-[10px] text-[#6E5548] dark:text-neutral-400">
                            {dest.region} · {dest.priceNote}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-[#8D7466] group-hover:text-[#E37500] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-[#8D7466] text-center py-3">
                    No destinations matching "{searchQuery}". Try "Bali", "Switzerland", or "Santorini".
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 w-full bg-[#FAF7F2] dark:bg-[#1C130E] border border-[#E8DFD5] dark:border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-2xl space-y-3 animate-in fade-in duration-150">
            <div className="flex flex-col space-y-1 text-xs font-semibold">
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
                className="text-left text-[#24130A] dark:text-white py-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10"
              >
                Destinations
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

              {onOpenMapsAgent && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMapsAgent();
                  }}
                  className="text-left text-[#E37500] font-semibold py-2 px-3 rounded-xl bg-[#E37500]/10 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Live Maps Concierge</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              )}

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

            <div className="pt-2 border-t border-[#E8DFD5] dark:border-white/10 flex items-center justify-between gap-2">
              {onOpenSidebar && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSidebar();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-white/10 text-[#24130A] dark:text-white text-xs font-semibold flex-1 text-center"
                >
                  Menu Drawer
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPlanTripClick();
                }}
                className="px-4 py-2 rounded-xl bg-[#E37500] text-white text-xs font-semibold flex-1 text-center shadow-xs"
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
