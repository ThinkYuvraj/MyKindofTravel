import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
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

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
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
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0A0706] text-[#2A1810] dark:text-[#FAF7F2] flex flex-col selection:bg-[#8C5528] dark:selection:bg-[#E28C38] selection:text-white font-sans relative transition-colors duration-300">
      {/* Top Sticky Header */}
      <Navbar
        onPlanTripClick={handlePlanTripClick}
        onNavigate={scrollToSection}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onSelectDestination={(destId) => {
          const dest = DESTINATIONS.find((d) => d.id === destId);
          if (dest) {
            setSelectedDestination(dest);
          } else {
            scrollToSection('destinations');
          }
        }}
      />

      {/* Persistent Left Dock Tab to open the Sidebar anywhere on the page */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-center gap-2 py-3 px-2 rounded-r-2xl bg-white/85 dark:bg-[#16100D]/85 hover:bg-[#8C5528] dark:hover:bg-[#E28C38] text-[#594336] dark:text-[#DFD0C0] hover:text-white dark:hover:text-white border-y border-r border-[#DFD0C0] dark:border-white/10 hover:border-[#8C5528] shadow-lg backdrop-blur-md transition-all duration-300 group -translate-x-1 hover:translate-x-0"
        title="Open Full Sidebar Hub"
        aria-label="Open sidebar menu"
      >
        <Compass className="w-4 h-4 text-[#8C5528] dark:text-[#E28C38] group-hover:text-white group-hover:rotate-45 transition-transform" />
        <span className="text-[10px] uppercase font-bold tracking-widest [writing-mode:vertical-lr] rotate-180">
          Concierge Menu
        </span>
      </button>

      {/* Comprehensive Sidebar Navigation with all Navbar features */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onPlanTripClick={handlePlanTripClick}
        onNavigate={scrollToSection}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Hero Section: Exact replication of the reference screenshot */}
        <Hero
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

