import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { EnquiryModal } from '../components/EnquiryModal';
import { WishlistModal } from '../components/WishlistModal';
import {
  Plane,
  Compass,
  Search,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Calendar,
  Users,
  Wallet,
  Heart,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Send,
  Star,
  ChevronDown,
  Info,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

interface StayLocation {
  id: string;
  name: string;
  region: string;
  nights: number;
  hotelName: string;
  hotelTier: string;
  image: string;
  tag: string;
  pricePerNight: number;
  highlights: string[];
  isOptional?: boolean;
  isActive?: boolean;
}

interface DestinationPlan {
  id: string;
  name: string;
  heroHeadline: string;
  heroImage: string;
  basePricePerPerson: number;
  budgetLabel: string;
  defaultWho: string;
  defaultNights: number;
  defaultBudget: string;
  defaultVibe: string;
  stays: StayLocation[];
}

const DESTINATION_PLANS: Record<string, DestinationPlan> = {
  bali: {
    id: 'bali',
    name: 'Bali',
    heroHeadline: 'Bali, planned your way',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
    basePricePerPerson: 80640,
    budgetLabel: 'Within your Premium budget',
    defaultWho: 'Couple · 2',
    defaultNights: 6,
    defaultBudget: 'Premium',
    defaultVibe: 'Romance, Culture, Food',
    stays: [
      {
        id: 'ubud',
        name: 'Ubud',
        region: 'Culture & Jungle',
        nights: 3,
        hotelName: 'Komaneka at Bisma Sanctuary',
        hotelTier: 'Private Pool Jungle Villa',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        tag: 'Rainforest Bliss',
        pricePerNight: 24000,
        highlights: ['Floating Breakfast in Plunge Pool', 'Ayung River Valley View', 'Private Yoga Shala'],
        isActive: true,
      },
      {
        id: 'seminyak',
        name: 'Seminyak',
        region: 'Coastal Chic & Dining',
        nights: 3,
        hotelName: 'The Elysian Boutique Enclave',
        hotelTier: 'Private Courtyard Pool Villa',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        tag: 'Sunset & Beach Clubs',
        pricePerNight: 28000,
        highlights: ['5 Mins to Beachfront Clubs', 'Private Frangipani Garden', 'Chauffeured Dinner Transfers'],
        isActive: true,
      },
      {
        id: 'uluwatu',
        name: 'Uluwatu',
        region: 'Cliffs & Ocean Temples',
        nights: 2,
        hotelName: 'Alila Villas Clifftop Reserve',
        hotelTier: 'Ocean View Cliff Villa',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
        tag: 'Panoramic Cliffs',
        pricePerNight: 36000,
        highlights: ['Sunset Kecak Dance VIP Seats', 'Cliff-Edge Infinity Cabana', 'Private Butler Service'],
        isOptional: true,
        isActive: false,
      },
    ],
  },
  switzerland: {
    id: 'switzerland',
    name: 'Switzerland',
    heroHeadline: 'Switzerland, planned your way',
    heroImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80',
    basePricePerPerson: 168000,
    budgetLabel: 'Within your Signature Luxury budget',
    defaultWho: 'Couple · 2',
    defaultNights: 7,
    defaultBudget: 'Signature Luxury',
    defaultVibe: 'Glaciers, Scenic Rail, Alps',
    stays: [
      {
        id: 'interlaken',
        name: 'Interlaken',
        region: 'Bernese Oberland',
        nights: 4,
        hotelName: 'Victoria-Jungfrau Grand Hotel & Spa',
        hotelTier: '5-Star Alpine Palace',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        tag: 'Glacier Gateway',
        pricePerNight: 42000,
        highlights: ['Jungfraujoch 1st-Class Pass', 'Private Lake Thun Cruise', 'Spa Nescens Access'],
        isActive: true,
      },
      {
        id: 'zermatt',
        name: 'Zermatt',
        region: 'Matterhorn Alpine Valley',
        nights: 3,
        hotelName: 'The Omnia Mountain Lodge',
        hotelTier: 'Matterhorn View Chalet',
        image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80',
        tag: 'Matterhorn Panoramas',
        pricePerNight: 48000,
        highlights: ['Glacier Express Excellence Class', 'Indoor-Outdoor Thermal Pool', 'Private Cedar Fireplace'],
        isActive: true,
      },
      {
        id: 'stmoritz',
        name: 'St. Moritz',
        region: 'Engadin Glamour',
        nights: 2,
        hotelName: 'Badrutt’s Palace Hotel',
        hotelTier: 'Historic Luxury Grand Suite',
        image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80',
        tag: 'Aristocratic Glamour',
        pricePerNight: 55000,
        highlights: ['Rolls Royce Chauffeur', 'Private Lake Skating / Boating', 'Michelin Alpine Dining'],
        isOptional: true,
        isActive: false,
      },
    ],
  },
  amalfi: {
    id: 'amalfi',
    name: 'Amalfi Coast',
    heroHeadline: 'Amalfi Coast, planned your way',
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80',
    basePricePerPerson: 185000,
    budgetLabel: 'Within your Mediterranean Chic budget',
    defaultWho: 'Couple · 2',
    defaultNights: 6,
    defaultBudget: 'Premium',
    defaultVibe: 'Riviera, Private Yacht, Wine',
    stays: [
      {
        id: 'positano',
        name: 'Positano',
        region: 'Pastel Cliffside Bay',
        nights: 3,
        hotelName: 'Le Sirenuse Heritage Suites',
        hotelTier: 'Clifftop Sea View Suite',
        image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
        tag: 'Iconic Pastel Bay',
        pricePerNight: 52000,
        highlights: ['Private Balcony Over Positano', 'Franco’s Bar VIP Reservation', 'Majolica Tile Jacuzzi'],
        isActive: true,
      },
      {
        id: 'capri',
        name: 'Capri',
        region: 'Island Aristocracy',
        nights: 3,
        hotelName: 'Capri Tiberio Palace',
        hotelTier: 'Boutique Sea View Enclave',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        tag: 'Faraglioni & Blue Grotto',
        pricePerNight: 49000,
        highlights: ['Private Riva Speedboat Charter', 'Anacapri Chairlift Excursion', 'Limoncello Tasting Masterclass'],
        isActive: true,
      },
      {
        id: 'ravello',
        name: 'Ravello',
        region: 'High Ridge Gardens',
        nights: 2,
        hotelName: 'Caruso, A Belmond Hotel',
        hotelTier: 'Infinity Cliffside Palace',
        image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80',
        tag: 'Classical Serenity',
        pricePerNight: 58000,
        highlights: ['World-Famous Cliffside Infinity Pool', 'Villa Cimbrone Garden Stroll', 'Private Terrace Chamber Concert'],
        isOptional: true,
        isActive: false,
      },
    ],
  },
};

export default function PlanTripPage() {
  const navigate = useNavigate();

  // Current active destination
  const [selectedDestId, setSelectedDestId] = useState<string>('bali');
  const activePlan = DESTINATION_PLANS[selectedDestId] || DESTINATION_PLANS.bali;

  // Search capsule preference parameters
  const [who, setWho] = useState<string>(activePlan.defaultWho);
  const [nights, setNights] = useState<number>(activePlan.defaultNights);
  const [budget, setBudget] = useState<string>(activePlan.defaultBudget);
  const [vibe, setVibe] = useState<string>(activePlan.defaultVibe);

  // Stays management (track which optional stays are toggled)
  const [staysState, setStaysState] = useState<Record<string, boolean>>({
    ubud: true,
    seminyak: true,
    uluwatu: false,
    interlaken: true,
    zermatt: true,
    stmoritz: false,
    positano: true,
    capri: true,
    ravello: false,
  });

  // Modal Concierge state
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryDestination, setEnquiryDestination] = useState('');
  const [enquiryTripType, setEnquiryTripType] = useState('');

  // Active stays calculation
  const activeStays = useMemo(() => {
    return activePlan.stays.filter((s) => (!s.isOptional ? true : staysState[s.id]));
  }, [activePlan, staysState]);

  const optionalStay = activePlan.stays.find((s) => s.isOptional);
  const isOptionalActive = optionalStay ? staysState[optionalStay.id] : false;

  // Dynamic price calculation
  const calculatedPrice = useMemo(() => {
    let base = activePlan.basePricePerPerson;
    if (optionalStay && staysState[optionalStay.id]) {
      base += Math.round(optionalStay.pricePerNight * 0.65);
    }
    return base;
  }, [activePlan, optionalStay, staysState]);

  const totalNights = useMemo(() => {
    return activeStays.reduce((acc, s) => acc + s.nights, 0);
  }, [activeStays]);

  // Toggle optional destination stay
  const handleToggleOptionalStay = (id: string) => {
    setStaysState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Switch destination and reset states
  const handleSelectDestination = (destId: string) => {
    setSelectedDestId(destId);
    const newPlan = DESTINATION_PLANS[destId];
    if (newPlan) {
      setWho(newPlan.defaultWho);
      setNights(newPlan.defaultNights);
      setBudget(newPlan.defaultBudget);
      setVibe(newPlan.defaultVibe);
    }
  };

  const handleOpenConcierge = () => {
    const routeNames = activeStays.map((s) => `${s.name} (${s.nights}N)`).join(' + ');
    setEnquiryDestination(`${activePlan.name} (${routeNames})`);
    setEnquiryTripType(`${who} · ${totalNights} Nights · ${budget} Budget (${vibe})`);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-black text-[#24130A] dark:text-white flex flex-col font-sans transition-colors duration-300">
      {/* Navbar */}
      <Navbar onPlanTrip={handleOpenConcierge} />

      <main className="flex-1 pt-24 sm:pt-28 pb-32">
        <div className="section-container max-w-7xl space-y-12">
          
          {/* Quick Destination Switcher Pills */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-[#8C7667] dark:text-[#A7978A] mr-1">
                Destination:
              </span>
              {Object.values(DESTINATION_PLANS).map((p) => {
                const isActive = p.id === selectedDestId;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectDestination(p.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#E37500] text-white shadow-xs scale-105'
                        : 'bg-white dark:bg-[#141414] text-[#6F5B4E] dark:text-[#C5B7AC] hover:bg-neutral-100 dark:hover:bg-white/10 border border-[#E8DFD5] dark:border-white/10'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#8C7667] dark:text-[#A7978A]">
              <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
              <span>Interactive Itinerary Atelier</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* HERO BANNER WITH INTEGRATED FLOATING SEARCH CAPSULE */}
          {/* ============================================================ */}
          <div className="relative">
            {/* Rounded Hero Banner */}
            <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] rounded-3xl sm:rounded-[36px] overflow-hidden shadow-2xl bg-neutral-900 border border-black/10">
              <img
                src={activePlan.heroImage}
                alt={activePlan.heroHeadline}
                className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
              />
              {/* Subtle Gradient Overlays for perfect legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />

              {/* Bold Title at Bottom-Left inside Banner */}
              <div className="absolute bottom-16 sm:bottom-20 left-6 sm:left-12 max-w-2xl text-white">
                <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg leading-tight">
                  {activePlan.heroHeadline}
                </h1>
              </div>
            </div>

            {/* Floating Search Capsule Bar overlapping bottom of hero banner */}
            <div className="relative -mt-10 sm:-mt-12 max-w-4xl mx-auto px-3 sm:px-6 z-20">
              <div className="p-3 sm:p-4 rounded-3xl sm:rounded-full bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 shadow-[0_16px_50px_rgba(42,24,16,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 transition-all">
                
                {/* Field 1: Who */}
                <div className="flex-1 px-4 py-1.5 border-b sm:border-b-0 sm:border-r border-[#E8DFD5] dark:border-white/10">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#8C7667] dark:text-[#A7978A]">
                    Who
                  </span>
                  <select
                    value={who}
                    onChange={(e) => setWho(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#24130A] dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Couple · 2">Couple · 2</option>
                    <option value="Solo Traveler · 1">Solo · 1</option>
                    <option value="Family · 3-4">Family · 3-4</option>
                    <option value="Group · 5+">Group · 5+</option>
                  </select>
                </div>

                {/* Field 2: Nights */}
                <div className="flex-1 px-4 py-1.5 border-b sm:border-b-0 sm:border-r border-[#E8DFD5] dark:border-white/10">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#8C7667] dark:text-[#A7978A]">
                    Nights
                  </span>
                  <select
                    value={nights}
                    onChange={(e) => setNights(Number(e.target.value))}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#24130A] dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value={4}>4 nights</option>
                    <option value={6}>6 nights</option>
                    <option value={8}>8 nights</option>
                    <option value={10}>10 nights</option>
                    <option value={14}>14 nights</option>
                  </select>
                </div>

                {/* Field 3: Budget */}
                <div className="flex-1 px-4 py-1.5 border-b sm:border-b-0 sm:border-r border-[#E8DFD5] dark:border-white/10">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#8C7667] dark:text-[#A7978A]">
                    Budget
                  </span>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#24130A] dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Smart Luxury">Smart Luxury</option>
                    <option value="Premium">Premium</option>
                    <option value="Ultra-Luxe Bespoke">Ultra-Luxe</option>
                  </select>
                </div>

                {/* Field 4: Vibe */}
                <div className="flex-1 px-4 py-1.5">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-[#8C7667] dark:text-[#A7978A]">
                    Vibe
                  </span>
                  <select
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#24130A] dark:text-white focus:outline-none cursor-pointer truncate"
                  >
                    <option value="Romance, Culture, Food">Romance, Culture, Food</option>
                    <option value="Beaches & Sunset Lounging">Beaches & Sunset Lounging</option>
                    <option value="Alpine & Glacial Grandeur">Alpine & Glacial Grandeur</option>
                    <option value="Wellness & Quiet Hideaway">Wellness & Quiet Hideaway</option>
                  </select>
                </div>

                {/* Action Button: Plan my trip */}
                <button
                  onClick={handleOpenConcierge}
                  className="px-6 py-3 rounded-full bg-[#B85D19] hover:bg-[#A35114] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all shrink-0 hover:scale-105 active:scale-95"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Plan my trip</span>
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* "WHERE YOU'LL STAY" SECTION */}
          {/* ============================================================ */}
          <section className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#24130A] dark:text-white">
                Where you'll stay
              </h2>

              <span className="text-xs text-[#8C7667] dark:text-[#A7978A] font-semibold">
                Curated boutique & 5-star villas
              </span>
            </div>

            {/* Route Path Flow Chain */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 text-xs font-semibold">
              {/* Departure Airport */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-[#6F5B4E] dark:text-[#C5B7AC] shrink-0 shadow-xs">
                <Plane className="w-3.5 h-3.5 text-[#E37500]" />
                <span>Airport</span>
              </div>

              <span className="text-neutral-400">→</span>

              {/* Active Stays along the path */}
              {activeStays.map((stay, idx) => (
                <React.Fragment key={stay.id}>
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-[#24130A] dark:text-white shrink-0 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#185ADB]" />
                    <span className="font-bold">{stay.name}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-600 dark:text-neutral-300">{stay.nights} nights</span>
                  </div>
                  <span className="text-neutral-400">→</span>
                </React.Fragment>
              ))}

              {/* Return Airport */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-[#6F5B4E] dark:text-[#C5B7AC] shrink-0 shadow-xs">
                <Plane className="w-3.5 h-3.5 text-[#E37500]" />
                <span>Airport</span>
              </div>
            </div>

            {/* Hotel / Stay Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Primary Active Stays */}
              {activePlan.stays.filter((s) => !s.isOptional).map((stay) => (
                <div
                  key={stay.id}
                  className="group rounded-3xl overflow-hidden bg-white dark:bg-[#0E0E0E] border border-[#E8DFD5] dark:border-white/10 shadow-[0_8px_30px_rgba(42,24,16,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between transition-all hover:-translate-y-1 hover:border-[#E37500]/60"
                >
                  {/* Photo with aspect ratio */}
                  <div className="w-full h-52 sm:h-56 relative overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <img
                      src={stay.image}
                      alt={stay.hotelName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/20">
                      {stay.name} · {stay.nights} Nights
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#E37500] font-bold uppercase tracking-wider">
                        {stay.hotelTier}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#24130A] dark:text-white leading-snug">
                        {stay.hotelName}
                      </h3>
                      <p className="text-xs text-[#8C7667] dark:text-[#A7978A] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#E37500]" />
                        <span>{stay.region}</span>
                      </p>
                    </div>

                    {/* Highlights bullet list */}
                    <div className="pt-2 border-t border-[#E8DFD5] dark:border-white/10 space-y-1">
                      {stay.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-[#6F5B4E] dark:text-[#C5B7AC]">
                          <Check className="w-3.5 h-3.5 text-[#E37500] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Optional 3rd Stay Card (+ Add Destination) */}
              {optionalStay && (
                <div
                  className={`group rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between relative ${
                    isOptionalActive
                      ? 'bg-white dark:bg-[#0E0E0E] border-[#E37500] shadow-[0_8px_30px_rgba(227,117,0,0.15)]'
                      : 'bg-white/80 dark:bg-[#0E0E0E]/80 border-dashed border-[#DFD0C0] dark:border-white/20 hover:border-[#E37500]/60'
                  }`}
                >
                  <div className="w-full h-52 sm:h-56 relative overflow-hidden bg-neutral-200 dark:bg-neutral-900">
                    <img
                      src={optionalStay.image}
                      alt={optionalStay.hotelName}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isOptionalActive ? 'opacity-100 group-hover:scale-105' : 'opacity-65 filter saturate-75'
                      }`}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
                      <button
                        onClick={() => handleToggleOptionalStay(optionalStay.id)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
                          isOptionalActive
                            ? 'bg-white text-neutral-900 hover:bg-neutral-100'
                            : 'bg-white/95 hover:bg-white text-[#24130A] border border-white/20 scale-105'
                        }`}
                      >
                        {isOptionalActive ? (
                          <>
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            <span>Remove {optionalStay.name}</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 text-[#E37500]" />
                            <span>+ Add {optionalStay.name}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {isOptionalActive && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#E37500] text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
                        Added: {optionalStay.name} · {optionalStay.nights}N
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#E37500] font-bold uppercase tracking-wider">
                        {optionalStay.hotelTier}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-[#24130A] dark:text-white leading-snug">
                        {optionalStay.hotelName}
                      </h3>
                      <p className="text-xs text-[#8C7667] dark:text-[#A7978A] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#E37500]" />
                        <span>{optionalStay.region}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E8DFD5] dark:border-white/10 space-y-1">
                      {optionalStay.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-[#6F5B4E] dark:text-[#C5B7AC]">
                          <Check className="w-3.5 h-3.5 text-[#E37500] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ============================================================ */}
          {/* WHAT'S INCLUDED BESPOKE PERKS */}
          {/* ============================================================ */}
          <section className="p-7 sm:p-9 rounded-3xl bg-white dark:bg-[#0E0E0E] border border-[#E8DFD5] dark:border-white/10 space-y-4 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-[#24130A] dark:text-white">
              Every curated itinerary includes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#6F5B4E] dark:text-[#C5B7AC]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#E37500] shrink-0" />
                <span>Private airport transfers in executive Mercedes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#E37500] shrink-0" />
                <span>Daily gourmet breakfast & VIP resort inclusions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#E37500] shrink-0" />
                <span>24/7 dedicated personal travel concierge on WhatsApp</span>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ============================================================ */}
      {/* STICKY BOTTOM PRICING & DESIGNER CONCIERGE BAR */}
      {/* ============================================================ */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#E8DFD5] dark:border-white/10 py-3.5 px-4 sm:px-8 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="section-container max-w-7xl flex items-center justify-between gap-4">
          {/* Left: Dynamic Pricing & Budget Status */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#24130A] dark:text-white tracking-tight">
                ₹{calculatedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs sm:text-sm text-neutral-500 font-normal">
                / person
              </span>
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activePlan.budgetLabel}</span>
            </div>
          </div>

          {/* Right: Send to my designer CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenConcierge}
              className="px-6 sm:px-8 py-3 rounded-2xl bg-[#B85D19] hover:bg-[#A35114] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#B85D19]/30 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Send to my designer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enquiry Concierge Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialDestination={enquiryDestination}
        initialTripType={enquiryTripType}
      />

      {/* Wishlist Modal */}
      <WishlistModal />

      {/* Footer */}
      <Footer
        onNavigate={(path) => {
          if (path === 'contact') handleOpenConcierge();
          else if (path === 'destinations') navigate('/destinations');
          else if (path === 'packages') navigate('/packages');
          else if (path === 'places') navigate('/places');
          else if (path === 'stories') navigate('/stories');
          else navigate(`/#${path}`);
        }}
        onSelectDestination={(name) => {
          setEnquiryDestination(name);
          setIsEnquiryOpen(true);
        }}
        onSelectTripType={(type) => {
          setEnquiryTripType(type);
          setIsEnquiryOpen(true);
        }}
        onPlanTrip={handleOpenConcierge}
      />

      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}
