import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  addYieldData,
  addPrediction,
  getCropAnalytics,
  getMarketOverview
} from '../controllers/cropController';
import { authenticate, optionalAuth } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errorHandler';

const router = Router();

// Validation rules
const createCropValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Crop name must be between 2 and 50 characters'),
  body('type')
    .isIn(['vegetable', 'fruit', 'grain', 'legume', 'other'])
    .withMessage('Invalid crop type'),
  body('season')
    .isIn(['spring', 'summer', 'autumn', 'winter', 'year-round'])
    .withMessage('Invalid season'),
  body('plantingMonths')
    .isArray({ min: 1 })
    .withMessage('At least one planting month is required'),
  body('plantingMonths.*')
    .isInt({ min: 1, max: 12 })
    .withMessage('Planting months must be between 1 and 12'),
  body('harvestMonths')
    .isArray({ min: 1 })
    .withMessage('At least one harvest month is required'),
  body('harvestMonths.*')
    .isInt({ min: 1, max: 12 })
    .withMessage('Harvest months must be between 1 and 12'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('variety')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Variety cannot exceed 100 characters'),
  body('marketDemand')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid market demand level'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level'),
  body('waterRequirement')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid water requirement level')
];

const updateCropValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Crop name must be between 2 and 50 characters'),
  body('type')
    .optional()
    .isIn(['vegetable', 'fruit', 'grain', 'legume', 'other'])
    .withMessage('Invalid crop type'),
  body('season')
    .optional()
    .isIn(['spring', 'summer', 'autumn', 'winter', 'year-round'])
    .withMessage('Invalid season'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('variety')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Variety cannot exceed 100 characters'),
  body('marketDemand')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid market demand level'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level'),
  body('waterRequirement')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid water requirement level')
];

const yieldDataValidation = [
  body('year')
    .isInt({ min: 2020, max: 2030 })
    .withMessage('Year must be between 2020 and 2030'),
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  body('yield')
    .isFloat({ min: 0 })
    .withMessage('Yield must be a positive number'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('demand')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Demand must be between 0 and 100'),
  body('weatherScore')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Weather score must be between 0 and 10'),
  body('soilScore')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Soil score must be between 0 and 10')
];

const predictionValidation = [
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('predictedYield')
    .isFloat({ min: 0 })
    .withMessage('Predicted yield must be a positive number'),
  body('predictedPrice')
    .isFloat({ min: 0 })
    .withMessage('Predicted price must be a positive number'),
  body('confidence')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Confidence must be between 0 and 100'),
  body('factors.weather')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Weather factor must be between 0 and 10'),
  body('factors.market')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Market factor must be between 0 and 10'),
  body('factors.historical')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Historical factor must be between 0 and 10')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('type')
    .optional()
    .isIn(['vegetable', 'fruit', 'grain', 'legume', 'other'])
    .withMessage('Invalid crop type filter'),
  query('season')
    .optional()
    .isIn(['spring', 'summer', 'autumn', 'winter', 'year-round'])
    .withMessage('Invalid season filter'),
  query('marketDemand')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid market demand filter'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters')
];

// Public routes (optional authentication for market overview)
router.get('/market-overview', optionalAuth, getMarketOverview);

// Protected routes (require authentication)
router.use(authenticate);

// Query validation for all GET routes
router.get('/', queryValidation, handleValidationErrors, getAllCrops);
router.get('/analytics/:id', getCropAnalytics);

// CRUD operations
router.post('/', createCropValidation, handleValidationErrors, createCrop);
router.get('/:id', getCropById);
router.put('/:id', updateCropValidation, handleValidationErrors, updateCrop);
router.delete('/:id', deleteCrop);

// Data operations
router.post('/:id/yield-data', yieldDataValidation, handleValidationErrors, addYieldData);
router.post('/:id/predictions', predictionValidation, handleValidationErrors, addPrediction);

export default router;
