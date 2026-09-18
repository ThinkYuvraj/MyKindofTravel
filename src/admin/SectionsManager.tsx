import React, { useState } from 'react';
import { CustomSection, CustomSectionItem } from '../types';
import { ImageUploadField } from './ImageUploadField';
import {
  Layers,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  LayoutGrid,
  Megaphone,
  HelpCircle,
  Columns,
  Sparkles,
} from 'lucide-react';

interface SectionsManagerProps {
  sectionOrder: string[];
  setSectionOrder: React.Dispatch<React.SetStateAction<string[]>>;
  sectionVisibility: Record<string, boolean>;
  setSectionVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  customSections: CustomSection[];
  setCustomSections: React.Dispatch<React.SetStateAction<CustomSection[]>>;
}

const SECTION_LABELS: Record<string, { label: string; desc: string }> = {
  hero: { label: 'Hero Banner', desc: 'Main headline, search cues, video/image banner' },
  destinations: { label: 'Featured Destinations', desc: 'Handpicked destination cards with flight time' },
  marquee: { label: 'Marquee Ticker', desc: 'Flowing ticker with destinations and icons' },
  about: { label: 'Philosophy & About', desc: 'Bespoke philosophy and company credentials' },
  radar: { label: 'Flight Route Radar', desc: 'Interactive flight routes from India' },
  experiences: { label: 'Experience Pillars', desc: '6 pillars: Honeymoon, Family, Luxury, etc.' },
  howItWorks: { label: 'How It Works', desc: '4-step journey from dream to departure' },
  packages: { label: 'Popular Packages', desc: 'Curated itineraries ready to personalise' },
  gallery: { label: 'Wanderlust Gallery', desc: 'Photo mosaic with category filters' },
  testimonials: { label: 'Client Stories', desc: 'Reviews from discerning travellers' },
  whyUs: { label: 'Why Choose Us', desc: 'Key promises and 24/7 concierge guarantee' },
  contact: { label: 'Enquiry & Contact', desc: 'Lead capture form and direct contact info' },
};

export const SectionsManager: React.FC<SectionsManagerProps> = ({
  sectionOrder,
  setSectionOrder,
  sectionVisibility,
  setSectionVisibility,
  customSections,
  setCustomSections,
}) => {
  const [editingSection, setEditingSection] = useState<CustomSection | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Toggle Visibility
  const toggleVisibility = (key: string) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
  };

  // Move Section Up
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sectionOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setSectionOrder(newOrder);
  };

  // Move Section Down
  const moveDown = (index: number) => {
    if (index >= sectionOrder.length - 1) return;
    const newOrder = [...sectionOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setSectionOrder(newOrder);
  };

  // Initiate New Custom Section
  const handleStartCreate = () => {
    const newId = `custom-${Date.now()}`;
    const newSection: CustomSection = {
      id: newId,
      title: 'Special Summer Escapes',
      subtitle: 'Handpicked boutique villas with private chefs and tailored excursions.',
      badgeText: 'Curated Collection',
      layout: 'grid-cards',
      theme: 'light',
      enabled: true,
      items: [
        {
          id: `item-${Date.now()}-1`,
          title: 'Amalfi Coast Cliffside Villa',
          subtitle: 'Positano, Italy',
          description: 'Private infinity pool overlooking the Tyrrhenian Sea with yacht charter.',
          badge: 'Exclusive',
          image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
          linkText: 'Explore Villa',
        },
        {
          id: `item-${Date.now()}-2`,
          title: 'Swiss Chalet Retreat',
          subtitle: 'Zermatt, Switzerland',
          description: 'Matterhorn view sauna, private ski butler, and Michelin star dining.',
          badge: 'Popular',
          image: 'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
          linkText: 'View Details',
        },
      ],
    };
    setEditingSection(newSection);
    setIsCreating(true);
  };

  // Save Custom Section (Create or Update)
  const handleSaveCustomSection = () => {
    if (!editingSection) return;

    if (isCreating) {
      setCustomSections((prev) => [...prev, editingSection]);
      setSectionOrder((prev) => [...prev, editingSection.id]);
      setSectionVisibility((prev) => ({ ...prev, [editingSection.id]: true }));
    } else {
      setCustomSections((prev) =>
        prev.map((s) => (s.id === editingSection.id ? editingSection : s))
      );
    }

    setEditingSection(null);
    setIsCreating(false);
  };

  // Delete Custom Section
  const handleDeleteCustomSection = (id: string) => {
    if (confirm('Are you sure you want to delete this custom section?')) {
      setCustomSections((prev) => prev.filter((s) => s.id !== id));
      setSectionOrder((prev) => prev.filter((k) => k !== id));
      setSectionVisibility((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  // Add Item to Editing Custom Section
  const handleAddItemToEditing = () => {
    if (!editingSection) return;
    const newItem: CustomSectionItem = {
      id: `item-${Date.now()}`,
      title: 'New Highlight or Question',
      subtitle: '',
      description: 'Add detailed description or answer here.',
      badge: 'Feature',
      image: '',
      linkText: 'Learn More',
    };
    setEditingSection({
      ...editingSection,
      items: [...editingSection.items, newItem],
    });
  };

  // Update Item in Editing Custom Section
  const handleUpdateEditingItem = (index: number, field: keyof CustomSectionItem, val: string) => {
    if (!editingSection) return;
    const updated = [...editingSection.items];
    updated[index] = { ...updated[index], [field]: val };
    setEditingSection({ ...editingSection, items: updated });
  };

  // Remove Item from Editing Custom Section
  const handleRemoveEditingItem = (index: number) => {
    if (!editingSection) return;
    const updated = editingSection.items.filter((_, i) => i !== index);
    setEditingSection({ ...editingSection, items: updated });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3D2315]">
        <div>
          <div className="flex items-center gap-2 text-[#C87428] font-bold text-xs uppercase tracking-widest mb-1">
            <Layers className="w-4 h-4" />
            <span>Layout & Flow Engine</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">Homepage Sections Manager</h3>
          <p className="text-sm text-[#EADFD5]/70 mt-1">
            Drag, reorder, show/hide, or create custom sections to customise your site structure in real time.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C87428] hover:bg-[#E28C38] text-white text-sm font-bold shadow-md shadow-[#C87428]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Custom Section</span>
        </button>
      </div>

      {/* Reorderable Section List */}
      <div className="space-y-3">
        {sectionOrder.map((key, index) => {
          const isCustom = key.startsWith('custom-');
          const customSec = isCustom ? customSections.find((s) => s.id === key) : null;
          const info = isCustom
            ? {
                label: customSec?.title || 'Custom Section',
                desc: `Layout: ${customSec?.layout || 'grid-cards'} • ${customSec?.items?.length || 0} items`,
              }
            : SECTION_LABELS[key] || { label: key, desc: 'Built-in section' };

          const isVisible = sectionVisibility[key] !== false;

          return (
            <div
              key={key}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                isVisible
                  ? 'bg-[#1A0E08]/80 border-[#3D2315] hover:border-[#C87428]/40'
                  : 'bg-[#140B06]/40 border-white/5 opacity-50'
              }`}
            >
              {/* Order Number & Title */}
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-[#2A1810] text-[#C87428] border border-[#3D2315] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-white truncate">{info.label}</h4>
                    {isCustom ? (
                      <span className="px-2 py-0.5 rounded-md bg-[#C87428]/20 text-[#E28C38] border border-[#C87428]/40 text-[10px] uppercase tracking-wider font-bold">
                        Custom Section
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#EADFD5]/70 border border-white/10 text-[10px] uppercase tracking-wider font-semibold">
                        Built-in
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#EADFD5]/60 truncate mt-0.5">{info.desc}</p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {/* Move Up */}
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  title="Move section up"
                  className="p-2 rounded-lg bg-[#2A1810] hover:bg-[#3D2315] disabled:opacity-30 disabled:pointer-events-none text-[#EADFD5] transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                {/* Move Down */}
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === sectionOrder.length - 1}
                  title="Move section down"
                  className="p-2 rounded-lg bg-[#2A1810] hover:bg-[#3D2315] disabled:opacity-30 disabled:pointer-events-none text-[#EADFD5] transition-colors"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                {/* Toggle Visibility */}
                <button
                  onClick={() => toggleVisibility(key)}
                  title={isVisible ? 'Hide on Homepage' : 'Show on Homepage'}
                  className={`p-2 rounded-lg transition-colors ${
                    isVisible
                      ? 'bg-[#C87428]/20 text-[#E28C38] hover:bg-[#C87428]/30'
                      : 'bg-white/5 text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                {/* If Custom, allow editing and deleting */}
                {isCustom && customSec && (
                  <>
                    <button
                      onClick={() => {
                        setEditingSection(customSec);
                        setIsCreating(false);
                      }}
                      title="Edit Custom Section"
                      className="p-2 rounded-lg bg-[#2A1810] hover:bg-[#3D2315] text-[#E28C38] transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustomSection(key)}
                      title="Delete Custom Section"
                      className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Section Editor Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#201109] border border-[#3D2315] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#3D2315]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C87428]" />
                <h3 className="text-lg font-serif font-bold text-white">
                  {isCreating ? 'Create New Custom Section' : 'Edit Custom Section'}
                </h3>
              </div>
              <button
                onClick={() => setEditingSection(null)}
                className="p-1.5 rounded-lg bg-[#2A1810] hover:bg-[#3D2315] text-[#EADFD5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Layout Type Selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#EADFD5] mb-2">
                Section Layout Archetype
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'grid-cards', name: 'Grid Cards', icon: LayoutGrid, desc: 'Image cards with perks' },
                  { id: 'banner-cta', name: 'Banner CTA', icon: Megaphone, desc: 'Full-width promotion banner' },
                  { id: 'faq', name: 'Q&A / FAQ', icon: HelpCircle, desc: 'Accordion knowledge base' },
                  { id: 'split-story', name: 'Split Story', icon: Columns, desc: 'Editorial image + text' },
                ].map((type) => {
                  const Icon = type.icon;
                  const isSelected = editingSection.layout === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() =>
                        setEditingSection({
                          ...editingSection,
                          layout: type.id as any,
                        })
                      }
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-[#C87428]/20 border-[#C87428] text-white shadow-md'
                          : 'bg-[#1A0E08] border-[#3D2315] text-[#EADFD5]/70 hover:border-[#C87428]/40'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#E28C38]' : 'text-neutral-400'}`} />
                      <div>
                        <div className="text-xs font-bold text-white">{type.name}</div>
                        <div className="text-[10px] text-[#EADFD5]/60 mt-0.5">{type.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#EADFD5] mb-1">Section Badge / Eyebrow</label>
                <input
                  type="text"
                  value={editingSection.badgeText}
                  onChange={(e) => setEditingSection({ ...editingSection, badgeText: e.target.value })}
                  placeholder="e.g. Limited Edition"
                  className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#EADFD5] mb-1">Color Theme</label>
                <select
                  value={editingSection.theme}
                  onChange={(e) => setEditingSection({ ...editingSection, theme: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
                >
                  <option value="light">Crisp Light (Warm Cream)</option>
                  <option value="dark">Luxury Dark (Onyx Velvet)</option>
                  <option value="caramel">Cognac Caramel Glow</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#EADFD5] mb-1">Section Heading Title</label>
                <input
                  type="text"
                  value={editingSection.title}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  placeholder="e.g. Private Island Retreats"
                  className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#EADFD5] mb-1">Subtitle / Context</label>
                <textarea
                  rows={2}
                  value={editingSection.subtitle}
                  onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                  placeholder="Brief introductory description"
                  className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
                />
              </div>
            </div>

            {/* Section Items Manager */}
            <div className="space-y-3 pt-2 border-t border-[#3D2315]">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider font-bold text-[#EADFD5]">
                  Content Items ({editingSection.items.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddItemToEditing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3D2315] hover:bg-[#4A2D1B] text-xs font-bold text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {editingSection.items.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 rounded-xl bg-[#1A0E08] border border-[#3D2315] space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#C87428]">Item #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEditingItem(idx)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Item Title / Question"
                        value={item.title}
                        onChange={(e) => handleUpdateEditingItem(idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                      />
                      <input
                        placeholder="Subtitle or Location (optional)"
                        value={item.subtitle || ''}
                        onChange={(e) => handleUpdateEditingItem(idx, 'subtitle', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                      />
                      <input
                        placeholder="Badge (e.g. Popular, Included)"
                        value={item.badge || ''}
                        onChange={(e) => handleUpdateEditingItem(idx, 'badge', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                      />
                      <div className="sm:col-span-2">
                        <ImageUploadField
                          label="Item Photography / Illustration"
                          value={item.image || ''}
                          onChange={(url) => handleUpdateEditingItem(idx, 'image', url)}
                          aspectRatio="video"
                          placeholder="Select a travel preset or upload an image"
                          helperText="Card image or visual media for this section item."
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Description or Answer text"
                        value={item.description}
                        onChange={(e) => handleUpdateEditingItem(idx, 'description', e.target.value)}
                        className="sm:col-span-2 w-full px-3 py-1.5 bg-[#201109] border border-[#3D2315] rounded-lg text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3D2315]">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-5 py-2 rounded-xl bg-[#2A1810] hover:bg-[#3D2315] text-[#EADFD5] text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomSection}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#C87428] hover:bg-[#E28C38] text-white text-sm font-bold shadow-md shadow-[#C87428]/25 transition-all"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{isCreating ? 'Add to Homepage' : 'Apply Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
