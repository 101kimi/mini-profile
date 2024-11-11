import React, { useState, useEffect } from 'react';
import { Link as LinkIcon, X, Trash2, XCircle } from 'lucide-react';

interface URLEditorProps {
  link: {
    id: string;
    url: string;
    favicon: string;
  };
  onUpdate: (id: string, url: string) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export function URLEditor({ link, onUpdate, onRemove, onClose }: URLEditorProps) {
  const [editUrl, setEditUrl] = useState(link.url);

  // Update editUrl when link.url changes
  useEffect(() => {
    setEditUrl(link.url);
  }, [link.url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!editUrl.trim()) {
        onRemove(link.id);
        onClose();
        return;
      }
      
      let processedUrl = editUrl;
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
      }
      
      onUpdate(link.id, processedUrl);
      onClose();
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  };

  const handleClear = () => {
    setEditUrl('');
  };

  return (
    <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={link.favicon} alt="" className="w-6 h-6 rounded-lg" />
          <span className="text-sm font-medium text-gray-600">Edit Pin URL</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            placeholder="Enter new URL or leave empty to delete"
            className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {editUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle size={20} />
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              editUrl.trim() 
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {editUrl.trim() ? (
              <>
                <LinkIcon size={20} />
                Update Pin
              </>
            ) : (
              <>
                <Trash2 size={20} />
                Delete Pin
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}