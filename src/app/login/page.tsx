'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', { username, password });
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleReset = async () => {
    setResetMessage('');
    setResetLoading(true);
    try {
      const res = await api.post('/admin/forgot-password', { email: resetEmail });
      setResetMessage(res.data?.message || 'If the email exists, a reset link was sent.');
    } catch (err: any) {
      setResetMessage(err.response?.data?.message || 'Unable to send reset link.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-8 bg-white/5 border border-white/10 rounded-2xl w-full max-w-md backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg p-3 pr-12 text-white focus:border-accent outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowReset((prev) => !prev)}
            className="text-xs text-white/60 hover:text-white transition"
          >
            Forgot password?
          </button>
          {showReset && (
            <div className="space-y-3 rounded-lg border border-white/10 bg-black/40 p-3">
              <p className="text-xs text-white/60">We will send a reset link to your admin email.</p>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none"
                placeholder="admin@email.com"
                required
              />
              <button
                type="button"
                onClick={handleReset}
                disabled={resetLoading || !resetEmail}
                className="w-full bg-white/10 text-white text-sm py-2.5 rounded-lg hover:bg-white/20 transition disabled:opacity-60"
              >
                {resetLoading ? 'Sending...' : 'Send reset link'}
              </button>
              {resetMessage && <p className="text-xs text-white/60">{resetMessage}</p>}
            </div>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
