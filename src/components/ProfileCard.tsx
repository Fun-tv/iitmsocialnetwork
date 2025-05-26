
import React from 'react';
import { Heart, X } from 'lucide-react';

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
  return (
    <div className="relative bg-gray-800 rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto transform transition-all duration-300 hover:scale-[1.02]">
      {/* Profile Image */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={profile.image} 
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
      
      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
        <p className="text-gray-300 mb-2">{profile.department} • {profile.year}</p>
        
        {/* Bio */}
        <p className="text-sm text-gray-200 mb-3 line-clamp-2">{profile.bio}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-500/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          onClick={() => onSkip(profile.id)}
          className="w-14 h-14 bg-gray-700/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-600/80 hover:scale-110 active:scale-95"
        >
          <X size={24} className="text-gray-300" />
        </button>
        
        <button
          onClick={() => onLike(profile.id)}
          className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
        >
          <Heart size={24} className="text-white" fill="white" />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
