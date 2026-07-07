import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || model('Admin', AdminSchema);
