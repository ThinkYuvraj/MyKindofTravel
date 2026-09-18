import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { ImageUploadField } from './ImageUploadField';
import { Plus, Edit2, Trash2, Camera, Eye, Sparkles, MapPin, Tag } from 'lucide-react';

interface GalleryManagerProps {
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  gallery,
  setGallery,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories = ['All', 'Stays', 'Journeys', 'Moments', 'Gourmet'];

  const handleAdd = () => {
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: 'Cliffside Infinity Panorama',
      location: 'Amalfi Coast, Italy',
      category: 'Stays',
      image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
      caption: 'Private terrace overlooking the sparkling Mediterranean sea with sunset aperitivo.',
      aspect: 'wide',
    };
    setGallery([newItem, ...gallery]);
    setEditingId(newItem.id);
  };

  const handleUpdate = (id: string, field: keyof GalleryItem, value: any) => {
    setGallery(gallery.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this photo from the Wanderlust Gallery?')) {
      setGallery(gallery.filter((item) => item.id !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  const filteredItems = activeFilter === 'All'
    ? gallery
    : gallery.filter((item) => item.category === activeFilter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#3D2315]">
        <div>
          <div className="flex items-center gap-2 text-[#C87428] font-bold text-xs uppercase tracking-widest mb-1">
            <Camera className="w-4 h-4" />
            <span>Visual Storytelling</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">Wanderlust Visual Gallery</h3>
          <p className="text-sm text-[#EADFD5]/70 mt-1">
            Upload and curate high-resolution visual stories, categorized under Stays, Journeys, Moments, and Gourmet.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto shadow-md shadow-[#C87428]/25"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs text-[#EADFD5]/60 mr-1 font-semibold">Filter:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeFilter === cat
                ? 'bg-[#C87428] text-white'
                : 'bg-[#1A0E08] hover:bg-[#2A1810] text-[#EADFD5]/70 hover:text-white border border-[#3D2315]'
            }`}
          >
            {cat} {cat === 'All' ? `(${gallery.length})` : `(${gallery.filter((g) => g.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Gallery List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border border-[#3D2315] rounded-xl p-4 sm:p-5 bg-[#1A0E08]/70 space-y-4 transition-all"
          >
            {editingId === item.id ? (
              /* Expanded Editor */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#3D2315]">
                  <span className="text-xs font-bold text-[#C87428] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Editing Photo: {item.title}
                  </span>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Done Editing
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Left Column: Image Uploader & Preview */}
                  <div className="md:col-span-5 space-y-3">
                    <ImageUploadField
                      label="Gallery Photo"
                      value={item.image}
                      onChange={(url) => handleUpdate(item.id, 'image', url)}
                      aspectRatio={item.aspect === 'tall' ? 'portrait' : item.aspect === 'square' ? 'square' : 'video'}
                      helperText="Supports high-res device uploads, travel presets, or URLs."
                    />

                    <div>
                      <label className="text-xs font-bold text-[#EADFD5] block mb-1">
                        Grid Card Layout Aspect
                      </label>
                      <select
                        value={item.aspect || 'wide'}
                        onChange={(e) => handleUpdate(item.id, 'aspect', e.target.value)}
                        className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-lg text-xs outline-none focus:border-[#C87428]"
                      >
                        <option value="wide">Wide Landscape (2x1)</option>
                        <option value="tall">Tall Portrait (1x2)</option>
                        <option value="square">Standard Square (1x1)</option>
                      </select>
                    </div>
                  </div>

                  {/* Right Column: Metadata Fields */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#EADFD5] block mb-1">
                          Photo Title / Subject
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
                          placeholder="e.g. Overwater Lagoon Haven"
                          className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm text-white outline-none focus:border-[#C87428]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#EADFD5] block mb-1">
                          Location / Country
                        </label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => handleUpdate(item.id, 'location', e.target.value)}
                          placeholder="e.g. Baa Atoll, Maldives"
                          className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm text-white outline-none focus:border-[#C87428]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#EADFD5] block mb-1">
                        Gallery Category Tab
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) => handleUpdate(item.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-lg text-xs outline-none focus:border-[#C87428]"
                      >
                        <option value="Stays">Stays (Villas, Chalets & Resorts)</option>
                        <option value="Journeys">Journeys (Flights, Trains & Cruises)</option>
                        <option value="Moments">Moments (Sunsets, Nature & Culture)</option>
                        <option value="Gourmet">Gourmet (Dining, Wine & Picnics)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#EADFD5] block mb-1">
                        Caption / Story Note
                      </label>
                      <textarea
                        rows={3}
                        value={item.caption}
                        onChange={(e) => handleUpdate(item.id, 'caption', e.target.value)}
                        placeholder="e.g. Direct reef immersion with private water slide and glass observatory floor."
                        className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg text-sm text-white outline-none focus:border-[#C87428]"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-4 py-1.5 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-lg text-xs font-bold"
                      >
                        Save Photo Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Collapsed Summary Row */
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#2A1810] border border-white/10 shrink-0 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                      <span className="px-2 py-0.5 rounded-md bg-[#C87428]/20 text-[#E28C38] text-[10px] font-bold uppercase tracking-wider border border-[#C87428]/30">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#EADFD5]/70 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C87428] shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                    <p className="text-xs text-[#EADFD5]/50 truncate italic">
                      "{item.caption}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="p-2 bg-[#2A1810] hover:bg-[#3D2315] text-[#E28C38] rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold"
                    title="Edit Photo Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit Photo</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="p-8 text-center bg-[#1A0E08]/40 border border-dashed border-[#3D2315] rounded-xl text-neutral-400">
            <Camera className="w-8 h-8 mx-auto text-[#C87428]/60 mb-2" />
            <p className="text-sm font-semibold text-white">No gallery items in this category</p>
            <p className="text-xs text-neutral-400 mt-1">
              Click "Add Photo" above to add pictures to this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
