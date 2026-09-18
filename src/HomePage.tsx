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
import { BackToTop } from './components/BackToTop';
import { CustomSectionRenderer } from './components/CustomSectionRenderer';
import { DESTINATIONS, POPULAR_PACKAGES, MARQUEE_ITEMS, TESTIMONIALS, EXPERIENCE_PILLARS, COMPANY_INFO, GALLERY_ITEMS } from './data/travelData';
import { DestinationItem, TravelPackage, CMSData } from './types';

const DEFAULT_ORDER = [
  'hero',
  'destinations',
  'marquee',
  'about',
  'radar',
  'experiences',
  'howItWorks',
  'packages',
  'gallery',
  'testimonials',
  'whyUs',
  'contact',
];

export default function HomePage() {
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
  const [enquiryDestination, setEnquiryDestination] = useState<string>('');
  const [enquiryTripType, setEnquiryTripType] = useState<string>('');

  const [cmsData, setCmsData] = useState<CMSData>({
    heroTitle: 'EXPLORE. DREAM. DISCOVER.',
    heroSubtitle: "Handcrafted luxury holidays, private European chalets, honeymoon cliffside villas, and bespoke journeys tailored for India's discerning travellers.",
    heroBadge: 'My Kind of Travel • Bespoke Journeys',
    heroBgImage: '',
    primaryButton: 'START EXPLORING',
    secondaryButton: 'PLAN TRIP',
    sectionOrder: DEFAULT_ORDER,
    sectionVisibility: {
      hero: true,
      destinations: true,
      marquee: true,
      about: true,
      radar: true,
      experiences: true,
      howItWorks: true,
      packages: true,
      gallery: true,
      testimonials: true,
      whyUs: true,
      contact: true,
    },
    destinations: DESTINATIONS,
    packages: POPULAR_PACKAGES,
    marquee: MARQUEE_ITEMS,
    testimonials: TESTIMONIALS,
    experiencePillars: EXPERIENCE_PILLARS,
    gallery: GALLERY_ITEMS,
    customSections: [],
    companyInfo: COMPANY_INFO,
  });

  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const response = await fetch('/api/cms');
        if (response.ok) {
          const data = await response.json();
          setCmsData((prev) => ({
            ...prev,
            ...data,
            sectionOrder: data.sectionOrder || prev.sectionOrder,
            sectionVisibility: data.sectionVisibility || prev.sectionVisibility,
            destinations: data.destinations || prev.destinations,
            packages: data.packages || prev.packages,
            marquee: data.marquee || prev.marquee,
            testimonials: data.testimonials || prev.testimonials,
            experiencePillars: data.experiencePillars || prev.experiencePillars,
            gallery: data.gallery || prev.gallery,
            customSections: data.customSections || prev.customSections,
            companyInfo: data.companyInfo || prev.companyInfo,
          }));
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

  // Section Component Factory
  const renderSectionByKey = (key: string) => {
    // Check master visibility toggle
    if (cmsData.sectionVisibility && cmsData.sectionVisibility[key] === false) {
      return null;
    }

    // Check if key corresponds to a custom section
    const customSec = cmsData.customSections?.find((s) => s.id === key);
    if (customSec) {
      return (
        <CustomSectionRenderer
          key={customSec.id}
          section={customSec}
          onCtaClick={handlePlanTripClick}
        />
      );
    }

    switch (key) {
      case 'hero':
        return (
          <Hero
            key="hero"
            title={cmsData.heroTitle}
            subtitle={cmsData.heroSubtitle}
            badgeText={cmsData.heroBadge}
            bgImage={cmsData.heroBgImage}
            primaryButtonText={cmsData.primaryButton}
            secondaryButtonText={cmsData.secondaryButton}
            onPlanTrip={handlePlanTripClick}
            onExploreDestinations={() => scrollToSection('destinations')}
            onSelectHighlight={handleSelectHighlight}
          />
        );

      case 'destinations':
        return (
          <DestinationsSection
            key="destinations"
            data={cmsData.destinations}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onEnquireDestination={handleEnquireDestination}
          />
        );

      case 'marquee':
        return <MarqueeTicker key="marquee" items={cmsData.marquee} />;

      case 'about':
        return <AboutSection key="about" companyInfo={cmsData.companyInfo} />;

      case 'radar':
        return (
          <FlightRouteRadar
            key="radar"
            onSelectRoute={(destinationName) => {
              setEnquiryDestination(destinationName);
              scrollToSection('contact');
            }}
          />
        );

      case 'experiences':
        return (
          <ExperiencesSection
            key="experiences"
            pillars={cmsData.experiencePillars}
            onPlanTripType={handlePlanTripType}
          />
        );

      case 'howItWorks':
        return <HowItWorksSection key="howItWorks" onStartPlanning={handlePlanTripClick} />;

      case 'packages':
        return (
          <PackagesSection
            key="packages"
            data={cmsData.packages}
            onEnquirePackage={handleEnquirePackage}
            onViewPackageDetails={(pkg) => setSelectedPackage(pkg)}
          />
        );

      case 'gallery':
        return (
          <WanderlustGallery
            key="gallery"
            items={cmsData.gallery}
            onPlanTripForLocation={handleSelectHighlight}
          />
        );

      case 'testimonials':
        return <TestimonialsSection key="testimonials" testimonials={cmsData.testimonials} />;

      case 'whyUs':
        return <WhyUsSection key="whyUs" companyInfo={cmsData.companyInfo} />;

      case 'contact':
        return (
          <ContactSection
            key="contact"
            initialDestination={enquiryDestination}
            initialTripType={enquiryTripType}
          />
        );

      default:
        return null;
    }
  };

  // Combine built-in sectionOrder with any custom sections not yet in sectionOrder
  const allSectionKeys = [
    ...(cmsData.sectionOrder || DEFAULT_ORDER),
    ...(cmsData.customSections || [])
      .map((s) => s.id)
      .filter((id) => !(cmsData.sectionOrder || []).includes(id)),
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0A0706] text-[#2A1810] dark:text-[#FAF7F2] flex flex-col selection:bg-[#8C5528] dark:selection:bg-[#E28C38] selection:text-white font-sans relative transition-colors duration-500">
      {/* Light Mode Subtle Gradient Canvas (Crossfades seamlessly) */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-[#FAF7F2] via-[#EFE8DF] to-[#FAF7F2] animate-bg-gradient pointer-events-none transition-opacity duration-500 ease-in-out opacity-100 dark:opacity-0 -z-10"
        aria-hidden="true"
      />

      {/* Dark Mode Obsidian & Deep Espresso Gradient Canvas (Crossfades seamlessly) */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-[#0A0706] via-[#16100D] to-[#0A0706] animate-bg-gradient pointer-events-none transition-opacity duration-500 ease-in-out opacity-0 dark:opacity-100 -z-10"
        aria-hidden="true"
      />

      {/* Top Sticky Header */}
      <Navbar
        onPlanTripClick={handlePlanTripClick}
        onNavigate={scrollToSection}
        onSelectDestination={(destId) => {
          const dest = (cmsData.destinations || DESTINATIONS).find((d) => d.id === destId);
          if (dest) {
            setSelectedDestination(dest);
          } else {
            scrollToSection('destinations');
          }
        }}
      />

      {/* Main Dynamic Page Flow */}
      <main className="flex-1 w-full overflow-x-clip">
        {allSectionKeys.map((key) => renderSectionByKey(key))}
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

      {/* Auto-Hiding Back To Top Button */}
      <BackToTop />
    </div>
  );
}


