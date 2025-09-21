import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  generateReport,
  getUserReports,
  getReportById,
  downloadReport,
  deleteReport,
  getAllReports
} from '../controllers/reportController';
import { authenticate, authorize } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errorHandler';

const router = Router();

// Validation rules
const generateReportValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Report title must be between 3 and 100 characters'),
  body('type')
    .isIn(['monthly', 'quarterly', 'annual', 'custom'])
    .withMessage('Invalid report type'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('filters.cropType')
    .optional()
    .isIn(['vegetable', 'fruit', 'grain', 'legume', 'other'])
    .withMessage('Invalid crop type filter'),
  body('filters.marketDemand')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid market demand filter'),
  body('filters.location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location filter cannot exceed 100 characters'),
  body('filters.dateRange.start')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  body('filters.dateRange.end')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// All routes require authentication
router.use(authenticate);

// User report routes
router.post('/generate', generateReportValidation, handleValidationErrors, generateReport);
router.get('/my-reports', queryValidation, handleValidationErrors, getUserReports);
router.get('/:id', getReportById);
router.post('/:id/download', downloadReport);
router.delete('/:id', deleteReport);

// Admin routes
router.get('/', authorize('admin'), queryValidation, handleValidationErrors, getAllReports);

export default router;
