import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types/profile';
import { getLuminance } from '../utils/color';

interface ProfileWidgetProps {
  userId: string;
  className?: string;
}

export function ProfileWidget({ userId, className = "" }: ProfileWidgetProps) {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const q = query(collection(db, 'profiles'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const profileData = querySnapshot.docs[0].data() as UserProfile;
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-[320px] rounded-xl shadow-lg overflow-hidden" style={{ background: '#EFF6FF' }}>
        <div className="p-6 bg-white">
          <div className="animate-pulse flex gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-[40%]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isDarkBg = profile.bgColor && getLuminance(profile.bgColor) < 0.5;

  return (
    <Link 
      to={`/${userId}`}
      className="block w-[320px] rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
      style={{ background: profile.bgColor || '#EFF6FF' }}
    >
      <div className="p-6 bg-white">
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-16 flex-shrink-0">
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
            <h2 className="text-xl font-semibold text-black">{profile.name}</h2>
            <p className="text-black mt-1">{profile.bio}</p>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {profile.links.map((link) => (
            <div
              key={link.id}
              className="group relative rounded-lg transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <div className="p-1">
                <img
                  src={link.favicon}
                  alt=""
                  className="w-5 h-5 mx-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAS1BMVEX////e3t7d3d3f39/c3Nzg4ODh4eHb29vY2Nja2trX19fZ2dnV1dXU1NTT09PS0tLR0dHQ0NDPz8/Ozs7Nzc3MzMzLy8vKysrJycnwG9D7AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVQ4jWNgGAWjYBQMZ8BIQUVFRU1Dh4CKmoa2rp4+ARUNbV09A0MjYwIqmto6egaGRsZGALyYA7/Ux1xYAAAAAElFTkSuQmCC';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`p-2 text-center text-sm transition-colors ${
          isDarkBg 
            ? 'text-white/80 hover:text-white bg-black/10 hover:bg-black/20' 
            : 'text-black bg-black/5 hover:bg-black/10'
        }`}
      >
        @{userId}
      </div>
    </Link>
  );
}