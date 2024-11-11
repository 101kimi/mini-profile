import React from 'react';
import { useUserStore } from '../store/userStore';
import { Palette } from 'lucide-react';
import type { UserProfile } from '../types/profile';

interface BackgroundPickerProps {
  onUpdate: (changes: Partial<UserProfile>) => void;
  pendingChanges: Partial<UserProfile>;
}

export function BackgroundPicker({ onUpdate, pendingChanges }: BackgroundPickerProps) {
  const { profile } = useUserStore();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ bgColor: e.target.value });
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Palette size={20} />
        Background Color
      </label>
      <input
        type="color"
        value={pendingChanges.bgColor ?? profile?.bgColor ?? '#EFF6FF'}
        onChange={handleColorChange}
        className="w-full h-10 rounded-lg cursor-pointer"
      />
    </div>
  );
}