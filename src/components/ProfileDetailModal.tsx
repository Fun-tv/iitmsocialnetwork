
import React from 'react';
import { X, MapPin, GraduationCap, Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Profile {
  id: string;
  full_name: string;
  age: number;
  department: string;
  academic_year: string;
  bio: string;
  interests: string[];
  profile_picture_url?: string;
  gender?: string;
}

interface ProfileDetailModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
  onLike?: () => void;
  onSuperLike?: () => void;
  onSkip?: () => void;
  showActions?: boolean;
}

const ProfileDetailModal = ({ 
  profile, 
  isOpen, 
  onClose, 
  onLike, 
  onSuperLike, 
  onSkip, 
  showActions = false 
}: ProfileDetailModalProps) => {
  if (!isOpen) return null;

  const academicYearLabels = {
    '1st_year': '1st Year',
    '2nd_year': '2nd Year', 
    '3rd_year': '3rd Year',
    '4th_year': '4th Year',
    'mtech': 'M.Tech',
    'phd': 'PhD',
    'other': 'Other'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header Image */}
        <div className="relative h-80">
          <img 
            src={profile.profile_picture_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face`}
            alt={profile.full_name}
            className="w-full h-full object-cover rounded-t-3xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
          >
            <X size={20} />
          </button>
          
          {/* Name and Age Overlay */}
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-3xl font-bold">{profile.full_name}</h2>
            <p className="text-lg opacity-90">{profile.age} years old</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Academic Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-300">
              <GraduationCap size={20} className="text-red-500" />
              <div>
                <p className="font-semibold text-white">{profile.department}</p>
                <p className="text-sm">{academicYearLabels[profile.academic_year as keyof typeof academicYearLabels]}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">About</h3>
            <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {showActions && (
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                onClick={onSkip}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Skip
              </Button>
              <Button
                onClick={onSuperLike}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                ⭐
              </Button>
              <Button
                onClick={onLike}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
              >
                <Heart size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailModal;
