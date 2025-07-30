import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  username: string;
  name: string;
  weightClass: string;
  squat: string;
  bench: string;
  deadlift: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema: Schema<IProfile> = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    ref: 'User'
  },
  name: { type: String, default: '' },
  weightClass: { type: String, default: '' },
  squat: { type: String, default: '' },
  bench: { type: String, default: '' },
  deadlift: { type: String, default: '' },
  profileImage: { type: String, default: '' }
}, {
  timestamps: true
});

const Profile = mongoose.model<IProfile>('Profile', profileSchema);
export default Profile;