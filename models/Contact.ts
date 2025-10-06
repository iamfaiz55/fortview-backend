import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  mobile: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
  mobile: { type: String, required: true, trim: true, maxlength: 20 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ name: 'text', email: 'text', mobile: 'text', message: 'text' });

export default mongoose.model<IContact>('Contact', ContactSchema);


