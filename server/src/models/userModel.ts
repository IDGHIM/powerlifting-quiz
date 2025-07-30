import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  resetToken?: string;
  resetTokenExpiration?: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  resetToken: { type: String, default: null },
  resetTokenExpiration: { type: Date, default: null },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
