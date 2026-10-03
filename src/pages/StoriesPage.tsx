import React, { useState } from 'react';
import { TESTIMONIALS, COMPANY_INFO } from '../data/travelData';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { BackToTop } from '../components/BackToTop';
import { WishlistModal } from '../components/WishlistModal';
import { EnquiryModal } from '../components/EnquiryModal';
import { Heart, Star, MapPin, Quote, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StoriesPage() {
  const navigate = useNavigate();
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryTripType, setEnquiryTripType] = useState('');

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#140D0A] text-[#24130A] dark:text-[#F8F4EE] flex flex-col font-sans transition-colors duration-300">
      <Navbar onPlanTrip={() => setIsEnquiryOpen(true)} />

      <main className="flex-1 pt-28 sm:pt-36 pb-20">
        <div className="section-container space-y-12">
          
          {/* Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1C1410] border border-[#E8DFD5] dark:border-white/10 text-[#E37500] text-xs font-bold uppercase tracking-widest shadow-xs">
              <Heart className="w-3.5 h-3.5 text-[#E37500]" />
              <span>Real Experiences · India's Discerning Travelers</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#24130A] dark:text-white">
              Client Stories & <span className="italic font-serif text-[#E37500] font-normal">Memories</span>
            </h1>
            <p className="text-sm sm:text-base text-[#6F5B4E] dark:text-[#C5B7AC] leading-relaxed">
              Read uncensored feedback from our clients across Mumbai, Delhi, Bengaluru, and beyond who trusted My Kind of Travel for honeymoons, anniversaries, multi-generational family milestones, and private escapes.
            </p>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8">
            {TESTIMONIALS.map((review) => (
              <div
                key={review.id}
                className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#1C1410] border border-[#E8DFD5] dark:border-white/10 shadow-[0_8px_30px_rgba(42,24,16,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between space-y-6 relative group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Stars & Location */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#E37500]">
                      {Array.from({ length: review.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-[#8C7667] dark:text-[#A7978A] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E37500]" />
                      <span>{review.tripInfo}</span>
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote className="font-serif text-base sm:text-lg leading-relaxed text-[#24130A] dark:text-white italic">
                    "{review.quote}"
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-[#E8DFD5] dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.author}
                        className="w-11 h-11 rounded-full object-cover border border-[#E8DFD5] dark:border-white/20"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#E37500] text-white flex items-center justify-center font-bold text-sm">
                        {review.initial || review.author[0]}
                      </div>
                    )}
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#24130A] dark:text-white">
                        {review.author}
                      </h4>
                      <span className="text-xs text-[#6F5B4E] dark:text-[#A7978A]">
                        {review.year}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-[#E37500] px-2.5 py-1 rounded-full bg-[#E37500]/10 border border-[#E37500]/20">
                    Verified Journey
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="p-8 sm:p-12 rounded-3xl sm:rounded-4xl bg-gradient-to-br from-[#24130A] via-[#351D12] to-[#1C1009] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Ready to create your own unforgettable story?
              </h3>
              <p className="text-xs sm:text-sm text-[#D1C2B8] leading-relaxed">
                Connect directly with your private concierge to build an itinerary tailored to your rhythm and milestones.
              </p>
            </div>

            <button
              onClick={() => setIsEnquiryOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#E37500]/30 transition-all shrink-0 active:scale-95"
            >
              <span>Design Your Trip</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </main>

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialTripType={enquiryTripType}
      />

      <WishlistModal />

      <Footer
        onNavigate={(path) => {
          if (path === 'destinations') navigate('/destinations');
          else if (path === 'packages') navigate('/packages');
          else if (path === 'contact') setIsEnquiryOpen(true);
          else navigate(`/#${path}`);
        }}
        onSelectDestination={() => setIsEnquiryOpen(true)}
        onSelectTripType={(type) => {
          setEnquiryTripType(type);
          setIsEnquiryOpen(true);
        }}
        onPlanTrip={() => setIsEnquiryOpen(true)}
      />

      <FloatingWhatsApp />
      <BackToTop />
    </div>
  );
}
