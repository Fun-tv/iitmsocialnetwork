
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

// Simplified roll number validation - just check if it's not empty and has reasonable length
export const validateRollNumber = (rollNumber: string): boolean => {
  if (!rollNumber || rollNumber.trim().length < 3) return false;
  
  // Very basic validation - just ensure it's alphanumeric and reasonable length
  const basicPattern = /^[A-Za-z0-9]+$/;
  return basicPattern.test(rollNumber.replace(/\s/g, '')) && rollNumber.length <= 20;
};
