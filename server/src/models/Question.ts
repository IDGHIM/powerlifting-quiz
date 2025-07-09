import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  answers: string[];
  correctAnswer: string;
  category: string;
}

const QuestionSchema: Schema = new Schema({
  question: { type: String, required: true },
  answers: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  category: { type: String, required: true }
});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
