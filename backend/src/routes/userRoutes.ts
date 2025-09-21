import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser
} from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errorHandler';

const router = Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['farmer', 'admin', 'analyst'])
    .withMessage('Role must be farmer, admin, or analyst'),
  body('farmSize')
    .optional()
    .isIn(['1-2 acres', '3-5 acres', '5 acres', '10+ acres'])
    .withMessage('Invalid farm size'),
  body('experience')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Experienced', 'Expert'])
    .withMessage('Invalid experience level'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('farmSize')
    .optional()
    .isIn(['1-2 acres', '3-5 acres', '5 acres', '10+ acres'])
    .withMessage('Invalid farm size'),
  body('experience')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Experienced', 'Expert'])
    .withMessage('Invalid experience level'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Public routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);

// Protected routes (require authentication)
router.use(authenticate); // All routes below require authentication

router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, handleValidationErrors, updateProfile);
router.put('/change-password', changePasswordValidation, handleValidationErrors, changePassword);

// Admin routes
router.get('/users', authorize('admin'), getAllUsers);
router.get('/users/:id', authorize('admin'), getUserById);
router.put('/users/:id/status', authorize('admin'), updateUserStatus);
router.delete('/users/:id', authorize('admin'), deleteUser);

export default router;
