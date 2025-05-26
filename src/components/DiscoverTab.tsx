
import React, { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import { RefreshCw } from 'lucide-react';

const DiscoverTab = () => {
  const [profiles] = useState([
    {
      id: '1',
      name: 'Dev Patel',
      department: 'Computer Science',
      year: '3rd Year',
      bio: 'Passionate about AI and machine learning. Love playing chess and exploring new technologies. Always up for a good coding session!',
      tags: ['AI Enthusiast', 'Chess Player', 'Tech Geek', 'Open Source'],
      image: '/lovable-uploads/dfdeaf77-68e6-4121-b7f2-fcc1752dbe99.png'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      department: 'Data Science',
      year: '2nd Year',
      bio: 'Data science student with interests in analytics and visualization. Coffee enthusiast and weekend hiker!',
      tags: ['Data Science', 'Analytics', 'Coffee Lover', 'Hiking'],
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b8c5?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Arjun Kumar',
      department: 'Mechanical Engineering',
      year: '4th Year',
      bio: 'Robotics enthusiast and aspiring entrepreneur. Always up for a good debate and innovative discussions!',
      tags: ['Robotics', 'Entrepreneur', 'Debate', 'Innovation'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      department: 'Electrical Engineering',
      year: '3rd Year',
      bio: 'Electronics geek who loves building circuits and exploring renewable energy solutions. Music lover!',
      tags: ['Electronics', 'Green Tech', 'Music', 'Innovation'],
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: '5',
      name: 'Rahul Krishnan',
      department: 'Chemical Engineering',
      year: '4th Year',
      bio: 'Passionate about sustainable chemistry and process optimization. Loves photography and travel.',
      tags: ['Chemistry', 'Sustainability', 'Photography', 'Travel'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [skippedProfiles, setSkippedProfiles] = useState<string[]>([]);

  const handleLike = (id: string) => {
    console.log('Liked profile:', id);
    setLikedProfiles(prev => [...prev, id]);
    nextProfile();
  };

  const handleSkip = (id: string) => {
    console.log('Skipped profile:', id);
    setSkippedProfiles(prev => [...prev, id]);
    nextProfile();
  };

  const nextProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % profiles.length);
      setIsLoading(false);
    }, 500);
  };

  const resetStack = () => {
    setCurrentIndex(0);
    setLikedProfiles([]);
    setSkippedProfiles([]);
  };

  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length - 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Finding your next connection...</p>
        </div>
      </div>
    );
  }

  if (!hasMoreProfiles && likedProfiles.length > 0) {
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
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-green-400 font-semibold">
                ❤️ {likedProfiles.length} profiles liked
              </p>
              <p className="text-gray-400 text-sm">
                ⏭️ {skippedProfiles.length} profiles skipped
              </p>
            </div>
            <button
              onClick={resetStack}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform mx-auto"
            >
              <RefreshCw size={20} />
              <span>Start Over</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              {currentIndex + 1} of {profiles.length}
            </span>
            <span className="text-gray-400 text-sm">
              {Math.round(((currentIndex + 1) / profiles.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / profiles.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="animate-fade-in">
          <ProfileCard
            profile={currentProfile}
            onLike={handleLike}
            onSkip={handleSkip}
          />
        </div>

        {/* Next Profile Preview */}
        {hasMoreProfiles && profiles[currentIndex + 1] && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 scale-95 opacity-30 -z-10">
            <div className="w-full max-w-sm bg-gray-800 rounded-3xl h-96 shadow-xl"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverTab;
