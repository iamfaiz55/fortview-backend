import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  title: string;
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  categories: string[]; // e.g. ['adult', 'child', 'common']
  isActive: boolean;
  isUpcoming: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gameSchema = new Schema<IGame>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
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
  categories: {
    type: [String],
    enum: ['adult', 'child', 'common'],
    required: true,
    default: ['common'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isUpcoming: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Game = mongoose.model<IGame>('Game', gameSchema);

export default Game;