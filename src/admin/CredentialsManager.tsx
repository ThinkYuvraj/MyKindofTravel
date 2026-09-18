import React, { useState, useEffect } from 'react';
import { KeyRound, Shield, Mail, Lock, CheckCircle2, AlertCircle, Building, Phone, Globe, Clock, Award } from 'lucide-react';

interface CredentialsManagerProps {
  companyInfo: any;
  setCompanyInfo: React.Dispatch<React.SetStateAction<any>>;
}

export const CredentialsManager: React.FC<CredentialsManagerProps> = ({
  companyInfo,
  setCompanyInfo,
}) => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  
  // Form State
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingCreds, setSavingCreds] = useState(false);
  const [credsSuccess, setCredsSuccess] = useState('');
  const [credsError, setCredsError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/profile');
      if (res.ok) {
        const data = await res.json();
        setCurrentEmail(data.email || 'marketing2glue@gmail.com');
        setNewEmail(data.email || 'marketing2glue@gmail.com');
        setLastUpdated(data.lastUpdated || '');
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredsError('');
    setCredsSuccess('');

    if (!currentPassword) {
      setCredsError('Please enter your current password to authorize changes.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setCredsError('New password and confirmation do not match.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setCredsError('New password must be at least 6 characters long.');
      return;
    }

    setSavingCreds(true);
    try {
      const res = await fetch('/api/auth/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newEmail,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setCredsSuccess(data.message || 'Credentials updated successfully!');
        setCurrentEmail(newEmail);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setCredsError(data.error || 'Failed to update credentials.');
      }
    } catch (e: any) {
      setCredsError('Network error while updating credentials.');
    } finally {
      setSavingCreds(false);
    }
  };

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyInfo((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-6 space-y-10">
      {/* 1. Admin Credentials Card */}
      <div className="space-y-6">
        <div className="pb-4 border-b border-[#3D2315]">
          <div className="flex items-center gap-2 text-[#C87428] font-bold text-xs uppercase tracking-widest mb-1">
            <KeyRound className="w-4 h-4" />
            <span>Security & Access Control</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">CMS Admin Credentials</h3>
          <p className="text-sm text-[#EADFD5]/70 mt-1">
            Safely change the administrator login email and password stored on the backend.
          </p>
        </div>

        {/* Current Info Banner */}
        <div className="p-4 rounded-xl bg-[#1A0E08] border border-[#3D2315] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#EADFD5]">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Active Admin Login: <strong className="text-white font-mono">{currentEmail}</strong></span>
          </div>
          {lastUpdated && (
            <span className="text-[#EADFD5]/50">
              Last modified: {new Date(lastUpdated).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Feedback alerts */}
        {credsSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{credsSuccess}</span>
          </div>
        )}

        {credsError && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{credsError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdateCredentials} className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-[#EADFD5] mb-1.5">
              Admin Login Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="marketing2glue@gmail.com"
                className="w-full pl-10 pr-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#EADFD5] mb-1.5">
                New Password (Optional)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep unchanged"
                  className="w-full pl-10 pr-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-[#EADFD5] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-4 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs uppercase tracking-wider font-bold text-[#E28C38] mb-1.5">
              Current Password (Required for verification)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#E28C38] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password (default: Admin@8369)"
                className="w-full pl-10 pr-4 py-2 bg-[#1A0E08] border border-[#C87428]/60 text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingCreds}
              className="px-6 py-2.5 rounded-xl bg-[#C87428] hover:bg-[#E28C38] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#C87428]/25 transition-all disabled:opacity-50"
            >
              {savingCreds ? 'Updating Security...' : 'Update Admin Credentials'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Company Information Card */}
      <div className="space-y-6 pt-6 border-t border-[#3D2315]">
        <div className="pb-4 border-b border-[#3D2315]">
          <div className="flex items-center gap-2 text-[#C87428] font-bold text-xs uppercase tracking-widest mb-1">
            <Building className="w-4 h-4" />
            <span>Brand & Agency Metadata</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">Company & Concierge Contacts</h3>
          <p className="text-sm text-[#EADFD5]/70 mt-1">
            Details rendered across the website footer, contact form headers, and WhatsApp triggers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          <div>
            <label className="block text-xs font-bold text-[#EADFD5] mb-1">Agency Name</label>
            <input
              type="text"
              value={companyInfo?.name || ''}
              onChange={(e) => handleCompanyChange('name', e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#EADFD5] mb-1">Tagline</label>
            <input
              type="text"
              value={companyInfo?.tagline || ''}
              onChange={(e) => handleCompanyChange('tagline', e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#EADFD5] mb-1">Display Phone Number</label>
            <input
              type="text"
              value={companyInfo?.phone || ''}
              onChange={(e) => handleCompanyChange('phone', e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#EADFD5] mb-1">WhatsApp Raw Number (No spaces)</label>
            <input
              type="text"
              value={companyInfo?.phoneRaw || ''}
              onChange={(e) => handleCompanyChange('phoneRaw', e.target.value)}
              placeholder="+919876543210"
              className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#EADFD5] mb-1">Concierge Email</label>
            <input
              type="email"
              value={companyInfo?.email || ''}
              onChange={(e) => handleCompanyChange('email', e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#EADFD5] mb-1">Years of Crafting Journeys</label>
            <input
              type="text"
              value={companyInfo?.yearsCrafting || ''}
              onChange={(e) => handleCompanyChange('yearsCrafting', e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#EADFD5] mb-1">Philosophy Statement</label>
            <textarea
              rows={3}
              value={companyInfo?.philosophy || ''}
              onChange={(e) => handleCompanyChange('philosophy', e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1A0E08] border border-[#3D2315] text-white rounded-xl text-sm outline-none focus:border-[#C87428]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
