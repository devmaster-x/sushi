// models/User.ts

import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  wallet: string;
  username: string;
  score: number;
  top_score: number;
  isVIP: boolean;
}

const UserSchema = new Schema<IUser>({
  wallet: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  score: { type: Number, required: true },
  top_score: { type: Number, required: true },
  isVIP: { type: Boolean, required: true },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
