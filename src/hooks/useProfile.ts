
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  age?: number;
  department?: string;
  academic_year?: '1st_year' | '2nd_year' | '3rd_year' | '4th_year' | 'mtech' | 'phd' | 'other';
  roll_number?: string;
  bio?: string;
  interests?: string[];
  profile_picture_url?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  is_profile_complete?: boolean;
}

interface OnboardingProgress {
  id: string;
  user_id: string;
  step_completed: number;
  steps_data: any;
  completed_at?: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        setLoading(false);
        return;
      }

      const { data: progressData, error: progressError } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        console.error('Error fetching onboarding progress:', progressError);
      }

      setProfile(profileData);
      setOnboardingProgress(progressData);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error) {
      setProfile(data);
    }

    return { data, error };
  };

  const updateOnboardingProgress = async (step: number, stepData: any = {}) => {
    if (!user) return { error: 'No user logged in' };

    const updates = {
      step_completed: step,
      steps_data: stepData,
      ...(step >= 4 ? { completed_at: new Date().toISOString() } : {})
    };

    const { data, error } = await supabase
      .from('onboarding_progress')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error) {
      setOnboardingProgress(data);
    }

    return { data, error };
  };

  return {
    profile,
    onboardingProgress,
    loading,
    updateProfile,
    updateOnboardingProgress,
    refetch: fetchProfile,
  };
};
