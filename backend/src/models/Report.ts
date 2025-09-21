import mongoose, { Document, Schema } from 'mongoose';

export interface IReportData {
  chartType: 'line' | 'bar' | 'pie' | 'area';
  data: any[];
  title: string;
  description?: string;
}

export interface IReport extends Document {
  title: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  description?: string;
  reportData: IReportData[];
  filters: {
    cropType?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    location?: string;
    marketDemand?: string;
  };
  generatedBy: mongoose.Types.ObjectId;
  status: 'generating' | 'completed' | 'failed';
  downloadCount: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReportDataSchema: Schema = new Schema({
  chartType: {
    type: String,
    required: true,
    enum: ['line', 'bar', 'pie', 'area']
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});

const ReportSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  type: {
    type: String,
    required: [true, 'Report type is required'],
    enum: ['monthly', 'quarterly', 'annual', 'custom']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  reportData: [ReportDataSchema],
  filters: {
    cropType: { type: String },
    dateRange: {
      start: { type: Date },
      end: { type: Date }
    },
    location: { type: String },
    marketDemand: { type: String }
  },
  generatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  downloadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
ReportSchema.index({ generatedBy: 1 });
ReportSchema.index({ type: 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ createdAt: -1 });

export default mongoose.model<IReport>('Report', ReportSchema);
