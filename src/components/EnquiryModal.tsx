import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  MapPin,
  Compass,
  Calendar,
  Phone,
  ShieldCheck,
  Send,
  User,
  Mail,
  Users,
  Clock,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { COMPANY_INFO, DESTINATIONS, EXPERIENCE_PILLARS } from '../data/travelData';

export interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDestination?: string;
  initialTripType?: string;
  initialPackageName?: string;
  companyInfo?: typeof COMPANY_INFO;
}

const POPULAR_DESTINATION_PILLS = [
  'Maldives',
  'Switzerland',
  'Bali',
  'Paris',
  'Santorini',
  'Amalfi Coast',
];

const POPULAR_TRIP_TYPES = [
  { label: 'Honeymoon 💍', value: 'Honeymoon Special' },
  { label: 'Couples Escape 🥂', value: 'Couples & Romance' },
  { label: 'Family Luxury 👨‍👩‍👧', value: 'Family Holiday' },
  { label: 'Celebration 🎉', value: 'Milestone Celebration' },
  { label: 'Alpine Retreat 🏔️', value: 'Alpine Luxury' },
];

const GUEST_OPTIONS = ['2 Guests (Couples)', '3–5 Guests (Family)', '6+ Guests (Group)'];

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialDestination = '',
  initialTripType = '',
  initialPackageName = '',
  companyInfo,
}) => {
  const info = companyInfo || COMPANY_INFO;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState('');
  const [guests, setGuests] = useState('2 Guests (Couples)');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState('');

  // Sync pre-selected query parameters whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      if (initialDestination) {
        setDestination(initialDestination);
      }
      if (initialTripType) {
        setTripType(initialTripType);
      }
      if (initialPackageName) {
        setMessage((prev) =>
          prev.includes(initialPackageName)
            ? prev
            : `Interested in customising package: ${initialPackageName}. `
        );
      }
    }
  }, [isOpen, initialDestination, initialTripType, initialPackageName]);

  // Handle Escape key and lock background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const generatedRef = 'MKT-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(generatedRef);

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refId: generatedRef,
          firstName,
          lastName,
          email,
          phone,
          guests,
          destination: destination || initialDestination || 'Custom Destination',
          tripType: tripType || initialTripType || 'Bespoke Holiday',
          message: initialPackageName
            ? `[Package: ${initialPackageName}] [Guests: ${guests}] ${message}`
            : `[Guests: ${guests}] ${message}`,
        }),
      });
    } catch (err) {
      console.warn('Could not post inquiry to server', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const whatsappUrl = `https://wa.me/${info.phoneRaw || COMPANY_INFO.phoneRaw}?text=${encodeURIComponent(
    `Hi My Kind of Travel Concierge, I'm ${firstName || 'a traveller'} (Ref: ${refId || 'New Enquiry'}). I'm planning a ${
      tripType || 'bespoke trip'
    } for ${guests} to ${destination || 'an unforgettable destination'}${
      initialPackageName ? ` (${initialPackageName})` : ''
    }. Details: ${message || 'Looking for custom luxury recommendations.'}`
  )}`;

  // Ensure any custom destination passed in is selectable in the dropdown
  const destinationOptions = Array.from(
    new Set([
      ...DESTINATIONS.map((d) => d.name),
      ...(initialDestination && !DESTINATIONS.some((d) => d.name === initialDestination)
        ? [initialDestination]
        : []),
      'Europe Grand Tour',
      'Other / Multiple',
    ])
  );

  const tripTypeOptions = Array.from(
    new Set([
      ...EXPERIENCE_PILLARS.map((p) => p.typeKey),
      ...(initialTripType && !EXPERIENCE_PILLARS.some((p) => p.typeKey === initialTripType)
        ? [initialTripType]
        : []),
      'Honeymoon Special',
      'Couples & Romance',
      'Family Holiday',
      'Milestone Celebration',
      'Alpine Luxury',
      'Luxury Europe Tour',
      'Other Custom Escape',
    ])
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      {/* Popup Enquiry Card */}
      <div
        className="relative w-full max-w-xl my-auto rounded-3xl bg-[#FCFAF6] dark:bg-[#0E0E0E] text-[#24130A] dark:text-white border border-[#E8DFD5] dark:border-white/10 shadow-[0_25px_80px_rgba(36,19,10,0.45)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#E37500] via-[#FF9A24] to-[#E37500] shrink-0" />

        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-[#E8DFD5] dark:border-white/10 flex items-start justify-between gap-4 shrink-0 bg-white/70 dark:bg-[#141414]/70 backdrop-blur-md">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E37500]/10 dark:bg-[#E37500]/20 text-[#E37500] text-[10px] font-bold uppercase tracking-widest border border-[#E37500]/30">
              <Sparkles className="w-3 h-3 text-[#E37500]" />
              <span>Bespoke Travel Concierge</span>
            </div>
            <h2
              id="enquiry-modal-title"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#24130A] dark:text-white leading-tight"
            >
              Let's Design Your <span className="italic font-serif text-[#E37500] font-normal">Dream Trip</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6F5B4E] dark:text-[#C5B7AC] font-normal">
              Share your preferences below — our travel specialists will craft a tailored itinerary within 24 hours.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white dark:bg-white/10 hover:bg-[#E37500] hover:text-white text-[#6F5B4E] dark:text-white border border-[#E8DFD5] dark:border-white/15 transition-all shrink-0 shadow-xs hover:scale-105 active:scale-95"
            aria-label="Close enquiry popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 no-scrollbar">
          {/* Active Context Banner if opened with specific place/package */}
          {(initialPackageName || initialDestination || initialTripType) && !submitted && (
            <div className="p-3.5 rounded-2xl bg-[#E37500]/10 dark:bg-[#E37500]/15 border border-[#E37500]/30 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#E37500] flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Active Selection:
              </span>
              {initialPackageName && (
                <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#141414] text-[#24130A] dark:text-white font-semibold border border-[#E37500]/30">
                  {initialPackageName}
                </span>
              )}
              {initialDestination && (
                <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#141414] text-[#24130A] dark:text-white font-semibold border border-[#E37500]/30 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E37500]" />
                  {initialDestination}
                </span>
              )}
              {initialTripType && (
                <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#141414] text-[#24130A] dark:text-white font-semibold border border-[#E37500]/30 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#E37500]" />
                  {initialTripType}
                </span>
              )}
            </div>
          )}

          {submitted ? (
            /* ============================================================ */
            /* SUCCESS STATE */
            /* ============================================================ */
            <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-[#E37500]/15 text-[#E37500] border border-[#E37500]/30 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#24130A] dark:text-white">
                  Enquiry Received!
                </h3>
                <div className="inline-block px-3 py-1 rounded-full bg-[#E37500]/10 border border-[#E37500]/30 text-[#E37500] font-mono font-bold text-xs uppercase tracking-wider">
                  Reference #{refId}
                </div>
                <p className="text-[#6F5B4E] dark:text-[#C5B7AC] text-xs sm:text-sm max-w-md mx-auto leading-relaxed pt-1">
                  Thank you, <strong className="text-[#24130A] dark:text-white">{firstName || 'traveller'}</strong>. Your dedicated luxury travel specialist has been assigned and will prepare a bespoke itinerary tailored for your dates and guest preferences.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/10 max-w-sm mx-auto text-left space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#8C7667] dark:text-[#A7978A]">
                  <span>Destination</span>
                  <span className="font-semibold text-[#24130A] dark:text-white">{destination || 'Bespoke'}</span>
                </div>
                <div className="flex items-center justify-between text-[#8C7667] dark:text-[#A7978A]">
                  <span>Trip Style</span>
                  <span className="font-semibold text-[#24130A] dark:text-white">{tripType || 'Luxury'}</span>
                </div>
                <div className="flex items-center justify-between text-[#8C7667] dark:text-[#A7978A]">
                  <span>Expected Response</span>
                  <span className="font-semibold text-[#E37500]">Within 24 Hours</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#E37500]/25 hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Instant WhatsApp Concierge</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white dark:bg-white/10 hover:bg-neutral-100 dark:hover:bg-white/20 text-[#24130A] dark:text-white text-xs font-bold uppercase tracking-wider border border-[#E8DFD5] dark:border-white/15 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* INTERACTIVE FORM */
            /* ============================================================ */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Name Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-neutral-300">
                    <User className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>First Name <span className="text-[#E37500]">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/15 text-[#24130A] dark:text-white placeholder-[#A8988B] text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-neutral-300">
                    <User className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>Last Name <span className="text-[#E37500]">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sharma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/15 text-[#24130A] dark:text-white placeholder-[#A8988B] text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Row 2: Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-neutral-300">
                    <Mail className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>Email Address <span className="text-[#E37500]">*</span></span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/15 text-[#24130A] dark:text-white placeholder-[#A8988B] text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-neutral-300">
                    <Phone className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>WhatsApp / Phone <span className="text-[#E37500]">*</span></span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/15 text-[#24130A] dark:text-white placeholder-[#A8988B] text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Row 3: Destination Selection & Quick Tap Pills */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-neutral-300">
                    <MapPin className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>Destination <span className="text-[#E37500]">*</span></span>
                  </label>
                  <span className="text-[11px] text-[#8C7667] dark:text-[#A7978A]">
                    Pick or tap a favourite below
                  </span>
                </div>

                <div className="relative">
                  <select
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/15 text-[#24130A] dark:text-white text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all cursor-pointer shadow-xs"
                  >
                    <option value="">Select destination</option>
                    {destinationOptions.map((destName) => (
                      <option key={destName} value={destName}>
                        {destName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Tap Destination Pills */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {POPULAR_DESTINATION_PILLS.map((d) => {
                    const isSelected = destination.toLowerCase().includes(d.toLowerCase());
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setDestination(d)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#E37500] text-white shadow-xs scale-105'
                            : 'bg-white dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#6F5B4E] dark:text-[#A7978A] hover:border-[#E37500]/50'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Trip Type & Guest Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-neutral-300">
                    <Sparkles className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>Trip Type <span className="text-[#E37500]">*</span></span>
                  </label>
                  <select
                    required
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/15 text-[#24130A] dark:text-white text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all cursor-pointer shadow-xs"
                  >
                    <option value="">Select trip type</option>
                    {tripTypeOptions.map((t) => {
                      const pillar = EXPERIENCE_PILLARS.find((p) => p.typeKey === t);
                      return (
                        <option key={t} value={t}>
                          {pillar ? pillar.title : t}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-neutral-300">
                    <Users className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>Number of Guests</span>
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/15 text-[#24130A] dark:text-white text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all cursor-pointer shadow-xs"
                  >
                    {GUEST_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Trip Type Chips */}
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TRIP_TYPES.map((t) => {
                  const isSelected = tripType === t.value;
                  return (
                    <button
                      type="button"
                      key={t.value}
                      onClick={() => setTripType(t.value)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#E37500] text-white shadow-xs scale-105'
                          : 'bg-white dark:bg-white/5 border border-[#E8DFD5] dark:border-white/10 text-[#6F5B4E] dark:text-[#A7978A] hover:border-[#E37500]/50'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Row 5: Tell Us About Your Dream Trip */}
              <div className="space-y-1.5 pt-1">
                <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#6F5B4E] dark:text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#E37500]" />
                    <span>Tell Us About Your Dream Trip</span>
                  </span>
                  <span className="text-[11px] font-normal text-[#8C7667] lowercase">optional</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Preferred travel dates, special occasions, private pool villa preferences, flight requests..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8DFD5] dark:border-white/15 text-[#24130A] dark:text-white placeholder-[#A8988B] text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all resize-none shadow-xs"
                />
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E37500] via-[#F28200] to-[#E37500] hover:from-[#C66500] hover:to-[#C66500] disabled:opacity-60 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#E37500]/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98 border border-white/20"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Crafting Your Enquiry...' : 'Send My Enquiry'}</span>
              </button>

              {/* Footer Trust & Instant WhatsApp Line */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6F5B4E] dark:text-[#A7978A] border-t border-[#E8DFD5] dark:border-white/10 pt-3">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#E37500]" />
                  <span>100% Private · Zero Obligation</span>
                </span>

                <a
                  href={`tel:${info.phone}`}
                  className="font-semibold text-[#E37500] hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Direct Founder Line: {info.phone}</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
