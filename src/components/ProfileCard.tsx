
import React, { useState } from 'react';
import { Heart, X, MapPin, GraduationCap } from 'lucide-react';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    department: string;
    year: string;
    bio: string;
    tags: string[];
    image: string;
  };
  onLike: (id: string) => void;
  onSkip: (id: string) => void;
}

const ProfileCard = ({ profile, onLike, onSkip }: ProfileCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAction = (action: 'like' | 'skip') => {
    setIsAnimating(true);
    setTimeout(() => {
      if (action === 'like') {
        onLike(profile.id);
      } else {
        onSkip(profile.id);
      }
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto transform transition-all duration-500 hover:scale-[1.02] ${isAnimating ? 'scale-95 opacity-80' : ''}`}>
      {/* Profile Image */}
      <div className="relative h-96 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
          </div>
        )}
        <img 
          src={profile.image} 
          alt={`${profile.name}'s profile`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
            setImageLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Floating Info Cards */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-white text-xs font-semibold">
            {profile.year}
          </div>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="space-y-3">
          <div>
            <h2 className="text-3xl font-bold mb-1 text-white drop-shadow-lg">{profile.name}</h2>
            <div className="flex items-center space-x-2 text-gray-200">
              <GraduationCap size={16} className="text-red-400" />
              <span className="text-sm font-medium">{profile.department}</span>
            </div>
          </div>
          
          {/* Bio */}
          <p className="text-sm text-gray-100 leading-relaxed line-clamp-2 drop-shadow-sm">
            {profile.bio}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {profile.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-gradient-to-r from-red-500/30 to-pink-500/30 backdrop-blur-sm text-red-200 text-xs rounded-full border border-red-400/30 font-medium shadow-lg"
              >
                {tag}
              </span>
            ))}
            {profile.tags.length > 3 && (
              <span className="px-3 py-1.5 bg-gray-700/50 backdrop-blur-sm text-gray-300 text-xs rounded-full border border-gray-600/30 font-medium">
                +{profile.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-6">
        <button
          onClick={() => handleAction('skip')}
          disabled={isAnimating}
          className="group w-16 h-16 bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gray-700/90 hover:scale-110 active:scale-95 shadow-xl border border-gray-600/50 disabled:opacity-50"
        >
          <X size={28} className="text-gray-300 group-hover:text-white transition-colors" />
        </button>
        
        <button
          onClick={() => handleAction('like')}
          disabled={isAnimating}
          className="group w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl hover:shadow-red-500/30 disabled:opacity-50"
        >
          <Heart size={28} className="text-white group-hover:scale-110 transition-transform" fill="white" />
        </button>
      </div>

      {/* Animated Like Effect */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-6xl animate-bounce">❤️</div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
