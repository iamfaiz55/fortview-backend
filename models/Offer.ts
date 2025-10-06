import mongoose, { Document, Schema } from 'mongoose';

export interface IOffer extends Document {
  image: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>({
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
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for ordering and filtering
offerSchema.index({ order: 1 });
offerSchema.index({ isActive: 1 });

export default mongoose.model<IOffer>('Offer', offerSchema);
