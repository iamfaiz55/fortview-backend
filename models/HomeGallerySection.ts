import mongoose, { Document, Schema } from 'mongoose';

export interface IHomeGalleryItem extends Document {
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  capacity: string;
  area: string;
  features: string[];
  rating?: number;
  icon: string; // Store icon name instead of React component
  image: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HomeGalleryItemSchema = new Schema<IHomeGalleryItem>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  detailedDescription: {
    type: String,
    required: [true, 'Detailed description is required'],
    trim: true,
    maxlength: [1000, 'Detailed description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  capacity: {
    type: String,
    required: [true, 'Capacity is required'],
    trim: true,
    maxlength: [50, 'Capacity cannot exceed 50 characters']
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true,
    maxlength: [50, 'Area cannot exceed 50 characters']
  },
  features: [{
    type: String,
    trim: true,
  }],
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  icon: {
    type: String,
    required: [true, 'Icon is required'],
    trim: true
  },
  image: {
    url: {
      type: String,
      required: [true, 'Image URL is required']
    },
    publicId: {
      type: String,
      required: [true, 'Image public ID is required']
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
HomeGalleryItemSchema.index({ isActive: 1, order: 1, createdAt: -1 }); // Compound index for main query
HomeGalleryItemSchema.index({ category: 1, isActive: 1 }); // Category filtering
HomeGalleryItemSchema.index({ createdAt: -1 }); // Sort by creation date
HomeGalleryItemSchema.index({ title: 'text', description: 'text' }); // Text search

export default mongoose.model<IHomeGalleryItem>('HomeGalleryItem', HomeGalleryItemSchema);
