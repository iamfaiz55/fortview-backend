import mongoose, { Document, Schema } from 'mongoose';

export interface ISpaWellness extends Document {
  name: string;
  description: string;
  location: string;
  services: string[];
  contact?: string;
  image: {
    url: string;
    publicId: string;
  };
  rating?: number;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const spaWellnessSchema = new Schema<ISpaWellness>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  services: [{
    type: String,
    trim: true,
    maxlength: 100,
  }],
  contact: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  image: {
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
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    required: false,
  },
}, {
  timestamps: true,
});

// Auto-increment order before saving
spaWellnessSchema.pre('save', async function(next) {
  if (this.isNew && !this.order) {
    const count = await (this.constructor as any).countDocuments();
    this.order = count + 1;
  }
  next();
});

// Indexes for ordering and filtering
spaWellnessSchema.index({ order: 1 });
spaWellnessSchema.index({ isActive: 1 });
spaWellnessSchema.index({ location: 1 });

export default mongoose.model<ISpaWellness>('SpaWellness', spaWellnessSchema);