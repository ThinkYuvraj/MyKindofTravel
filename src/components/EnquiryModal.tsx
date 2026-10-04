import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  Check,
  Search,
  Plus,
  Edit3,
  RotateCcw,
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
  'Kyoto',
  'Other',
];

const POPULAR_TRIP_TYPES = [
  { label: 'Honeymoon 💍', value: 'Honeymoon' },
  { label: 'Couples Escape 🥂', value: 'Couples & Romance' },
  { label: 'Family Luxury 👨‍👩‍👧', value: 'Family Holiday' },
  { label: 'Alpine Retreat 🏔️', value: 'Alpine Luxury' },
  { label: 'Celebration 🎉', value: 'Milestone Celebration' },
  { label: 'Other ✍️', value: 'Other' },
];

const CURATED_TRIP_STYLES = [
  { label: 'Honeymoon & Romantic Escape', value: 'Honeymoon', emoji: '💍' },
  { label: 'Couples Sanctuary & Wellness', value: 'Couples & Romance', emoji: '🥂' },
  { label: 'Multi-Generational Family Holiday', value: 'Family Holiday', emoji: '👨‍👩‍👧' },
  { label: 'Alpine & Snow Luxury Chalets', value: 'Alpine Luxury', emoji: '🏔️' },
  { label: 'Private Island & Overwater Villas', value: 'Overwater Luxury', emoji: '🏖️' },
  { label: 'Michelin Dining & Vineyard Tastings', value: 'Culinary & Wine', emoji: '🍷' },
  { label: 'Historic Castles & Cultural Expeditions', value: 'Cultural & Heritage', emoji: '🏛️' },
  { label: 'Milestone Anniversary or Celebration', value: 'Milestone Celebration', emoji: '🎉' },
  { label: 'Corporate Executive Retreat', value: 'Corporate Retreat', emoji: '💼' },
];

const GUEST_OPTIONS = [
  { label: '2 Guests (Couples / Duo)', value: '2 Guests (Couples)' },
  { label: '1 Guest (Solo Luxury)', value: '1 Guest (Solo)' },
  { label: '3–5 Guests (Family / Friends)', value: '3–5 Guests (Family)' },
  { label: '6+ Guests (Private Group / Milestone)', value: '6+ Guests (Group)' },
  { label: 'Other (Custom Party Size)', value: 'Other' },
];

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialDestination = '',
  initialTripType = '',
  initialPackageName = '',
  companyInfo,
}) => {
  const info = companyInfo || COMPANY_INFO;

  // Form Fields State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [destination, setDestination] = useState('');
  const [customDestination, setCustomDestination] = useState('');
  const [tripType, setTripType] = useState('');
  const [customTripType, setCustomTripType] = useState('');
  const [guests, setGuests] = useState('2 Guests (Couples)');
  const [customGuests, setCustomGuests] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState('');

  // Interactive Caret Dropdowns State
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [destSearch, setDestSearch] = useState('');
  const [isTripTypeOpen, setIsTripTypeOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  // Dropdown click-outside refs
  const destDropdownRef = useRef<HTMLDivElement>(null);
  const tripTypeDropdownRef = useRef<HTMLDivElement>(null);
  const guestsDropdownRef = useRef<HTMLDivElement>(null);

  // Pre-fill parameters when modal opens
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
    } else {
      setIsDestOpen(false);
      setIsTripTypeOpen(false);
      setIsGuestsOpen(false);
      setDestSearch('');
    }
  }, [isOpen, initialDestination, initialTripType, initialPackageName]);

  // Handle click outside to close interactive carets
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (destDropdownRef.current && !destDropdownRef.current.contains(e.target as Node)) {
        setIsDestOpen(false);
      }
      if (tripTypeDropdownRef.current && !tripTypeDropdownRef.current.contains(e.target as Node)) {
        setIsTripTypeOpen(false);
      }
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(e.target as Node)) {
        setIsGuestsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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

  // Effective values considering "Other" write-ins
  const isCustomDest = destination === 'Other' || destination === 'Other / Multiple';
  const effectiveDestination = isCustomDest && customDestination ? customDestination : destination;

  const isCustomTrip = tripType === 'Other' || tripType === 'Other Custom Escape';
  const effectiveTripType = isCustomTrip && customTripType ? customTripType : tripType;

  const isCustomGuests = guests === 'Other' || guests.startsWith('Other');
  const effectiveGuests = isCustomGuests && customGuests ? customGuests : guests;

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
          guests: effectiveGuests,
          destination: effectiveDestination || initialDestination || 'Custom Destination',
          tripType: effectiveTripType || initialTripType || 'Bespoke Holiday',
          message: initialPackageName
            ? `[Package: ${initialPackageName}] [Guests: ${effectiveGuests}] ${message}`
            : `[Guests: ${effectiveGuests}] ${message}`,
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
      effectiveTripType || 'bespoke trip'
    } for ${effectiveGuests} to ${effectiveDestination || 'an unforgettable destination'}${
      initialPackageName ? ` (${initialPackageName})` : ''
    }. Details: ${message || 'Looking for custom luxury recommendations.'}`
  )}`;

  // Destination list
  const destinationOptions = Array.from(
    new Set([
      ...DESTINATIONS.map((d) => d.name),
      ...(initialDestination && !DESTINATIONS.some((d) => d.name === initialDestination)
        ? [initialDestination]
        : []),
      'Europe Grand Tour (Multi-Country)',
      'Swiss Alps & Italian Lakes',
      'Nordic Fjords & Northern Lights',
      'Japan Cherry Blossom & Culture',
    ])
  );

  const filteredDestinationOptions = destinationOptions.filter((d) =>
    d.toLowerCase().includes(destSearch.toLowerCase())
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
        className="relative w-full max-w-xl my-auto rounded-3xl bg-white dark:bg-[#0E0E0E] text-neutral-900 dark:text-white border border-neutral-200 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-[#E37500] shrink-0" />

        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-neutral-200 dark:border-white/10 flex items-start justify-between gap-4 shrink-0 bg-white/70 dark:bg-[#141414]/70 backdrop-blur-md">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E37500]/10 dark:bg-[#E37500]/20 text-[#E37500] text-[10px] font-bold uppercase tracking-widest border border-[#E37500]/30">
              <Sparkles className="w-3 h-3 text-[#E37500]" />
              <span>Bespoke Travel Concierge</span>
            </div>
            <h2
              id="enquiry-modal-title"
              className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white leading-tight"
            >
              Let's Design Your <span className="italic font-serif text-[#E37500] font-normal">Dream Trip</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-normal">
              Share your preferences below — our travel specialists will craft a tailored itinerary within 24 hours.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-neutral-100 dark:bg-white/10 hover:bg-[#E37500] hover:text-white text-neutral-600 dark:text-white border border-neutral-200 dark:border-white/15 transition-all shrink-0 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Close enquiry popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 no-scrollbar">
          {/* Active Context Banner if opened with specific place/package */}
          {(initialPackageName || initialDestination || initialTripType) && !submitted && (
            <div className="p-3.5 rounded-2xl bg-[#E37500]/10 dark:bg-[#E37500]/15 border border-[#E37500]/30 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#E37500] flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Active Selection:
              </span>
              {initialPackageName && (
                <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#141414] text-neutral-900 dark:text-white font-semibold border border-[#E37500]/30">
                  {initialPackageName}
                </span>
              )}
              {initialDestination && (
                <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#141414] text-neutral-900 dark:text-white font-semibold border border-[#E37500]/30 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E37500]" />
                  {initialDestination}
                </span>
              )}
              {initialTripType && (
                <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#141414] text-neutral-900 dark:text-white font-semibold border border-[#E37500]/30 flex items-center gap-1">
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
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                  Enquiry Received!
                </h3>
                <div className="inline-block px-3 py-1 rounded-full bg-[#E37500]/10 border border-[#E37500]/30 text-[#E37500] font-mono font-bold text-xs uppercase tracking-wider">
                  Reference #{refId}
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed pt-1">
                  Thank you, <strong className="text-neutral-900 dark:text-white">{firstName || 'traveller'}</strong>. Your dedicated luxury travel specialist has been assigned and will prepare a bespoke itinerary tailored for your dates and guest preferences.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-[#141414] border border-neutral-200 dark:border-white/10 max-w-sm mx-auto text-left space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Destination</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{effectiveDestination || 'Bespoke'}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Trip Style</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{effectiveTripType || 'Luxury'}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Guests</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">{effectiveGuests}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Expected Response</span>
                  <span className="font-semibold text-[#E37500]">Within 24 Hours</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#E37500]/25 hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Instant WhatsApp Concierge</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white dark:bg-white/10 hover:bg-neutral-100 dark:hover:bg-white/20 text-neutral-900 dark:text-white text-xs font-bold uppercase tracking-wider border border-neutral-200 dark:border-white/15 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* MODULAR INTERACTIVE FORM */
            /* ============================================================ */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* ── MODULE 1: TRAVELLER DETAILS ─────────────────────── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-white/10 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-white/10">
                  <span className="w-5 h-5 rounded-full bg-[#E37500] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Your Contact Details
                  </span>
                </div>

                {/* Name Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-[#E37500]" />
                      <span>First Name <span className="text-[#E37500]">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Rahul"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181818] border border-neutral-200 dark:border-white/15 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all shadow-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-[#E37500]" />
                      <span>Last Name <span className="text-[#E37500]">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sharma"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181818] border border-neutral-200 dark:border-white/15 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#E37500]" />
                      <span>Email Address <span className="text-[#E37500]">*</span></span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181818] border border-neutral-200 dark:border-white/15 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all shadow-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#E37500]" />
                      <span>WhatsApp / Mobile <span className="text-[#E37500]">*</span></span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98000 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#181818] border border-neutral-200 dark:border-white/15 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* ── MODULE 2: DESTINATION & TRIP STYLE ────────────── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-white/10 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-white/10">
                  <span className="w-5 h-5 rounded-full bg-[#E37500] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Destination & Journey Style
                  </span>
                </div>

                {/* Destination Interactive Caret Selector */}
                <div className="space-y-2" ref={destDropdownRef}>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E37500]" />
                      <span>Destination <span className="text-[#E37500]">*</span></span>
                    </label>
                    <span className="text-[10px] text-neutral-400">
                      Tap caret to browse or pick Other
                    </span>
                  </div>

                  {/* Interactive Caret Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDestOpen(!isDestOpen);
                        setIsTripTypeOpen(false);
                        setIsGuestsOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#181818] border text-left flex items-center justify-between transition-all cursor-pointer shadow-xs ${
                        isDestOpen
                          ? 'border-[#E37500] ring-2 ring-[#E37500]/20'
                          : 'border-neutral-200 dark:border-white/15 hover:border-[#E37500]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <MapPin className="w-4 h-4 text-[#E37500] shrink-0" />
                        <span className={`text-sm truncate font-medium ${destination ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                          {destination
                            ? (isCustomDest && customDestination ? customDestination : destination)
                            : 'Select a curated destination...'}
                        </span>
                      </div>
                      
                      {/* Interactive Caret Button with Smooth 180° Flip */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                          isDestOpen
                            ? 'bg-[#E37500] text-white rotate-180 shadow-xs'
                            : 'bg-neutral-100 dark:bg-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                        title={isDestOpen ? 'Collapse destination options' : 'Expand destination options'}
                      >
                        <ChevronDown className="w-4 h-4 stroke-[2.4]" />
                      </div>
                    </button>

                    {/* Interactive Dropdown Panel */}
                    {isDestOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-[#161616] border border-neutral-200 dark:border-white/15 rounded-2xl shadow-xl overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                        {/* Search Input Filter */}
                        <div className="p-2 border-b border-neutral-200 dark:border-white/10">
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              placeholder="Search destinations (e.g. Bali, Paris, Swiss)..."
                              value={destSearch}
                              onChange={(e) => setDestSearch(e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-transparent focus:border-[#E37500] text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Destination Options List */}
                        <div className="max-h-52 overflow-y-auto p-1.5 space-y-0.5 no-scrollbar">
                          {filteredDestinationOptions.map((destName) => {
                            const isSelected = destination === destName;
                            return (
                              <button
                                key={destName}
                                type="button"
                                onClick={() => {
                                  setDestination(destName);
                                  setIsDestOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                                  isSelected
                                    ? 'bg-[#E37500]/15 text-[#E37500] font-bold'
                                    : 'text-neutral-800 dark:text-neutral-200 hover:bg-[#E37500]/10 hover:text-[#E37500]'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <MapPin className="w-3 h-3 text-[#E37500] shrink-0" />
                                  <span className="truncate">{destName}</span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#E37500] shrink-0" />}
                              </button>
                            );
                          })}

                          {filteredDestinationOptions.length === 0 && (
                            <div className="p-3 text-center text-xs text-neutral-400">
                              No matching destination found.
                            </div>
                          )}

                          {/* Explicit "+ Other (Custom Destination)" Option */}
                          <div className="pt-1 mt-1 border-t border-neutral-200 dark:border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setDestination('Other');
                                setIsDestOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                                destination === 'Other'
                                  ? 'bg-[#E37500] text-white'
                                  : 'text-[#E37500] hover:bg-[#E37500]/15'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Plus className="w-3.5 h-3.5 shrink-0" />
                                <span>+ Other (Type Custom Destination)</span>
                              </div>
                              <Edit3 className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* If Other is selected, show smooth write-in box */}
                  {isCustomDest && (
                    <div className="p-3 rounded-xl bg-[#E37500]/10 dark:bg-[#E37500]/15 border border-[#E37500] space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#E37500]">
                        <span className="flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          Specify Your Desired Destination:
                        </span>
                        <button
                          type="button"
                          onClick={() => setDestination('')}
                          className="hover:underline text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-0.5"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset to list</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. Kenya Safari, Iceland Ring Road, New Zealand, Norway..."
                        value={customDestination}
                        onChange={(e) => setCustomDestination(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#181818] border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#E37500]/30 shadow-xs"
                      />
                    </div>
                  )}

                  {/* Quick Tap Destination Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {POPULAR_DESTINATION_PILLS.map((d) => {
                      const isSelected =
                        d === 'Other'
                          ? isCustomDest
                          : destination.toLowerCase() === d.toLowerCase();
                      return (
                        <button
                          type="button"
                          key={d}
                          onClick={() => {
                            if (d === 'Other') {
                              setDestination('Other');
                            } else {
                              setDestination(d);
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#E37500] text-white shadow-xs scale-105'
                              : 'bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-[#E37500]/50'
                          }`}
                        >
                          {d === 'Other' ? '+ Other ✍️' : d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Trip Type Interactive Caret Selector */}
                <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-white/10" ref={tripTypeDropdownRef}>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#E37500]" />
                      <span>Trip Style / Type <span className="text-[#E37500]">*</span></span>
                    </label>
                    <span className="text-[10px] text-neutral-400">
                      Tap caret to select or choose Other
                    </span>
                  </div>

                  {/* Interactive Caret Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTripTypeOpen(!isTripTypeOpen);
                        setIsDestOpen(false);
                        setIsGuestsOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#181818] border text-left flex items-center justify-between transition-all cursor-pointer shadow-xs ${
                        isTripTypeOpen
                          ? 'border-[#E37500] ring-2 ring-[#E37500]/20'
                          : 'border-neutral-200 dark:border-white/15 hover:border-[#E37500]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <Sparkles className="w-4 h-4 text-[#E37500] shrink-0" />
                        <span className={`text-sm truncate font-medium ${tripType ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                          {tripType
                            ? (isCustomTrip && customTripType ? customTripType : tripType)
                            : 'Select journey style...'}
                        </span>
                      </div>

                      {/* Interactive Caret Button with Smooth 180° Flip */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                          isTripTypeOpen
                            ? 'bg-[#E37500] text-white rotate-180 shadow-xs'
                            : 'bg-neutral-100 dark:bg-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                        title={isTripTypeOpen ? 'Collapse trip styles' : 'Expand trip styles'}
                      >
                        <ChevronDown className="w-4 h-4 stroke-[2.4]" />
                      </div>
                    </button>

                    {/* Interactive Dropdown Panel */}
                    {isTripTypeOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-[#161616] border border-neutral-200 dark:border-white/15 rounded-2xl shadow-xl overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="max-h-52 overflow-y-auto p-1.5 space-y-0.5 no-scrollbar">
                          {CURATED_TRIP_STYLES.map((t) => {
                            const isSelected = tripType === t.value;
                            return (
                              <button
                                key={t.value}
                                type="button"
                                onClick={() => {
                                  setTripType(t.value);
                                  setIsTripTypeOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                                  isSelected
                                    ? 'bg-[#E37500]/15 text-[#E37500] font-bold'
                                    : 'text-neutral-800 dark:text-neutral-200 hover:bg-[#E37500]/10 hover:text-[#E37500]'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span>{t.emoji}</span>
                                  <span className="truncate">{t.label}</span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#E37500] shrink-0" />}
                              </button>
                            );
                          })}

                          {/* Explicit "+ Other (Custom Experience)" Option */}
                          <div className="pt-1 mt-1 border-t border-neutral-200 dark:border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setTripType('Other');
                                setIsTripTypeOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                                tripType === 'Other'
                                  ? 'bg-[#E37500] text-white'
                                  : 'text-[#E37500] hover:bg-[#E37500]/15'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Plus className="w-3.5 h-3.5 shrink-0" />
                                <span>+ Other (Describe Custom Experience)</span>
                              </div>
                              <Edit3 className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* If Other is selected, show smooth write-in box */}
                  {isCustomTrip && (
                    <div className="p-3 rounded-xl bg-[#E37500]/10 dark:bg-[#E37500]/15 border border-[#E37500] space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#E37500]">
                        <span className="flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          Describe Your Custom Travel Style:
                        </span>
                        <button
                          type="button"
                          onClick={() => setTripType('')}
                          className="hover:underline text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-0.5"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset to list</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. Scuba Diving Expedition, Wildlife Photography, Golf & Yacht..."
                        value={customTripType}
                        onChange={(e) => setCustomTripType(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#181818] border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#E37500]/30 shadow-xs"
                      />
                    </div>
                  )}

                  {/* Quick Trip Type Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {POPULAR_TRIP_TYPES.map((t) => {
                      const isSelected =
                        t.value === 'Other'
                          ? isCustomTrip
                          : tripType === t.value;
                      return (
                        <button
                          type="button"
                          key={t.value}
                          onClick={() => {
                            if (t.value === 'Other') {
                              setTripType('Other');
                            } else {
                              setTripType(t.value);
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#E37500] text-white shadow-xs scale-105'
                              : 'bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-[#E37500]/50'
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── MODULE 3: GUESTS & SPECIAL WISHES ──────────────── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 dark:bg-[#121212] border border-neutral-200 dark:border-white/10 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-white/10">
                  <span className="w-5 h-5 rounded-full bg-[#E37500] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Party Size & Special Requests
                  </span>
                </div>

                {/* Number of Guests with Interactive Caret */}
                <div className="space-y-2" ref={guestsDropdownRef}>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#E37500]" />
                      <span>Number of Guests</span>
                    </label>
                    <span className="text-[10px] text-neutral-400">
                      Select or specify custom
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsGuestsOpen(!isGuestsOpen);
                        setIsDestOpen(false);
                        setIsTripTypeOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#181818] border text-left flex items-center justify-between transition-all cursor-pointer shadow-xs ${
                        isGuestsOpen
                          ? 'border-[#E37500] ring-2 ring-[#E37500]/20'
                          : 'border-neutral-200 dark:border-white/15 hover:border-[#E37500]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <Users className="w-4 h-4 text-[#E37500] shrink-0" />
                        <span className="text-sm truncate font-medium text-neutral-900 dark:text-white">
                          {isCustomGuests && customGuests ? customGuests : guests}
                        </span>
                      </div>

                      {/* Interactive Caret Button with Smooth 180° Flip */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                          isGuestsOpen
                            ? 'bg-[#E37500] text-white rotate-180 shadow-xs'
                            : 'bg-neutral-100 dark:bg-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                        title={isGuestsOpen ? 'Collapse guest options' : 'Expand guest options'}
                      >
                        <ChevronDown className="w-4 h-4 stroke-[2.4]" />
                      </div>
                    </button>

                    {/* Interactive Dropdown Panel */}
                    {isGuestsOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-[#161616] border border-neutral-200 dark:border-white/15 rounded-2xl shadow-xl overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-1.5 space-y-0.5">
                          {GUEST_OPTIONS.map((g) => {
                            const isSelected = guests === g.value;
                            return (
                              <button
                                key={g.value}
                                type="button"
                                onClick={() => {
                                  setGuests(g.value);
                                  setIsGuestsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                                  isSelected
                                    ? 'bg-[#E37500]/15 text-[#E37500] font-bold'
                                    : 'text-neutral-800 dark:text-neutral-200 hover:bg-[#E37500]/10 hover:text-[#E37500]'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <Users className="w-3 h-3 text-[#E37500] shrink-0" />
                                  <span className="truncate">{g.label}</span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#E37500] shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* If Other Guest Count is selected, show smooth write-in box */}
                  {isCustomGuests && (
                    <div className="p-3 rounded-xl bg-[#E37500]/10 dark:bg-[#E37500]/15 border border-[#E37500] space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#E37500]">
                        <span className="flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          Specify Custom Party Size:
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuests('2 Guests (Couples)')}
                          className="hover:underline text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-0.5"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        autoFocus
                        placeholder="e.g. 8 Adults + 3 Children (2 luxury villas)..."
                        value={customGuests}
                        onChange={(e) => setCustomGuests(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#181818] border border-neutral-300 dark:border-white/20 text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#E37500]/30 shadow-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Dream Trip Notes */}
                <div className="space-y-1 pt-1">
                  <label className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Compass className="w-3 h-3 text-[#E37500]" />
                      <span>Tell Us About Your Dream Trip</span>
                    </span>
                    <span className="text-[10px] font-normal text-neutral-400 lowercase">optional</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Preferred travel months, special anniversary celebration, private jet or villa requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#181818] border border-neutral-200 dark:border-white/15 text-neutral-900 dark:text-white placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-[#E37500] focus:ring-2 focus:ring-[#E37500]/20 transition-all resize-none shadow-xs"
                  />
                </div>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] disabled:opacity-60 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md shadow-[#E37500]/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-98 border border-white/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Crafting Your Enquiry...' : 'Design My Journey'}</span>
              </button>

              {/* Footer Trust & Instant WhatsApp Line */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-600 dark:text-neutral-300 border-t border-neutral-200 dark:border-white/10 pt-3">
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
