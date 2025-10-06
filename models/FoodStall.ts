import mongoose, { Document, Schema } from 'mongoose';

export interface IFoodStall extends Document {
  title: string;
  description?: string;
  location?: string;
  image: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const FoodStallSchema = new Schema<IFoodStall>({
  title: {
    type: String,
    required: [true, 'Stall title is required'],
    trim: true,
    maxlength: [100, 'Stall title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
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
FoodStallSchema.index({ isActive: 1, order: 1 }); // Compound index for main query
FoodStallSchema.index({ createdAt: -1 }); // Sort by creation date
FoodStallSchema.index({ title: 'text', description: 'text' }); // Text search

export default mongoose.model<IFoodStall>('FoodStall', FoodStallSchema);
