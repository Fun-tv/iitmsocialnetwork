
import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string) => void;
}

const ProfileImageUpload = ({ currentImageUrl, onImageUpdate }: ProfileImageUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5242880) {
      toast({
        title: 'File Too Large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: 'Upload Failed',
          description: 'Failed to upload image. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Update the profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        toast({
          title: 'Update Failed',
          description: 'Failed to update profile. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      onImageUpdate(publicUrl);
      setPreviewUrl(publicUrl);
      toast({
        title: 'Success!',
        description: 'Profile image updated successfully',
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    if (!user) return;

    try {
      // Update profile to remove image URL
      const { error } = await supabase
        .from('profiles')
        .update({ profile_picture_url: null })
        .eq('id', user.id);

      if (error) {
        console.error('Error removing image:', error);
        toast({
          title: 'Error',
          description: 'Failed to remove image',
          variant: 'destructive',
        });
        return;
      }

      onImageUpdate('');
      setPreviewUrl(null);
      toast({
        title: 'Image Removed',
        description: 'Profile image has been removed',
      });
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          {displayImageUrl ? (
            <img 
              src={displayImageUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera size={40} className="text-gray-400" />
          )}
        </div>
        
        {displayImageUrl && (
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex space-x-2">
        <label htmlFor="profile-image-input">
          <Button 
            disabled={uploading}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            asChild
          >
            <span className="cursor-pointer flex items-center space-x-2">
              <Upload size={16} />
              <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            </span>
          </Button>
        </label>
        
        <input
          id="profile-image-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default ProfileImageUpload;
