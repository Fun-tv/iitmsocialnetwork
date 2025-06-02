
import React, { useState, useEffect } from 'react';
import { Settings, Edit3, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import ProfileImageUpload from './ProfileImageUpload';

const ProfileTab = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    department: '',
    academic_year: '',
    bio: '',
    interests: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        department: profile.department || '',
        academic_year: profile.academic_year || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        age: parseInt(formData.age),
        department: formData.department,
        academic_year: formData.academic_year as any,
        bio: formData.bio,
        interests: formData.interests,
      });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive',
        });
        return;
      }

      setIsEditing(false);
      toast({
        title: 'Success!',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpdate = (imageUrl: string) => {
    // The ProfileImageUpload component handles the database update
    // This callback is just for UI updates if needed
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        <Button
          onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          {isEditing ? <X size={20} /> : <Edit3 size={20} />}
        </Button>
      </div>

      {/* Profile Image */}
      <div className="flex justify-center">
        <ProfileImageUpload 
          currentImageUrl={profile.profile_picture_url || ''}
          onImageUpdate={handleImageUpdate}
        />
      </div>

      {/* Profile Info */}
      <div className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Academic Year</label>
              <Select value={formData.academic_year} onValueChange={(value) => setFormData(prev => ({ ...prev, academic_year: value }))}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st_year">1st Year</SelectItem>
                  <SelectItem value="2nd_year">2nd Year</SelectItem>
                  <SelectItem value="3rd_year">3rd Year</SelectItem>
                  <SelectItem value="4th_year">4th Year</SelectItem>
                  <SelectItem value="mtech">M.Tech</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                rows={4}
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              <Save size={20} className="mr-2" />
              Save Changes
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-2xl p-4">
              <h3 className="font-semibold text-white mb-2">Personal Information</h3>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-gray-400">Email:</span> {profile.email}</p>
                <p><span className="text-gray-400">Age:</span> {profile.age}</p>
                <p><span className="text-gray-400">Department:</span> {profile.department}</p>
                <p><span className="text-gray-400">Academic Year:</span> {profile.academic_year?.replace('_', ' ')}</p>
                {profile.roll_number && (
                  <p><span className="text-gray-400">Roll Number:</span> {profile.roll_number}</p>
                )}
              </div>
            </div>

            {profile.bio && (
              <div className="bg-gray-800 rounded-2xl p-4">
                <h3 className="font-semibold text-white mb-2">About Me</h3>
                <p className="text-gray-300">{profile.bio}</p>
              </div>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <div className="bg-gray-800 rounded-2xl p-4">
                <h3 className="font-semibold text-white mb-2">Interests</h3>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
