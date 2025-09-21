import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Report, { IReport } from '../models/Report';
import Crop from '../models/Crop';
import { AppError, catchAsync } from '../middlewares/errorHandler';

/**
 * Report Controller
 * Handles report generation and management
 */

/**
 * Generate a new report
 */
export const generateReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = req.user!;
  const { title, type, description, filters } = req.body;

  // Create report with generating status
  const report = new Report({
    title,
    type,
    description,
    filters,
    generatedBy: user._id,
    status: 'generating'
  });

  await report.save();

  // Generate report data asynchronously
  generateReportData((report._id as any).toString(), filters, type)
    .then(async (reportData) => {
      const updatedReport = await Report.findById(report._id);
      if (updatedReport) {
        updatedReport.reportData = reportData as any;
        updatedReport.status = 'completed';
        await updatedReport.save();
      }
    })
    .catch(async (error) => {
      console.error('Error generating report:', error);
      const updatedReport = await Report.findById(report._id);
      if (updatedReport) {
        updatedReport.status = 'failed';
        await updatedReport.save();
      }
    });

  res.status(201).json({
    success: true,
    message: 'Report generation started',
    data: {
      report: {
        id: report._id,
        title: report.title,
        type: report.type,
        status: report.status,
        createdAt: report.createdAt
      }
    }
  });
});

/**
 * Get all reports for a user
 */
export const getUserReports = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user!;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const reports = await Report.find({ generatedBy: user._id })
    .populate('generatedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Report.countDocuments({ generatedBy: user._id });

  res.json({
    success: true,
    data: {
      reports,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

/**
 * Get report by ID
 */
export const getReportById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user!;

  const report = await Report.findById(id)
    .populate('generatedBy', 'name email');

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found'
    });
  }

  // Check if user is authorized to view this report
  if ((report.generatedBy as any)._id.toString() !== (user._id as any).toString() && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this report'
    });
  }

  res.json({
    success: true,
    data: {
      report
    }
  });
});

/**
 * Download report (increment download count)
 */
export const downloadReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user!;

  const report = await Report.findById(id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found'
    });
  }

  // Check if user is authorized to download this report
  if (report.generatedBy.toString() !== (user._id as any).toString() && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to download this report'
    });
  }

  // Increment download count
  report.downloadCount += 1;
  await report.save();

  res.json({
    success: true,
    message: 'Report download initiated',
    data: {
      report: {
        id: report._id,
        title: report.title,
        downloadCount: report.downloadCount
      }
    }
  });
});

/**
 * Delete report
 */
export const deleteReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = req.user!;

  const report = await Report.findById(id);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found'
    });
  }

  // Check if user is authorized to delete this report
  if (report.generatedBy.toString() !== (user._id as any).toString() && user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this report'
    });
  }

  await Report.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Report deleted successfully'
  });
});

/**
 * Get all reports (Admin only)
 */
export const getAllReports = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const reports = await Report.find()
    .populate('generatedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Report.countDocuments();

  res.json({
    success: true,
    data: {
      reports,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

/**
 * Generate report data based on filters and type
 */
const generateReportData = async (reportId: string, filters: any, type: string) => {
  try {
    // Build query based on filters
    const query: any = { isActive: true };
    
    if (filters.cropType) query.type = filters.cropType;
    if (filters.marketDemand) query.marketDemand = filters.marketDemand;
    if (filters.location) query.location = { $regex: filters.location, $options: 'i' };

    const crops = await Crop.find(query);

    // Generate different chart data based on report type
    const reportData = [];

    if (type === 'monthly' || type === 'quarterly' || type === 'annual') {
      // Price trend chart
      reportData.push({
        chartType: 'line',
        title: 'Price Trends',
        description: 'Monthly price changes for key crops',
        data: generatePriceTrendData(crops)
      });

      // Yield vs Demand chart
      reportData.push({
        chartType: 'bar',
        title: 'Yield vs Demand',
        description: 'Current yield compared to market demand',
        data: generateYieldVsDemandData(crops)
      });

      // Market share chart
      reportData.push({
        chartType: 'pie',
        title: 'Market Share',
        description: 'Distribution of crops in portfolio',
        data: generateMarketShareData(crops)
      });

      // Profit analysis chart
      reportData.push({
        chartType: 'area',
        title: 'Profit Analysis',
        description: 'Monthly profit vs cost breakdown',
        data: generateProfitAnalysisData(crops)
      });
    }

    return reportData;
  } catch (error) {
    console.error('Error generating report data:', error);
    throw error;
  }
};

// Helper functions to generate chart data
const generatePriceTrendData = (crops: any[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = months.map(month => {
    const monthData: any = { month };
    
    crops.slice(0, 3).forEach(crop => {
      const cropData = crop.yieldData.find((d: any) => d.month === months.indexOf(month) + 1);
      monthData[crop.name.toLowerCase()] = cropData ? cropData.price : 0;
    });
    
    return monthData;
  });

  return data;
};

const generateYieldVsDemandData = (crops: any[]) => {
  return crops.slice(0, 5).map(crop => ({
    crop: crop.name,
    yield: crop.averageYield,
    demand: crop.yieldData.length > 0 
      ? crop.yieldData.reduce((sum: number, data: any) => sum + data.demand, 0) / crop.yieldData.length
      : 0
  }));
};

const generateMarketShareData = (crops: any[]) => {
  const typeDistribution: { [key: string]: number } = {};
  
  crops.forEach(crop => {
    typeDistribution[crop.type] = (typeDistribution[crop.type] || 0) + 1;
  });

  return Object.entries(typeDistribution).map(([name, value]) => ({
    name,
    value,
    color: getRandomColor()
  }));
};

const generateProfitAnalysisData = (crops: any[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map(month => {
    const monthIndex = months.indexOf(month) + 1;
    let totalProfit = 0;
    let totalCost = 0;

    crops.forEach(crop => {
      const monthData = crop.yieldData.find((d: any) => d.month === monthIndex);
      if (monthData) {
        totalProfit += monthData.price * monthData.yield;
        totalCost += monthData.yield * 0.7; // Assuming 70% cost ratio
      }
    });

    return {
      month,
      profit: totalProfit,
      cost: totalCost
    };
  });
};

const getRandomColor = () => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default {
  generateReport,
  getUserReports,
  getReportById,
  downloadReport,
  deleteReport,
  getAllReports
};
