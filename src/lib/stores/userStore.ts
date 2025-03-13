import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  subscription?: string;
  usageToday: number;
  sessionsToday: number;
  lastSessionTime?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUsage: (images: number) => void;
  resetUsage: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: (user: User) => {
        set({ user, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateUsage: (images: number) => {
        const { user } = get();
        if (!user) return;
        
        const now = new Date().toISOString();
        const isNewSession = !user.lastSessionTime || 
          new Date(now).getTime() - new Date(user.lastSessionTime).getTime() > 30 * 60 * 1000; // 30 minutes
        
        set({
          user: {
            ...user,
            usageToday: user.usageToday + images,
            sessionsToday: isNewSession ? user.sessionsToday + 1 : user.sessionsToday,
            lastSessionTime: now
          }
        });
      },
      
      resetUsage: () => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            usageToday: 0,
            sessionsToday: 0,
            lastSessionTime: undefined
          }
        });
      },
      
      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        
        set({
          user: {
            ...user,
            ...userData
          }
        });
      }
    }),
    {
      name: 'user-storage',
      // Check if it's a new day and reset usage
      onRehydrateStorage: () => (state) => {
        if (!state || !state.user || !state.user.lastSessionTime) return;
        
        const lastDate = new Date(state.user.lastSessionTime).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        
        if (lastDate < today) {
          state.resetUsage();
        }
      }
    }
  )
);