import mongoose, { Document, Schema } from 'mongoose';

export interface IYieldData {
  year: number;
  month: number;
  yield: number;
  price: number;
  demand: number;
  weatherScore: number;
  soilScore: number;
}

export interface IPrediction {
  date: Date;
  predictedYield: number;
  predictedPrice: number;
  confidence: number;
  factors: {
    weather: number;
    market: number;
    historical: number;
  };
}

export interface ICrop extends Document {
  name: string;
  type: 'vegetable' | 'fruit' | 'grain' | 'legume' | 'other';
  variety?: string;
  description?: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'year-round';
  plantingMonths: number[];
  harvestMonths: number[];
  yieldData: IYieldData[];
  predictions: IPrediction[];
  averageYield: number;
  averagePrice: number;
  marketDemand: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  waterRequirement: 'low' | 'medium' | 'high';
  soilType: string[];
  climateRequirements: string[];
  pests: string[];
  diseases: string[];
  nutritionalValue: {
    calories: number;
    protein: number;
    carbs: number;
    fiber: number;
    vitamins: string[];
  };
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const YieldDataSchema: Schema = new Schema({
  year: { type: Number, required: true },
  month: { type: Number, required: true, min: 1, max: 12 },
  yield: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  demand: { type: Number, required: true, min: 0, max: 100 },
  weatherScore: { type: Number, min: 0, max: 10 },
  soilScore: { type: Number, min: 0, max: 10 }
});

const PredictionSchema: Schema = new Schema({
  date: { type: Date, required: true },
  predictedYield: { type: Number, required: true, min: 0 },
  predictedPrice: { type: Number, required: true, min: 0 },
  confidence: { type: Number, required: true, min: 0, max: 100 },
  factors: {
    weather: { type: Number, min: 0, max: 10 },
    market: { type: Number, min: 0, max: 10 },
    historical: { type: Number, min: 0, max: 10 }
  }
});

const CropSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
    unique: true,
    minlength: [2, 'Crop name must be at least 2 characters'],
    maxlength: [50, 'Crop name cannot exceed 50 characters']
  },
  type: {
    type: String,
    required: [true, 'Crop type is required'],
    enum: ['vegetable', 'fruit', 'grain', 'legume', 'other']
  },
  variety: {
    type: String,
    trim: true,
    maxlength: [100, 'Variety cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  season: {
    type: String,
    required: [true, 'Season is required'],
    enum: ['spring', 'summer', 'autumn', 'winter', 'year-round']
  },
  plantingMonths: [{
    type: Number,
    min: 1,
    max: 12
  }],
  harvestMonths: [{
    type: Number,
    min: 1,
    max: 12
  }],
  yieldData: [YieldDataSchema],
  predictions: [PredictionSchema],
  averageYield: {
    type: Number,
    default: 0,
    min: 0
  },
  averagePrice: {
    type: Number,
    default: 0,
    min: 0
  },
  marketDemand: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  waterRequirement: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  soilType: [{
    type: String,
    trim: true
  }],
  climateRequirements: [{
    type: String,
    trim: true
  }],
  pests: [{
    type: String,
    trim: true
  }],
  diseases: [{
    type: String,
    trim: true
  }],
  nutritionalValue: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 },
    vitamins: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
CropSchema.index({ name: 1 });
CropSchema.index({ type: 1 });
CropSchema.index({ season: 1 });
CropSchema.index({ marketDemand: 1 });
CropSchema.index({ createdBy: 1 });
CropSchema.index({ createdAt: -1 });

// Virtual for crop statistics
CropSchema.virtual('statistics').get(function() {
  const yieldData = this.yieldData as IYieldData[];
  if (!yieldData || yieldData.length === 0) {
    return {
      totalRecords: 0,
      averageYield: 0,
      averagePrice: 0,
      averageDemand: 0,
      yieldTrend: 'stable',
      priceTrend: 'stable'
    };
  }

  const avgYield = yieldData.reduce((sum: number, data: IYieldData) => sum + data.yield, 0) / yieldData.length;
  const avgPrice = yieldData.reduce((sum: number, data: IYieldData) => sum + data.price, 0) / yieldData.length;
  const avgDemand = yieldData.reduce((sum: number, data: IYieldData) => sum + data.demand, 0) / yieldData.length;

  // Calculate trends (simplified)
  const recentData = yieldData.slice(-3);
  const olderData = yieldData.slice(0, 3);
  
  const recentAvgYield = recentData.reduce((sum: number, data: IYieldData) => sum + data.yield, 0) / recentData.length;
  const olderAvgYield = olderData.reduce((sum: number, data: IYieldData) => sum + data.yield, 0) / olderData.length;
  
  const yieldTrend = recentAvgYield > olderAvgYield ? 'increasing' : recentAvgYield < olderAvgYield ? 'decreasing' : 'stable';

  return {
    totalRecords: yieldData.length,
    averageYield: Math.round(avgYield * 100) / 100,
    averagePrice: Math.round(avgPrice * 100) / 100,
    averageDemand: Math.round(avgDemand * 100) / 100,
    yieldTrend,
    priceTrend: 'stable' // Simplified for now
  };
});

// Pre-save middleware to calculate averages
CropSchema.pre('save', function(next) {
  const yieldData = this.yieldData as IYieldData[];
  if (yieldData && yieldData.length > 0) {
    this.averageYield = yieldData.reduce((sum: number, data: IYieldData) => sum + data.yield, 0) / yieldData.length;
    this.averagePrice = yieldData.reduce((sum: number, data: IYieldData) => sum + data.price, 0) / yieldData.length;
  }
  next();
});

export default mongoose.model<ICrop>('Crop', CropSchema);
