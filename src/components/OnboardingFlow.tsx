import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Sparkles, Heart, Users, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OnboardingFlow = () => {
  const { user } = useAuth();
  const { profile, updateProfile, updateOnboardingProgress } = useProfile();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    department: '',
    academic_year: '',
    roll_number: '',
    bio: '',
    interests: [] as string[],
    profile_picture_url: ''
  });
  const [availableInterests] = useState([
    'Sports', 'Music', 'Movies', 'Reading', 'Gaming', 'Travel', 'Cooking', 'Art', 
    'Photography', 'Dancing', 'Fitness', 'Technology', 'Science', 'Literature',
    'Anime', 'Manga', 'Comedy', 'Adventure', 'Romance', 'Thriller'
  ]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        department: profile.department || '',
        academic_year: profile.academic_year || '',
        roll_number: profile.roll_number || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
        profile_picture_url: profile.profile_picture_url || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      if (prev.interests.includes(interest)) {
        return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...prev.interests, interest] };
      }
    });
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-4">
      <Input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleInputChange}
        className="bg-gray-700 text-white"
      />
      <Input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleInputChange}
        className="bg-gray-700 text-white"
      />
      <Select onValueChange={(value) => handleSelectChange('gender', value)}>
        <SelectTrigger className="bg-gray-700 text-white w-full">
          <SelectValue placeholder="Select Gender" defaultValue={formData.gender} />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white">
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={nextStep} className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
        Next: Academic Details
      </Button>
    </div>
  );

  const renderAcademicStep = () => (
    <div className="space-y-4">
      <Input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleInputChange}
        className="bg-gray-700 text-white"
      />
      <Select onValueChange={(value) => handleSelectChange('academic_year', value)}>
        <SelectTrigger className="bg-gray-700 text-white w-full">
          <SelectValue placeholder="Select Academic Year" defaultValue={formData.academic_year} />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white">
          <SelectItem value="1st_year">1st Year</SelectItem>
          <SelectItem value="2nd_year">2nd Year</SelectItem>
          <SelectItem value="3rd_year">3rd Year</SelectItem>
          <SelectItem value="4th_year">4th Year</SelectItem>
          <SelectItem value="mtech">MTech</SelectItem>
          <SelectItem value="phd">PhD</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        name="roll_number"
        placeholder="Roll Number"
        value={formData.roll_number}
        onChange={handleInputChange}
        className="bg-gray-700 text-white"
      />
      <div className="flex justify-between">
        <Button onClick={prevStep} variant="outline" className="text-white">
          Previous
        </Button>
        <Button onClick={nextStep} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
          Next: About You
        </Button>
      </div>
    </div>
  );

  const renderBioStep = () => (
    <div className="space-y-4">
      <Textarea
        name="bio"
        placeholder="Write a short bio about yourself"
        value={formData.bio}
        onChange={handleInputChange}
        className="bg-gray-700 text-white"
      />
      <Input
        type="text"
        name="profile_picture_url"
        placeholder="Profile Picture URL"
        value={formData.profile_picture_url}
        onChange={handleInputChange}
        className="bg-gray-700 text-white"
      />
      <div className="flex justify-between">
        <Button onClick={prevStep} variant="outline" className="text-white">
          Previous
        </Button>
        <Button onClick={nextStep} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
          Next: Interests
        </Button>
      </div>
    </div>
  );

  const renderInterestsStep = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {availableInterests.map((interest) => (
          <Badge
            key={interest}
            variant={formData.interests.includes(interest) ? "default" : "secondary"}
            onClick={() => handleInterestToggle(interest)}
            className={`cursor-pointer ${formData.interests.includes(interest) ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {interest}
          </Badge>
        ))}
      </div>
      <div className="flex justify-between">
        <Button onClick={prevStep} variant="outline" className="text-white">
          Previous
        </Button>
        <Button onClick={completeOnboarding} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
          Complete Onboarding
        </Button>
      </div>
    </div>
  );

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      console.log('Completing onboarding for user:', user.id);
      
      // First, ensure profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Prepare complete profile data
      const profileData = {
        id: user.id,
        email: user.email || '',
        full_name: formData.full_name,
        age: parseInt(formData.age),
        gender: formData.gender as any,
        department: formData.department,
        academic_year: formData.academic_year as any,
        bio: formData.bio,
        interests: formData.interests,
        roll_number: formData.roll_number,
        profile_picture_url: formData.profile_picture_url,
        is_profile_complete: true,
        verification_status: 'pending' as const
      };

      console.log('Creating/updating profile with data:', profileData);

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (insertError) {
          console.error('Error inserting profile:', insertError);
          throw insertError;
        }
      }

      // Update onboarding progress
      const { error: onboardingError } = await supabase
        .from('onboarding_progress')
        .update({ 
          step_completed: 4,
          steps_data: formData,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (onboardingError) {
        console.error('Error updating onboarding progress:', onboardingError);
        throw onboardingError;
      }

      // Verify the profile was created successfully
      const { data: verificationData, error: verificationError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (verificationError || !verificationData) {
        console.error('Profile verification failed:', verificationError);
        throw new Error('Profile creation verification failed');
      }

      console.log('Profile successfully verified:', verificationData);

      toast({
        title: '🎉 Welcome to IITM Social Network!',
        description: 'Your profile is complete! You can now discover and connect with other students.',
      });

      // Force a complete refresh to ensure proper navigation
      setTimeout(() => {
        console.log('Profile setup complete, redirecting to main app...');
        window.location.href = '/';
      }, 1500);

    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Setup Error',
        description: 'Failed to complete profile setup. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {currentStep < 4 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <Heart className="text-white" size={32} />
                </div>
              </div>
              <CardTitle className="text-2xl text-white">
                {currentStep === 0 && 'Personal Information'}
                {currentStep === 1 && 'Academic Details'}
                {currentStep === 2 && 'Tell Us About Yourself'}
                {currentStep === 3 && 'Your Interests'}
              </CardTitle>
              <div className="flex justify-center space-x-2 mt-4">
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step <= currentStep ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 0 && renderPersonalInfoStep()}
              {currentStep === 1 && renderAcademicStep()}
              {currentStep === 2 && renderBioStep()}
              {currentStep === 3 && renderInterestsStep()}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Sparkles size={48} className="text-yellow-400 mx-auto mb-4" />
              </div>
              <CardTitle className="text-2xl text-white">You're All Set!</CardTitle>
              <p className="text-gray-300">Welcome to IITM Social Network</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                  <Users className="text-red-400" size={24} />
                  <div>
                    <h3 className="text-white font-semibold">Discover Students</h3>
                    <p className="text-gray-400 text-sm">Find and connect with fellow IITM students</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                  <Heart className="text-pink-400" size={24} />
                  <div>
                    <h3 className="text-white font-semibold">Make Connections</h3>
                    <p className="text-gray-400 text-sm">Like profiles and get matched with compatible students</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                  <MessageCircle className="text-blue-400" size={24} />
                  <div>
                    <h3 className="text-white font-semibold">Start Conversations</h3>
                    <p className="text-gray-400 text-sm">Chat with your matches and build meaningful relationships</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={completeOnboarding}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3"
              >
                Start Connecting! 🚀
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
