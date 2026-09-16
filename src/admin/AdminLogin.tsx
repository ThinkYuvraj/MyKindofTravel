import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        navigate('/admin');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid credentials.');
        setLoading(false);
      }
    } catch (err) {
      setError('An error occurred during login.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#201109] p-4">
      <div className="max-w-md w-full bg-[#2A1810] rounded-2xl shadow-xl shadow-black/40 p-8 border border-[#3D2315]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#FAF7F4]">Admin Access</h1>
          <p className="text-[#EADFD5] mt-2">Sign in to manage the application.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-950/40 text-red-300 rounded-xl text-sm border border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#EADFD5] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] focus:ring-2 focus:ring-[#C87428] focus:border-[#C87428] outline-none transition-all placeholder-[#7A4522]"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#EADFD5] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1A0E08] border border-[#3D2315] text-[#FAF7F4] focus:ring-2 focus:ring-[#C87428] focus:border-[#C87428] outline-none transition-all placeholder-[#7A4522]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#C87428] hover:bg-[#E28C38] text-white font-bold tracking-wide transition-all disabled:opacity-70 shadow-md shadow-[#C87428]/20"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
