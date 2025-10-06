import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
  name: string;
  description?: string;
  category: string;
  image: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema = new Schema<IFood>({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
    maxlength: [100, 'Food name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
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
FoodSchema.index({ isActive: 1, order: 1, category: 1 }); // Compound index for main query
FoodSchema.index({ category: 1, isActive: 1 }); // Category filtering
FoodSchema.index({ createdAt: -1 }); // Sort by creation date
FoodSchema.index({ name: 'text', description: 'text' }); // Text search

export default mongoose.model<IFood>('Food', FoodSchema);
