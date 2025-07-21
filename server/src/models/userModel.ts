import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);
