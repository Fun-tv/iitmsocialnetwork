import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Heart, MessageCircle, Users, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OnboardingFlow = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    department: '',
    academic_year: '',
    gender: '',
    bio: '',
    interests: [] as string[],
    roll_number: '',
    profile_picture_url: ''
  });

  const [availableInterests] = useState([
    'Technology', 'Sports', 'Music', 'Art', 'Reading', 'Gaming', 'Movies', 'Travel',
    'Photography', 'Cooking', 'Dancing', 'Fitness', 'Science', 'Fashion', 'Nature',
    'Programming', 'Design', 'Writing', 'Languages', 'Volunteering'
  ]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        age: profile.age?.toString() || '',
        department: profile.department || '',
        academic_year: profile.academic_year || '',
        gender: profile.gender || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
        roll_number: profile.roll_number || '',
        profile_picture_url: profile.profile_picture_url || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addInterest = (interest: string) => {
    if (!formData.interests.includes(interest) && formData.interests.length < 10) {
      handleInputChange('interests', [...formData.interests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    handleInputChange('interests', formData.interests.filter(i => i !== interest));
  };

  const nextStep = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      // Update profile with all form data
      const profileData = {
        full_name: formData.full_name,
        age: parseInt(formData.age),
        department: formData.department,
        academic_year: formData.academic_year,
        gender: formData.gender,
        bio: formData.bio,
        interests: formData.interests,
        roll_number: formData.roll_number,
        profile_picture_url: formData.profile_picture_url,
        is_profile_complete: true
      };

      await updateProfile(profileData);

      // Mark onboarding as complete (step 4)
      await supabase
        .from('onboarding_progress')
        .update({ 
          step_completed: 4,
          completed_at: new Date().toISOString(),
          steps_data: formData
        })
        .eq('user_id', user.id);

      toast({
        title: '🎉 Welcome to UniConnect!',
        description: 'Your profile is complete. Start discovering amazing people!',
      });

      // Force page reload to trigger proper navigation
      window.location.reload();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.full_name && formData.age && formData.department && formData.academic_year;
      case 2:
        return formData.gender && formData.roll_number;
      case 3:
        return formData.bio && formData.interests.length >= 3;
      case 4:
        return true; // Final step - always valid
      default:
        return false;
    }
  };

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Basic Information</CardTitle>
            <p className="text-gray-300">Tell us about yourself</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-white">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-white">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                placeholder="Enter your age"
                min="18"
                max="30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-white">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                placeholder="e.g., Computer Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year" className="text-white">Academic Year</Label>
              <Select value={formData.academic_year} onValueChange={(value) => handleInputChange('academic_year', value)}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Select your year" />
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

            <Button 
              onClick={nextStep} 
              disabled={!validateStep()}
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Personal Details</CardTitle>
            <p className="text-gray-300">Help others know you better</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-white">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roll_number" className="text-white">Roll Number</Label>
              <Input
                id="roll_number"
                value={formData.roll_number}
                onChange={(e) => handleInputChange('roll_number', e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                placeholder="Enter your roll number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile_picture" className="text-white">Profile Picture URL (Optional)</Label>
              <Input
                id="profile_picture"
                value={formData.profile_picture_url}
                onChange={(e) => handleInputChange('profile_picture_url', e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                placeholder="Enter image URL"
              />
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={prevStep} 
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/20"
              >
                Back
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={!validateStep()}
                className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">About You</CardTitle>
            <p className="text-gray-300">Share your story and interests</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-gray-300"
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Interests (Select at least 3)</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {availableInterests.map((interest) => (
                  <Button
                    key={interest}
                    variant={formData.interests.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      formData.interests.includes(interest) 
                        ? removeInterest(interest)
                        : addInterest(interest)
                    }
                    className={
                      formData.interests.includes(interest)
                        ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white"
                        : "border-white/30 text-white hover:bg-white/20"
                    }
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="bg-white/20 text-white">
                  {interest}
                  <X 
                    size={14} 
                    className="ml-1 cursor-pointer" 
                    onClick={() => removeInterest(interest)}
                  />
                </Badge>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={prevStep} 
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/20"
              >
                Back
              </Button>
              <Button 
                onClick={nextStep} 
                disabled={!validateStep()}
                className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <div className="mb-4">
              <Sparkles size={48} className="text-yellow-400 mx-auto mb-4" />
            </div>
            <CardTitle className="text-2xl text-white">You're All Set!</CardTitle>
            <p className="text-gray-300">Welcome to UniConnect</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white">
                <Heart className="text-red-400" size={20} />
                <span>Discover amazing people in your university</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <Users className="text-blue-400" size={20} />
                <span>Connect with students who share your interests</span>
              </div>
              <div className="flex items-center space-x-3 text-white">
                <MessageCircle className="text-green-400" size={20} />
                <span>Start meaningful conversations</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={completeOnboarding}
                className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-lg py-3"
              >
                Get Started 🚀
              </Button>
              <Button 
                onClick={prevStep} 
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/20"
              >
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default OnboardingFlow;
