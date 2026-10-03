import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { WishlistModal } from '../components/WishlistModal';
import { DESTINATIONS, COMPANY_INFO } from '../data/travelData';
import { Compass, Check, ArrowRight, ArrowLeft, Sparkles, MessageCircle, ShieldCheck, Heart, Users, Calendar, MapPin, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TRIP_TYPES = [
  { id: 'couple', label: 'Romantic Couple', desc: 'Private intimacies & candlelit views' },
  { id: 'honeymoon', label: 'Honeymoon Bliss', desc: 'Champagne, cave suites & private villas' },
  { id: 'family', label: 'Family Vacation', desc: 'Interconnecting suites & gentle pacing' },
  { id: 'corporate', label: 'Executive Retreat', desc: 'Luxury logistics & first-class transfers' },
];

const HOTEL_TIERS = [
  { id: 'boutique', label: 'Luxury Boutique & Historic Charms', desc: 'Small-scale, character-rich boutique estates' },
  { id: '5star', label: 'Iconic 5-Star Heritage & Palaces', desc: 'World-renowned service, spas, and legendary suites' },
  { id: 'villa', label: 'Private Cliffside / Lagoon Villa', desc: 'Total privacy, private plunge pools & personal butler' },
  { id: 'chalet', label: 'Alpine Luxury Chalet', desc: 'Fireplaces, glacier panoramas & mountain retreats' },
];

const EXPERIENCES = [
  'Private Yacht / Riva Boat Charter',
  'Helicopter Glacier or Volcano Landing',
  'Private After-Hours Museum / Castle Access',
  'Michelin-Starred Cellar Wine Pairing Dinner',
  'Mercedes S-Class Chauffeured Inter-City Transfers',
  'Floating Champagne Breakfast',
];

export default function PlanTripPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form State
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['amalfi']);
  const [tripType, setTripType] = useState('couple');
  const [duration, setDuration] = useState('7-10 Days');
  const [travelMonth, setTravelMonth] = useState('Upcoming Summer');
  const [travelersCount, setTravelersCount] = useState('2 Adults');
  const [hotelTier, setHotelTier] = useState('5star');
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([
    'Private Yacht / Riva Boat Charter',
    'Michelin-Starred Cellar Wine Pairing Dinner',
  ]);
  const [budgetTier, setBudgetTier] = useState('Signature Luxury (₹1.5L - ₹3L / person)');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  const toggleDestination = (id: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((d) => d !== id) : prev) : [...prev, id]
    );
  };

  const toggleExperience = (exp: string) => {
    setSelectedExperiences((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `MKOT-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(ref);

    // Save lead to localStorage for Admin CMS leads table
    try {
      const existingLeads = JSON.parse(localStorage.getItem('mkot_leads') || '[]');
      const newLead = {
        id: ref,
        name: fullName,
        phone,
        email,
        destinations: selectedDestinations.join(', '),
        tripType,
        hotelTier,
        budgetTier,
        experiences: selectedExperiences.join(', '),
        notes,
        createdAt: new Date().toISOString(),
        status: 'new',
      };
      localStorage.setItem('mkot_leads', JSON.stringify([newLead, ...existingLeads]));
    } catch (err) {
      console.error('Failed to store lead', err);
    }

    setIsSubmitted(true);
  };

  const handleSendWhatsApp = () => {
    const text = `Hi My Kind of Travel Concierge!
I have designed my bespoke journey (Ref: ${referenceId || 'MKOT-STUDIO'}):

👤 Name: ${fullName || 'Traveler'}
📞 Phone: ${phone || 'Provided in enquiry'}
📍 Destinations: ${selectedDestinations.join(', ')}
👥 Trip Type: ${tripType} (${travelersCount})
⏱ Duration: ${duration} (${travelMonth})
🏨 Stay Style: ${hotelTier}
✨ Inclusions: ${selectedExperiences.join(', ')}
💰 Budget Tier: ${budgetTier}
📝 Notes: ${notes || 'None'}

Please share availability and tailored recommendations for this journey.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${COMPANY_INFO.phoneRaw}?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-black text-[#24130A] dark:text-white flex flex-col font-sans transition-colors duration-300">
      <Navbar onPlanTrip={() => {}} />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="section-container max-w-4xl space-y-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#111111] border border-[#E8DFD5] dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
              <Compass className="w-3.5 h-3.5" />
              <span>Bespoke Travel Atelier</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#24130A] dark:text-white">
              Design Your <span className="italic font-serif text-[#E37500] font-normal">Dream Journey</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6F5B4E] dark:text-[#C5B7AC] leading-relaxed">
              Answer 4 simple questions. We'll curate a private starting blueprint and connect you with your dedicated travel specialist.
            </p>
          </div>

          {/* Stepper Bar */}
          {!isSubmitted && (
            <div className="flex items-center justify-between p-2 bg-white dark:bg-[#111111] rounded-2xl border border-[#E8DFD5] dark:border-white/10 shadow-xs text-xs">
              {[
                { s: 1, label: '01 Destination' },
                { s: 2, label: '02 Party & Dates' },
                { s: 3, label: '03 Stays & Vibe' },
                { s: 4, label: '04 Concierge' },
              ].map((item) => (
                <div
                  key={item.s}
                  className={`flex-1 text-center py-2 px-2 rounded-xl font-bold transition-all ${
                    step === item.s
                      ? 'bg-[#E37500] text-white shadow-xs'
                      : step > item.s
                      ? 'text-[#E37500] dark:text-[#E37500] bg-[#E37500]/10'
                      : 'text-[#8C7667] dark:text-[#A7978A]'
                  }`}
                >
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">Step {item.s}</span>
                </div>
              ))}
            </div>
          )}

          {/* Form Wizard Container */}
          <div className="bg-white dark:bg-[#0E0E0E] rounded-3xl sm:rounded-4xl p-6 sm:p-10 border border-[#E8DFD5] dark:border-white/10 shadow-[0_16px_50px_rgba(42,24,16,0.06)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
            
            {!isSubmitted ? (
              <div>
                {/* STEP 1: DESTINATIONS */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Where would you like to escape?</h2>
                      <p className="text-xs sm:text-sm text-[#6F5B4E] dark:text-[#C5B7AC] mt-1">
                        Select one or more destinations to include in your bespoke itinerary.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      {DESTINATIONS.map((d) => {
                        const isSelected = selectedDestinations.includes(d.id);
                        return (
                          <div
                            key={d.id}
                            onClick={() => toggleDestination(d.id)}
                            className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-36 relative overflow-hidden group ${
                              isSelected
                                ? 'border-[#E37500] ring-2 ring-[#E37500]/30 shadow-md'
                                : 'border-[#E8DFD5] dark:border-white/10 hover:border-[#E37500]/50'
                            }`}
                          >
                            <img
                              src={d.image}
                              alt={d.name}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

                            <div className="relative z-10 flex justify-end">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                  isSelected ? 'bg-[#E37500] text-white' : 'bg-black/40 text-white/50 border border-white/20'
                                }`}
                              >
                                {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                              </div>
                            </div>

                            <div className="relative z-10 text-white space-y-0.5">
                              <span className="text-[10px] text-[#E3BA91] uppercase tracking-wider block font-bold">
                                {d.country}
                              </span>
                              <h3 className="font-serif text-sm sm:text-base font-bold leading-tight">
                                {d.name.split(',')[0]}
                              </h3>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        className="px-7 py-3 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#E37500]/25 transition-all"
                      >
                        <span>Next: Travel Party</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: TRIP TYPE & DATES */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Who is traveling and when?</h2>
                      <p className="text-xs sm:text-sm text-[#6F5B4E] dark:text-[#C5B7AC] mt-1">
                        We configure private pacing and bespoke activities based on your group dynamics.
                      </p>
                    </div>

                    {/* Trip Type Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {TRIP_TYPES.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setTripType(t.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                            tripType === t.id
                              ? 'border-[#E37500] bg-[#E37500]/5 dark:bg-[#E37500]/10 ring-1 ring-[#E37500]'
                              : 'border-[#E8DFD5] dark:border-white/10 hover:border-[#E37500]/50'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 border ${
                              tripType === t.id ? 'border-[#E37500] bg-[#E37500] text-white' : 'border-[#8C7667]'
                            }`}
                          >
                            {tripType === t.id && <Check className="w-3 h-3" />}
                          </div>
                          <div>
                            <h4 className="font-serif text-base font-bold">{t.label}</h4>
                            <p className="text-xs text-[#6F5B4E] dark:text-[#C5B7AC] mt-0.5">{t.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Duration & Month */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#8C7667]">Estimated Duration</label>
                        <select
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm font-semibold"
                        >
                          <option>5 to 7 Days (Short Getaway)</option>
                          <option>7 to 10 Days (Signature Grand Tour)</option>
                          <option>10 to 14 Days (Extended Bespoke)</option>
                          <option>14+ Days (Grand Voyage)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#8C7667]">Travel Window</label>
                        <select
                          value={travelMonth}
                          onChange={(e) => setTravelMonth(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm font-semibold"
                        >
                          <option>Within 30 Days (Immediate)</option>
                          <option>Next 1-3 Months</option>
                          <option>Upcoming Summer / Peak Season</option>
                          <option>Autumn / Winter Holiday Magic</option>
                          <option>Dates still flexible</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#8C7667]">Travelers</label>
                        <input
                          type="text"
                          value={travelersCount}
                          onChange={(e) => setTravelersCount(e.target.value)}
                          placeholder="e.g. 2 Adults, 1 Child"
                          className="w-full p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="px-5 py-2.5 rounded-full border border-[#E8DFD5] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={() => setStep(3)}
                        className="px-7 py-3 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#E37500]/25 transition-all"
                      >
                        <span>Next: Stays & Inclusions</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: HOTEL TIER & INCLUSIONS */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Stays & Signature Inclusions</h2>
                      <p className="text-xs sm:text-sm text-[#6F5B4E] dark:text-[#C5B7AC] mt-1">
                        Select the accommodation tier and experiences you'd like included in your quote.
                      </p>
                    </div>

                    {/* Stay Styles */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#8C7667]">Preferred Stay Style</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {HOTEL_TIERS.map((h) => (
                          <div
                            key={h.id}
                            onClick={() => setHotelTier(h.id)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                              hotelTier === h.id
                                ? 'border-[#E37500] bg-[#E37500]/5 dark:bg-[#E37500]/10 ring-1 ring-[#E37500]'
                                : 'border-[#E8DFD5] dark:border-white/10 hover:border-[#E37500]/50'
                            }`}
                          >
                            <div
                              className={`w-5 h-5 rounded-full mt-0.5 flex items-center justify-center shrink-0 border ${
                                hotelTier === h.id ? 'border-[#E37500] bg-[#E37500] text-white' : 'border-[#8C7667]'
                              }`}
                            >
                              {hotelTier === h.id && <Check className="w-3 h-3" />}
                            </div>
                            <div>
                              <h4 className="font-serif text-sm font-bold">{h.label}</h4>
                              <p className="text-[11px] text-[#6F5B4E] dark:text-[#C5B7AC] mt-0.5">{h.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experiences */}
                    <div className="space-y-2.5 pt-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#8C7667]">Bespoke Inclusions (Select any)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {EXPERIENCES.map((exp) => {
                          const isSelected = selectedExperiences.includes(exp);
                          return (
                            <div
                              key={exp}
                              onClick={() => toggleExperience(exp)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                                isSelected
                                  ? 'border-[#E37500] bg-white dark:bg-[#141414] text-[#24130A] dark:text-white shadow-xs font-semibold'
                                  : 'border-[#E8DFD5] dark:border-white/10 text-[#6F5B4E] dark:text-[#A7978A]'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                                  isSelected ? 'bg-[#E37500] text-white' : 'border border-[#8C7667]'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                              <span className="text-xs truncate">{exp}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="px-5 py-2.5 rounded-full border border-[#E8DFD5] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={() => setStep(4)}
                        className="px-7 py-3 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#E37500]/25 transition-all"
                      >
                        <span>Next: Finalize & Concierge</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: CONTACT & DISPATCH */}
                {step === 4 && (
                  <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
                    <div>
                      <h2 className="font-serif text-2xl font-bold">Confirm Your Private Proposal</h2>
                      <p className="text-xs sm:text-sm text-[#6F5B4E] dark:text-[#C5B7AC] mt-1">
                        Where should our senior travel specialist send your custom itinerary breakdown?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#8C7667]">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Vikram Malhotra"
                          className="w-full p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#8C7667]">WhatsApp / Phone *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98000 00000"
                          className="w-full p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#8C7667]">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vikram@example.com"
                        className="w-full p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#8C7667]">Special Requests & Celebrations</label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Anniversary surprises, specific flight airlines, dietary needs, preferred room views..."
                        className="w-full p-3 rounded-xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-xs sm:text-sm"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-5 py-2.5 rounded-full border border-[#E8DFD5] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        className="px-8 py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#E37500]/30 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Bespoke Proposal</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* CONFIRMATION SCREEN */
              <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-400">
                <div className="w-16 h-16 rounded-full bg-[#E37500]/10 dark:bg-[#E37500]/20 text-[#E37500] dark:text-[#E37500] flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E37500]">
                    Proposal Generated · Ref #{referenceId}
                  </span>
                  <h2 className="font-serif text-3xl font-bold">Your Journey is in the Works</h2>
                  <p className="text-xs sm:text-sm text-[#6F5B4E] dark:text-[#C5B7AC] leading-relaxed">
                    Thank you, {fullName}! Your private travel specialist has received your blueprint parameters and is preparing your personalized itinerary.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#FAF7F2] dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 text-left text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                    <span className="text-[#8C7667]">Destinations:</span>
                    <span className="font-bold">{selectedDestinations.join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                    <span className="text-[#8C7667]">Duration:</span>
                    <span className="font-bold">{duration}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                    <span className="text-[#8C7667]">Party:</span>
                    <span className="font-bold">{travelersCount}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#8C7667]">Contact Phone:</span>
                    <span className="font-bold">{phone}</span>
                  </div>
                </div>

                {/* Instant WhatsApp Action */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleSendWhatsApp}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20BA5C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/25 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open in WhatsApp Concierge</span>
                  </button>

                  <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FAF7F2] dark:bg-[#141414] text-[#24130A] dark:text-white border border-[#E8DFD5] text-xs font-bold uppercase tracking-wider"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <WishlistModal />

      <Footer
        onNavigate={(path) => {
          if (path === 'destinations') navigate('/destinations');
          else if (path === 'packages') navigate('/packages');
          else navigate(`/#${path}`);
        }}
        onSelectDestination={(name) => navigate(`/destinations`)}
        onSelectTripType={(type) => navigate(`/?type=${encodeURIComponent(type)}#contact`)}
        onPlanTrip={() => {}}
      />

      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}
