import mongoose, { Document, Schema } from 'mongoose';

export interface IBanquetVenue extends Document {
  title: string;
  capacity: string;
  area: string;
  ac: string;
  description: string;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  isActive: boolean;
  order: number;
  features?: string[];
  pricing?: {
    basePrice: number;
    currency: string;
    includes: string[];
  };
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const banquetVenueSchema = new Schema<IBanquetVenue>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  capacity: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  area: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  ac: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  images: [{
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
  features: [{
    type: String,
    trim: true,
    maxlength: 100,
  }],
  pricing: {
    basePrice: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      maxlength: 3,
    },
    includes: [{
      type: String,
      trim: true,
      maxlength: 200,
    }],
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
banquetVenueSchema.index({ order: 1 });
banquetVenueSchema.index({ isActive: 1 });
banquetVenueSchema.index({ title: 1 });

export default mongoose.model<IBanquetVenue>('BanquetVenue', banquetVenueSchema);
