import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Check,
  Sparkles,
  ExternalLink,
  X,
  Eye,
  RefreshCw,
} from 'lucide-react';

export interface ImagePreset {
  id: string;
  title: string;
  category: string;
  url: string;
}

export const LUXURY_TRAVEL_PRESETS: ImagePreset[] = [
  // Switzerland & Alps
  {
    id: 'preset-matterhorn',
    title: 'Zermatt Matterhorn Panorama',
    category: 'Switzerland & Alps',
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset-lake-brienz',
    title: 'Lake Brienz Turquoise Waters',
    category: 'Switzerland & Alps',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset-alps-chalet',
    title: 'Alpine Wooden Chalet',
    category: 'Switzerland & Alps',
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
  },
  // Bali & Tropics
  {
    id: 'preset-bali-villa',
    title: 'Ubud Jungle Infinity Pool Villa',
    category: 'Bali & Tropics',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset-tegallalang',
    title: 'Tegallalang Emerald Rice Terraces',
    category: 'Bali & Tropics',
    url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset-nusa-penida',
    title: 'Nusa Penida Kelingking Beach',
    category: 'Bali & Tropics',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  // France & Mediterranean
  {
    id: 'preset-paris-sunset',
    title: 'Parisian Eiffel Sunset',
    category: 'Europe & Mediterranean',
    url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset-santorini-caldera',
    title: 'Santorini Cliffside Caldera & Pools',
    category: 'Europe & Mediterranean',
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset-french-riviera',
    title: 'French Riviera Yacht & Sea',
    category: 'Europe & Mediterranean',
    url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset-amalfi-positano',
    title: 'Amalfi Coast Positano Cliffs',
    category: 'Europe & Mediterranean',
    url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
  },
  // Maldives & Stays
  {
    id: 'preset-maldives-overwater',
    title: 'Maldives Overwater Lagoon Villa',
    category: 'Islands & Beaches',
    url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset-sandbank',
    title: 'Private Sandbank Dining',
    category: 'Islands & Beaches',
    url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80',
  },
  // Middle East & Exotics
  {
    id: 'preset-cappadocia-balloons',
    title: 'Cappadocia Sunrise Hot Air Balloons',
    category: 'Exotic & Adventures',
    url: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset-dubai-desert',
    title: 'Dubai Golden Dunes & Sunset Safari',
    category: 'Exotic & Adventures',
    url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'preset-kyoto-pagoda',
    title: 'Kyoto Sakura & Historic Pagoda',
    category: 'Exotic & Adventures',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  },
];

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'video' | 'portrait' | 'square' | 'wide' | 'auto';
  placeholder?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label = 'Image',
  helperText,
  aspectRatio = 'video',
  placeholder = 'https://images.unsplash.com/...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedPresetCategory, setSelectedPresetCategory] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories for presets
  const categories = ['All', 'Switzerland & Alps', 'Bali & Tropics', 'Europe & Mediterranean', 'Islands & Beaches', 'Exotic & Adventures'];

  const filteredPresets = selectedPresetCategory === 'All'
    ? LUXURY_TRAVEL_PRESETS
    : LUXURY_TRAVEL_PRESETS.filter((p) => p.category === selectedPresetCategory);

  // Aspect ratio styling
  const aspectClasses = {
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
    auto: 'h-40',
  }[aspectRatio];

  // Process file upload and compress image via HTML5 Canvas
  const processImageFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size is too large (max 15MB).');
      return;
    }

    setProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize resolution: max width/height 1920px
        const maxDimension = 1920;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Export as compressed WebP or JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);
          onChange(compressedDataUrl);
          setProcessing(false);
          setIsOpen(false);
        } else {
          // Fallback to original data URL
          onChange(event.target?.result as string);
          setProcessing(false);
          setIsOpen(false);
        }
      };

      img.onerror = () => {
        setUploadError('Failed to load the image file.');
        setProcessing(false);
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setUploadError('Failed to read the file.');
      setProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setIsOpen(false);
    }
  };

  const handleSelectPreset = (url: string) => {
    onChange(url);
    setIsOpen(false);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#EADFD5] uppercase tracking-wider block">
            {label}
          </label>
          {value && (
            <span className="text-[10px] text-[#C87428] font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Image Active
            </span>
          )}
        </div>
      )}

      {/* Main Preview Card / Quick Trigger */}
      <div className="relative group">
        {value ? (
          <div className="relative rounded-xl overflow-hidden border border-[#3D2315] bg-[#1A0E08]">
            <div className={`w-full ${aspectClasses} bg-[#16100D] relative overflow-hidden`}>
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Hover / Overlay Controls */}
              <div className="absolute inset-0 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
                    {value.startsWith('data:') ? 'Custom Upload (Local)' : 'External URL'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {value.startsWith('http') && (
                      <a
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/80 hover:text-white transition-colors"
                        title="View Full Image"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 hover:text-white transition-colors border border-red-800/40"
                      title="Remove Image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-white/80 truncate max-w-[70%] font-mono">
                    {value.startsWith('data:') ? 'Base64 image stream' : value}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="px-3 py-1.5 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State - Click to Add */
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`w-full ${aspectClasses} rounded-xl border-2 border-dashed border-[#3D2315] hover:border-[#C87428] bg-[#1A0E08]/60 hover:bg-[#1A0E08] transition-all flex flex-col items-center justify-center p-4 text-center group/empty`}
          >
            <div className="w-10 h-10 rounded-full bg-[#2A1810] group-hover/empty:bg-[#C87428] flex items-center justify-center text-[#C87428] group-hover/empty:text-white transition-colors mb-2 shadow-sm">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white group-hover/empty:text-[#E28C38] transition-colors">
              Add or Upload Image
            </p>
            <p className="text-[11px] text-[#EADFD5]/60 mt-0.5">
              Upload from device, select curated travel presets, or paste URL
            </p>
          </button>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-[#EADFD5]/60 mt-1">{helperText}</p>
      )}

      {/* Expanded Modal / Drawer for Image Selection */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#24130A] border border-[#3D2315] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl text-[#FAF7F4]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#3D2315] flex items-center justify-between bg-[#1A0E08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C87428]/20 flex items-center justify-center text-[#C87428]">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-serif">Image Manager & Uploader</h4>
                  <p className="text-[11px] text-[#EADFD5]/60">Select or upload high-resolution media</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-[#2A1810] hover:bg-[#3D2315] text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#3D2315] bg-[#1E0F07] px-6 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 ${
                  activeTab === 'upload'
                    ? 'border-[#C87428] text-[#C87428] bg-[#24130A]'
                    : 'border-transparent text-[#EADFD5]/70 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload From Device</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 ${
                  activeTab === 'presets'
                    ? 'border-[#C87428] text-[#C87428] bg-[#24130A]'
                    : 'border-transparent text-[#EADFD5]/70 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Presets Library ({LUXURY_TRAVEL_PRESETS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors border-b-2 ${
                  activeTab === 'url'
                    ? 'border-[#C87428] text-[#C87428] bg-[#24130A]'
                    : 'border-transparent text-[#EADFD5]/70 hover:text-white'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Paste Image URL</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* TAB 1: UPLOAD FILE */}
              {activeTab === 'upload' && (
                <div className="space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                      isDragging
                        ? 'border-[#C87428] bg-[#C87428]/10'
                        : 'border-[#3D2315] hover:border-[#C87428]/60 bg-[#1A0E08]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-14 h-14 rounded-2xl bg-[#2A1810] flex items-center justify-center text-[#C87428] shadow-md group-hover:scale-105 transition-transform">
                      {processing ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-[#C87428]" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {processing ? 'Processing & Optimizing Image...' : 'Click to Browse or Drag & Drop'}
                      </p>
                      <p className="text-xs text-[#EADFD5]/60 mt-1">
                        Supports PNG, JPG, JPEG, WebP (Automatically optimized for web delivery)
                      </p>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-xs text-red-300">
                      {uploadError}
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-[#1A0E08] border border-[#3D2315] text-xs text-[#EADFD5]/70 space-y-1">
                    <p className="font-semibold text-[#C87428] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> High Quality Auto-Optimization
                    </p>
                    <p>
                      Images uploaded from your phone or camera are automatically sized and compressed to load instantly for visitors without losing visual fidelity.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: PRESETS LIBRARY */}
              {activeTab === 'presets' && (
                <div className="space-y-4">
                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1.5 pb-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedPresetCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          selectedPresetCategory === cat
                            ? 'bg-[#C87428] text-white shadow-sm'
                            : 'bg-[#1A0E08] hover:bg-[#2A1810] text-[#EADFD5]/80 hover:text-white border border-[#3D2315]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Presets Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredPresets.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset.url)}
                        className="group relative rounded-xl overflow-hidden border border-[#3D2315] hover:border-[#C87428] cursor-pointer bg-[#1A0E08] transition-all"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-[#16100D]">
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-2 bg-[#1A0E08]">
                          <p className="text-xs font-bold text-white truncate">{preset.title}</p>
                          <span className="text-[10px] text-[#C87428] font-semibold block truncate">
                            {preset.category}
                          </span>
                        </div>
                        {value === preset.url && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#C87428] text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DIRECT URL */}
              {activeTab === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#EADFD5] uppercase tracking-wider mb-2">
                      External Image URL
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder={placeholder}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyUrl}
                        disabled={!urlInput.trim()}
                        className="px-5 py-2.5 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 transition-all shrink-0"
                      >
                        Apply URL
                      </button>
                    </div>
                  </div>

                  {urlInput.trim() && (
                    <div className="p-3 bg-[#1A0E08] border border-[#3D2315] rounded-xl space-y-2">
                      <span className="text-xs font-bold text-white block">Preview URL:</span>
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/40 border border-[#3D2315]">
                        <img
                          src={urlInput.trim()}
                          alt="URL preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-3.5 bg-[#1A0E08] border border-[#3D2315] rounded-xl text-xs text-[#EADFD5]/70 space-y-1">
                    <p className="font-semibold text-white">Recommended Sources:</p>
                    <p>
                      You can paste direct image links from Unsplash, Pexels, Cloudinary, AWS S3, or any custom image hosting provider.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#3D2315] bg-[#1A0E08] flex items-center justify-between">
              <span className="text-xs text-[#EADFD5]/60">
                {value ? 'An image is currently assigned' : 'No image assigned yet'}
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-[#2A1810] hover:bg-[#3D2315] text-white rounded-lg text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
