
export const validateIITMEmail = (email: string): boolean => {
  const iitmDomains = [
    '@smail.iitm.ac.in',
    '@ds.study.iitm.ac.in',
    '@research.iitm.ac.in',
    '@iitm.ac.in',
  ];
  
  return iitmDomains.some(domain => email.toLowerCase().endsWith(domain));
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRollNumber = (rollNumber: string, academicYear: string): boolean => {
  if (!rollNumber || rollNumber.length < 6) return false;
  
  // Basic validation - can be enhanced based on IITM roll number patterns
  const rollPattern = /^[A-Z]{2}\d{2}[A-Z]\d{3}$/i;
  return rollPattern.test(rollNumber.replace(/\s/g, ''));
};
