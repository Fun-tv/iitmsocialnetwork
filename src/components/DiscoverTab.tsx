
import React, { useState } from 'react';
import ProfileCard from './ProfileCard';

const DiscoverTab = () => {
  const [profiles] = useState([
    {
      id: '1',
      name: 'Dev Patel',
      department: 'Computer Science',
      year: '3rd Year',
      bio: 'Passionate about AI and machine learning. Love playing chess and exploring new technologies.',
      tags: ['AI Enthusiast', 'Chess Player', 'Tech Geek'],
      image: '/lovable-uploads/dfdeaf77-68e6-4121-b7f2-fcc1752dbe99.png'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      department: 'Data Science',
      year: '2nd Year',
      bio: 'Data science student with interests in analytics and visualization. Coffee enthusiast!',
      tags: ['Data Science', 'Analytics', 'Coffee Lover'],
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b8c5?w=400&h=400&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Arjun Kumar',
      department: 'Mechanical Engineering',
      year: '4th Year',
      bio: 'Robotics enthusiast and aspiring entrepreneur. Always up for a good debate!',
      tags: ['Robotics', 'Entrepreneur', 'Debate'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLike = (id: string) => {
    console.log('Liked profile:', id);
    nextProfile();
  };

  const handleSkip = (id: string) => {
    console.log('Skipped profile:', id);
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentIndex((prev) => (prev + 1) % profiles.length);
  };

  if (profiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
          <p className="text-gray-400">Check back later for new profiles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <div className="w-full max-w-sm">
        <ProfileCard
          profile={profiles[currentIndex]}
          onLike={handleLike}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

export default DiscoverTab;
