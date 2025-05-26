
import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import { RefreshCw } from 'lucide-react';
import { useSocial } from '@/hooks/useSocial';

const DiscoverTab = () => {
  const { 
    discoveryProfiles, 
    loading, 
    fetchDiscoveryProfiles, 
    likeProfile, 
    skipProfile 
  } = useSocial();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchDiscoveryProfiles();
  }, []);

  const handleLike = async (id: string) => {
    setIsActionLoading(true);
    try {
      const success = await likeProfile(id);
      if (success) {
        nextProfile();
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSkip = (id: string) => {
    skipProfile(id);
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentIndex((prev) => (prev + 1) % discoveryProfiles.length);
  };

  const resetStack = () => {
    setCurrentIndex(0);
    fetchDiscoveryProfiles();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Finding your next connection...</p>
        </div>
      </div>
    );
  }

  if (discoveryProfiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center p-6">
        <div className="space-y-6">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">You're all caught up!</h3>
            <p className="text-gray-400 max-w-sm">
              You've seen all available profiles. Check back later for new connections or explore your matches!
            </p>
          </div>
          <button
            onClick={resetStack}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform mx-auto"
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    );
  }

  const currentProfile = discoveryProfiles[currentIndex];
  const hasMoreProfiles = currentIndex < discoveryProfiles.length - 1;

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-full text-center p-6">
        <div className="space-y-6">
          <div className="text-8xl mb-4">😴</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">No more profiles</h3>
            <p className="text-gray-400 max-w-sm">
              Check back later for new students to connect with!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Transform profile data to match ProfileCard interface
  const profileCardData = {
    id: currentProfile.id,
    name: currentProfile.full_name || 'Anonymous',
    department: currentProfile.department || 'Unknown Department',
    year: currentProfile.academic_year?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Year',
    bio: currentProfile.bio || 'No bio available',
    tags: currentProfile.interests || [],
    image: currentProfile.profile_picture_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face`
  };

  return (
    <div className="flex items-center justify-center min-h-full p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-500 rounded-full blur-xl"></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">
              {currentIndex + 1} of {discoveryProfiles.length}
            </span>
            <span className="text-gray-400 text-sm">
              {Math.round(((currentIndex + 1) / discoveryProfiles.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / discoveryProfiles.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="animate-fade-in">
          <ProfileCard
            profile={profileCardData}
            onLike={handleLike}
            onSkip={handleSkip}
            disabled={isActionLoading}
          />
        </div>

        {/* Next Profile Preview */}
        {hasMoreProfiles && discoveryProfiles[currentIndex + 1] && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 scale-95 opacity-30 -z-10">
            <div className="w-full max-w-sm bg-gray-800 rounded-3xl h-96 shadow-xl"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverTab;
