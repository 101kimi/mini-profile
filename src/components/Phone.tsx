import React, { useRef, useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { Plus, LogOut, Link as LinkIcon, CheckCircle2, Settings, Clipboard, ExternalLink, Check } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortablePin } from './SortablePin';
import { ProfileEditor } from './ProfileEditor';
import { URLEditor } from './URLEditor';
import { AccountSettings } from './AccountSettings';
import { BackgroundPicker } from './BackgroundPicker';
import { Link as RouterLink } from 'react-router-dom';
import { getLuminance } from '../utils/color';
import type { UserProfile, UserLink } from '../types/profile';

export function Phone() {
  const { profile, updateProfile } = useUserStore();
  const [newUrl, setNewUrl] = useState('');
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Partial<UserProfile>>({});
  const [pendingLinks, setPendingLinks] = useState<UserLink[]>([]);
  const profileRef = useRef<HTMLDivElement>(null);

  // Initialize pendingLinks with current links when profile changes
  useEffect(() => {
    if (profile?.links) {
      setPendingLinks(profile.links);
    }
  }, [profile?.links]);

  const hasChanges = Object.keys(pendingChanges).length > 0 || 
    JSON.stringify(pendingLinks) !== JSON.stringify(profile?.links || []);

  // モバイルとPCで異なる設定を使用
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: isMobile ? {
        delay: 250,
        tolerance: 5,
      } : {
        distance: 4,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    setIsDragging(true);
    if (isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    if (isMobile) {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = pendingLinks.findIndex((link) => link.id === active.id);
      const newIndex = pendingLinks.findIndex((link) => link.id === over.id);
      setPendingLinks(arrayMove(pendingLinks, oldIndex, newIndex));
      setSelectedPin(null);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    
    let processedUrl = newUrl;
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = `https://${processedUrl}`;
    }

    const domain = new URL(processedUrl).hostname;
    const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    const newLink = { url: processedUrl, favicon, id: crypto.randomUUID() };
    
    setPendingLinks(prev => [...prev, newLink]);
    setNewUrl('');
  };

  const handleUpdateLink = (id: string, url: string) => {
    const domain = new URL(url).hostname;
    const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    
    setPendingLinks(prev => prev.map(link => 
      link.id === id ? { ...link, url, favicon } : link
    ));
  };

  const handleRemoveLink = (id: string) => {
    setPendingLinks(prev => prev.filter(link => link.id !== id));
    setSelectedPin(null);
  };

  const handlePinSelect = (id: string) => {
    if (selectedPin === id) {
      setSelectedPin(null);
      setNewUrl('');
    } else {
      setSelectedPin(id);
      const link = pendingLinks.find(l => l.id === id);
      if (link) {
        setNewUrl(link.url);
      }
    }
  };

  const handleProfileUpdate = (changes: Partial<UserProfile>) => {
    setPendingChanges(prev => ({ ...prev, ...changes }));
  };

  const handleSaveChanges = async () => {
    if (hasChanges && profile) {
      const updates = {
        ...pendingChanges,
        links: pendingLinks
      };
      await updateProfile(updates);
      setPendingChanges({});
    }
  };

  // Reset form when selected pin is removed
  useEffect(() => {
    if (selectedPin && !pendingLinks.find(link => link.id === selectedPin)) {
      setSelectedPin(null);
      setNewUrl('');
    }
  }, [pendingLinks, selectedPin]);

  if (!profile) return null;

  if (showSettings) {
    return (
      <div 
        className="min-h-screen w-full"
        style={{ background: profile.bgColor || '#EFF6FF' }}
      >
        <div className="fixed top-4 left-4 z-50">
          <RouterLink to="/about" className={`text-4xl font-['Cookie'] ${
            profile.bgColor && getLuminance(profile.bgColor) < 0.5 ? 'text-white' : 'text-black'
          }`}>
            mini
          </RouterLink>
        </div>
        <AccountSettings onClose={() => setShowSettings(false)} />
      </div>
    );
  }

  const selectedLink = pendingLinks.find(link => link.id === selectedPin);

  return (
    <div 
      className="min-h-screen w-full py-20 px-4"
      style={{ background: profile.bgColor || '#EFF6FF' }}
    >
      <div className="fixed top-4 left-4 z-50">
        <RouterLink to="/about" className={`text-4xl font-['Cookie'] ${
          profile.bgColor && getLuminance(profile.bgColor) < 0.5 ? 'text-white' : 'text-black'
        }`}>
          mini
        </RouterLink>
      </div>

      <div className="max-w-[320px] mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <ProfileEditor onUpdate={handleProfileUpdate} pendingChanges={pendingChanges} />

          <div className="space-y-4 mb-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={pendingLinks.map(link => link.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-5 gap-2">
                  {pendingLinks.map((link) => (
                    <SortablePin
                      key={link.id}
                      id={link.id}
                      favicon={link.favicon}
                      isSelected={selectedPin === link.id}
                      isEditing={true}
                      onSelect={() => handlePinSelect(link.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {!selectedLink && (
              <form onSubmit={handleAddLink}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="Enter website URL"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </form>
            )}

            {selectedLink && (
              <URLEditor
                link={selectedLink}
                onUpdate={handleUpdateLink}
                onRemove={handleRemoveLink}
                onClose={() => {
                  setSelectedPin(null);
                  setNewUrl('');
                }}
              />
            )}

            <div className="pt-4 border-t">
              <BackgroundPicker onUpdate={handleProfileUpdate} pendingChanges={pendingChanges} />
            </div>

            {hasChanges ? (
              <button
                onClick={handleSaveChanges}
                className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Save Changes
              </button>
            ) : (
              <RouterLink
                to={`/${profile.userId}`}
                className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink size={20} />
                View My Profile
              </RouterLink>
            )}

            <button
              onClick={() => setShowSettings(true)}
              className="w-full py-2 px-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Settings size={20} />
              Account Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}