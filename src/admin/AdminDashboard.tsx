import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  DestinationItem,
  TravelPackage,
  CustomSection,
  TestimonialItem,
  ExperiencePillar,
  GalleryItem,
  HowItWorksStep,
  WhyUsPillar,
  SectionCustomContent,
} from '../types';
import {
  Layers,
  Settings,
  Map,
  Package,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  LogOut,
  Inbox,
  Shield,
  MessageSquareQuote,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Compass,
  Camera,
} from 'lucide-react';
import { SectionsManager } from './SectionsManager';
import { InquiriesManager } from './InquiriesManager';
import { CredentialsManager } from './CredentialsManager';
import { GalleryManager } from './GalleryManager';
import { ImageUploadField } from './ImageUploadField';
import {
  DESTINATIONS,
  POPULAR_PACKAGES,
  MARQUEE_ITEMS,
  TESTIMONIALS,
  EXPERIENCE_PILLARS,
  COMPANY_INFO,
  GALLERY_ITEMS,
} from '../data/travelData';

type Tab = 'sections' | 'hero' | 'destinations' | 'packages' | 'gallery' | 'content' | 'leads' | 'settings';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveBanner, setSaveBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('sections');

  // CMS State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  const [primaryButton, setPrimaryButton] = useState('');
  const [secondaryButton, setSecondaryButton] = useState('');

  const [sectionOrder, setSectionOrder] = useState<string[]>([
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
  ]);
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({});
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [marquee, setMarquee] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [experiencePillars, setExperiencePillars] = useState<ExperiencePillar[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [companyInfo, setCompanyInfo] = useState<any>(COMPANY_INFO);
  const [sectionHeaders, setSectionHeaders] = useState<Record<string, SectionCustomContent>>({});
  const [howItWorksSteps, setHowItWorksSteps] = useState<HowItWorksStep[]>([]);
  const [whyUsPillars, setWhyUsPillars] = useState<WhyUsPillar[]>([]);

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      navigate('/admin/login');
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/cms');
      if (response.ok) {
        const data = await response.json();
        setHeroTitle(data.heroTitle || 'EXPLORE. DREAM. DISCOVER.');
        setHeroSubtitle(data.heroSubtitle || '');
        setHeroBadge(data.heroBadge || 'My Kind of Travel • Bespoke Journeys');
        setHeroBgImage(data.heroBgImage || '');
        setPrimaryButton(data.primaryButton || 'START EXPLORING');
        setSecondaryButton(data.secondaryButton || 'PLAN TRIP');
        if (data.sectionOrder && Array.isArray(data.sectionOrder)) {
          setSectionOrder(data.sectionOrder);
        }
        if (data.sectionVisibility) {
          setSectionVisibility(data.sectionVisibility);
        }
        setDestinations(data.destinations || DESTINATIONS);
        setPackages(data.packages || POPULAR_PACKAGES);
        setMarquee(data.marquee || MARQUEE_ITEMS);
        setTestimonials(data.testimonials || TESTIMONIALS);
        setExperiencePillars(data.experiencePillars || EXPERIENCE_PILLARS);
        setGallery(data.gallery || GALLERY_ITEMS);
        setCustomSections(data.customSections || []);
        setCompanyInfo(data.companyInfo || COMPANY_INFO);
        setSectionHeaders(data.sectionHeaders || {});
        if (data.howItWorksSteps && Array.isArray(data.howItWorksSteps)) {
          setHowItWorksSteps(data.howItWorksSteps);
        }
        if (data.whyUsPillars && Array.isArray(data.whyUsPillars)) {
          setWhyUsPillars(data.whyUsPillars);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveBanner(null);
    try {
      const response = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroTitle,
          heroSubtitle,
          heroBadge,
          heroBgImage,
          primaryButton,
          secondaryButton,
          sectionOrder,
          sectionVisibility,
          destinations,
          packages,
          marquee,
          testimonials,
          experiencePillars,
          gallery,
          customSections,
          companyInfo,
          sectionHeaders,
          howItWorksSteps,
          whyUsPillars,
        }),
      });

      if (response.ok) {
        setSaveBanner({ type: 'success', message: 'All changes saved & published to live site!' });
        setTimeout(() => setSaveBanner(null), 4000);
      } else {
        setSaveBanner({ type: 'error', message: 'Server error saving changes.' });
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveBanner({ type: 'error', message: 'Network error saving changes.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[#FAF7F4] bg-[#201109] min-h-screen flex items-center justify-center">
        <div className="space-y-3">
          <Compass className="w-10 h-10 text-[#C87428] animate-spin mx-auto" />
          <p className="font-serif text-lg font-bold">Loading Interactive CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#201109] flex flex-col font-sans text-[#FAF7F4]">
      {/* Top Header */}
      <header className="bg-[#1A0E08] border-b border-[#3D2315] px-6 py-3.5 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C87428] to-[#8C5528] flex items-center justify-center text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-serif font-bold text-[#FAF7F4]">My Kind of Travel</h1>
            <span className="text-[11px] text-[#C87428] font-bold uppercase tracking-widest block">
              Interactive CMS Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A1810] hover:bg-[#3D2315] text-[#EADFD5] text-xs font-semibold transition-colors border border-[#3D2315]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C87428]" />
            <span>View Live Site</span>
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-[#C87428]/25"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Publish Changes'}</span>
          </button>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-xl bg-[#2A1810] hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition-colors border border-[#3D2315]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Persistent Save Notification Banner */}
      {saveBanner && (
        <div
          className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between transition-all ${
            saveBanner.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-b border-emerald-800'
              : 'bg-red-950 text-red-200 border-b border-red-800'
          }`}
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            {saveBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{saveBanner.message}</span>
          </div>
          <button onClick={() => setSaveBanner(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[#1A0E08] border-r border-[#3D2315] hidden lg:block shrink-0">
          <nav className="p-4 space-y-1.5 sticky top-16">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-[#EADFD5]/50">
              Page Architecture
            </div>

            <button
              onClick={() => setActiveTab('sections')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sections'
                  ? 'bg-[#C87428] text-white shadow-md'
                  : 'text-[#EADFD5] hover:bg-[#2A1810] hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Sections & Page Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hero'
                  ? 'bg-[#C87428] text-white shadow-md'
                  : 'text-[#EADFD5] hover:bg-[#2A1810] hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Hero & Banners</span>
            </button>

            <button
              onClick={() => setActiveTab('destinations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'destinations'
                  ? 'bg-[#C87428] text-white shadow-md'
                  : 'text-[#EADFD5] hover:bg-[#2A1810] hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Destinations ({destinations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'packages'
                  ? 'bg-[#C87428] text-white shadow-md'
                  : 'text-[#EADFD5] hover:bg-[#2A1810] hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Itineraries & Packages ({packages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-[#C87428] text-white shadow-md'
                  : 'text-[#EADFD5] hover:bg-[#2A1810] hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Visual Gallery ({gallery.length})</span>
            </button>

            <div className="pt-4 px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-[#EADFD5]/50">
              Content & Inquiries
            </div>

            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'content'
                  ? 'bg-[#C87428] text-white shadow-md'
                  : 'text-[#EADFD5] hover:bg-[#2A1810] hover:text-white'
              }`}
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Stories & Pillars</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'leads'
                  ? 'bg-[#C87428] text-white shadow-md'
                  : 'text-[#EADFD5] hover:bg-[#2A1810] hover:text-white'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Customer Inquiries CRM</span>
            </button>

            <div className="pt-4 px-3 py-2 text-[10px] uppercase font-bold tracking-widest text-[#EADFD5]/50">
              System & Security
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#C87428] text-white shadow-md'
                  : 'text-[#EADFD5] hover:bg-[#2A1810] hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Pass & Agency</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Horizontal Tabs Bar */}
        <div className="lg:hidden flex overflow-x-auto border-b border-[#3D2315] bg-[#1A0E08] p-2 gap-1.5 scrollbar-none w-full">
          {[
            { id: 'sections', label: 'Sections' },
            { id: 'hero', label: 'Hero' },
            { id: 'destinations', label: 'Destinations' },
            { id: 'packages', label: 'Packages' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'content', label: 'Stories' },
            { id: 'leads', label: 'Inquiries' },
            { id: 'settings', label: 'Credentials' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-[#C87428] text-white'
                  : 'text-[#EADFD5]/70 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <div className="bg-[#2A1810] rounded-2xl shadow-2xl border border-[#3D2315] overflow-hidden">
            {/* 1. Sections & Flow Tab */}
            {activeTab === 'sections' && (
              <SectionsManager
                sectionOrder={sectionOrder}
                setSectionOrder={setSectionOrder}
                sectionVisibility={sectionVisibility}
                setSectionVisibility={setSectionVisibility}
                customSections={customSections}
                setCustomSections={setCustomSections}
                sectionHeaders={sectionHeaders}
                setSectionHeaders={setSectionHeaders}
                howItWorksSteps={howItWorksSteps}
                setHowItWorksSteps={setHowItWorksSteps}
                whyUsPillars={whyUsPillars}
                setWhyUsPillars={setWhyUsPillars}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {/* 2. Hero Tab */}
            {activeTab === 'hero' && (
              <div className="p-6 space-y-6">
                <div className="pb-4 border-b border-[#3D2315]">
                  <div className="flex items-center gap-2 text-[#C87428] font-bold text-xs uppercase tracking-widest mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Hero Section & Brand Welcome</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-white">Main Visual Header</h3>
                </div>

                <div className="space-y-4 max-w-3xl">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#EADFD5] mb-1.5">
                      Eyebrow Badge Text
                    </label>
                    <input
                      type="text"
                      value={heroBadge}
                      onChange={(e) => setHeroBadge(e.target.value)}
                      placeholder="My Kind of Travel • Bespoke Journeys"
                      className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl text-sm outline-none focus:border-[#C87428]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#EADFD5] mb-1.5">
                      Main Headline
                    </label>
                    <input
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl text-sm outline-none focus:border-[#C87428]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-[#EADFD5] mb-1.5">
                      Subtitle / Editorial Description
                    </label>
                    <textarea
                      rows={3}
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl text-sm outline-none focus:border-[#C87428]"
                    />
                  </div>

                  <div>
                    <ImageUploadField
                      label="Hero Background Panorama Image"
                      value={heroBgImage}
                      onChange={(url) => setHeroBgImage(url)}
                      aspectRatio="wide"
                      placeholder="Leave empty for default Bali green terraces, or paste an image URL"
                      helperText="Select from curated luxury travel presets (Zermatt, Paris, Maldives, Bali) or upload an image from your device."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#EADFD5] mb-1.5">
                        Primary CTA Button
                      </label>
                      <input
                        type="text"
                        value={primaryButton}
                        onChange={(e) => setPrimaryButton(e.target.value)}
                        className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl text-sm outline-none focus:border-[#C87428]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-[#EADFD5] mb-1.5">
                        Secondary CTA Button
                      </label>
                      <input
                        type="text"
                        value={secondaryButton}
                        onChange={(e) => setSecondaryButton(e.target.value)}
                        className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl text-sm outline-none focus:border-[#C87428]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Destinations Tab */}
            {activeTab === 'destinations' && (
              <DestinationsManager destinations={destinations} setDestinations={setDestinations} />
            )}

            {/* 4. Packages Tab */}
            {activeTab === 'packages' && (
              <PackagesManager packages={packages} setPackages={setPackages} />
            )}

            {/* 5. Wanderlust Visual Gallery Tab */}
            {activeTab === 'gallery' && (
              <GalleryManager gallery={gallery} setGallery={setGallery} />
            )}

            {/* 6. Stories, Testimonials & Marquee Tab */}
            {activeTab === 'content' && (
              <ContentManager
                marquee={marquee}
                setMarquee={setMarquee}
                testimonials={testimonials}
                setTestimonials={setTestimonials}
                experiencePillars={experiencePillars}
                setExperiencePillars={setExperiencePillars}
              />
            )}

            {/* 6. Customer Inquiries Tab */}
            {activeTab === 'leads' && <InquiriesManager />}

            {/* 7. Settings & Credentials Tab */}
            {activeTab === 'settings' && (
              <CredentialsManager
                companyInfo={companyInfo}
                setCompanyInfo={setCompanyInfo}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Subcomponent: DestinationsManager
// --------------------------------------------------------
function DestinationsManager({
  destinations,
  setDestinations,
}: {
  destinations: DestinationItem[];
  setDestinations: React.Dispatch<React.SetStateAction<DestinationItem[]>>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newDest: DestinationItem = {
      id: `dest-${Date.now()}`,
      name: 'Santorini Sunset Haven',
      country: 'Greece',
      region: 'Cyclades',
      priceNote: 'Starting at ₹2,40,000 / couple',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
      description: 'Perched high on the caldera with private heated plunge pools and uninterrupted Aegean views.',
      highlights: ['Private catamaran caldera cruise', 'Cliffside wine tasting at sunset', 'VIP airport transfers'],
      bestTime: 'May to October',
      idealFor: 'Couples & Milestones',
    };
    setDestinations([newDest, ...destinations]);
    setEditingId(newDest.id);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    setDestinations(destinations.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this destination?')) {
      setDestinations(destinations.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3D2315]">
        <div>
          <h3 className="text-xl font-serif font-bold text-white">Manage Featured Destinations</h3>
          <p className="text-sm text-[#EADFD5]/70 mt-1">
            Display luxury destination cards with tags, descriptions, flight details, and perks.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Destination</span>
        </button>
      </div>

      <div className="space-y-4">
        {destinations.map((dest) => (
          <div key={dest.id} className="border border-[#3D2315] rounded-xl p-4 bg-[#1A0E08]/60">
            {editingId === dest.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Destination Name</label>
                    <input
                      value={dest.name}
                      onChange={(e) => handleUpdate(dest.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Country</label>
                    <input
                      value={dest.country}
                      onChange={(e) => handleUpdate(dest.id, 'country', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Region</label>
                    <input
                      value={dest.region}
                      onChange={(e) => handleUpdate(dest.id, 'region', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Price Note / Starting Price</label>
                    <input
                      value={dest.priceNote}
                      onChange={(e) => handleUpdate(dest.id, 'priceNote', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploadField
                      label="Destination Card Image"
                      value={dest.image}
                      onChange={(url) => handleUpdate(dest.id, 'image', url)}
                      aspectRatio="video"
                      helperText="Select from luxury presets or upload high-res destination photography."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Description</label>
                    <textarea
                      value={dest.description}
                      onChange={(e) => handleUpdate(dest.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Best Time to Visit</label>
                    <input
                      value={dest.bestTime}
                      onChange={(e) => handleUpdate(dest.id, 'bestTime', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Ideal For</label>
                    <input
                      value={dest.idealFor}
                      onChange={(e) => handleUpdate(dest.id, 'idealFor', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#EADFD5] block mb-1">
                    Signature Inclusions (Comma separated)
                  </label>
                  <input
                    value={(dest.highlights || []).join(', ')}
                    onChange={(e) =>
                      handleUpdate(
                        dest.id,
                        'highlights',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                    className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-[#C87428] text-white rounded-lg text-xs font-bold"
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {dest.image ? (
                    <img src={dest.image} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#201109] flex items-center justify-center text-neutral-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-white truncate">{dest.name}</h4>
                    <p className="text-xs text-[#EADFD5]/70">
                      {dest.country} • {dest.region} • {dest.priceNote}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingId(dest.id)}
                    className="p-2 bg-[#2A1810] hover:bg-[#3D2315] text-[#E28C38] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(dest.id)}
                    className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Subcomponent: PackagesManager
// --------------------------------------------------------
function PackagesManager({
  packages,
  setPackages,
}: {
  packages: TravelPackage[];
  setPackages: React.Dispatch<React.SetStateAction<TravelPackage[]>>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newPkg: TravelPackage = {
      id: `pkg-${Date.now()}`,
      tag: 'Luxury Honeymoon',
      badge: 'Best Seller',
      title: 'French Riviera & Monaco Luxe Escape',
      subtitle: 'Nice, Cannes, Eze, Monte Carlo',
      duration: '7 Days / 6 Nights',
      destination: 'France & Monaco',
      startingPrice: '₹3,20,000',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
      features: ['Private Ferrari or Helicopter transfer to Monaco', '5-star cliffside suites in Eze', 'Michelin star sunset dinners'],
      inclusions: ['Luxury airport chauffeur', 'Daily champagne breakfasts', 'Private yacht excursion to Saint-Tropez'],
      dayHighlights: [
        { day: 1, title: 'Arrival in Nice', details: 'Private chauffeur to sea-view suite' },
        { day: 2, title: 'Monaco Grandeur', details: 'Casino square VIP tour and yacht dinner' },
      ],
    };
    setPackages([newPkg, ...packages]);
    setEditingId(newPkg.id);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    setPackages(packages.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this package?')) {
      setPackages(packages.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3D2315]">
        <div>
          <h3 className="text-xl font-serif font-bold text-white">Manage Curated Packages</h3>
          <p className="text-sm text-[#EADFD5]/70 mt-1">
            Proven, popular packages with itinerary details and investment pricing.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Package</span>
        </button>
      </div>

      <div className="space-y-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="border border-[#3D2315] rounded-xl p-4 bg-[#1A0E08]/60">
            {editingId === pkg.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Package Title</label>
                    <input
                      value={pkg.title}
                      onChange={(e) => handleUpdate(pkg.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Subtitle</label>
                    <input
                      value={pkg.subtitle}
                      onChange={(e) => handleUpdate(pkg.id, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Destination</label>
                    <input
                      value={pkg.destination}
                      onChange={(e) => handleUpdate(pkg.id, 'destination', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Duration (e.g. 7 Days)</label>
                    <input
                      value={pkg.duration}
                      onChange={(e) => handleUpdate(pkg.id, 'duration', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Price (e.g. ₹2,40,000)</label>
                    <input
                      value={pkg.startingPrice}
                      onChange={(e) => handleUpdate(pkg.id, 'startingPrice', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#EADFD5] block mb-1">Tag / Category</label>
                    <input
                      value={pkg.tag}
                      onChange={(e) => handleUpdate(pkg.id, 'tag', e.target.value)}
                      className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUploadField
                      label="Package Hero Cover Image"
                      value={pkg.image}
                      onChange={(url) => handleUpdate(pkg.id, 'image', url)}
                      aspectRatio="video"
                      helperText="Curated travel photo representing this itinerary package."
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#EADFD5] block mb-1">Features (Comma separated)</label>
                  <input
                    value={(pkg.features || []).join(', ')}
                    onChange={(e) =>
                      handleUpdate(
                        pkg.id,
                        'features',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                    className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#EADFD5] block mb-1">Inclusions (Comma separated)</label>
                  <input
                    value={(pkg.inclusions || []).join(', ')}
                    onChange={(e) =>
                      handleUpdate(
                        pkg.id,
                        'inclusions',
                        e.target.value.split(',').map((s) => s.trim())
                      )
                    }
                    className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-[#C87428] text-white rounded-lg text-xs font-bold"
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {pkg.image ? (
                    <img src={pkg.image} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/10" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#201109] flex items-center justify-center text-neutral-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-white truncate">{pkg.title}</h4>
                    <p className="text-xs text-[#EADFD5]/70">
                      {pkg.destination} • {pkg.duration} • <span className="text-[#C87428] font-semibold">{pkg.startingPrice}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingId(pkg.id)}
                    className="p-2 bg-[#2A1810] hover:bg-[#3D2315] text-[#E28C38] rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Subcomponent: ContentManager (Marquee, Testimonials, Experience Pillars)
// --------------------------------------------------------
function ContentManager({
  marquee,
  setMarquee,
  testimonials,
  setTestimonials,
  experiencePillars,
  setExperiencePillars,
}: {
  marquee: string[];
  setMarquee: React.Dispatch<React.SetStateAction<string[]>>;
  testimonials: TestimonialItem[];
  setTestimonials: React.Dispatch<React.SetStateAction<TestimonialItem[]>>;
  experiencePillars: ExperiencePillar[];
  setExperiencePillars: React.Dispatch<React.SetStateAction<ExperiencePillar[]>>;
}) {
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  const handleAddTestimonial = () => {
    const newTest: TestimonialItem = {
      id: `review-${Date.now()}`,
      author: 'Pooja & Sameer Verma',
      rating: 5,
      quote:
        'Every little detail of our Swiss chalet and glacier helicopter flight was taken care of seamlessly. Absolute 5-star service from My Kind of Travel.',
      tripInfo: 'Honeymoon in Switzerland & Paris',
      year: '2025',
      initial: 'P',
    };
    setTestimonials([newTest, ...testimonials]);
    setEditingTestimonialId(newTest.id);
  };

  const handleUpdateTestimonial = (id: string, field: string, val: any) => {
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, [field]: val } : t)));
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Delete this client story?')) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* 1. Marquee Ticker */}
      <div className="space-y-4">
        <div className="pb-3 border-b border-[#3D2315]">
          <h3 className="text-lg font-serif font-bold text-white">Marquee Ticker Items</h3>
          <p className="text-xs text-[#EADFD5]/70 mt-0.5">
            Continuous moving ticker phrases below the hero banner. Separate items with commas.
          </p>
        </div>

        <div>
          <textarea
            rows={2}
            value={marquee.join(', ')}
            onChange={(e) =>
              setMarquee(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
            }
            className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
          />
        </div>
      </div>

      {/* 2. Testimonials / Client Stories */}
      <div className="space-y-4 pt-4 border-t border-[#3D2315]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#3D2315]">
          <div>
            <h3 className="text-lg font-serif font-bold text-white">Client Stories & Reviews</h3>
            <p className="text-xs text-[#EADFD5]/70 mt-0.5">
              Verified testimonials with traveller name, rating, and trip details.
            </p>
          </div>
          <button
            onClick={handleAddTestimonial}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Review</span>
          </button>
        </div>

        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-[#1A0E08] border border-[#3D2315]">
              {editingTestimonialId === t.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      placeholder="Traveller Name"
                      value={t.author}
                      onChange={(e) => handleUpdateTestimonial(t.id, 'author', e.target.value)}
                      className="px-3 py-1.5 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                    />
                    <input
                      placeholder="Trip Info (e.g. Honeymoon in Switzerland)"
                      value={t.tripInfo}
                      onChange={(e) => handleUpdateTestimonial(t.id, 'tripInfo', e.target.value)}
                      className="px-3 py-1.5 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Review Quote"
                    value={t.quote}
                    onChange={(e) => handleUpdateTestimonial(t.id, 'quote', e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditingTestimonialId(null)}
                      className="px-3 py-1 bg-[#C87428] rounded-md text-xs font-bold text-white"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.author}</h4>
                    <p className="text-xs text-[#EADFD5]/60">{t.tripInfo}</p>
                    <p className="text-xs text-[#EADFD5]/80 italic mt-1.5 line-clamp-2">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingTestimonialId(t.id)}
                      className="p-1.5 bg-[#2A1810] text-[#E28C38] rounded-md"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-1.5 bg-red-950/40 text-red-400 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bespoke Experience Pillars */}
      <div className="space-y-4 pt-4 border-t border-[#3D2315]">
        <div className="pb-3 border-b border-[#3D2315]">
          <h3 className="text-lg font-serif font-bold text-white">Signature Experience Pillars</h3>
          <p className="text-xs text-[#EADFD5]/70 mt-0.5">
            Bespoke travel categories (Honeymoons, Europe Rail, Corporate Retreats, Family Holidays, Wildlife) with photos, inclusions, and descriptions.
          </p>
        </div>

        <div className="space-y-4">
          {experiencePillars.map((pillar, idx) => (
            <div key={pillar.typeKey || idx} className="p-4 rounded-xl bg-[#1A0E08] border border-[#3D2315] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#C87428] uppercase tracking-wider">
                  Pillar {idx + 1}: {pillar.title}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#3D2315] text-[#EADFD5]/80 font-medium">
                  {pillar.number || `0${idx + 1}`}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#EADFD5] block mb-1">Title</label>
                  <input
                    value={pillar.title}
                    onChange={(e) => {
                      const updated = [...experiencePillars];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      setExperiencePillars(updated);
                    }}
                    className="w-full px-3 py-2 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#EADFD5] block mb-1">Subtitle</label>
                  <input
                    value={pillar.subtitle}
                    onChange={(e) => {
                      const updated = [...experiencePillars];
                      updated[idx] = { ...updated[idx], subtitle: e.target.value };
                      setExperiencePillars(updated);
                    }}
                    className="w-full px-3 py-2 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUploadField
                    label="Pillar Visual Photography"
                    value={pillar.image}
                    onChange={(url) => {
                      const updated = [...experiencePillars];
                      updated[idx] = { ...updated[idx], image: url };
                      setExperiencePillars(updated);
                    }}
                    aspectRatio="video"
                    helperText="High-impact photography displayed on the experience showcase card."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-[#EADFD5] block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={pillar.description}
                    onChange={(e) => {
                      const updated = [...experiencePillars];
                      updated[idx] = { ...updated[idx], description: e.target.value };
                      setExperiencePillars(updated);
                    }}
                    className="w-full px-3 py-2 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-[#EADFD5] block mb-1">
                    Signature Inclusions (comma-separated)
                  </label>
                  <input
                    value={(pillar.highlights || []).join(', ')}
                    onChange={(e) => {
                      const updated = [...experiencePillars];
                      updated[idx] = {
                        ...updated[idx],
                        highlights: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      };
                      setExperiencePillars(updated);
                    }}
                    className="w-full px-3 py-2 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
