import mongoose, { Document, Schema } from 'mongoose';

export interface ICarousel extends Document {
  title: string;
  description: string;
  desktopImage: {
    url: string;
    publicId: string;
  };
  mobileImage: {
    url: string;
    publicId: string;
  };
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const carouselSchema = new Schema<ICarousel>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  desktopImage: {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  mobileImage: {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  buttonText: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  buttonLink: {
    type: String,
    trim: true,
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

// Index for ordering
carouselSchema.index({ order: 1 });

export default mongoose.model<ICarousel>('Carousel', carouselSchema);
