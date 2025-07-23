import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    points: { type: Number, required: true },
    category: { type: String, required: true },
    mode: { type: String, required: true },
  },
  {
    timestamps: true, 
  }
);

export const Score = mongoose.model('Score', scoreSchema);
