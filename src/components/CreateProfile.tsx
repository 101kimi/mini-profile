import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { AtSign } from 'lucide-react';

export function CreateProfile() {
  const { createProfile, authError, isLoading, clearError } = useUserStore();
  const [userId, setUserId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await createProfile(userId);
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div 
      className="min-h-screen w-full content-container bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50"
    >
      <div className="fixed top-4 left-4 z-50">
        <h1 className="text-4xl font-['Cookie'] text-black">mini</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-[320px] bg-white rounded-2xl p-6 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pink-50 rounded-full mx-auto flex items-center justify-center">
              <AtSign className="w-8 h-8 text-pink-500" />
            </div>
            <h2 className="text-2xl font-semibold mt-4">Create Your Profile</h2>
            <p className="text-gray-600 mt-2">Choose a unique username for your profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toLowerCase())}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Choose a username"
                  required
                  minLength={4}
                  pattern="[a-z0-9]+"
                />
              </div>
              <p className="text-sm text-gray-500">
                This will be your profile URL: example.com/{userId || 'username'}
              </p>
            </div>

            {authError && (
              <p className="text-sm text-red-500">{authError}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || userId.length < 4}
              className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Profile...' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}