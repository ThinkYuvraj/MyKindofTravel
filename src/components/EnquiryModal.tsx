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
          destination: destination || initialDestination || 'Custom Destination',
          tripType: tripType || initialTripType || 'Bespoke Holiday',
          message: initialPackageName
            ? `[Package: ${initialPackageName}] ${message}`
            : message,
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
    `Hi My Kind of Travel Team, I'm ${firstName || 'a traveller'} (Ref: ${refId || 'New Query'}) interested in planning a ${
      tripType || 'bespoke trip'
    } to ${destination || 'an unforgettable destination'}${
      initialPackageName ? ` (${initialPackageName})` : ''
    }. Details: ${message || 'Looking for personalised recommendations.'}`
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
      'Luxury Europe Tour',
      'Other Custom Escape',
    ])
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      {/* Popup Enquiry Card */}
      <div
        className="relative w-full max-w-xl my-auto rounded-3xl bg-[#FAF7F2] dark:bg-[#16100D] text-[#2A1810] dark:text-white border border-[#E5DCD2] dark:border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.55)] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#E37500] via-[#FF9829] to-[#E37500] shrink-0" />

        {/* Modal Header */}
        <div className="px-5 sm:px-7 pt-5 pb-4 border-b border-[#EADFD5] dark:border-white/10 flex items-start justify-between gap-4 shrink-0 bg-white/60 dark:bg-white/[0.02]">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E37500]/10 dark:bg-[#E37500]/20 text-[#E37500] text-[11px] font-bold uppercase tracking-widest border border-[#E37500]/30">
              <Sparkles className="w-3 h-3" />
              <span>Bespoke Travel Enquiry</span>
            </div>
            <h2
              id="enquiry-modal-title"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#24130A] dark:text-white leading-tight"
            >
              Let's Design Your <span className="italic font-normal text-[#E37500]">Dream Trip</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6F5B4E] dark:text-[#C5B7AC]">
              Share your preferences below — our travel specialists will craft a custom itinerary within 24 hours.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white dark:bg-white/10 hover:bg-[#E37500] hover:text-white text-[#594336] dark:text-white border border-[#DFD0C0] dark:border-white/15 transition-colors shrink-0 shadow-xs"
            aria-label="Close enquiry popup"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {/* Active Query Context Pill if triggered from a specific card */}
          {(initialPackageName || initialDestination || initialTripType) && !submitted && (
            <div className="p-3.5 rounded-2xl bg-[#E37500]/10 dark:bg-[#E37500]/15 border border-[#E37500]/30 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#E37500] flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Selected Query:
              </span>
              {initialPackageName && (
                <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#241812] text-[#24130A] dark:text-white font-semibold border border-[#E37500]/30">
                  {initialPackageName}
                </span>
              )}
              {initialDestination && (
                <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#241812] text-[#24130A] dark:text-white font-semibold border border-[#E37500]/30 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E37500]" />
                  {initialDestination}
                </span>
              )}
              {initialTripType && (
                <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#241812] text-[#24130A] dark:text-white font-semibold border border-[#E37500]/30 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#E37500]" />
                  {initialTripType}
                </span>
              )}
            </div>
          )}

          {submitted ? (
            <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-[#E37500]/15 text-[#E37500] border border-[#E37500]/30 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1810] dark:text-white">
                  Enquiry Received!
                </h3>
                <p className="text-[#E37500] font-bold text-sm font-mono">
                  Reference #{refId}
                </p>
                <p className="text-[#594336] dark:text-[#D1C2B8] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-[#24130A] dark:text-white">{firstName || 'traveller'}</strong>. A dedicated luxury travel specialist from My Kind of Travel has been assigned to your query and will connect with you shortly.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#E37500]/30"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Instant WhatsApp Concierge</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white dark:bg-white/10 hover:bg-[#F4ECE4] dark:hover:bg-white/20 text-[#2A1810] dark:text-white text-xs font-bold border border-[#DFD0C0] dark:border-white/15 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* First Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1612] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500]"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sharma"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1612] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1612] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500]"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1612] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Destination */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                    Destination *
                  </label>
                  <select
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1612] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500] cursor-pointer"
                  >
                    <option value="">Select destination</option>
                    {destinationOptions.map((destName) => (
                      <option key={destName} value={destName}>
                        {destName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Trip Type */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                    Trip Type *
                  </label>
                  <select
                    required
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1612] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500] cursor-pointer"
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
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                  Tell Us About Your Dream Trip
                </label>
                <textarea
                  rows={3}
                  placeholder="Preferred travel dates, number of guests, hotel tier, special occasions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E1612] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500] resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] disabled:opacity-60 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#E37500]/30 flex items-center justify-center gap-2 active:scale-98 border border-white/20"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Enquiry...' : 'Send My Enquiry'}</span>
              </button>

              {/* Footer Trust Bar */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#7C685B] dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E37500]" />
                  100% Private & Zero Obligation
                </span>
                <a
                  href={`tel:${info.phone}`}
                  className="font-semibold text-[#E37500] hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  <span>Direct Line: {info.phone}</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
