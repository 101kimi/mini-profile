import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { Mail, Lock, ArrowLeft } from 'lucide-react';

interface RegisterProps {
  onBack: () => void;
}

export function Register({ onBack }: RegisterProps) {
  const { signUpWithEmail, authError, isLoading, clearError } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await signUpWithEmail(email, password);
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50"
    >
      <div className="fixed top-4 left-4 z-50">
        <h1 className="text-4xl font-['Cookie'] text-black">mini</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-[320px] bg-white rounded-2xl p-6 shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-normal font-['Cookie']">mini</h2>
            <p className="text-gray-600 mt-2">
              Create your{' '}
              <span className="font-['Cookie'] text-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-transparent bg-clip-text animate-gradient">
                mini
              </span>
              {' '}profile
            </p>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Choose a password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {authError && (
              <p className="text-sm text-red-500">{authError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}