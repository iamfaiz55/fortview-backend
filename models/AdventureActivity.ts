import mongoose, { Document, Schema } from 'mongoose';

export interface IAdventureActivity extends Document {
  name: string;
  description: string;
  detailedDescription: string;
  category: 'indoor' | 'outdoor' | 'water' | 'kids';
  image: {
    url: string;
    publicId: string;
  };
  icon: string;
  ageGroup: 'kids' | 'teens-adults' | 'kids-adults' | 'all-ages';
  difficulty: 'easy' | 'moderate' | 'hard';
  timing: 'all-day' | 'morning-evening' | 'evening';
  duration: string;
  capacity: string;
  highlights: string[];
  rating?: number;
  isActive: boolean;
  order: number;
  // Additional fields for adventure activities
  equipment?: string[];
  safetyRequirements?: string[];
  weatherDependent?: boolean;
  minAge?: number;
  maxAge?: number;
  price?: {
    adult: number;
    child: number;
    group?: number;
  };
  location?: string;
  instructorRequired?: boolean;
  groupSize?: {
    min: number;
    max: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AdventureActivitySchema = new Schema<IAdventureActivity>({
  name: {
    type: String,
    required: [true, 'Activity name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  detailedDescription: {
    type: String,
    required: [true, 'Detailed description is required'],
    trim: true,
    maxlength: [2000, 'Detailed description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['indoor', 'outdoor', 'water', 'kids'],
      message: 'Category must be one of: indoor, outdoor, water, kids'
    }
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
  icon: {
    type: String,
    required: [true, 'Icon is required'],
    trim: true
  },
  ageGroup: {
    type: String,
    required: [true, 'Age group is required'],
    enum: {
      values: ['kids', 'teens-adults', 'kids-adults', 'all-ages'],
      message: 'Age group must be one of: kids, teens-adults, kids-adults, all-ages'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: {
      values: ['easy', 'moderate', 'hard'],
      message: 'Difficulty must be one of: easy, moderate, hard'
    }
  },
  timing: {
    type: String,
    required: [true, 'Timing is required'],
    enum: {
      values: ['all-day', 'morning-evening', 'evening'],
      message: 'Timing must be one of: all-day, morning-evening, evening'
    }
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true,
    maxlength: [50, 'Duration cannot exceed 50 characters']
  },
  capacity: {
    type: String,
    required: [true, 'Capacity is required'],
    trim: true,
    maxlength: [50, 'Capacity cannot exceed 50 characters']
  },
  highlights: [{
    type: String,
    trim: true,
    maxlength: [100, 'Each highlight cannot exceed 100 characters']
  }],
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0,
    min: [0, 'Order cannot be negative']
  },
  // Additional fields
  equipment: [{
    type: String,
    trim: true,
    maxlength: [100, 'Each equipment item cannot exceed 100 characters']
  }],
  safetyRequirements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each safety requirement cannot exceed 200 characters']
  }],
  weatherDependent: {
    type: Boolean,
    default: false
  },
  minAge: {
    type: Number,
    min: [0, 'Minimum age cannot be negative'],
    max: [100, 'Minimum age cannot exceed 100']
  },
  maxAge: {
    type: Number,
    min: [0, 'Maximum age cannot be negative'],
    max: [100, 'Maximum age cannot exceed 100']
  },
  price: {
    adult: {
      type: Number,
      min: [0, 'Adult price cannot be negative']
    },
    child: {
      type: Number,
      min: [0, 'Child price cannot be negative']
    },
    group: {
      type: Number,
      min: [0, 'Group price cannot be negative']
    }
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  instructorRequired: {
    type: Boolean,
    default: false
  },
  groupSize: {
    min: {
      type: Number,
      min: [1, 'Minimum group size must be at least 1']
    },
    max: {
      type: Number,
      min: [1, 'Maximum group size must be at least 1']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
AdventureActivitySchema.index({ category: 1, isActive: 1 });
AdventureActivitySchema.index({ ageGroup: 1, isActive: 1 });
AdventureActivitySchema.index({ difficulty: 1, isActive: 1 });
AdventureActivitySchema.index({ timing: 1, isActive: 1 });
AdventureActivitySchema.index({ order: 1 });
AdventureActivitySchema.index({ isActive: 1, order: 1 });

// Virtual for formatted timing display
AdventureActivitySchema.virtual('formattedTiming').get(function() {
  return this.timing.replace('-', ' & ');
});

// Pre-save middleware to validate group size
AdventureActivitySchema.pre('save', function(next) {
  if (this.groupSize && this.groupSize.min > this.groupSize.max) {
    return next(new Error('Minimum group size cannot be greater than maximum group size'));
  }
  if (this.minAge && this.maxAge && this.minAge > this.maxAge) {
    return next(new Error('Minimum age cannot be greater than maximum age'));
  }
  next();
});

export default mongoose.model<IAdventureActivity>('AdventureActivity', AdventureActivitySchema);
