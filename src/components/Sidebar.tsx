import React from 'react';
import {
  Compass,
  Phone,
  MessageCircle,
  X,
  ArrowRight,
  Sparkles,
  MapPin,
  Plane,
  Clock,
  Heart,
  ShieldCheck,
  Calendar,
  Layers,
  Camera,
  Sun,
  Moon,
} from 'lucide-react';
import { COMPANY_INFO, DESTINATIONS } from '../data/travelData';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanTripClick: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onPlanTripClick,
  onNavigate,
}) => {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { label: 'Our Philosophy', id: 'philosophy', icon: Sparkles, desc: 'Bespoke by design' },
    { label: 'Destinations', id: 'destinations', icon: MapPin, desc: 'Bali, Swiss, Paris & more' },
    { label: 'Visual Moments', id: 'gallery', icon: Camera, desc: 'Wanderlust photo mosaic' },
    { label: 'Flight Corridors', id: 'radar', icon: Plane, desc: 'Direct routes from India' },
    { label: 'What We Curate', id: 'experiences', icon: Layers, desc: 'Honeymoon, Luxury & Corporate' },
    { label: 'How It Works', id: 'how-it-works', icon: Clock, desc: '4-step journey flow' },
    { label: 'Popular Packages', id: 'packages', icon: Calendar, desc: 'Ready to personalise' },
    { label: 'Real Stories', id: 'stories', icon: Heart, desc: 'Client reviews & milestones' },
    { label: 'Why Us & Promise', id: 'why-us', icon: ShieldCheck, desc: 'The difference you feel' },
    { label: 'Get in Touch', id: 'contact', icon: Phone, desc: 'Start custom planning' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    onClose();
  };

  const handlePlanClick = () => {
    onPlanTripClick();
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer Container in Glassmorphic White / Obsidian Espresso */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 sm:w-96 bg-[#FAF7F2]/95 dark:bg-[#0E0A08]/95 backdrop-blur-2xl border-r border-[#EADFD5] dark:border-white/10 text-[#2A1810] dark:text-white shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar navigation"
      >
        {/* Top Header with Brand & Close Button */}
        <div className="p-5 sm:p-6 border-b border-[#EADFD5] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#120D0B] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8C5528] dark:bg-[#C87428] text-white flex items-center justify-center border border-[#70421D] dark:border-white/20 shadow-md shadow-[#8C5528]/20">
                <Compass className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-[#2A1810] dark:text-white block leading-tight">
                  My Kind of Travel
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C5528] dark:text-[#E28C38] font-bold block">
                  Bespoke Luxury Journeys
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-[#594336] dark:text-white border border-[#DFD0C0] dark:border-white/15 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Main Navigation Menu */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C5528] dark:text-[#E28C38]">
                Explore & Plan
              </span>
              {/* Theme toggle inside drawer */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-white/10 border border-[#DFD0C0] dark:border-white/15 text-xs font-semibold text-[#594336] dark:text-white hover:bg-white transition-all shadow-2xs"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#8C5528]" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="w-full px-3.5 py-2.5 rounded-xl hover:bg-white/80 dark:hover:bg-white/10 text-[#3D2B22] dark:text-white/90 hover:text-[#8C5528] dark:hover:text-white flex items-center justify-between group transition-all text-left border border-transparent hover:border-[#EADFD5] dark:hover:border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 group-hover:bg-[#8C5528]/15 dark:group-hover:bg-[#C87428]/25 text-[#8C5528] dark:text-[#E28C38] flex items-center justify-center border border-[#EADFD5] dark:border-white/10 group-hover:border-[#8C5528]/30 transition-colors">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold block group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] transition-colors">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-[#7C685B] dark:text-[#A8988C] block">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B5A496] dark:text-white/40 group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Destination Pins */}
          <div className="space-y-2 pt-4 border-t border-[#EADFD5] dark:border-white/10">
            <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#7C685B] dark:text-neutral-400 block">
              Trending Destinations
            </span>
            <div className="flex flex-wrap gap-1.5 px-3">
              {DESTINATIONS.slice(0, 6).map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => handleNavClick('destinations')}
                  className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-white/10 hover:bg-[#8C5528] dark:hover:bg-[#C87428] text-[#594336] dark:text-neutral-200 hover:text-white border border-[#EADFD5] dark:border-white/10 text-xs font-semibold transition-colors"
                >
                  {dest.name.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions & Direct Contacts */}
        <div className="p-5 sm:p-6 border-t border-[#EADFD5] dark:border-white/10 bg-[#FAF7F2] dark:bg-[#120D0B] shrink-0 space-y-3.5">
          {/* Primary CTA Button */}
          <button
            onClick={handlePlanClick}
            className="w-full py-3.5 rounded-xl bg-[#8C5528] dark:bg-[#C87428] hover:bg-[#72421D] dark:hover:bg-[#B86620] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#8C5528]/25 flex items-center justify-center gap-2 border border-white/20"
          >
            <span>Plan My Trip</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Contact Actions Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="px-3 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-[#F4ECE4] dark:hover:bg-white/15 text-[#2A1810] dark:text-white border border-[#EADFD5] dark:border-white/10 flex items-center justify-center gap-2 font-semibold transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#8C5528] dark:text-[#E28C38]" />
              <span>Call Us</span>
            </a>

            <a
              href={`https://wa.me/${COMPANY_INFO.phoneRaw}?text=Hi%20My%20Kind%20of%20Travel%2C%20I%20would%20like%20to%20plan%20a%20luxury%20holiday.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 rounded-xl bg-[#E6F4EA] dark:bg-[#064E3B]/40 hover:bg-[#D7EEDF] dark:hover:bg-[#064E3B]/60 text-[#22543D] dark:text-[#A7F3D0] border border-[#B7DFC2] dark:border-[#059669]/40 flex items-center justify-center gap-2 font-semibold transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#34D399]" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Support Hours */}
          <div className="text-center pt-1">
            <span className="text-[11px] text-[#7C685B] dark:text-neutral-400 font-medium">
              Concierge Active: {COMPANY_INFO.supportHours}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
