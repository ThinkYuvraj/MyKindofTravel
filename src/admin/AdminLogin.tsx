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
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <div className="max-w-md w-full bg-neutral-900 rounded-2xl shadow-xl shadow-black/50 p-8 border border-neutral-800">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#E37500] flex items-center justify-center text-white shadow-lg shadow-[#E37500]/25 mx-auto mb-4">
            <span className="font-serif font-bold text-xl">M</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-white">My Kind of Travel</h1>
          <p className="text-neutral-400 text-xs uppercase tracking-widest font-semibold mt-1">
            CMS Portal Management
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 text-red-300 rounded-xl text-sm border border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:ring-2 focus:ring-[#E37500] focus:border-[#E37500] outline-none transition-all placeholder-neutral-500 text-sm"
              placeholder="Please enter your email"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300">
                Please enter your password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:ring-2 focus:ring-[#E37500] focus:border-[#E37500] outline-none transition-all placeholder-neutral-500 text-sm"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#E37500] hover:bg-[#C66500] text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-70 shadow-md shadow-[#E37500]/20"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <button
            type="button"
            onClick={() => {
              setEmail('marketing2glue@gmail.com');
              setPassword('Admin@8369');
            }}
            className="text-[#E37500] hover:text-[#C66500] transition-colors font-semibold"
          >
            Fill Default Credentials
          </button>
          <a href="/" className="hover:text-white transition-colors">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
