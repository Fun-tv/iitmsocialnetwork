
import React, { useState } from 'react';
import { Camera, Edit3, Settings, User, Mail, GraduationCap, Calendar, Heart, BookOpen } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

const ProfileTab = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: '',
    bio: '',
    interests: [] as string[]
  });

  // Initialize edit data when profile loads
  React.useEffect(() => {
    if (profile) {
      setEditData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        interests: profile.interests || []
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatAcademicYear = (year: string | undefined) => {
    if (!year) return 'Not specified';
    return year.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !editData.interests.includes(interest.trim())) {
      setEditData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const removeInterest = (index: number) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-400 mb-4">
          <User size={48} className="mx-auto mb-2" />
          <p>No profile data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">My Profile</h2>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </div>

      {/* Profile Picture Section */}
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <img 
            src={profile.profile_picture_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'} 
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
          />
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
            <Camera size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-6">
        {/* Name */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <User size={16} />
              Name
            </label>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Edit3 size={16} />
            </button>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editData.full_name}
              onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
              placeholder="Enter your full name"
            />
          ) : (
            <p className="text-white font-medium">{profile.full_name || 'Not specified'}</p>
          )}
        </div>

        {/* Email */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Mail size={16} />
              Email
            </label>
          </div>
          <p className="text-white font-medium">{profile.email}</p>
        </div>

        {/* Department & Year & Age */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <GraduationCap size={16} />
                Department
              </label>
            </div>
            <p className="text-white font-medium">{profile.department || 'Not specified'}</p>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Calendar size={16} />
                Year
              </label>
            </div>
            <p className="text-white font-medium">{formatAcademicYear(profile.academic_year)}</p>
          </div>
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">Age</label>
            </div>
            <p className="text-white font-medium">{profile.age || 'Not specified'}</p>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">Gender</label>
            </div>
            <p className="text-white font-medium capitalize">{profile.gender?.replace('_', ' ') || 'Not specified'}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <BookOpen size={16} />
              Bio
            </label>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Edit3 size={16} />
            </button>
          </div>
          {isEditing ? (
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Tell others about yourself..."
            />
          ) : (
            <p className="text-white">{profile.bio || 'Add a bio to tell others about yourself...'}</p>
          )}
        </div>

        {/* Interests */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Heart size={16} />
              Interests
            </label>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Edit3 size={16} />
            </button>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {editData.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-full border border-red-500/30 flex items-center gap-2"
                  >
                    {interest}
                    <button
                      onClick={() => removeInterest(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add an interest and press Enter"
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-red-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addInterest(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-full border border-red-500/30"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">Add your interests to help others connect with you</span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          {isEditing ? (
            <div className="flex gap-3">
              <button 
                onClick={handleSaveProfile}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 rounded-2xl hover:shadow-lg transition-all duration-200"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-700 text-white font-semibold py-3 rounded-2xl hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 rounded-2xl hover:shadow-lg transition-all duration-200"
              >
                Edit Profile
              </button>
              
              <button className="w-full bg-gray-800 text-white font-semibold py-3 rounded-2xl hover:bg-gray-700 transition-colors">
                Account Settings
              </button>
            </>
          )}
        </div>

        {/* Profile Completion Status */}
        <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Profile Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              profile.is_profile_complete 
                ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
            }`}>
              {profile.is_profile_complete ? 'Complete' : 'Incomplete'}
            </span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {profile.is_profile_complete 
              ? 'Your profile is visible to other users' 
              : 'Complete your profile to be discoverable by others'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
