import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DestinationItem, TravelPackage } from '../types';
import { Settings, Image as ImageIcon, Map, Package, Plus, Trash2, Edit2, X, Check } from 'lucide-react';

type Tab = 'hero' | 'destinations' | 'packages';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('hero');

  // CMS State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [primaryButton, setPrimaryButton] = useState('');
  const [secondaryButton, setSecondaryButton] = useState('');
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);

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
        setHeroTitle(data.heroTitle || '');
        setHeroSubtitle(data.heroSubtitle || '');
        setPrimaryButton(data.primaryButton || '');
        setSecondaryButton(data.secondaryButton || '');
        setDestinations(data.destinations || []);
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroTitle,
          heroSubtitle,
          primaryButton,
          secondaryButton,
          destinations,
          packages
        })
      });
      if (response.ok) {
        alert('Changes saved successfully!');
      } else {
        alert('Failed to save changes.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  if (loading) return <div className="p-8 text-center text-[#FAF7F4] bg-[#201109] min-h-screen">Loading Admin CMS...</div>;

  return (
    <div className="min-h-screen bg-[#201109] flex flex-col font-sans text-[#FAF7F4]">
      <header className="bg-[#1A0E08] border-b border-[#3D2315] px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <h1 className="text-xl font-bold text-[#FAF7F4]">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#EADFD5] hidden sm:block">Admin</span>
          <button onClick={handleLogout} className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">Logout</button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-[#1A0E08] border-r border-[#3D2315] hidden md:block">
          <nav className="p-4 space-y-2">
            <button onClick={() => setActiveTab('hero')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'hero' ? 'bg-[#C87428] text-white shadow-md' : 'text-[#EADFD5] hover:bg-[#3D2315] hover:text-white'}`}>
              <Settings className="w-5 h-5" />
              <span className="font-medium">Hero Section</span>
            </button>
            <button onClick={() => setActiveTab('destinations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'destinations' ? 'bg-[#C87428] text-white shadow-md' : 'text-[#EADFD5] hover:bg-[#3D2315] hover:text-white'}`}>
              <Map className="w-5 h-5" />
              <span className="font-medium">Destinations</span>
            </button>
            <button onClick={() => setActiveTab('packages')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'packages' ? 'bg-[#C87428] text-white shadow-md' : 'text-[#EADFD5] hover:bg-[#3D2315] hover:text-white'}`}>
              <Package className="w-5 h-5" />
              <span className="font-medium">Packages</span>
            </button>
          </nav>
        </aside>

        {/* Mobile Tabs */}
        <div className="md:hidden flex border-b border-[#3D2315] bg-[#1A0E08]">
          <button onClick={() => setActiveTab('hero')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'hero' ? 'text-[#C87428] border-b-2 border-[#C87428]' : 'text-[#EADFD5]'}`}>Hero</button>
          <button onClick={() => setActiveTab('destinations')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'destinations' ? 'text-[#C87428] border-b-2 border-[#C87428]' : 'text-[#EADFD5]'}`}>Destinations</button>
          <button onClick={() => setActiveTab('packages')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'packages' ? 'text-[#C87428] border-b-2 border-[#C87428]' : 'text-[#EADFD5]'}`}>Packages</button>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold capitalize">{activeTab} Management</h2>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-md shadow-[#C87428]/20"
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>

          <div className="bg-[#2A1810] rounded-2xl shadow-xl shadow-black/20 border border-[#3D2315] overflow-hidden">
            {activeTab === 'hero' && (
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#EADFD5] mb-2">Main Headline</label>
                  <input 
                    type="text" 
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl focus:ring-[#C87428] focus:border-[#C87428] outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#EADFD5] mb-2">Subtitle / Description</label>
                  <textarea 
                    rows={4}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl focus:ring-[#C87428] focus:border-[#C87428] outline-none transition-all" 
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#EADFD5] mb-2">Primary Button Text</label>
                    <input 
                      type="text" 
                      value={primaryButton}
                      onChange={(e) => setPrimaryButton(e.target.value)}
                      className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl focus:ring-[#C87428] focus:border-[#C87428] outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#EADFD5] mb-2">Secondary Button Text</label>
                    <input 
                      type="text" 
                      value={secondaryButton}
                      onChange={(e) => setSecondaryButton(e.target.value)}
                      className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl focus:ring-[#C87428] focus:border-[#C87428] outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'destinations' && (
              <DestinationsManager destinations={destinations} setDestinations={setDestinations} />
            )}

            {activeTab === 'packages' && (
              <PackagesManager packages={packages} setPackages={setPackages} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function DestinationsManager({ destinations, setDestinations }: { destinations: DestinationItem[], setDestinations: any }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newDest: DestinationItem = {
      id: Date.now().toString(),
      name: 'New Destination',
      country: '',
      region: '',
      priceNote: '',
      image: '',
      description: '',
      highlights: [''],
      bestTime: '',
      idealFor: ''
    };
    setDestinations([newDest, ...destinations]);
    setEditingId(newDest.id);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    setDestinations(destinations.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to delete this destination?')) {
      setDestinations(destinations.filter(d => d.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Manage Destinations</h3>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#3D2315] hover:bg-[#4A2D1B] rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Destination
        </button>
      </div>

      <div className="space-y-4">
        {destinations.map(dest => (
          <div key={dest.id} className="border border-[#3D2315] rounded-xl p-4 bg-[#1A0E08]/50">
            {editingId === dest.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Name" value={dest.name} onChange={(e) => handleUpdate(dest.id, 'name', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Country" value={dest.country} onChange={(e) => handleUpdate(dest.id, 'country', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Region" value={dest.region} onChange={(e) => handleUpdate(dest.id, 'region', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Price Note" value={dest.priceNote} onChange={(e) => handleUpdate(dest.id, 'priceNote', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Image URL" value={dest.image} onChange={(e) => handleUpdate(dest.id, 'image', e.target.value)} className="w-full md:col-span-2 px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <textarea placeholder="Description" value={dest.description} onChange={(e) => handleUpdate(dest.id, 'description', e.target.value)} className="w-full md:col-span-2 px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" rows={2} />
                  <input placeholder="Best Time" value={dest.bestTime} onChange={(e) => handleUpdate(dest.id, 'bestTime', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Ideal For" value={dest.idealFor} onChange={(e) => handleUpdate(dest.id, 'idealFor', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                </div>
                
                {/* Highlights Array Manager */}
                <div>
                  <label className="text-sm text-[#EADFD5] block mb-2">Highlights (Comma separated)</label>
                  <input 
                    value={dest.highlights.join(', ')} 
                    onChange={(e) => handleUpdate(dest.id, 'highlights', e.target.value.split(',').map(s => s.trim()))} 
                    className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" 
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-[#3D2315] rounded-lg text-sm">Done</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {dest.image && <img src={dest.image} className="w-12 h-12 rounded-lg object-cover" />}
                  <div>
                    <h4 className="font-bold">{dest.name}</h4>
                    <p className="text-xs text-[#EADFD5]">{dest.country} • {dest.region}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingId(dest.id)} className="p-2 bg-[#3D2315] hover:bg-[#4A2D1B] rounded-lg"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(dest.id)} className="p-2 bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PackagesManager({ packages, setPackages }: { packages: TravelPackage[], setPackages: any }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newPkg: TravelPackage = {
      id: Date.now().toString(),
      tag: 'New',
      title: 'New Package',
      subtitle: '',
      duration: '',
      destination: '',
      startingPrice: '',
      image: '',
      features: [],
      inclusions: [],
      dayHighlights: []
    };
    setPackages([newPkg, ...packages]);
    setEditingId(newPkg.id);
  };

  const handleUpdate = (id: string, field: string, value: any) => {
    setPackages(packages.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure?')) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Manage Packages</h3>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#3D2315] hover:bg-[#4A2D1B] rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      <div className="space-y-4">
        {packages.map(pkg => (
          <div key={pkg.id} className="border border-[#3D2315] rounded-xl p-4 bg-[#1A0E08]/50">
            {editingId === pkg.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Title" value={pkg.title} onChange={(e) => handleUpdate(pkg.id, 'title', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Subtitle" value={pkg.subtitle} onChange={(e) => handleUpdate(pkg.id, 'subtitle', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Destination" value={pkg.destination} onChange={(e) => handleUpdate(pkg.id, 'destination', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Duration (e.g. 6 Days)" value={pkg.duration} onChange={(e) => handleUpdate(pkg.id, 'duration', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Price (e.g. ₹1,20,000)" value={pkg.startingPrice} onChange={(e) => handleUpdate(pkg.id, 'startingPrice', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Tag (e.g. Honeymoon)" value={pkg.tag} onChange={(e) => handleUpdate(pkg.id, 'tag', e.target.value)} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                  <input placeholder="Image URL" value={pkg.image} onChange={(e) => handleUpdate(pkg.id, 'image', e.target.value)} className="w-full md:col-span-2 px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                </div>
                
                <div>
                  <label className="text-sm text-[#EADFD5] block mb-2">Features (Comma separated)</label>
                  <input value={pkg.features.join(', ')} onChange={(e) => handleUpdate(pkg.id, 'features', e.target.value.split(',').map(s => s.trim()))} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                </div>
                
                <div>
                  <label className="text-sm text-[#EADFD5] block mb-2">Inclusions (Comma separated)</label>
                  <input value={pkg.inclusions.join(', ')} onChange={(e) => handleUpdate(pkg.id, 'inclusions', e.target.value.split(',').map(s => s.trim()))} className="w-full px-3 py-2 bg-[#1A0E08] border border-[#3D2315] rounded-lg outline-none" />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-[#3D2315] rounded-lg text-sm">Done</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {pkg.image && <img src={pkg.image} className="w-12 h-12 rounded-lg object-cover" />}
                  <div>
                    <h4 className="font-bold">{pkg.title}</h4>
                    <p className="text-xs text-[#EADFD5]">{pkg.duration} • {pkg.startingPrice}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingId(pkg.id)} className="p-2 bg-[#3D2315] hover:bg-[#4A2D1B] rounded-lg"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
