import React from 'react';

interface DraggingFaviconProps {
  favicon: string;
}

export function DraggingFavicon({ favicon }: DraggingFaviconProps) {
  return (
    <div className="relative">
      <img
        src={favicon}
        alt=""
        className="w-6 h-6 rounded-lg mx-auto"
      />
    </div>
  );
}