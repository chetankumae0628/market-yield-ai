import bcrypt from 'bcryptjs';

/**
 * Password hashing and verification utilities
 * Provides secure password handling using bcrypt
 */

const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise<boolean> - True if passwords match
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password cannot exceed 128 characters' };
  }

  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasLetter) {
    return { isValid: false, message: 'Password must contain at least one letter' };
  }

  if (!hasNumber) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  return { isValid: true, message: 'Password is valid' };
};

export default {
  hashPassword,
  comparePassword,
  validatePasswordStrength
};
