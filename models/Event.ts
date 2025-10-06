import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  image: {
    url: string;
    publicId: string;
  };
  price?: number;
  capacity?: number;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
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
  price: {
    type: Number,
    min: 0,
  },
  capacity: {
    type: Number,
    min: 1,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
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
eventSchema.pre('save', async function(next) {
  if (this.isNew && !this.order) {
    const count = await (this.constructor as any).countDocuments();
    this.order = count + 1;
  }
  next();
});

// Index for ordering and filtering
eventSchema.index({ order: 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });

export default mongoose.model<IEvent>('Event', eventSchema);
 this 