import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';

const HomePage = lazy(() => import('./HomePage'));
const DestinationsPage = lazy(() => import('./pages/DestinationsPage'));
const PackagesPage = lazy(() => import('./pages/PackagesPage'));
const PlanTripPage = lazy(() => import('./pages/PlanTripPage'));
const StoriesPage = lazy(() => import('./pages/StoriesPage'));
const PlacesPage = lazy(() => import('./pages/PlacesPage'));
const ExperiencesPage = lazy(() => import('./pages/ExperiencesPage'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./admin/AdminLogin'));

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  return (
    <BrowserRouter>
      <WishlistProvider>
        {quotaExceeded && (
          <div className="fixed bottom-4 right-4 max-w-md bg-[#0E0E0E]/95 backdrop-blur-md text-white border border-[#E37500]/40 px-4 py-3 rounded-2xl text-xs z-50 shadow-2xl flex items-center justify-between gap-3">
            <span>
              Google Maps Platform quota reached. Visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-[#E37500] hover:text-[#C66500]"
              >
                maps developer site
              </a>{' '}
              to update account.
            </span>
            <button
              onClick={() => setQuotaExceeded(false)}
              className="text-white/60 hover:text-white p-1 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-neutral-900 dark:text-white font-serif text-lg">Loading My Kind of Travel...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/plan" element={<PlanTripPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </Suspense>
      </WishlistProvider>
    </BrowserRouter>
  );
}
