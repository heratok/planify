import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { AuthContextType, User, UserRole } from '../utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        // FORCE ADMIN ROLE FOR DEMO PURPOSES
        // This ensures the user can test all features immediately
        const demoRole = 'admin'; 
        
        setUser({
          id: data.id,
          email: data.email,
          name: data.email.split('@')[0],
          role: demoRole, // Override DB role
          avatar: `https://ui-avatars.com/api/?name=${data.email}&background=random`,
        });

        // Attempt to update DB to match (fire and forget)
        if (data.role !== demoRole) {
          supabase.from('profiles').update({ role: demoRole }).eq('id', userId).then();
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback if profile doesn't exist yet
      setUser({
        id: userId,
        email: email,
        name: email.split('@')[0],
        role: 'admin', // Default to admin
        avatar: `https://ui-avatars.com/api/?name=${email}&background=random`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      throw error;
    }
    
    return true;
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          role: 'admin', // Request admin role
        }
      }
    });

    if (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      throw error;
    }

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const hasPermission = (requiredRole: string): boolean => {
    if (!user) return false;
    const roleHierarchy: Record<string, number> = {
      viewer: 1,
      collaborator: 2,
      admin: 3,
    };
    return (roleHierarchy[user.role] || 0) >= (roleHierarchy[requiredRole] || 0);
  };

  const updateRole = async (role: UserRole) => {
    if (!user) return;
    
    // Update local state immediately
    setUser({ ...user, role });
    
    // Attempt to update DB
    try {
      await supabase.from('profiles').update({ role }).eq('id', user.id);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signUp,
    logout,
    hasPermission,
    updateRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
