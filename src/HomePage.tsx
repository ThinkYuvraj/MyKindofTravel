import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MarqueeTicker } from './components/MarqueeTicker';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { DestinationsSection } from './components/DestinationsSection';
import { FlightRouteRadar } from './components/FlightRouteRadar';
import { ExperiencesSection } from './components/ExperiencesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PackagesSection } from './components/PackagesSection';
import { WanderlustGallery } from './components/WanderlustGallery';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WhyUsSection } from './components/WhyUsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PackageModal } from './components/PackageModal';
import { DestinationModal } from './components/DestinationModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { DESTINATIONS } from './data/travelData';
import { DestinationItem, TravelPackage } from './types';
import { Compass } from 'lucide-react';

export default function HomePage() {
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
  const [enquiryDestination, setEnquiryDestination] = useState<string>('');
  const [enquiryTripType, setEnquiryTripType] = useState<string>('');

  const [cmsData, setCmsData] = useState<any>({
    heroTitle: 'EXPLORE. DREAM. DISCOVER.',
    heroSubtitle: "Handcrafted luxury holidays, private European chalets, honeymoon cliffside villas, and bespoke journeys tailored for India's discerning travellers.",
    primaryButton: 'START EXPLORING',
    secondaryButton: 'PLAN TRIP'
  });

  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const response = await fetch('/api/cms');
        if (response.ok) {
          const data = await response.json();
          setCmsData((prev: any) => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error("Error loading CMS data", e);
      }
    };
    fetchCmsData();
  }, []);


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
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#EFE8DF] to-[#FAF7F2] dark:from-[#0A0706] dark:via-[#16100D] dark:to-[#0A0706] animate-bg-gradient text-[#2A1810] dark:text-[#FAF7F2] flex flex-col selection:bg-[#8C5528] dark:selection:bg-[#E28C38] selection:text-white font-sans relative transition-colors duration-300">
      {/* Top Sticky Header */}
      <Navbar
        onPlanTripClick={handlePlanTripClick}
        onNavigate={scrollToSection}
        onSelectDestination={(destId) => {
          const dest = DESTINATIONS.find((d) => d.id === destId);
          if (dest) {
            setSelectedDestination(dest);
          } else {
            scrollToSection('destinations');
          }
        }}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section: Exact replication of the reference screenshot */}
        <Hero
          title={cmsData.heroTitle}
          subtitle={cmsData.heroSubtitle}
          primaryButtonText={cmsData.primaryButton}
          secondaryButtonText={cmsData.secondaryButton}
          onPlanTrip={handlePlanTripClick}
          onExploreDestinations={() => scrollToSection('destinations')}
          onSelectHighlight={handleSelectHighlight}
        />

        {/* Featured Destinations Section (revealed right below the torn paper edge) */}
        <DestinationsSection
          onSelectDestination={(dest) => setSelectedDestination(dest)}
          onEnquireDestination={handleEnquireDestination}
        />

        {/* Marquee Ticker: Bali • Switzerland • Paris • Santorini • Maldives • Prague ... */}
        <MarqueeTicker />

        {/* About & Philosophy Section */}
        <AboutSection />

        {/* Direct Flight Corridors & Radar (India to Bali, Paris, Swiss Alps, Santorini, Maldives) */}
        <FlightRouteRadar
          onSelectRoute={(destinationName) => {
            setEnquiryDestination(destinationName);
            scrollToSection('contact');
          }}
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

        {/* Wanderlust Gallery: Visual Odyssey with glassmorphic cards */}
        <WanderlustGallery onPlanTripForLocation={handleSelectHighlight} />

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

