import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import User, { IUser } from '../models/User';
import { generateToken } from '../middlewares/auth';
import { AppError, catchAsync } from '../middlewares/errorHandler';

/**
 * User Controller
 * Handles all user-related operations including authentication and profile management
 */

/**
 * Register a new user
 */
export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { name, email, password, role, farmSize, experience, location, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create new user
  const user = new User({
    name,
    email,
    password,
    role: role || 'farmer',
    farmSize,
    experience,
    location,
    phone
  });

  await user.save();

  // Generate JWT token
  const token = generateToken((user._id as any).toString());

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: (user as any).profile,
      token
    }
  });
});

/**
 * Login user
 */
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated. Please contact support.'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Generate JWT token
  const token = generateToken((user._id as any).toString());

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: (user as any).profile,
      token
    }
  });
});

/**
 * Get current user profile
 */
export const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUser;

  res.json({
    success: true,
    data: {
      user: (req.user as any).profile
    }
  });
});

/**
 * Update user profile
 */
export const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = req.user as IUser;
  const { name, farmSize, experience, location, phone } = req.body;

  // Update user fields
  if (name) user.name = name;
  if (farmSize) user.farmSize = farmSize;
  if (experience) user.experience = experience;
  if (location) user.location = location;
  if (phone) user.phone = phone;

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: (user as any).profile
    }
  });
});

/**
 * Change password
 */
export const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = req.user as IUser;
  const { currentPassword, newPassword } = req.body;

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * Get all users (Admin only)
 */
export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

/**
 * Get user by ID (Admin only)
 */
export const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: {
      user
    }
  });
});

/**
 * Update user status (Admin only)
 */
export const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.isActive = isActive;
  await user.save();

  res.json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: {
      user: (user as any).profile
    }
  });
});

/**
 * Delete user (Admin only)
 */
export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  await User.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

export default {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser
};
