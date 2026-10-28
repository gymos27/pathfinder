'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { UserProfile } from '@/types/user';
import { getStoredProfile, saveStoredProfile, DEFAULT_PROFILE } from '@/lib/storage';

export interface AuthUser {
  id: string;
  email: string;
  userType?: 'student' | 'professional';
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isSupabaseActive: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, initialProfile?: Partial<UserProfile>) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  saveProfile: (newProfile: UserProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SIMULATED_USER_KEY = 'pathfinder_simulated_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabaseActive = isSupabaseConfigured();

  const loadProfile = async (userId?: string) => {
    // 1. If Supabase configured, try to fetch from Supabase
    if (isSupabaseActive) {
      const supabase = createClient();
      if (supabase && userId) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

          if (data && !error) {
            const mappedProfile: UserProfile = {
              id: data.id,
              email: data.email,
              userType: data.user_type || 'student',
              goal: data.goal || DEFAULT_PROFILE.goal,
              domainInterest: data.domain_interest || DEFAULT_PROFILE.domainInterest,
              currentSkills: data.current_skills || DEFAULT_PROFILE.currentSkills,
              level: data.level || DEFAULT_PROFILE.level,
              hoursPerWeek: data.hours_per_week || DEFAULT_PROFILE.hoursPerWeek,
              currentRole: data.current_role,
              yearsOfExperience: data.years_of_experience,
              targetRole: data.target_role,
              createdAt: data.created_at || new Date().toISOString(),
              updatedAt: data.updated_at || new Date().toISOString(),
            };
            setProfile(mappedProfile);
            saveStoredProfile(mappedProfile);
            return;
          }
        } catch (e) {
          console.warn('Could not fetch Supabase profile, falling back to local', e);
        }
      }
    }

    // 2. Fallback to localStorage
    const local = getStoredProfile();
    setProfile(local || DEFAULT_PROFILE);
  };

  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);

      if (isSupabaseActive) {
        const supabase = createClient();
        if (supabase) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              const u: AuthUser = {
                id: session.user.id,
                email: session.user.email || '',
              };
              setUser(u);
              await loadProfile(session.user.id);
            }
          } catch (err) {
            console.error('Error fetching Supabase session:', err);
          }

          // Subscribe to auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
              if (session?.user) {
                const u: AuthUser = {
                  id: session.user.id,
                  email: session.user.email || '',
                };
                setUser(u);
                await loadProfile(session.user.id);
              } else {
                setUser(null);
              }
            }
          );

          setIsLoading(false);
          return () => {
            subscription.unsubscribe();
          };
        }
      }

      // Local / Simulated Auth Mode
      try {
        const simRaw = localStorage.getItem(SIMULATED_USER_KEY);
        if (simRaw) {
          const simUser = JSON.parse(simRaw);
          setUser(simUser);
        }
      } catch (e) {
        console.error('Error loading simulated user', e);
      }

      await loadProfile();
      setIsLoading(false);
    }

    initAuth();
  }, [isSupabaseActive]);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    setIsLoading(true);

    if (isSupabaseActive) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          const u: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
          };
          setUser(u);
          await loadProfile(data.user.id);
        }

        setIsLoading(false);
        return {};
      }
    }

    // Local Simulated Mode
    if (!email || !password) {
      setIsLoading(false);
      return { error: 'Please provide both email and password.' };
    }

    const simUser: AuthUser = {
      id: `sim-${Date.now()}`,
      email,
    };
    localStorage.setItem(SIMULATED_USER_KEY, JSON.stringify(simUser));
    setUser(simUser);
    await loadProfile();
    setIsLoading(false);
    return {};
  };

  const signUp = async (
    email: string,
    password: string,
    initialProfile?: Partial<UserProfile>
  ): Promise<{ error?: string }> => {
    setIsLoading(true);

    if (isSupabaseActive) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { error: error.message };
        }

        if (data.user) {
          const u: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            userType: initialProfile?.userType || 'student',
          };
          setUser(u);

          // Insert or update profile
          if (initialProfile) {
            try {
              await supabase.from('profiles').upsert({
                id: data.user.id,
                email,
                user_type: initialProfile.userType || 'student',
                goal: initialProfile.goal,
                domain_interest: initialProfile.domainInterest,
                current_role: initialProfile.currentRole,
                years_of_experience: initialProfile.yearsOfExperience,
                target_role: initialProfile.targetRole,
                current_skills: initialProfile.currentSkills,
                level: initialProfile.level,
                hours_per_week: initialProfile.hoursPerWeek,
                updated_at: new Date().toISOString(),
              });
            } catch (e) {
              console.warn('Could not auto-insert profile into Supabase:', e);
            }
          }

          await loadProfile(data.user.id);
        }

        setIsLoading(false);
        return {};
      }
    }

    // Local Simulated Mode
    if (!email || password.length < 6) {
      setIsLoading(false);
      return { error: 'Password must be at least 6 characters.' };
    }

    const simUser: AuthUser = {
      id: `sim-${Date.now()}`,
      email,
      userType: initialProfile?.userType || 'student',
    };
    localStorage.setItem(SIMULATED_USER_KEY, JSON.stringify(simUser));
    setUser(simUser);

    if (initialProfile) {
      const completeProfile: UserProfile = {
        ...DEFAULT_PROFILE,
        ...initialProfile,
        email,
        id: simUser.id,
        userType: initialProfile.userType || 'student',
      };
      saveStoredProfile(completeProfile);
      setProfile(completeProfile);
    }

    setIsLoading(false);
    return {};
  };

  const signOut = async () => {
    if (isSupabaseActive) {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    localStorage.removeItem(SIMULATED_USER_KEY);
    setUser(null);
  };

  const saveProfile = async (newProfile: UserProfile) => {
    saveStoredProfile(newProfile);
    setProfile(newProfile);

    if (isSupabaseActive && user?.id) {
      const supabase = createClient();
      if (supabase) {
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            user_type: newProfile.userType,
            goal: newProfile.goal,
            domain_interest: newProfile.domainInterest,
            current_role: newProfile.currentRole,
            years_of_experience: newProfile.yearsOfExperience,
            target_role: newProfile.targetRole,
            current_skills: newProfile.currentSkills,
            level: newProfile.level,
            hours_per_week: newProfile.hoursPerWeek,
            updated_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn('Could not sync profile to Supabase', e);
        }
      }
    }
  };

  const refreshProfile = async () => {
    await loadProfile(user?.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isSupabaseActive,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        saveProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
