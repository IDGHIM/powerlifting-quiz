import mongoose from 'mongoose';

export interface IQuestion extends mongoose.Document {
  question: string;
  options: string[];
  answer: string;
  category: string;
}

const questionSchema = new mongoose.Schema<IQuestion>({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true },
});

const QuestionModel = mongoose.model<IQuestion>('Question', questionSchema);

export default QuestionModel;
