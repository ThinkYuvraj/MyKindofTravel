import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { MarqueeTicker } from './components/MarqueeTicker';
import { Hero } from './components/Hero';
import { DestinationsSection } from './components/DestinationsSection';
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
import { EnquiryModal } from './components/EnquiryModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BackToTop } from './components/BackToTop';
import { CustomSectionRenderer } from './components/CustomSectionRenderer';
import { GoogleMapsSection } from './components/GoogleMapsSection';
import { GoogleMapsAgentModal } from './components/GoogleMapsAgentModal';
import { DESTINATIONS, POPULAR_PACKAGES, MARQUEE_ITEMS, TESTIMONIALS, EXPERIENCE_PILLARS, COMPANY_INFO, GALLERY_ITEMS } from './data/travelData';
import { DestinationItem, TravelPackage, CMSData } from './types';

const DEFAULT_ORDER = [
  'hero',
  'destinations',
  'experiences',
  'gallery',
  'mapsRadar',
  'marquee',
  'packages',
  'howItWorks',
  'testimonials',
  'whyUs',
  'contact',
];

export default function HomePage() {
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<DestinationItem | null>(null);
  const [enquiryDestination, setEnquiryDestination] = useState<string>('');
  const [enquiryTripType, setEnquiryTripType] = useState<string>('');
  const [enquiryPackageName, setEnquiryPackageName] = useState<string>('');
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [isMapsAgentOpen, setIsMapsAgentOpen] = useState(false);
  const [mapsAgentPrompt, setMapsAgentPrompt] = useState<string | undefined>(undefined);

  const handleOpenMapsAgent = (prompt?: string) => {
    setMapsAgentPrompt(prompt);
    setIsMapsAgentOpen(true);
  };

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
    if (sectionId === 'contact') {
      setIsEnquiryModalOpen(true);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlanTripClick = () => {
    setEnquiryPackageName('');
    setIsEnquiryModalOpen(true);
  };

  const handleSelectHighlight = (destName: string) => {
    setEnquiryDestination(destName);
    setEnquiryPackageName('');
    setIsEnquiryModalOpen(true);
  };

  const handleEnquireDestination = (destName: string) => {
    setEnquiryDestination(destName);
    setEnquiryPackageName('');
    setSelectedDestination(null);
    setIsEnquiryModalOpen(true);
  };

  const handlePlanTripType = (tripType: string) => {
    setEnquiryTripType(tripType);
    setEnquiryPackageName('');
    setIsEnquiryModalOpen(true);
  };

  const handleEnquirePackage = (pkg: TravelPackage) => {
    setEnquiryDestination(pkg.destination);
    setEnquiryTripType(pkg.tag.includes('Honeymoon') ? 'Honeymoon' : 'Luxury Europe Tour');
    setEnquiryPackageName(pkg.title);
    setSelectedPackage(null);
    setIsEnquiryModalOpen(true);
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
            bgImage={cmsData.sectionHeaders?.hero?.image || cmsData.heroBgImage}
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
            customBadge={cmsData.sectionHeaders?.destinations?.badge}
            customTitle={cmsData.sectionHeaders?.destinations?.title}
            customSubtitle={cmsData.sectionHeaders?.destinations?.subtitle}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onEnquireDestination={handleEnquireDestination}
          />
        );

      case 'mapsRadar':
        return (
          <GoogleMapsSection
            key="mapsRadar"
            onOpenAgentModal={handleOpenMapsAgent}
          />
        );

      case 'marquee':
        return <MarqueeTicker key="marquee" items={cmsData.marquee} />;

      case 'experiences':
        return (
          <ExperiencesSection
            key="experiences"
            pillars={cmsData.experiencePillars}
            customBadge={cmsData.sectionHeaders?.experiences?.badge}
            customTitle={cmsData.sectionHeaders?.experiences?.title}
            customSubtitle={cmsData.sectionHeaders?.experiences?.subtitle}
            onPlanTripType={handlePlanTripType}
          />
        );

      case 'howItWorks':
        return (
          <HowItWorksSection
            key="howItWorks"
            steps={cmsData.howItWorksSteps}
            customBadge={cmsData.sectionHeaders?.howItWorks?.badge}
            customTitle={cmsData.sectionHeaders?.howItWorks?.title}
            customSubtitle={cmsData.sectionHeaders?.howItWorks?.subtitle}
            onStartPlanning={handlePlanTripClick}
          />
        );

      case 'packages':
        return (
          <PackagesSection
            key="packages"
            data={cmsData.packages}
            customBadge={cmsData.sectionHeaders?.packages?.badge}
            customTitle={cmsData.sectionHeaders?.packages?.title}
            customSubtitle={cmsData.sectionHeaders?.packages?.subtitle}
            onEnquirePackage={handleEnquirePackage}
            onViewPackageDetails={(pkg) => setSelectedPackage(pkg)}
          />
        );

      case 'gallery':
        return (
          <WanderlustGallery
            key="gallery"
            items={cmsData.gallery}
            customBadge={cmsData.sectionHeaders?.gallery?.badge}
            customTitle={cmsData.sectionHeaders?.gallery?.title}
            customSubtitle={cmsData.sectionHeaders?.gallery?.subtitle}
            onPlanTripForLocation={handleSelectHighlight}
          />
        );

      case 'testimonials':
        return (
          <TestimonialsSection
            key="testimonials"
            testimonials={cmsData.testimonials}
            customBadge={cmsData.sectionHeaders?.testimonials?.badge}
            customTitle={cmsData.sectionHeaders?.testimonials?.title}
            customSubtitle={cmsData.sectionHeaders?.testimonials?.subtitle}
          />
        );

      case 'whyUs':
        return (
          <WhyUsSection
            key="whyUs"
            companyInfo={cmsData.companyInfo}
            pillars={cmsData.whyUsPillars}
            customBadge={cmsData.sectionHeaders?.whyUs?.badge}
            customTitle={cmsData.sectionHeaders?.whyUs?.title}
            customSubtitle={cmsData.sectionHeaders?.whyUs?.subtitle}
          />
        );

      case 'contact':
        return (
          <ContactSection
            key="contact"
            companyInfo={cmsData.companyInfo}
            customBadge={cmsData.sectionHeaders?.contact?.badge}
            customTitle={cmsData.sectionHeaders?.contact?.title}
            customSubtitle={cmsData.sectionHeaders?.contact?.subtitle}
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
    <div className="min-h-screen bg-[#1A0E08] text-[#24130A] dark:text-[#F8F4EE] flex flex-col selection:bg-[#E3BA91] selection:text-[#24130A] font-sans relative transition-colors duration-500">
      {/* Light Warm Gradient Canvas with #E3BA91 Champagne/Gold undertone */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-[#FAF6F1] via-[#F4E6D7] to-[#FAF6F1] animate-bg-gradient pointer-events-none transition-opacity duration-500 ease-in-out opacity-100 dark:opacity-0 -z-10"
        aria-hidden="true"
      />

      {/* Dark Mode Warm Espresso Canvas with subtle #E3BA91 ambient glow */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-[#140D0A] via-[#1F1510] to-[#140D0A] animate-bg-gradient pointer-events-none transition-opacity duration-500 ease-in-out opacity-0 dark:opacity-100 -z-10"
        aria-hidden="true"
      />

      {/* Top Sticky Header */}
      <Navbar
        onPlanTripClick={handlePlanTripClick}
        onNavigate={scrollToSection}
        onOpenMapsAgent={handleOpenMapsAgent}
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

      {/* Popup Enquiry Card Modal */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        initialDestination={enquiryDestination}
        initialTripType={enquiryTripType}
        initialPackageName={enquiryPackageName}
        companyInfo={cmsData.companyInfo}
      />

      {/* Google Maps Real-Time Intelligence Agent Modal */}
      <GoogleMapsAgentModal
        isOpen={isMapsAgentOpen}
        onClose={() => setIsMapsAgentOpen(false)}
        initialPrompt={mapsAgentPrompt}
      />

      {/* Floating 1-Click WhatsApp Concierge */}
      <FloatingWhatsApp />

      {/* Auto-Hiding Back To Top Button */}
      <BackToTop />
    </div>
  );
}


