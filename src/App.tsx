import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';

const HomePage = lazy(() => import('./HomePage'));
const DestinationsPage = lazy(() => import('./pages/DestinationsPage'));
const PackagesPage = lazy(() => import('./pages/PackagesPage'));
const PlanTripPage = lazy(() => import('./pages/PlanTripPage'));
const StoriesPage = lazy(() => import('./pages/StoriesPage'));
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
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] text-[#24130A] font-serif text-lg">Loading My Kind of Travel...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/plan" element={<PlanTripPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Routes>
        </Suspense>
      </WishlistProvider>
    </BrowserRouter>
  );
}
