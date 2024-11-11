import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile, UserLink } from '../types/profile';
import { LinkPopup } from './LinkPopup';
import { LogIn, Edit2, Copy, Check, Shuffle } from 'lucide-react';
import { getLuminance } from '../utils/color';

export function PublicProfile() {
  const { userId } = useParams();
  const { isLoggedIn, profile: currentUserProfile } = useUserStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedLink, setSelectedLink] = useState<(UserLink & { title: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        const q = query(collection(db, 'profiles'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const profileData = querySnapshot.docs[0].data() as UserProfile;
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleCopyUrl = async () => {
    const url = `${window.location.origin}/${profile?.userId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShuffle = async () => {
    if (isShuffling) return;
    
    setIsShuffling(true);
    try {
      const currentId = userId;
      const q = query(
        collection(db, 'profiles'),
        where('userId', '!=', currentId || '')
      );
      
      const querySnapshot = await getDocs(q);
      const profiles = querySnapshot.docs.map(doc => doc.data() as UserProfile);
      
      if (profiles.length > 0) {
        const randomIndex = Math.floor(Math.random() * profiles.length);
        const randomProfile = profiles[randomIndex];
        window.location.href = `/${randomProfile.userId}`;
      }
    } catch (error) {
      console.error('Error fetching random profile:', error);
    } finally {
      setIsShuffling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#EFF6FF' }}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          Loading...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#EFF6FF' }}>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const isDarkBg = profile.bgColor && getLuminance(profile.bgColor) < 0.5;
  const headerButtonClass = `py-2 px-4 ${
    isDarkBg 
      ? 'bg-white/10 text-white hover:bg-white/20' 
      : 'bg-black/10 text-black hover:bg-black/20'
  } backdrop-blur-sm rounded-lg transition-colors flex items-center gap-2`;

  const renderAuthButton = () => {
    if (!isLoggedIn) {
      return (
        <Link
          to="/"
          className={headerButtonClass}
        >
          <LogIn size={20} />
          Sign In
        </Link>
      );
    }

    if (currentUserProfile?.userId === profile.userId) {
      return (
        <Link
          to={`/${currentUserProfile.userId}`}
          className={headerButtonClass}
        >
          My Profile
        </Link>
      );
    }

    return (
      <Link
        to={`/${currentUserProfile?.userId}`}
        className={headerButtonClass}
      >
        My Profile
      </Link>
    );
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center"
      style={{ background: profile.bgColor || '#EFF6FF' }}
    >
      <div className="fixed top-4 left-4 z-50">
        <Link to="/about" className={`text-4xl font-['Cookie'] ${
          isDarkBg ? 'text-white' : 'text-black'
        }`}>
          mini
        </Link>
      </div>

      <div className="fixed top-4 right-4 z-50">
        {renderAuthButton()}
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-[320px] mx-auto p-4">
        <div className="w-full bg-white rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 flex-shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover rounded-[40%]"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAS1BMVEX////e3t7d3d3f39/c3Nzg4ODh4eHb29vY2Nja2trX19fZ2dnV1dXU1NTT09PS0tLR0dHQ0NDPz8/Ozs7Nzc3MzMzLy8vKysrJycnwG9D7AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVQ4jWNgGAWjYBQMZ8BIQUVFRU1Dh4CKmoa2rp4+ARUNbV09A0MjYwIqmto6egaGRsZGALyYA7/Ux1xYAAAAAElFTkSuQmCC';
                }}
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600 mt-1 text-sm">{profile.bio}</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {profile.links.map((link) => (
              <button
                key={link.id}
                onClick={() => setSelectedLink({ ...link, title: new URL(link.url).hostname })}
                className="group relative hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="p-1">
                  <img
                    src={link.favicon}
                    alt=""
                    className="w-5 h-5 mx-auto transition-transform group-hover:scale-105 rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAS1BMVEX////e3t7d3d3f39/c3Nzg4ODh4eHb29vY2Nja2trX19fZ2dnV1dXU1NTT09PS0tLR0dHQ0NDPz8/Ozs7Nzc3MzMzLy8vKysrJycnwG9D7AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVQ4jWNgGAWjYBQMZ8BIQUVFRU1Dh4CKmoa2rp4+ARUNbV09A0MjYwIqmto6egaGRsZGALyYA7/Ux1xYAAAAAElFTkSuQmCC';
                    }}
                  />
                </div>
              </button>
            ))}
          </div>

          {isLoggedIn && currentUserProfile?.userId === profile.userId && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600 truncate">
                  {window.location.origin}/{profile.userId}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Copy profile URL"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleShuffle}
          disabled={isShuffling}
          className={`${headerButtonClass} mb-4`}
        >
          <Shuffle size={20} />
          {isShuffling ? 'Shuffling...' : 'Shuffle Profile'}
        </button>

        {selectedLink && (
          <LinkPopup
            link={selectedLink}
            onClose={() => setSelectedLink(null)}
          />
        )}
      </div>
    </div>
  );
}