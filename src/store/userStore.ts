import { create } from 'zustand';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updatePassword, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '../lib/firebase';
import type { UserLink, UserProfile } from '../types/profile';

const DEFAULT_FAVICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAS1BMVEX////e3t7d3d3f39/c3Nzg4ODh4eHb29vY2Nja2trX19fZ2dnV1dXU1NTT09PS0tLR0dHQ0NDPz8/Ozs7Nzc3MzMzLy8vKysrJycnwG9D7AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVQ4jWNgGAWjYBQMZ8BIQUVFRU1Dh4CKmoa2rp4+ARUNbV09A0MjYwIqmto6egaGRsZGALyYA7/Ux1xYAAAAAElFTkSuQmCC';

const getFaviconUrl = async (url: string): Promise<string> => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return DEFAULT_FAVICON;
  }
};

interface UserStore {
  isLoggedIn: boolean;
  needsProfile: boolean;
  profile: UserProfile | null;
  userId: string | null;
  authError: string | null;
  isLoading: boolean;
  initializeAuthState: () => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<string>;
  signInWithGoogle: () => Promise<void>;
  createProfile: (userId: string) => Promise<void>;
  checkUserId: (userId: string) => Promise<boolean>;
  updateUserId: (userId: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  addLink: (url: string) => Promise<void>;
  removeLink: (id: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateLink: (id: string, url: string) => Promise<void>;
  reorderLinks: (links: UserLink[]) => Promise<void>;
  setEditMode: (isEditing: boolean) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  isLoggedIn: false,
  needsProfile: false,
  profile: null,
  userId: null,
  authError: null,
  isLoading: false,

  initializeAuthState: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          set({ 
            isLoggedIn: true,
            needsProfile: false,
            profile: docSnap.data() as UserProfile,
            userId: user.uid 
          });
        } else {
          set({ 
            isLoggedIn: true,
            needsProfile: true,
            userId: user.uid 
          });
        }
      } else {
        set({ 
          isLoggedIn: false,
          needsProfile: false,
          profile: null,
          userId: null 
        });
      }
    });
  },

  clearError: () => set({ authError: null }),

  checkUserId: async (userId: string) => {
    if (userId.length < 4) return false;
    
    const q = query(collection(db, 'profiles'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  },

  createProfile: async (userId: string) => {
    const state = get();
    if (!state.userId) return;

    set({ isLoading: true, authError: null });
    try {
      const isAvailable = await get().checkUserId(userId);
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }

      const profile: UserProfile = {
        userId,
        name: '',
        bio: '',
        avatar: '',
        links: [],
        isEditing: true,
        email: auth.currentUser?.email || '',
        bgColor: '#EFF6FF'
      };

      await setDoc(doc(db, 'profiles', state.userId), profile);
      set({ profile, needsProfile: false });
    } catch (error) {
      set({ authError: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserId: async (userId: string) => {
    const state = get();
    if (!state.profile || !state.userId) return;

    set({ isLoading: true, authError: null });
    try {
      const isAvailable = await get().checkUserId(userId);
      if (!isAvailable) {
        throw new Error('Username is already taken');
      }

      const newProfile = { ...state.profile, userId };
      await setDoc(doc(db, 'profiles', state.userId), newProfile);
      set({ profile: newProfile });
    } catch (error) {
      set({ authError: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    set({ isLoading: true, authError: null });
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('No user logged in');

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } catch (error) {
      set({ authError: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, authError: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        throw new Error('Please verify your email before signing in');
      }

      const docRef = doc(db, 'profiles', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        set({ 
          isLoggedIn: true,
          needsProfile: false,
          profile,
          userId: userCredential.user.uid 
        });
      } else {
        set({ 
          isLoggedIn: true,
          needsProfile: true,
          userId: userCredential.user.uid 
        });
      }
    } catch (error) {
      set({ authError: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, authError: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      set({ authError: 'Please check your email to verify your account before signing in' });
      return userCredential.user.uid;
    } catch (error) {
      set({ authError: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, authError: null });
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const docRef = doc(db, 'profiles', result.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        set({ 
          isLoggedIn: true,
          needsProfile: false,
          profile,
          userId: result.user.uid 
        });
      } else {
        set({ 
          isLoggedIn: true,
          needsProfile: true,
          userId: result.user.uid 
        });
      }
    } catch (error) {
      set({ authError: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await auth.signOut();
      set({ 
        isLoggedIn: false,
        needsProfile: false,
        profile: null,
        userId: null 
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },

  addLink: async (url: string) => {
    const state = get();
    if (!state.profile || !state.userId) return;

    try {
      let processedUrl = url;
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
      }

      const favicon = await getFaviconUrl(processedUrl);
      const newLink = { url: processedUrl, favicon, id: crypto.randomUUID() };
      const newProfile = {
        ...state.profile,
        links: [...state.profile.links, newLink],
      };
      
      await setDoc(doc(db, 'profiles', state.userId), newProfile);
      set({ profile: newProfile });
    } catch (error) {
      console.error('Error adding link:', error);
    }
  },

  removeLink: async (id: string) => {
    const state = get();
    if (!state.profile || !state.userId) return;

    try {
      const newProfile = {
        ...state.profile,
        links: state.profile.links.filter((link) => link.id !== id),
      };
      
      await setDoc(doc(db, 'profiles', state.userId), newProfile);
      set({ profile: newProfile });
    } catch (error) {
      console.error('Error removing link:', error);
      throw error;
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    const state = get();
    if (!state.profile || !state.userId) return;

    try {
      const newProfile = { ...state.profile, ...updates };
      await setDoc(doc(db, 'profiles', state.userId), newProfile);
      set({ profile: newProfile });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  },

  updateLink: async (id: string, url: string) => {
    const state = get();
    if (!state.profile || !state.userId) return;

    try {
      let processedUrl = url;
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
      }

      const favicon = await getFaviconUrl(processedUrl);
      const newProfile = {
        ...state.profile,
        links: state.profile.links.map((link) =>
          link.id === id ? { ...link, url: processedUrl, favicon } : link
        ),
      };
      
      await setDoc(doc(db, 'profiles', state.userId), newProfile);
      set({ profile: newProfile });
    } catch (error) {
      console.error('Error updating link:', error);
      throw error;
    }
  },

  reorderLinks: async (links: UserLink[]) => {
    const state = get();
    if (!state.profile || !state.userId) return;

    try {
      const newProfile = { ...state.profile, links };
      await setDoc(doc(db, 'profiles', state.userId), newProfile);
      set({ profile: newProfile });
    } catch (error) {
      console.error('Error reordering links:', error);
    }
  },

  setEditMode: async (isEditing: boolean) => {
    const state = get();
    if (!state.profile || !state.userId) return;

    try {
      const newProfile = { ...state.profile, isEditing };
      await setDoc(doc(db, 'profiles', state.userId), newProfile);
      set({ profile: newProfile });
    } catch (error) {
      console.error('Error updating edit mode:', error);
    }
  },
}));