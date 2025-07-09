import 'dotenv/config';
import connectDB from '../config/db';
import QuestionModel from '../models/Question';
import { quizDatabase } from '../data/quizData';

const importQuiz = async () => {
  await connectDB();

  // Vider la collection si besoin
  await QuestionModel.deleteMany();

  for (const [category, questions] of Object.entries(quizDatabase)) {
    const docs = questions.map((q) => ({
      ...q,
      category,
    }));
    await QuestionModel.insertMany(docs);
  }

  console.log('✅ Quiz importé avec succès dans MongoDB Atlas');
  process.exit();
};

importQuiz();
