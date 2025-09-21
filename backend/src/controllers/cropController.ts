import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Crop, { ICrop, IYieldData, IPrediction } from '../models/Crop';
import { AppError, catchAsync } from '../middlewares/errorHandler';

/**
 * Crop Controller
 * Handles all crop-related operations including CRUD operations and analytics
 */

/**
 * Get all crops with optional filtering
 */
export const getAllCrops = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter: any = { isActive: true };
  
  if (req.query.type) filter.type = req.query.type;
  if (req.query.season) filter.season = req.query.season;
  if (req.query.marketDemand) filter.marketDemand = req.query.marketDemand;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const crops = await Crop.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Crop.countDocuments(filter);

  res.json({
    success: true,
    data: {
      crops,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

/**
 * Get crop by ID
 */
export const getCropById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const crop = await Crop.findById(id)
    .populate('createdBy', 'name email');
    
  if (!crop) {
    return res.status(404).json({
      success: false,
      message: 'Crop not found'
    });
  }

  res.json({
    success: true,
    data: {
      crop
    }
  });
});

/**
 * Create new crop
 */
export const createCrop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = req.user!;
  const cropData = {
    ...req.body,
    createdBy: user._id
  };

  const crop = new Crop(cropData);
  await crop.save();

  await crop.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Crop created successfully',
    data: {
      crop
    }
  });
});

/**
 * Update crop
 */
export const updateCrop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const user = req.user!;

  const crop = await Crop.findById(id);
  if (!crop) {
    return res.status(404).json({
      success: false,
      message: 'Crop not found'
    });
  }

  // Check if user is authorized to update (owner or admin)
  if (crop.createdBy.toString() !== (user._id as any).toString() && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this crop'
    });
  }

  Object.assign(crop, req.body);
  await crop.save();

  await crop.populate('createdBy', 'name email');

  res.json({
    success: true,
    message: 'Crop updated successfully',
    data: {
      crop
    }
  });
});

/**
 * Delete crop
 */
export const deleteCrop = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user!;

  const crop = await Crop.findById(id);
  if (!crop) {
    return res.status(404).json({
      success: false,
      message: 'Crop not found'
    });
  }

  // Check if user is authorized to delete (owner or admin)
  if (crop.createdBy.toString() !== (user._id as any).toString() && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this crop'
    });
  }

  await Crop.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Crop deleted successfully'
  });
});

/**
 * Add yield data to crop
 */
export const addYieldData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const user = req.user!;

  const crop = await Crop.findById(id);
  if (!crop) {
    return res.status(404).json({
      success: false,
      message: 'Crop not found'
    });
  }

  // Check if user is authorized (owner or admin)
  if (crop.createdBy.toString() !== (user._id as any).toString() && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to modify this crop'
    });
  }

  const yieldData: IYieldData = req.body;
  crop.yieldData.push(yieldData);
  await crop.save();

  res.json({
    success: true,
    message: 'Yield data added successfully',
    data: {
      crop
    }
  });
});

/**
 * Add prediction to crop
 */
export const addPrediction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const user = req.user!;

  const crop = await Crop.findById(id);
  if (!crop) {
    return res.status(404).json({
      success: false,
      message: 'Crop not found'
    });
  }

  // Check if user is authorized (owner or admin)
  if (crop.createdBy.toString() !== (user._id as any).toString() && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to modify this crop'
    });
  }

  const prediction: IPrediction = req.body;
  crop.predictions.push(prediction);
  await crop.save();

  res.json({
    success: true,
    message: 'Prediction added successfully',
    data: {
      crop
    }
  });
});

/**
 * Get crop analytics
 */
export const getCropAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const crop = await Crop.findById(id);
  if (!crop) {
    return res.status(404).json({
      success: false,
      message: 'Crop not found'
    });
  }

  // Calculate analytics
  const analytics = {
    basicStats: (crop as any).statistics,
    yieldTrend: calculateYieldTrend(crop.yieldData),
    priceTrend: calculatePriceTrend(crop.yieldData),
    demandTrend: calculateDemandTrend(crop.yieldData),
    seasonalAnalysis: calculateSeasonalAnalysis(crop.yieldData),
    predictions: crop.predictions.slice(-5) // Last 5 predictions
  };

  res.json({
    success: true,
    data: {
      analytics
    }
  });
});

/**
 * Get market overview analytics
 */
export const getMarketOverview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const crops = await Crop.find({ isActive: true });
  
  const overview = {
    totalCrops: crops.length,
    cropTypes: calculateCropTypeDistribution(crops),
    marketDemand: calculateMarketDemandDistribution(crops),
    topPerformingCrops: getTopPerformingCrops(crops),
    averageYields: calculateAverageYields(crops),
    priceRanges: calculatePriceRanges(crops)
  };

  res.json({
    success: true,
    data: {
      overview
    }
  });
});

// Helper functions for analytics
const calculateYieldTrend = (yieldData: IYieldData[]) => {
  if (yieldData.length < 2) return 'stable';
  
  const recent = yieldData.slice(-3);
  const older = yieldData.slice(0, 3);
  
  const recentAvg = recent.reduce((sum, data) => sum + data.yield, 0) / recent.length;
  const olderAvg = older.reduce((sum, data) => sum + data.yield, 0) / older.length;
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (change > 5) return 'increasing';
  if (change < -5) return 'decreasing';
  return 'stable';
};

const calculatePriceTrend = (yieldData: IYieldData[]) => {
  if (yieldData.length < 2) return 'stable';
  
  const recent = yieldData.slice(-3);
  const older = yieldData.slice(0, 3);
  
  const recentAvg = recent.reduce((sum, data) => sum + data.price, 0) / recent.length;
  const olderAvg = older.reduce((sum, data) => sum + data.price, 0) / older.length;
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (change > 5) return 'increasing';
  if (change < -5) return 'decreasing';
  return 'stable';
};

const calculateDemandTrend = (yieldData: IYieldData[]) => {
  if (yieldData.length < 2) return 'stable';
  
  const recent = yieldData.slice(-3);
  const older = yieldData.slice(0, 3);
  
  const recentAvg = recent.reduce((sum, data) => sum + data.demand, 0) / recent.length;
  const olderAvg = older.reduce((sum, data) => sum + data.demand, 0) / older.length;
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (change > 5) return 'increasing';
  if (change < -5) return 'decreasing';
  return 'stable';
};

const calculateSeasonalAnalysis = (yieldData: IYieldData[]) => {
  const seasonalData: { [key: number]: { yield: number[], price: number[], demand: number[] } } = {};
  
  yieldData.forEach(data => {
    if (!seasonalData[data.month]) {
      seasonalData[data.month] = { yield: [], price: [], demand: [] };
    }
    seasonalData[data.month].yield.push(data.yield);
    seasonalData[data.month].price.push(data.price);
    seasonalData[data.month].demand.push(data.demand);
  });

  const analysis: { [key: number]: { avgYield: number, avgPrice: number, avgDemand: number } } = {};
  
  Object.keys(seasonalData).forEach(month => {
    const monthNum = parseInt(month);
    const data = seasonalData[monthNum];
    
    analysis[monthNum] = {
      avgYield: data.yield.reduce((sum, val) => sum + val, 0) / data.yield.length,
      avgPrice: data.price.reduce((sum, val) => sum + val, 0) / data.price.length,
      avgDemand: data.demand.reduce((sum, val) => sum + val, 0) / data.demand.length
    };
  });

  return analysis;
};

const calculateCropTypeDistribution = (crops: ICrop[]) => {
  const distribution: { [key: string]: number } = {};
  
  crops.forEach(crop => {
    distribution[crop.type] = (distribution[crop.type] || 0) + 1;
  });

  return distribution;
};

const calculateMarketDemandDistribution = (crops: ICrop[]) => {
  const distribution: { [key: string]: number } = {};
  
  crops.forEach(crop => {
    distribution[crop.marketDemand] = (distribution[crop.marketDemand] || 0) + 1;
  });

  return distribution;
};

const getTopPerformingCrops = (crops: ICrop[]) => {
  return crops
    .filter(crop => crop.yieldData.length > 0)
    .sort((a, b) => b.averageYield - a.averageYield)
    .slice(0, 5)
    .map(crop => ({
      name: crop.name,
      averageYield: crop.averageYield,
      averagePrice: crop.averagePrice,
      marketDemand: crop.marketDemand
    }));
};

const calculateAverageYields = (crops: ICrop[]) => {
  const cropsWithData = crops.filter(crop => crop.yieldData.length > 0);
  if (cropsWithData.length === 0) return 0;
  
  const totalYield = cropsWithData.reduce((sum, crop) => sum + crop.averageYield, 0);
  return totalYield / cropsWithData.length;
};

const calculatePriceRanges = (crops: ICrop[]) => {
  const cropsWithData = crops.filter(crop => crop.yieldData.length > 0);
  if (cropsWithData.length === 0) return { min: 0, max: 0, avg: 0 };
  
  const prices = cropsWithData.map(crop => crop.averagePrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((sum, price) => sum + price, 0) / prices.length
  };
};

export default {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  addYieldData,
  addPrediction,
  getCropAnalytics,
  getMarketOverview
};
