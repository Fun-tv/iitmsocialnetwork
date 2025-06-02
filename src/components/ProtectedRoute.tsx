
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Navigate } from 'react-router-dom';
import OnboardingFlow from '@/components/OnboardingFlow';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, onboardingProgress, loading: profileLoading } = useProfile();

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🔥</span>
          </div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user needs to complete onboarding
  if (!onboardingProgress || onboardingProgress.step_completed < 4) {
    return <OnboardingFlow />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
