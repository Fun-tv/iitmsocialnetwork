
import { supabase } from '@/integrations/supabase/client';

export const createTestProfiles = async () => {
  try {
    console.log('Creating test profiles for discovery...');
    
    const testProfiles = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'alex.student@iitm.ac.in',
        full_name: 'Alex Kumar',
        age: 22,
        gender: 'male',
        department: 'Computer Science',
        academic_year: '3rd_year',
        bio: 'Love coding, gaming, and exploring new technologies. Always up for interesting conversations!',
        interests: ['Programming', 'Gaming', 'Tech', 'Movies'],
        is_profile_complete: true,
        verification_status: 'verified'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'priya.sharma@iitm.ac.in',
        full_name: 'Priya Sharma',
        age: 21,
        gender: 'female',
        department: 'Electrical Engineering',
        academic_year: '2nd_year',
        bio: 'Passionate about renewable energy and sustainable technology. Love music and dance!',
        interests: ['Engineering', 'Music', 'Dance', 'Environment'],
        is_profile_complete: true,
        verification_status: 'verified'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'raj.patel@iitm.ac.in',
        full_name: 'Raj Patel',
        age: 23,
        gender: 'male',
        department: 'Mechanical Engineering',
        academic_year: '4th_year',
        bio: 'Future entrepreneur with a passion for innovation. Love sports and traveling.',
        interests: ['Innovation', 'Sports', 'Travel', 'Business'],
        is_profile_complete: true,
        verification_status: 'verified'
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'sara.khan@iitm.ac.in',
        full_name: 'Sara Khan',
        age: 20,
        gender: 'female',
        department: 'Chemistry',
        academic_year: '1st_year',
        bio: 'Curious about the world around us. Love reading, painting, and philosophical discussions.',
        interests: ['Science', 'Art', 'Reading', 'Philosophy'],
        is_profile_complete: true,
        verification_status: 'verified'
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'jamie.lee@iitm.ac.in',
        full_name: 'Jamie Lee',
        age: 22,
        gender: 'other',
        department: 'Mathematics',
        academic_year: '3rd_year',
        bio: 'Math enthusiast who sees beauty in numbers. Love photography and nature walks.',
        interests: ['Mathematics', 'Photography', 'Nature', 'Hiking'],
        is_profile_complete: true,
        verification_status: 'verified'
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        email: 'arjun.singh@iitm.ac.in',
        full_name: 'Arjun Singh',
        age: 24,
        gender: 'male',
        department: 'Physics',
        academic_year: 'phd',
        bio: 'PhD student exploring quantum mechanics. Love astronomy and deep conversations about the universe.',
        interests: ['Physics', 'Astronomy', 'Research', 'Science Fiction'],
        is_profile_complete: true,
        verification_status: 'verified'
      }
    ];

    const { data, error } = await supabase
      .from('profiles')
      .upsert(testProfiles, { onConflict: 'id' });

    if (error) {
      console.error('Error creating test profiles:', error);
      return false;
    }

    console.log('Test profiles created successfully:', data);
    return true;
  } catch (error) {
    console.error('Error in createTestProfiles:', error);
    return false;
  }
};
