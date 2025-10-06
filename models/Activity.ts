import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ageGroup: string;
  features: string[];
  rating?: number;
  icon: string;
  image: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
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
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true,
    maxlength: [50, 'Duration cannot exceed 50 characters']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  ageGroup: {
    type: String,
    required: [true, 'Age group is required'],
    trim: true,
    maxlength: [50, 'Age group cannot exceed 50 characters']
  },
  features: [{
    type: String,
    trim: true,
    maxlength: [100, 'Feature cannot exceed 100 characters']
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
ActivitySchema.index({ isActive: 1, order: 1, createdAt: -1 });
ActivitySchema.index({ category: 1, isActive: 1 });
ActivitySchema.index({ difficulty: 1, isActive: 1 });
ActivitySchema.index({ createdAt: -1 });
ActivitySchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IActivity>('Activity', ActivitySchema);
