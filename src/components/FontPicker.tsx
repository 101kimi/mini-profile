import React from 'react';
import { Type } from 'lucide-react';
import { useUserStore } from '../store/userStore';

const fonts = [
  'Zen Kaku Gothic New',
  'Zen Maru Gothic',
  'Zen Old Mincho'
] as const;

export function FontPicker() {
  const { profile, updateProfile } = useUserStore();

  const handleFontChange = (font: typeof fonts[number]) => {
    updateProfile({ font });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Type size={16} />
        <span>Font Style</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {fonts.map((font) => (
          <button
            key={font}
            onClick={() => handleFontChange(font)}
            className={`p-2 text-left rounded-lg transition-colors ${
              profile?.font === font
                ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500'
                : 'hover:bg-gray-50'
            }`}
            style={{ fontFamily: font }}
          >
            {font}
          </button>
        ))}
      </div>
    </div>
  );
}