import React, { useState, useEffect } from 'react';
import { COMPANY_INFO, DESTINATIONS, EXPERIENCE_PILLARS } from '../data/travelData';
import { Phone, Mail, MessageCircle, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = 'MKT-' + Math.floor(100000 + Math.random() * 900000);
    setRefId(generatedRef);
    setSubmitted(true);
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
    <section id="contact" className="py-20 lg:py-28 bg-[#121210] text-white border-b border-stone-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Contact details & intro */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold uppercase tracking-widest border border-amber-500/25">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get in touch</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Let's design your <br />
                <span className="italic font-serif text-amber-300 font-normal">
                  perfect trip
                </span>
              </h2>

              <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
                Share your travel dreams and we'll get back to you within 24 hours with a custom plan. No obligation, no pressure — just inspiration.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              {/* Phone / WhatsApp */}
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-colors flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400 font-semibold">
                    Call / WhatsApp
                  </span>
                  <span className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {COMPANY_INFO.phone}
                  </span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 transition-colors flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400 font-semibold">
                    Email us
                  </span>
                  <span className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {COMPANY_INFO.email}
                  </span>
                </div>
              </a>

              {/* WhatsApp Support Hours */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-stone-400 font-semibold">
                    WhatsApp chat
                  </span>
                  <span className="text-sm font-medium text-emerald-300">
                    {COMPANY_INFO.supportHours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl relative">
              {submitted ? (
                <div className="py-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      Enquiry Received!
                    </h3>
                    <p className="text-amber-300 font-semibold text-sm">
                      Reference #{refId}
                    </p>
                    <p className="text-stone-300 text-sm max-w-md mx-auto leading-relaxed">
                      Thank you, {firstName || 'traveller'}. A dedicated luxury travel specialist from My Kind of Travel has been assigned to your request and will reach out within 24 hours.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleWhatsAppDirect}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp Now</span>
                    </button>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setMessage('');
                      }}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
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
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                        First name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Rahul"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-800/90 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                        Last name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Sharma"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-800/90 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                        Email address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="rahul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-800/90 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Phone / WhatsApp */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                        WhatsApp / Phone
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98000 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-800/90 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Destination */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                        Destination
                      </label>
                      <select
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-800/90 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
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
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                        Trip type
                      </label>
                      <select
                        required
                        value={tripType}
                        onChange={(e) => setTripType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-800/90 border border-stone-700 text-white text-sm focus:outline-none focus:border-amber-500 cursor-pointer"
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
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
                      Tell us your dream trip
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Dates, budget, must-haves, special occasions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-stone-800/90 border border-stone-700 text-white placeholder-stone-500 text-sm focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-950/40 flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>Send My Enquiry →</span>
                  </button>

                  <p className="text-center text-[11px] text-stone-500 pt-1">
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
