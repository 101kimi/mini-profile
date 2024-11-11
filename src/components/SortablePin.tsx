import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DEFAULT_PIN = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAS1BMVEX////e3t7d3d3f39/c3Nzg4ODh4eHb29vY2Nja2trX19fZ2dnV1dXU1NTT09PS0tLR0dHQ0NDPz8/Ozs7Nzc3MzMzLy8vKysrJycnwG9D7AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVQ4jWNgGAWjYBQMZ8BIQUVFRU1Dh4CKmoa2rp4+ARUNbV09A0MjYwIqmto6egaGRsZGALyYA7/Ux1xYAAAAAElFTkSuQmCC';

interface SortablePinProps {
  id: string;
  favicon: string;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
}

export function SortablePin({ 
  id, 
  favicon, 
  isSelected,
  isEditing,
  onSelect
}: SortablePinProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [imgError, setImgError] = useState(false);
  const isGoogleFavicon = favicon.startsWith('https://www.google.com/s2/favicons');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? { ...attributes, ...listeners } : {})}
      className={`relative group ${isEditing ? 'cursor-move' : ''}`}
      onClick={onSelect}
    >
      <div className={`p-1 rounded-lg transition-all ${isSelected ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}>
        <img
          src={favicon}
          alt=""
          className={`w-5 h-5 rounded-lg mx-auto transition-transform group-hover:scale-105 ${
            isGoogleFavicon ? 'object-contain' : 'object-cover'
          }`}
          onError={(e) => {
            if (!imgError) {
              setImgError(true);
              e.currentTarget.src = DEFAULT_PIN;
            }
          }}
        />
      </div>
    </div>
  );
}