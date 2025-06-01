
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

export const createTestProfiles = async () => {
  try {
    console.log('Creating test profiles for discovery...');
    
    // First, check if profiles already exist to avoid duplicates
    const { data: existingProfiles, error: checkError } = await supabase
      .from('profiles')
      .select('id, full_name, verification_status')
      .in('id', [
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444',
        '55555555-5555-5555-5555-555555555555',
        '66666666-6666-6666-6666-666666666666',
        '77777777-7777-7777-7777-777777777777',
        '88888888-8888-8888-8888-888888888888'
      ]);

    if (checkError) {
      console.error('Error checking existing profiles:', checkError);
    }

    console.log('Existing test profiles found:', existingProfiles?.length || 0);
    
    // If we already have test profiles, just verify existing profiles are complete
    if (existingProfiles && existingProfiles.length > 0) {
      console.log('Test profiles already exist, ensuring they are complete and verified...');
      
      // Update existing profiles to be verified and complete
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          verification_status: 'verified',
          is_profile_complete: true 
        })
        .in('id', existingProfiles.map(p => p.id));

      if (updateError) {
        console.error('Error updating existing profiles:', updateError);
        return false;
      }

      console.log('Updated existing profiles to verified and complete status');
      return true;
    }
    
    const testProfiles: ProfileInsert[] = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'alex.student@iitm.ac.in',
        full_name: 'Alex Kumar',
        age: 22,
        gender: 'male',
        department: 'Computer Science',
        academic_year: '3rd_year',
        bio: 'Love coding, gaming, and exploring new technologies. Always up for interesting conversations about AI and machine learning!',
        interests: ['Programming', 'Gaming', 'AI/ML', 'Movies', 'Tech'],
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
        bio: 'Passionate about renewable energy and sustainable technology. Love music, dance, and making a positive impact!',
        interests: ['Engineering', 'Music', 'Dance', 'Environment', 'Sustainability'],
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
        bio: 'Future entrepreneur with a passion for innovation. Love sports, traveling, and building cool things that matter.',
        interests: ['Innovation', 'Sports', 'Travel', 'Business', 'Startups'],
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
        bio: 'Curious about the world around us. Love reading, painting, philosophical discussions, and discovering new perspectives.',
        interests: ['Science', 'Art', 'Reading', 'Philosophy', 'Painting'],
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
        bio: 'Math enthusiast who sees beauty in numbers. Love photography, nature walks, and capturing perfect moments.',
        interests: ['Mathematics', 'Photography', 'Nature', 'Hiking', 'Art'],
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
        bio: 'PhD student exploring quantum mechanics. Love astronomy, deep conversations about the universe, and sci-fi.',
        interests: ['Physics', 'Astronomy', 'Research', 'Science Fiction', 'Space'],
        is_profile_complete: true,
        verification_status: 'verified'
      },
      {
        id: '77777777-7777-7777-7777-777777777777',
        email: 'maya.reddy@iitm.ac.in',
        full_name: 'Maya Reddy',
        age: 21,
        gender: 'female',
        department: 'Civil Engineering',
        academic_year: '2nd_year',
        bio: 'Building the future, one structure at a time. Love architecture, sustainable design, and creating beautiful spaces.',
        interests: ['Engineering', 'Architecture', 'Sustainability', 'Design', 'Art'],
        is_profile_complete: true,
        verification_status: 'verified'
      },
      {
        id: '88888888-8888-8888-8888-888888888888',
        email: 'rohit.gupta@iitm.ac.in',
        full_name: 'Rohit Gupta',
        age: 23,
        gender: 'male',
        department: 'Biotechnology',
        academic_year: '4th_year',
        bio: 'Exploring the intersection of biology and technology. Passionate about research, innovation, and improving healthcare.',
        interests: ['Biotechnology', 'Research', 'Innovation', 'Health', 'Medicine'],
        is_profile_complete: true,
        verification_status: 'verified'
      }
    ];

    console.log('Attempting to insert test profiles...');
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert(testProfiles, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select();

    if (error) {
      console.error('Error creating test profiles:', error);
      
      // Try to create profiles one by one if batch insert fails
      console.log('Attempting individual profile creation...');
      let successCount = 0;
      
      for (const profile of testProfiles) {
        try {
          const { error: individualError } = await supabase
            .from('profiles')
            .upsert(profile, { onConflict: 'id' });
          
          if (!individualError) {
            successCount++;
            console.log(`Successfully created/updated profile: ${profile.full_name}`);
          } else {
            console.error(`Error creating profile ${profile.full_name}:`, individualError);
          }
        } catch (err) {
          console.error(`Exception creating profile ${profile.full_name}:`, err);
        }
      }
      
      console.log(`Successfully created/updated ${successCount} of ${testProfiles.length} profiles`);
      return successCount > 0;
    }

    console.log('Test profiles created/updated successfully:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('Error in createTestProfiles:', error);
    return false;
  }
};
