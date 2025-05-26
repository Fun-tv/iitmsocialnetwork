
import React, { useState } from 'react';
import { Camera, Edit3, Settings } from 'lucide-react';

const ProfileTab = () => {
  const [profile] = useState({
    name: 'Your Name',
    department: 'Computer Science',
    year: '3rd Year',
    bio: 'Edit your bio to tell others about yourself...',
    tags: ['Add', 'Your', 'Interests'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
  });

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
            src={profile.image} 
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
            <label className="text-sm font-medium text-gray-400">Name</label>
            <Edit3 size={16} className="text-gray-400" />
          </div>
          <p className="text-white font-medium">{profile.name}</p>
        </div>

        {/* Department & Year */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">Department</label>
              <Edit3 size={16} className="text-gray-400" />
            </div>
            <p className="text-white font-medium">{profile.department}</p>
          </div>
          
          <div className="bg-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">Year</label>
              <Edit3 size={16} className="text-gray-400" />
            </div>
            <p className="text-white font-medium">{profile.year}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-400">Bio</label>
            <Edit3 size={16} className="text-gray-400" />
          </div>
          <p className="text-white">{profile.bio}</p>
        </div>

        {/* Tags */}
        <div className="bg-gray-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-400">Interests</label>
            <Edit3 size={16} className="text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-red-500/20 text-red-300 text-sm rounded-full border border-red-500/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 rounded-2xl hover:shadow-lg transition-all duration-200">
            Edit Profile
          </button>
          
          <button className="w-full bg-gray-800 text-white font-semibold py-3 rounded-2xl hover:bg-gray-700 transition-colors">
            Account Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
