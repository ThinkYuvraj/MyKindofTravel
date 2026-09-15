import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MarqueeTicker } from './components/MarqueeTicker';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { DestinationsSection } from './components/DestinationsSection';
import { ExperiencesSection } from './components/ExperiencesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PackagesSection } from './components/PackagesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WhyUsSection } from './components/WhyUsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PackageModal } from './components/PackageModal';
import { DestinationModal } from './components/DestinationModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { DestinationItem, TravelPackage } from './types';

export default function App() {
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
  const [enquiryDestination, setEnquiryDestination] = useState<string>('');
  const [enquiryTripType, setEnquiryTripType] = useState<string>('');

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlanTripClick = () => {
    scrollToSection('contact');
  };

  const handleSelectHighlight = (destName: string) => {
    setEnquiryDestination(destName);
    scrollToSection('contact');
  };

  const handleEnquireDestination = (destName: string) => {
    setEnquiryDestination(destName);
    setSelectedDestination(null);
    scrollToSection('contact');
  };

  const handlePlanTripType = (tripType: string) => {
    setEnquiryTripType(tripType);
    scrollToSection('contact');
  };

  const handleEnquirePackage = (pkg: TravelPackage) => {
    setEnquiryDestination(pkg.destination);
    setEnquiryTripType(pkg.tag.includes('Honeymoon') ? 'Honeymoon' : 'Luxury Europe Tour');
    setSelectedPackage(null);
    scrollToSection('contact');
  };

  return (
    <div className="min-h-screen bg-[#141412] text-stone-100 flex flex-col selection:bg-amber-400 selection:text-stone-950 font-sans">
      {/* Top Sticky Header */}
      <Navbar
        onPlanTripClick={handlePlanTripClick}
        onNavigate={scrollToSection}
      />

      {/* Marquee Ticker: Bali • Switzerland • Paris • Santorini • Maldives • Prague ... */}
      <MarqueeTicker />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onPlanTrip={handlePlanTripClick}
          onExploreDestinations={() => scrollToSection('destinations')}
          onSelectHighlight={handleSelectHighlight}
        />

        {/* About & Philosophy Section */}
        <AboutSection />

        {/* Where We Take You (Destinations) */}
        <DestinationsSection
          onSelectDestination={(dest) => setSelectedDestination(dest)}
          onEnquireDestination={handleEnquireDestination}
        />

        {/* What We Curate (6 Experience Pillars) */}
        <ExperiencesSection onPlanTripType={handlePlanTripType} />

        {/* How It Works (4 Steps) */}
        <HowItWorksSection onStartPlanning={handlePlanTripClick} />

        {/* Popular Packages Ready to Personalise */}
        <PackagesSection
          onEnquirePackage={handleEnquirePackage}
          onViewPackageDetails={(pkg) => setSelectedPackage(pkg)}
        />

        {/* Real Stories (Testimonials) */}
        <TestimonialsSection />

        {/* Why Us & Our Promise */}
        <WhyUsSection />

        {/* Get in Touch (Interactive Enquiry Form & Contacts) */}
        <ContactSection
          initialDestination={enquiryDestination}
          initialTripType={enquiryTripType}
        />
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={scrollToSection}
        onPlanTrip={handlePlanTripClick}
        onSelectDestination={handleEnquireDestination}
        onSelectTripType={handlePlanTripType}
      />

      {/* Modals */}
      <PackageModal
        pkg={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onCustomise={handleEnquirePackage}
      />

      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onEnquire={handleEnquireDestination}
      />

      {/* Floating 1-Click WhatsApp Concierge */}
      <FloatingWhatsApp />
    </div>
  );
}
