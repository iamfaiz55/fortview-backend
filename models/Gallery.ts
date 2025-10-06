import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IGallery extends Document {
  type: 'image' | 'video';
  media: {
    url: string;
    publicId: string;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>({
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  media: {
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
  order: {
    type: Number,
    required: false,
  },
}, {
  timestamps: true,
});

// Index for ordering
gallerySchema.index({ order: 1 });

const Gallery = mongoose.model<IGallery>('Gallery', gallerySchema);

// Auto-increment order before saving
gallerySchema.pre('save', async function(next) {
  if (this.isNew && !this.order) {
    const count = await Gallery.countDocuments();
    this.order = count + 1;
  }
  next();
});

export default Gallery;
