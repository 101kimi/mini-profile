import React, { useRef, useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { Upload } from 'lucide-react';
import type { UserProfile } from '../types/profile';

interface ProfileEditorProps {
  onUpdate: (changes: Partial<UserProfile>) => void;
  pendingChanges: Partial<UserProfile>;
}

export function ProfileEditor({ onUpdate, pendingChanges }: ProfileEditorProps) {
  const { profile } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');

  // Update local state when profile changes
  useEffect(() => {
    setName(pendingChanges.name ?? profile?.name ?? '');
    setBio(pendingChanges.bio ?? profile?.bio ?? '');
  }, [profile, pendingChanges]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      onUpdate({ avatar: base64String });
    };
    reader.readAsDataURL(file);
  };

  const handleNameBlur = () => {
    if (name !== profile?.name) {
      onUpdate({ name });
    }
  };

  const handleBioBlur = () => {
    if (bio !== profile?.bio) {
      onUpdate({ bio });
    }
  };

  return (
    <div className="flex gap-4 mb-6">
      <div className="w-20 h-20 flex-shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-full rounded-[40%] overflow-hidden group relative"
        >
          <img
            src={pendingChanges.avatar ?? profile?.avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
            <Upload className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
      </div>
      <div className="flex-1 space-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameBlur}
          placeholder="Your name"
          className="w-full px-3 py-2 text-xl font-semibold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent placeholder-gray-400"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          onBlur={handleBioBlur}
          placeholder="Your bio"
          rows={2}
          className="w-full px-3 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none placeholder-gray-400"
        />
      </div>
    </div>
  );
}