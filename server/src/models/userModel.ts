import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'user' | 'admin';
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
