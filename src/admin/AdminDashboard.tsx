import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // CMS State
  const [heroTitle, setHeroTitle] = useState('EXPLORE. DREAM. DISCOVER.');
  const [heroSubtitle, setHeroSubtitle] = useState("Handcrafted luxury holidays, private European chalets, honeymoon cliffside villas, and bespoke journeys tailored for India's discerning travellers.");
  const [primaryButton, setPrimaryButton] = useState('START EXPLORING');
  const [secondaryButton, setSecondaryButton] = useState('PLAN TRIP');

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
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroSubtitle) setHeroSubtitle(data.heroSubtitle);
        if (data.primaryButton) setPrimaryButton(data.primaryButton);
        if (data.secondaryButton) setSecondaryButton(data.secondaryButton);
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
          secondaryButton
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
    <div className="min-h-screen bg-[#201109] flex flex-col font-sans">
      <header className="bg-[#1A0E08] border-b border-[#3D2315] px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-[#FAF7F4]">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#EADFD5]">Admin</span>
          <button onClick={handleLogout} className="text-sm font-medium text-red-400 hover:text-red-300">Logout</button>
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#FAF7F4]">Homepage Content</h2>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-[#C87428] hover:bg-[#E28C38] text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-md shadow-[#C87428]/20"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="bg-[#2A1810] rounded-2xl shadow-xl shadow-black/20 border border-[#3D2315] overflow-hidden">
          <div className="p-6 border-b border-[#3D2315] bg-[#1A0E08]/50">
            <h3 className="font-semibold text-[#FAF7F4]">Hero Section</h3>
            <p className="text-sm text-[#EADFD5] mt-1">Manage the main hero text and buttons.</p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#EADFD5] mb-2">Main Headline</label>
              <input 
                type="text" 
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl focus:ring-[#C87428] focus:border-[#C87428] outline-none transition-all placeholder-[#7A4522]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#EADFD5] mb-2">Subtitle / Description</label>
              <textarea 
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl focus:ring-[#C87428] focus:border-[#C87428] outline-none transition-all placeholder-[#7A4522]" 
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#EADFD5] mb-2">Primary Button Text</label>
                <input 
                  type="text" 
                  value={primaryButton}
                  onChange={(e) => setPrimaryButton(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl focus:ring-[#C87428] focus:border-[#C87428] outline-none transition-all placeholder-[#7A4522]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#EADFD5] mb-2">Secondary Button Text</label>
                <input 
                  type="text" 
                  value={secondaryButton}
                  onChange={(e) => setSecondaryButton(e.target.value)}
                  className="w-full px-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] rounded-xl focus:ring-[#C87428] focus:border-[#C87428] outline-none transition-all placeholder-[#7A4522]" 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
