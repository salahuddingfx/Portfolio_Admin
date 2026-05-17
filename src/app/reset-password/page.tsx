'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Invalid reset link.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/admin/reset-password', { token, password });
      setMessage(res.data?.message || 'Password updated successfully.');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="p-8 bg-white/5 border border-white/10 rounded-2xl w-full max-w-md backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Reset Password</h1>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">New Password</label>
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
          <div>
            <label className="block text-sm text-white/60 mb-2">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-70"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
