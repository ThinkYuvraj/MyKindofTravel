import React, { useState } from 'react';
import { Plane, Clock, ArrowRight } from 'lucide-react';

interface RouteData {
  id: string;
  origin: string;
  originCode: string;
  destination: string;
  destCode: string;
  region: string;
  duration: string;
  distance: string;
  classStyle: string;
  highlight: string;
  coordinates: string;
}

const ROUTES: RouteData[] = [
  {
    id: 'bali',
    origin: 'Delhi / Mumbai',
    originCode: 'DEL / BOM',
    destination: 'Bali, Indonesia',
    destCode: 'DPS',
    region: 'South-East Asia',
    duration: '8h 45m · Direct & 1-Stop VIP',
    distance: '5,820 km',
    classStyle: 'Private Pool Villa & Chauffeured SUV',
    highlight: 'Floating champagne breakfast & Uluwatu cliff sunsets',
    coordinates: '8.3405° S, 115.0920° E',
  },
  {
    id: 'switzerland',
    origin: 'Mumbai / Delhi',
    originCode: 'BOM / DEL',
    destination: 'Zurich & Swiss Alps',
    destCode: 'ZRH',
    region: 'Central Europe',
    duration: '8h 30m · Direct Swiss / Air India',
    distance: '6,540 km',
    classStyle: '1st Class Panoramic Rail & Alpine Chalet',
    highlight: 'Glacier Express & Jungfraujoch 3,454m private excursion',
    coordinates: '46.8182° N, 8.2275° E',
  },
  {
    id: 'amalfi',
    origin: 'Delhi / Mumbai',
    originCode: 'DEL / BOM',
    destination: 'Amalfi & Naples',
    destCode: 'NAP',
    region: 'Southern Europe',
    duration: '9h 40m · European Corridor Transit',
    distance: '6,180 km',
    classStyle: 'Cliffside Plunge Pool Suite & Private Riva',
    highlight: 'Private Capri yacht charter & cliffside lemon grove dining',
    coordinates: '40.6340° N, 14.6027° E',
  },
  {
    id: 'paris',
    origin: 'Delhi / Mumbai',
    originCode: 'DEL / BOM',
    destination: 'Paris, France',
    destCode: 'CDG',
    region: 'Western Europe',
    duration: '9h 15m · Direct Air France / Vistara',
    distance: '6,600 km',
    classStyle: '5-Star Boutique Suite & Private Concierge',
    highlight: 'After-hours Louvre & Seine gourmet candlelit dinner cruise',
    coordinates: '48.8566° N, 2.3522° E',
  },
  {
    id: 'kyoto',
    origin: 'Delhi / Mumbai',
    originCode: 'DEL / BOM',
    destination: 'Kyoto & Tokyo',
    destCode: 'HND',
    region: 'East Asia',
    duration: '8h 20m · Direct ANA / Air India',
    distance: '5,960 km',
    classStyle: 'Private Onsen Ryokan & Shinkansen Gran Class',
    highlight: 'Private Geisha tea ceremony & Arashiyama bamboo grove twilight walk',
    coordinates: '35.0116° N, 135.7681° E',
  },
  {
    id: 'santorini',
    origin: 'Delhi / Mumbai',
    originCode: 'DEL / BOM',
    destination: 'Santorini, Greece',
    destCode: 'JTR',
    region: 'Aegean Sea',
    duration: '10h 30m · 1-Stop Luxury Transit',
    distance: '5,300 km',
    classStyle: 'Cliffside Caldera Cave Suite & Hot Tub',
    highlight: 'Private sunset catamaran sailing with Aegean seafood BBQ',
    coordinates: '36.3932° N, 25.4615° E',
  },
  {
    id: 'maldives',
    origin: 'Mumbai / Kochi / Delhi',
    originCode: 'BOM / COK / DEL',
    destination: 'Maldives Overwater',
    destCode: 'MLE',
    region: 'Indian Ocean',
    duration: '2h 45m · Short Flight Luxury Escape',
    distance: '1,660 km',
    classStyle: 'Private Seaplane & Overwater Pool Bungalow',
    highlight: 'Direct turquoise lagoon slide & private sandbank dining',
    coordinates: '3.2028° N, 73.2207° E',
  },
];

interface FlightRouteRadarProps {
  onSelectRoute: (destinationName: string) => void;
}

export const FlightRouteRadar: React.FC<FlightRouteRadarProps> = ({ onSelectRoute }) => {
  const [activeRouteId, setActiveRouteId] = useState<string>('bali');

  const currentRoute = ROUTES.find((r) => r.id === activeRouteId) || ROUTES[0];

  return (
    <section id="radar" className="py-16 bg-[#F5EFEB] dark:bg-[#0E0A08] text-[#2A1810] dark:text-white border-y border-[#EADFD5] dark:border-white/10 relative overflow-hidden transition-colors duration-300">
      {/* Background Animated Flight Path Grid in subtle warm brown */}
      <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="flight-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#8C5528" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#flight-grid)" />
        </svg>
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] text-xs font-bold uppercase tracking-widest border border-[#DFD0C0]/80 dark:border-white/10 backdrop-blur-md shadow-xs">
              <Plane className="w-3.5 h-3.5 -rotate-45" />
              <span>Direct Route Radar</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2A1810] dark:text-white">
              Bespoke Flight Corridors <span className="italic font-serif text-[#8C5528] dark:text-[#E28C38] font-normal">from India</span>
            </h2>

            <p className="text-[#594336] dark:text-[#D1C2B8] text-xs sm:text-sm max-w-xl font-normal">
              Preview flight times, curated connections, and signature on-ground luxury waiting for you at each destination.
            </p>
          </div>

          {/* Route Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {ROUTES.map((route) => (
              <button
                key={route.id}
                onClick={() => setActiveRouteId(route.id)}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs backdrop-blur-md ${
                  activeRouteId === route.id
                    ? 'bg-[#8C5528] dark:bg-[#C87428] text-white shadow-md'
                    : 'bg-white/80 dark:bg-white/10 text-[#594336] dark:text-neutral-200 hover:text-[#2A1810] dark:hover:text-white border border-[#EADFD5] dark:border-white/10'
                }`}
              >
                <span>{route.destination.split(',')[0]}</span>
                <span className="text-[10px] opacity-80 font-mono">({route.destCode})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Flight Boarding Pass Card */}
        <div className="rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-[#16100D]/85 border border-white/80 dark:border-white/10 p-4 sm:p-8 shadow-[0_12px_40px_rgba(42,24,16,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] relative overflow-hidden">
          {/* Animated Flight Arc Line */}
          <div className="relative py-2 sm:py-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-between relative z-10 gap-2">
              {/* Origin */}
              <div className="space-y-0.5 sm:space-y-1 shrink-0">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#8C5528] dark:text-[#E28C38] block">
                  Departure
                </span>
                <span className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-[#2A1810] dark:text-white tracking-tight block">
                  {currentRoute.originCode}
                </span>
                <span className="text-[11px] sm:text-xs text-[#7C685B] dark:text-neutral-400 block font-medium max-w-[100px] sm:max-w-none truncate sm:overflow-visible">
                  {currentRoute.origin}
                </span>
              </div>

              {/* Animated Flight Path Center Graphic */}
              <div className="flex-1 px-2 sm:px-8 md:px-12 flex flex-col items-center min-w-0">
                <div className="w-full relative flex items-center justify-center">
                  <div className="w-full h-0.5 border-t-2 border-dashed border-[#8C5528]/40 dark:border-[#E28C38]/40" />
                  <div className="absolute p-2 sm:p-2.5 rounded-full bg-white dark:bg-[#1A1310] border-2 border-[#8C5528] dark:border-[#E28C38] text-[#8C5528] dark:text-[#E28C38] shadow-md shadow-[#8C5528]/20 -rotate-45 animate-pulse">
                    <Plane className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 text-[10px] sm:text-[11px] font-bold text-[#8C5528] dark:text-[#E28C38] text-center">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                  <span>{currentRoute.duration}</span>
                  <span className="text-[#C5A059] hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{currentRoute.distance}</span>
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-0.5 sm:space-y-1 text-right shrink-0">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#8C5528] dark:text-[#E28C38] block">
                  Arrival
                </span>
                <span className="font-serif text-xl sm:text-3xl md:text-4xl font-bold text-[#2A1810] dark:text-white tracking-tight block">
                  {currentRoute.destCode}
                </span>
                <span className="text-[11px] sm:text-xs text-[#7C685B] dark:text-neutral-400 block font-medium max-w-[100px] sm:max-w-none truncate sm:overflow-visible">
                  {currentRoute.destination.split(',')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Route Perks & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-[#EADFD5]/80 dark:border-white/10">
            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#120D0B] border border-[#EADFD5] dark:border-white/10 space-y-1 shadow-xs">
              <span className="text-[11px] text-[#7C685B] dark:text-neutral-400 uppercase tracking-wider block font-bold">
                Arrival & Ground Handling
              </span>
              <p className="text-xs sm:text-sm font-medium text-[#2A1810] dark:text-white">
                {currentRoute.classStyle}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#120D0B] border border-[#EADFD5] dark:border-white/10 space-y-1 shadow-xs">
              <span className="text-[11px] text-[#7C685B] dark:text-neutral-400 uppercase tracking-wider block font-bold">
                Curated Experience
              </span>
              <p className="text-xs sm:text-sm font-medium text-[#2A1810] dark:text-white">
                {currentRoute.highlight}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F4ECE4] dark:bg-white/10 border border-[#DFD0C0] dark:border-white/15 flex items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[10px] text-[#8C5528] dark:text-[#E28C38] uppercase tracking-wider block font-bold">
                  GPS Coordinates
                </span>
                <span className="text-xs text-[#2A1810] dark:text-white font-mono font-medium">
                  {currentRoute.coordinates}
                </span>
              </div>

              <button
                onClick={() => onSelectRoute(currentRoute.destination)}
                className="px-4 py-2 rounded-xl bg-[#8C5528] dark:bg-[#C87428] hover:bg-[#72421D] dark:hover:bg-[#B86620] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-[#8C5528]/20 shrink-0 active:scale-95 border border-white/20"
              >
                <span>Plan Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
