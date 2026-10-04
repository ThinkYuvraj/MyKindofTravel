import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Star,
  ShieldCheck,
  Plane,
  MessageCircle,
  Sliders,
  MapPin,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/travelData';

export type TripTypeOption = 'Couple' | 'Honeymoon' | 'Family' | 'Corporate';
export type PropertyCategory = '1★' | '2★' | '3★' | '4★' | '5★';
export type VibeOption =
  | 'Romantic Hideaway'
  | 'Scenic & Slow-Paced'
  | 'Alpine & Glacial'
  | 'Riviera Glamour'
  | 'Cultural & Epicurean'
  | 'Wellness Sanctuary';

export type BudgetTier = 'Smart Luxury' | 'Signature Luxury' | 'Ultra-Luxe Bespoke';

interface CuratedBlueprint {
  id: string;
  name: string;
  region: string;
  duration: string;
  highlight: string;
  defaultVibe: VibeOption;
  image: string;
  routeSummary: string;
  experiences: string[];
}

const CURATED_BLUEPRINTS: CuratedBlueprint[] = [
  {
    id: 'amalfi-capri',
    name: 'Amalfi Coastline & Capri Yacht Odyssey',
    region: 'Italy',
    duration: '7 Nights',
    highlight: 'Cliffside boutique villa, private Riva boat to Capri, and Michelin clifftop dining.',
    defaultVibe: 'Riviera Glamour',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80',
    routeSummary: 'Naples ➔ Sorrento ➔ Positano ➔ Capri ➔ Ravello',
    experiences: [
      'Private Riva speedboat day charter around Capri grottos',
      'Sunset wine tasting on Ravello cliffside terrace',
      'Chauffeured scenic coastal drive via Amalfi highway'
    ]
  },
  {
    id: 'swiss-alpine',
    name: 'Swiss Alpine Glaciers & Chalet Sanctuary',
    region: 'Switzerland',
    duration: '8 Nights',
    highlight: 'Matterhorn view chalet, Glacier Express first class, and Jungfraujoch summit excursion.',
    defaultVibe: 'Alpine & Glacial',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
    routeSummary: 'Zurich ➔ Lucerne ➔ Interlaken ➔ Zermatt ➔ Geneva',
    experiences: [
      'First-Class Glacier Express panoramic journey',
      'Private helicopter flight overlooking Matterhorn north face',
      'Thermal bath spa day in Alpine luxury sanctuary'
    ]
  },
  {
    id: 'santorini-cyclades',
    name: 'Santorini Caldera & Cycladic Sunsets',
    region: 'Greece',
    duration: '6 Nights',
    highlight: 'Private infinity plunge pool in Oia, catamaran sunset cruise, and volcanic vineyard tour.',
    defaultVibe: 'Romantic Hideaway',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80',
    routeSummary: 'Athens ➔ Mykonos ➔ Paros ➔ Santorini Oia',
    experiences: [
      'Private luxury catamaran sailing around the caldera',
      'Sommelier-guided Assyrtiko wine tasting at dusk',
      'Private terrace candlelit dinner overlooking Aegean Sea'
    ]
  },
  {
    id: 'french-riviera-provence',
    name: 'French Riviera & Provence Country Estate',
    region: 'France',
    duration: '7 Nights',
    highlight: 'Monaco harbour helicopter, Cannes private beach club, and private lavender estate.',
    defaultVibe: 'Cultural & Epicurean',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    routeSummary: 'Nice ➔ Monaco ➔ Cannes ➔ Gordes / Provence',
    experiences: [
      'Helicopter transfer from Nice to Monaco harbour',
      'Private truffle hunting and Châteauneuf-du-Pape tasting',
      'VIP cabana reservation at iconic Cap d’Antibes club'
    ]
  }
];

export const DreamToDepartureStudio: React.FC = () => {
  // Step state: 1: Curated, 2: Personalize, 3: Confirm, 4: Depart
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Selections
  const [selectedBlueprint, setSelectedBlueprint] = useState<CuratedBlueprint>(CURATED_BLUEPRINTS[0]);
  const [tripType, setTripType] = useState<TripTypeOption>('Couple');
  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>('5★');
  const [vibe, setVibe] = useState<VibeOption>('Riviera Glamour');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('Signature Luxury');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([
    'Private Chauffeured Mercedes S-Class',
    'Private Sunset Yacht Charter'
  ]);
  const [confirmedRef, setConfirmedRef] = useState<string>('');

  const toggleAddon = (addon: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const handleConfirm = () => {
    const ref = `MKT-DEPART-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedRef(ref);
    setCurrentStep(4);
  };

  // WhatsApp Link pre-filled with all personalized details
  const whatsappBookingUrl = `https://wa.me/${COMPANY_INFO.phoneRaw}?text=${encodeURIComponent(
    `Hello My Kind of Travel Team, I'd like to confirm my personalized journey from Dream to Departure:

• Blueprint: ${selectedBlueprint.name} (${selectedBlueprint.duration})
• Trip Type: ${tripType}
• Property Category: ${propertyCategory}
• Vibe: ${vibe}
• Budget Comfort Tier: ${budgetTier}
• Experiences Selected: ${selectedAddons.join(', ')}
• Reference: ${confirmedRef || 'Ready to lock in'}

Please share availability and current bespoke perks for this curated itinerary.`
  )}`;

  return (
    <section id="dream-to-departure" className="py-20 sm:py-24 bg-white dark:bg-black border-b border-neutral-200 dark:border-white/10 relative transition-colors duration-300">
      <div className="section-container relative z-10">
        
        {/* Section Header with Explicit Niche Positioning */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111111] border border-neutral-200 dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>My Dream to Departure · Clearly Defined Niche</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white font-serif leading-tight">
            Curated. Ready to Personalize.
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Never build a luxury trip from scratch. We provide masterfully handcrafted starting points — ready for you to personalize, confirm with dedicated concierge, and depart in effortless luxury.
          </p>
        </div>

        {/* 4-Step Visual Progress Track: Curated -> Personalize -> Confirm -> Depart */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 p-1.5 sm:p-2 bg-neutral-100 dark:bg-[#111111] rounded-2xl sm:rounded-3xl border border-neutral-200 dark:border-white/10">
            {[
              { num: 1, title: 'Curated', desc: 'Choose Blueprint' },
              { num: 2, title: 'Personalize', desc: 'Tailor Vibe & Levers' },
              { num: 3, title: 'Confirm', desc: 'Concierge Lock' },
              { num: 4, title: 'Depart', desc: 'Live Dossier' }
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num as any)}
                className={`py-2 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-center transition-all ${
                  currentStep === s.num
                    ? 'bg-white dark:bg-[#222222] text-neutral-900 dark:text-white shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                    currentStep === s.num
                      ? 'bg-[#E37500] text-white'
                      : 'bg-black/5 dark:bg-white/10 text-current'
                  }`}>
                    {s.num}
                  </span>
                  <span className="font-bold text-xs sm:text-sm hidden sm:inline">{s.title}</span>
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 hidden md:block mt-0.5">
                  {s.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Studio Interactive Card (Softsurface Container) */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-[#0B0B0B] border border-neutral-200 dark:border-white/10 rounded-3xl sm:rounded-4xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)] transition-all">
          
          {/* STEP 1: CURATED STARTING POINT WITH AUTO-SWIPE CARET CAROUSEL */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-white/10 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#E37500]">
                    Step 01 · Curated Blueprint
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
                    Select Your Starting Journey
                  </h3>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  <span>4 Master Blueprints Available</span>
                </div>
              </div>

              {/* Responsive Grid for All Devices (MacBook Air, iPad, iPhone, Android, Kali, Windows) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {CURATED_BLUEPRINTS.map((bp) => {
                  const isSelected = selectedBlueprint.id === bp.id;
                  return (
                    <div
                      key={bp.id}
                      onClick={() => {
                        setSelectedBlueprint(bp);
                        setVibe(bp.defaultVibe);
                      }}
                      className={`relative rounded-3xl overflow-hidden border cursor-pointer transition-all duration-300 group flex flex-col sm:flex-row bg-neutral-50 dark:bg-[#0E0E0E] ${
                        isSelected
                          ? 'border-[#E37500] ring-2 ring-[#E37500]/30 shadow-[0_12px_32px_rgba(227,117,0,0.18)]'
                          : 'border-neutral-200 dark:border-white/10 hover:border-[#E37500]/50 shadow-xs'
                      }`}
                    >
                      {/* Image Frame */}
                      <div className="w-full sm:w-2/5 h-44 sm:h-auto relative overflow-hidden shrink-0">
                        <img
                          src={bp.image}
                          alt={bp.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                          {bp.region} · {bp.duration}
                        </div>
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-[#E37500] text-white py-1 px-2.5 rounded-full shadow-md flex items-center gap-1 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Selected</span>
                          </div>
                        )}
                        <div className="absolute bottom-2.5 left-3 right-3 sm:hidden">
                          <h4 className="font-serif text-base font-bold text-white leading-snug line-clamp-1">
                            {bp.name}
                          </h4>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-4 sm:p-5 sm:w-3/5 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E37500]">
                            {bp.defaultVibe}
                          </span>
                          <h4 className="hidden sm:block font-serif text-lg font-bold text-neutral-900 dark:text-white leading-snug">
                            {bp.name}
                          </h4>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                            {bp.highlight}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                          <span className="flex items-center gap-1 font-medium truncate pr-2">
                            <MapPin className="w-3.5 h-3.5 text-[#E37500] shrink-0" />
                            <span className="truncate max-w-[150px]">{bp.routeSummary}</span>
                          </span>
                          <span className={`shrink-0 font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                            isSelected ? 'bg-[#E37500]/10 text-[#E37500]' : 'text-neutral-500 dark:text-neutral-400'
                          }`}>
                            {isSelected ? 'Selected' : 'Select'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next Step Action with Pill Shaped Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-neutral-600 dark:text-neutral-300">
                  Ready to personalize: <strong>{selectedBlueprint.name}</strong>
                </span>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(227,117,0,0.25)] active:scale-95 transition-all"
                >
                  <span>Personalize This Journey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONALIZE (Experience-first, Personalization-driven) */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-white/10 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#E37500]">
                    Step 02 · Personalize Every Dimension
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
                    Tailor to Your Rhythm, Vibe & Party
                  </h3>
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Experience-first · Budget as supporting constraint
                </span>
              </div>

              {/* 1. TRIP TYPE SELECTOR */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#E37500]" />
                  <span>Trip Type</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['Couple', 'Honeymoon', 'Family', 'Corporate'] as TripTypeOption[]).map((type) => {
                    const isSelected = tripType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setTripType(type)}
                        className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#E37500] text-white border-[#E37500] shadow-[0_6px_18px_rgba(227,117,0,0.2)]'
                            : 'bg-white dark:bg-[#141414] text-neutral-900 dark:text-white border-neutral-200 dark:border-white/10 hover:border-[#E37500]'
                        }`}
                      >
                        <span className="font-bold text-xs sm:text-sm">{type}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-neutral-500 dark:text-neutral-400'}`}>
                          {type === 'Couple' && 'Romantic Pacing'}
                          {type === 'Honeymoon' && 'Caldera & Champagne'}
                          {type === 'Family' && 'Private Villa & Space'}
                          {type === 'Corporate' && 'Executive Logistics'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. PROPERTY CATEGORY (1★ to 5★) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#E37500]" />
                    <span>Property Category</span>
                  </label>
                  <span className="text-xs text-[#E37500] font-semibold">
                    {propertyCategory === '5★' && '5★ Ultra-Luxury Palaces & Private Signature Villas'}
                    {propertyCategory === '4★' && '4★ Premium Boutique & Heritage Resorts'}
                    {propertyCategory === '3★' && '3★ Curated Design Hotels & Manor Stays'}
                    {propertyCategory === '2★' && '2★ Authentic Family-Run Country Inns'}
                    {propertyCategory === '1★' && '1★ Characterful Rustic Hideaways & Chalets'}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {(['1★', '2★', '3★', '4★', '5★'] as PropertyCategory[]).map((cat) => {
                    const isSelected = propertyCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setPropertyCategory(cat)}
                        className={`py-3 rounded-2xl border font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-[#E37500] text-white border-[#E37500] shadow-[0_6px_18px_rgba(227,117,0,0.2)]'
                            : 'bg-white dark:bg-[#141414] text-neutral-900 dark:text-white border-neutral-200 dark:border-white/10 hover:border-[#E37500]'
                        }`}
                      >
                        <span>{cat}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: parseInt(cat) }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2.5 h-2.5 fill-current ${
                                isSelected ? 'text-white' : 'text-[#E37500]'
                              }`}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. VIBE SELECTOR */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E37500]" />
                  <span>Desired Vibe</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(
                    [
                      'Romantic Hideaway',
                      'Scenic & Slow-Paced',
                      'Alpine & Glacial',
                      'Riviera Glamour',
                      'Cultural & Epicurean',
                      'Wellness Sanctuary'
                    ] as VibeOption[]
                  ).map((v) => {
                    const isSelected = vibe === v;
                    return (
                      <button
                        key={v}
                        onClick={() => setVibe(v)}
                        className={`p-3 rounded-2xl border text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-white dark:bg-[#222222] text-[#E37500] border-[#E37500] shadow-sm ring-1 ring-[#E37500]'
                            : 'bg-white dark:bg-[#141414] text-neutral-900 dark:text-white border-neutral-200 dark:border-white/10 hover:border-[#E37500]/50'
                        }`}
                      >
                        <span>{v}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. EXPERIENCE-FIRST CURATED ADD-ONS */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#E37500]" />
                  <span>Signature Experiences (Experience-First Levers)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    'Private Sunset Yacht Charter with Champagne',
                    'Scenic Helicopter Transfer / Aerial Tour',
                    'Private Sommelier Wine Cellar Pairing',
                    'Private Chauffeured Mercedes S-Class',
                    'Fast-Track VIP Airport Meet & Assist',
                    'Michelin-Starred Clifftop Table Reservation'
                  ].map((exp) => {
                    const isSelected = selectedAddons.includes(exp);
                    return (
                      <button
                        key={exp}
                        onClick={() => toggleAddon(exp)}
                        className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-white dark:bg-[#222222] border-[#E37500] text-neutral-900 dark:text-white shadow-xs'
                            : 'bg-white dark:bg-[#141414] border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        <span className="font-medium pr-2">{exp}</span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-[#E37500] border-[#E37500] text-white'
                            : 'border-neutral-300 dark:border-white/20'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. BUDGET AS SUPPORTING CONSTRAINT */}
              <div className="space-y-3 p-4 rounded-2xl bg-neutral-50 dark:bg-[#111111] border border-neutral-200 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#E37500]" />
                    <span>Budget as a Supporting Constraint</span>
                  </label>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Supporting parameter · Not a restrictive wall
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(['Smart Luxury', 'Signature Luxury', 'Ultra-Luxe Bespoke'] as BudgetTier[]).map((tier) => {
                    const isSelected = budgetTier === tier;
                    return (
                      <button
                        key={tier}
                        onClick={() => setBudgetTier(tier)}
                        className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                          isSelected
                            ? 'bg-white dark:bg-[#222222] border-[#E37500] text-[#E37500] font-bold shadow-xs'
                            : 'bg-white/80 dark:bg-white/5 border-transparent text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {tier}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-neutral-200 dark:border-white/10">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-semibold text-neutral-600 dark:text-neutral-300"
                >
                  ← Back to Blueprints
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-2xl bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_6px_20px_rgba(227,117,0,0.25)] active:scale-95 transition-all"
                >
                  <span>Review Personalized Blueprint</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRM (Concierge Precision) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-white/10 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#E37500]">
                    Step 03 · Concierge Confirmation
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-white">
                    Confirm Your Personalized Itinerary
                  </h3>
                </div>
                <span className="text-xs text-[#E37500] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  White-Glove Guarantee
                </span>
              </div>

              {/* Summary Dossier Card */}
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-[#0E0E0E] border border-neutral-200 dark:border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#E37500] font-bold">
                      Curated Starting Point
                    </span>
                    <h4 className="font-serif text-xl font-bold text-neutral-900 dark:text-white">
                      {selectedBlueprint.name}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white bg-white dark:bg-white/10 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-white/10">
                    {selectedBlueprint.duration}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-white/10">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Trip Type</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{tripType}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-white/10">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Stay Category</span>
                    <span className="font-bold text-[#E37500]">{propertyCategory} Star Stays</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-white/10">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Selected Vibe</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{vibe}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-white/10">
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">Budget Comfort Tier</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{budgetTier}</span>
                  </div>
                </div>

                {/* Experiences */}
                {selectedAddons.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                      Included Signature Experiences ({selectedAddons.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedAddons.map((exp, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#141414] border border-neutral-200 dark:border-white/10 text-xs text-neutral-900 dark:text-white font-medium"
                        >
                          ✓ {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmation Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-xs font-semibold text-neutral-600 dark:text-neutral-300"
                >
                  ← Modify Personalization
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={whatsappBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleConfirm()}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(227,117,0,0.25)] transition-all"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Lock In via WhatsApp Concierge</span>
                  </a>

                  <button
                    onClick={handleConfirm}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(227,117,0,0.25)] transition-all"
                  >
                    <span>Confirm Itinerary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DEPART (Dream to Departure) */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center py-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-[#E37500]/10 dark:bg-[#E37500]/20 text-[#E37500] dark:text-[#E37500] border border-[#E37500]/30 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-[11px] uppercase tracking-widest text-[#E37500] font-bold">
                  Step 04 · Ready to Depart
                </span>
                <h3 className="font-serif text-3xl font-bold text-neutral-900 dark:text-white">
                  Your Journey Blueprint is Ready
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Your personal travel director is curating live partner upgrades and verifying transit fluidity for <strong>{selectedBlueprint.name}</strong>.
                </p>
                <div className="mt-3 p-3 bg-neutral-100 dark:bg-[#111111] rounded-2xl border border-neutral-200 dark:border-white/10 text-xs font-mono text-[#E37500]">
                  Reference ID: {confirmedRef || 'MKT-DEPART-849201'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <a
                  href={whatsappBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_6px_20px_rgba(227,117,0,0.25)] transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat with Dedicated Concierge</span>
                </a>

                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-full border border-neutral-200 dark:border-white/10 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95"
                >
                  Personalize Another Trip
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
