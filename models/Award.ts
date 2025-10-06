import mongoose, { Document, Schema } from 'mongoose';

export interface IAward extends Document {
  title: string;
  description: string;
  year: number;
  organization?: string;
  category?: string;
  image?: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AwardSchema = new Schema<IAward>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be at least 1900'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  organization: {
    type: String,
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  image: {
    url: {
      type: String,
      required: false
    },
    publicId: {
      type: String,
      required: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
AwardSchema.index({ isActive: 1, order: 1, year: -1 }); // Compound index for main query
AwardSchema.index({ year: -1, isActive: 1 }); // Year filtering
AwardSchema.index({ category: 1, isActive: 1 }); // Category filtering
AwardSchema.index({ createdAt: -1 }); // Sort by creation date
AwardSchema.index({ title: 'text', description: 'text' }); // Text search

export default mongoose.model<IAward>('Award', AwardSchema);
