import React from 'react';
import { ExternalLink, X, Plus } from 'lucide-react';
import { UserLink } from '../types/profile';
import { useUserStore } from '../store/userStore';
import { useParams } from 'react-router-dom';

interface LinkPopupProps {
  link: UserLink & { title: string };
  onClose: () => void;
}

export function LinkPopup({ link, onClose }: LinkPopupProps) {
  const { userId } = useParams();
  const { profile: currentUserProfile, addLink } = useUserStore();

  const showAddButton = currentUserProfile && currentUserProfile.userId !== userId;

  const handleAddToProfile = () => {
    addLink(link.url);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="w-[280px] bg-white rounded-lg p-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src={link.favicon}
              alt=""
              className="w-6 h-6"
              onError={(e) => {
                e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAS1BMVEX////e3t7d3d3f39/c3Nzg4ODh4eHb29vY2Nja2trX19fZ2dnV1dXU1NTT09PS0tLR0dHQ0NDPz8/Ozs7Nzc3MzMzLy8vKysrJycnwG9D7AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVQ4jWNgGAWjYBQMZ8BIQUVFRU1Dh4CKmoa2rp4+ARUNbV09A0MjYwIqmto6egaGRsZGALyYA7/Ux1xYAAAAAElFTkSuQmCC';
              }}
            />
            <h3 className="font-medium text-gray-900 line-clamp-1">{link.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 break-all">{link.url}</p>
        
        <div className="space-y-2">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink size={20} />
            Visit Website
          </a>

          {showAddButton && (
            <button
              onClick={handleAddToProfile}
              className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add to My Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}