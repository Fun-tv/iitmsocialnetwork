
import React, { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { validateRollNumber } from '@/utils/validation';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const OnboardingFlow = () => {
  const { profile, onboardingProgress, updateProfile, updateOnboardingProgress } = useProfile();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    full_name: '',
    gender: '',
    age: '',
    department: '',
    academic_year: '',
    roll_number: '',
    bio: '',
    interests: [] as string[],
  });

  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (onboardingProgress) {
      setCurrentStep(onboardingProgress.step_completed);
    }
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        gender: profile.gender || '',
        age: profile.age?.toString() || '',
        department: profile.department || '',
        academic_year: profile.academic_year || '',
        roll_number: profile.roll_number || '',
        bio: profile.bio || '',
        interests: profile.interests || [],
      });
    }
  }, [profile, onboardingProgress]);

  const steps = [
    { title: 'Personal Info', description: 'Tell us about yourself' },
    { title: 'Academic Details', description: 'Your IITM academic information' },
    { title: 'Profile & Interests', description: 'Complete your profile' },
    { title: 'Welcome!', description: 'You\'re all set!' },
  ];

  const handleNext = async () => {
    setLoading(true);
    try {
      let isValid = true;
      let updateData = {};

      switch (currentStep) {
        case 0:
          if (!formData.full_name || !formData.gender || !formData.age) {
            toast({
              title: 'Required Fields',
              description: 'Please fill in all required fields',
              variant: 'destructive',
            });
            isValid = false;
          } else if (parseInt(formData.age) < 16 || parseInt(formData.age) > 100) {
            toast({
              title: 'Invalid Age',
              description: 'Please enter a valid age between 16 and 100',
              variant: 'destructive',
            });
            isValid = false;
          } else {
            updateData = {
              full_name: formData.full_name,
              gender: formData.gender as any,
              age: parseInt(formData.age),
            };
          }
          break;

        case 1:
          if (!formData.department || !formData.academic_year || !formData.roll_number) {
            toast({
              title: 'Required Fields',
              description: 'Please fill in all academic details',
              variant: 'destructive',
            });
            isValid = false;
          } else if (!validateRollNumber(formData.roll_number, formData.academic_year)) {
            toast({
              title: 'Invalid Roll Number',
              description: 'Please enter a valid IITM roll number',
              variant: 'destructive',
            });
            isValid = false;
          } else {
            updateData = {
              department: formData.department,
              academic_year: formData.academic_year as any,
              roll_number: formData.roll_number.toUpperCase(),
            };
          }
          break;

        case 2:
          if (!formData.bio || formData.interests.length === 0) {
            toast({
              title: 'Required Fields',
              description: 'Please add a bio and at least one interest',
              variant: 'destructive',
            });
            isValid = false;
          } else {
            updateData = {
              bio: formData.bio,
              interests: formData.interests,
              is_profile_complete: true,
            };
          }
          break;
      }

      if (isValid) {
        if (Object.keys(updateData).length > 0) {
          const { error } = await updateProfile(updateData);
          if (error) {
            toast({
              title: 'Update Failed',
              description: error.message,
              variant: 'destructive',
            });
            return;
          }
        }

        const { error: progressError } = await updateOnboardingProgress(currentStep + 1, formData);
        if (progressError) {
          toast({
            title: 'Progress Update Failed',
            description: progressError.message,
            variant: 'destructive',
          });
          return;
        }

        setCurrentStep(currentStep + 1);
        toast({
          title: 'Progress Saved',
          description: `Step ${currentStep + 1} completed successfully!`,
        });
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest),
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name" className="text-gray-300">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="gender" className="text-gray-300">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
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

            <div>
              <Label htmlFor="age" className="text-gray-300">Age *</Label>
              <Input
                id="age"
                type="number"
                min="16"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter your age"
                required
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="department" className="text-gray-300">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Computer Science and Engineering"
                required
              />
            </div>

            <div>
              <Label htmlFor="academic_year" className="text-gray-300">Academic Year *</Label>
              <Select value={formData.academic_year} onValueChange={(value) => setFormData({...formData, academic_year: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select your academic year" />
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
              <Label htmlFor="roll_number" className="text-gray-300">Roll Number *</Label>
              <Input
                id="roll_number"
                value={formData.roll_number}
                onChange={(e) => setFormData({...formData, roll_number: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., CS21B1001"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bio" className="text-gray-300">Bio *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Tell others about yourself, your hobbies, what you're looking for..."
                rows={4}
                required
              />
            </div>

            <div>
              <Label className="text-gray-300">Interests *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Add an interest"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                />
                <Button type="button" onClick={addInterest} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-red-500/20 text-red-300 border-red-500/30 cursor-pointer"
                    onClick={() => removeInterest(interest)}
                  >
                    {interest} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Welcome to IITM Social Network!</h3>
              <p className="text-gray-300">
                Your profile is complete and you're ready to start connecting with fellow IITM students.
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              Get Started
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      index < currentStep ? 'bg-red-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">{steps[currentStep]?.title}</CardTitle>
            <CardDescription className="text-gray-400">
              {steps[currentStep]?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
            
            {currentStep < 3 && (
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-gray-600 text-gray-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  {loading ? 'Saving...' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
