import React, { useState, useEffect } from 'react';
import { COMPANY_INFO, DESTINATIONS, EXPERIENCE_PILLARS } from '../data/travelData';
import { Phone, Mail, MessageCircle, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface ContactSectionProps {
  initialDestination?: string;
  initialTripType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialDestination = '',
  initialTripType = '',
}) => {
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

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hi My Kind of Travel Team, I'm ${firstName || 'a traveller'} interested in planning a ${
        tripType || 'bespoke trip'
      } to ${destination || 'an unforgettable destination'}. Dates & details: ${message || 'Looking for recommendations.'}`
    );
    window.open(`https://wa.me/${COMPANY_INFO.phoneRaw}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-24 bg-transparent text-[#2A1810] dark:text-white border-b border-[#EADFD5] dark:border-white/10 relative transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Contact details & intro */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] text-xs font-bold uppercase tracking-widest border border-[#DFD0C0]/80 dark:border-white/10 backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get in touch</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#2A1810] dark:text-white leading-tight">
                Let's design your <br />
                <span className="italic font-serif text-[#8C5528] dark:text-[#E28C38] font-normal">
                  perfect trip
                </span>
              </h2>

              <p className="text-[#594336] dark:text-[#D1C2B8] text-base sm:text-lg leading-relaxed font-normal">
                Share your travel dreams and we'll get back to you within 24 hours with a custom plan. No obligation, no pressure — just inspiration.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              {/* Phone / WhatsApp */}
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="p-5 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 hover:border-[#8C5528]/50 dark:hover:border-[#E28C38]/50 transition-colors flex items-center gap-4 group shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4ECE4] dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] flex items-center justify-center border border-[#DFD0C0] dark:border-white/15 shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#7C685B] dark:text-neutral-400 font-bold">
                    Call / WhatsApp
                  </span>
                  <span className="font-serif text-lg font-bold text-[#2A1810] dark:text-white group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] transition-colors">
                    {COMPANY_INFO.phone}
                  </span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="p-5 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 hover:border-[#8C5528]/50 dark:hover:border-[#E28C38]/50 transition-colors flex items-center gap-4 group shadow-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4ECE4] dark:bg-white/10 text-[#8C5528] dark:text-[#E28C38] flex items-center justify-center border border-[#DFD0C0] dark:border-white/15 shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#7C685B] dark:text-neutral-400 font-bold">
                    Email us
                  </span>
                  <span className="font-serif text-lg font-bold text-[#2A1810] dark:text-white group-hover:text-[#8C5528] dark:group-hover:text-[#E28C38] transition-colors">
                    {COMPANY_INFO.email}
                  </span>
                </div>
              </a>

              {/* WhatsApp Support Hours */}
              <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-[#16100D]/80 border border-white/80 dark:border-white/10 flex items-center gap-4 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-[#E6F4EA] dark:bg-emerald-950/40 text-[#2E7D32] dark:text-emerald-400 flex items-center justify-center border border-[#B7DFC2] dark:border-emerald-800/40 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#7C685B] dark:text-neutral-400 font-bold">
                    WhatsApp chat
                  </span>
                  <span className="text-sm font-semibold text-[#22543D] dark:text-emerald-400">
                    {COMPANY_INFO.supportHours}
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
                  <div className="w-16 h-16 rounded-2xl bg-[#E6F4EA] dark:bg-emerald-950/40 text-[#2E7D32] dark:text-emerald-400 border border-[#B7DFC2] dark:border-emerald-800/40 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1810] dark:text-white">
                      Enquiry Received!
                    </h3>
                    <p className="text-[#8C5528] dark:text-[#E28C38] font-bold text-sm">
                      Reference #{refId}
                    </p>
                    <p className="text-[#594336] dark:text-[#D1C2B8] text-sm max-w-md mx-auto leading-relaxed">
                      Thank you, {firstName || 'traveller'}. A dedicated luxury travel specialist from My Kind of Travel has been assigned to your request and will reach out within 24 hours.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#256529] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp Now</span>
                    </button>

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
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#8C5528] dark:focus:border-[#E28C38] focus:ring-1 focus:ring-[#8C5528]"
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
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#8C5528] dark:focus:border-[#E28C38] focus:ring-1 focus:ring-[#8C5528]"
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
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#8C5528] dark:focus:border-[#E28C38] focus:ring-1 focus:ring-[#8C5528]"
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
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#8C5528] dark:focus:border-[#E28C38] focus:ring-1 focus:ring-[#8C5528]"
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
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white text-sm focus:outline-none focus:border-[#8C5528] dark:focus:border-[#E28C38] focus:ring-1 focus:ring-[#8C5528] cursor-pointer"
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
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white text-sm focus:outline-none focus:border-[#8C5528] dark:focus:border-[#E28C38] focus:ring-1 focus:ring-[#8C5528] cursor-pointer"
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
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#1A1310] border border-[#DFD0C0] dark:border-white/15 text-[#2A1810] dark:text-white placeholder-[#A8988B] dark:placeholder-neutral-500 text-sm focus:outline-none focus:border-[#8C5528] dark:focus:border-[#E28C38] focus:ring-1 focus:ring-[#8C5528] resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-[#8C5528] dark:bg-[#C87428] hover:bg-[#72421D] dark:hover:bg-[#B86620] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#8C5528]/30 flex items-center justify-center gap-2 active:scale-98 border border-white/20"
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
