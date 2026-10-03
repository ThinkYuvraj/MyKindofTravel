import React, { useState, useEffect } from 'react';
import { COMPANY_INFO, DESTINATIONS, EXPERIENCE_PILLARS } from '../data/travelData';
import { Phone, Mail, MessageCircle, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  initialDestination?: string;
  initialTripType?: string;
  companyInfo?: typeof COMPANY_INFO;
  customBadge?: string;
  customTitle?: string;
  customSubtitle?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialDestination = '',
  initialTripType = '',
  companyInfo,
  customBadge,
  customTitle,
  customSubtitle,
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
  const [refId, setRefId] = useState('');

  useEffect(() => {
    if (initialDestination) setDestination(initialDestination);
    if (initialTripType) setTripType(initialTripType);
  }, [initialDestination, initialTripType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = 'MKT-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(generatedRef);
    setSubmitted(true);

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
          destination,
          tripType,
          message,
        }),
      });
    } catch (err) {
      console.warn('Could not post inquiry to server', err);
    }
  };

  const whatsappUrl = `https://wa.me/${COMPANY_INFO.phoneRaw}?text=${encodeURIComponent(
    `Hi My Kind of Travel Team, I'm ${firstName || 'a traveller'} interested in planning a ${
      tripType || 'bespoke trip'
    } to ${destination || 'an unforgettable destination'}. Dates & details: ${message || 'Looking for recommendations.'}`
  )}`;

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-24 bg-transparent text-[#2A1810] dark:text-white border-b border-[#EADFD5] dark:border-white/10 relative transition-colors duration-300">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Contact details & intro */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest border border-[#DFD0C0]/80 dark:border-white/10 backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{customBadge || 'Get in touch'}</span>
              </div>

              {customTitle ? (
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white leading-tight">
                  {customTitle}
                </h2>
              ) : (
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white leading-tight">
                  Let's design your <br />
                  <span className="italic font-serif text-[#E37500] font-normal">
                    perfect trip
                  </span>
                </h2>
              )}

              <p className="text-[#594336] dark:text-[#D1C2B8] text-base sm:text-lg leading-relaxed font-normal">
                {customSubtitle || "Share your travel dreams and we'll get back to you within 24 hours with a custom plan. No obligation, no pressure — just inspiration."}
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              {/* Phone / WhatsApp */}
              <a
                href={`https://wa.me/${info.phoneRaw || COMPANY_INFO.phoneRaw}?text=Hi%20My%20Kind%20of%20Travel%2C%20I%20am%20interested%20in%20planning%20a%20luxury%20holiday.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 hover:border-[#E37500]/50 dark:hover:border-[#E37500]/50 transition-colors flex items-center gap-4 group shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E37500]/10 dark:bg-[#E37500]/20 text-[#E37500] dark:text-[#E37500] flex items-center justify-center border border-[#E37500]/30 shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-label="WhatsApp">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#7C685B] dark:text-[#A7978A] font-bold font-sans">
                    WhatsApp / Call
                  </span>
                  <span className="font-sans text-base sm:text-lg font-semibold tracking-wide text-[#2A1810] dark:text-white group-hover:text-[#E37500] dark:group-hover:text-[#E37500] transition-colors">
                    {info.phone}
                  </span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${info.email}`}
                className="p-5 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 hover:border-[#E37500]/50 dark:hover:border-[#E37500]/50 transition-colors flex items-center gap-4 group shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E37500]/10 dark:bg-[#E37500]/20 text-[#E37500] dark:text-[#E37500] flex items-center justify-center border border-[#E37500]/30 shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#7C685B] dark:text-[#A7978A] font-bold font-sans">
                    Email us
                  </span>
                  <span className="font-sans text-sm sm:text-base font-semibold text-[#2A1810] dark:text-white group-hover:text-[#E37500] dark:group-hover:text-[#E37500] transition-colors break-all">
                    {info.email}
                  </span>
                </div>
              </a>

              {/* WhatsApp Support Hours */}
              <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 flex items-center gap-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#E37500]/10 dark:bg-[#E37500]/20 text-[#E37500] dark:text-[#E37500] flex items-center justify-center border border-[#E37500]/30 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#7C685B] dark:text-[#A7978A] font-bold font-sans">
                    WhatsApp chat
                  </span>
                  <span className="font-sans text-xs sm:text-sm font-medium text-[#2A1810] dark:text-white">
                    {info.supportHours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-[#16100D]/85 border border-white/80 dark:border-white/10 shadow-[0_12px_45px_rgba(42,24,16,0.06)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.4)] relative">
              {submitted ? (
                <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-[#E37500]/10 dark:bg-[#E37500]/20 text-[#E37500] dark:text-[#E37500] border border-[#E37500]/30 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1810] dark:text-white">
                      Enquiry Received!
                    </h3>
                    <p className="text-[#E37500] dark:text-[#E37500] font-bold text-sm">
                      Reference #{refId}
                    </p>
                    <p className="text-[#594336] dark:text-[#D1C2B8] text-sm max-w-md mx-auto leading-relaxed">
                      Thank you, {firstName || 'traveller'}. A dedicated luxury travel specialist from My Kind of Travel has been assigned to your request and will reach out within 24 hours.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp Now</span>
                    </a>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setMessage('');
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F4ECE4] dark:bg-white/10 hover:bg-[#EBE0D5] dark:hover:bg-white/20 text-[#2A1810] dark:text-white text-xs font-bold border border-[#DFD0C0] dark:border-white/15"
                    >
                      Submit Another Trip
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                        First name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Rahul"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500]"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                        Last name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sharma"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                        Email address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500]"
                      />
                    </div>

                    {/* Phone / WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                        WhatsApp / Phone
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98000 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Destination */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                        Destination
                      </label>
                      <select
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500] cursor-pointer"
                      >
                        <option value="">Select destination</option>
                        {DESTINATIONS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                        <option value="Europe Grand Tour">Europe Grand Tour</option>
                        <option value="Other / Multiple">Other / Multiple</option>
                      </select>
                    </div>

                    {/* Trip Type */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                        Trip type
                      </label>
                      <select
                        required
                        value={tripType}
                        onChange={(e) => setTripType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500] cursor-pointer"
                      >
                        <option value="">Select type</option>
                        {EXPERIENCE_PILLARS.map((p) => (
                          <option key={p.typeKey} value={p.typeKey}>
                            {p.title}
                          </option>
                        ))}
                        <option value="Other Custom Escape">Other Custom Escape</option>
                      </select>
                    </div>
                  </div>

                  {/* Dream Trip Description */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#594336] dark:text-neutral-300">
                      Tell us your dream trip
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Dates, budget, must-haves, special occasions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#E37500] focus:ring-1 focus:ring-[#E37500] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#E37500]/30 flex items-center justify-center gap-2 active:scale-98 border border-white/20"
                  >
                    <span>Send My Enquiry →</span>
                  </button>

                  <p className="text-center text-[11px] text-[#7C685B] dark:text-neutral-400 pt-1">
                    No spam. We respect your privacy and will never share your personal contact information.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
