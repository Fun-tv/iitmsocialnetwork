
import { z } from 'zod';

// Email validation that supports both domains
const emailSchema = z.string().email().refine(
  (email) => email.endsWith('@ds.study.iitm.ac.in') || email.endsWith('@es.study.iitm.ac.in'),
  {
    message: 'Please use your IIT Madras email (@ds.study.iitm.ac.in or @es.study.iitm.ac.in)',
  }
);

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),
  age: z.number().min(18, 'Must be at least 18 years old').max(100, 'Age must be realistic'),
  department: z.string().min(2, 'Department is required'),
  academic_year: z.enum(['1st_year', '2nd_year', '3rd_year', '4th_year', 'mtech', 'phd', 'other']),
  roll_number: z.string().min(3, 'Roll number is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio must be less than 500 characters'),
  interests: z.array(z.string()).min(1, 'Select at least one interest').max(10, 'Maximum 10 interests allowed'),
});

export const authSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type AuthFormData = z.infer<typeof authSchema>;
