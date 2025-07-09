import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db';
import { Question } from '../models/Question';
import { quizDatabase } from '../data/quizData';

const importData = async () => {
  try {
    await connectDB();

    await Question.deleteMany(); // facultatif

    const allQuestions = Object.values(quizDatabase).flat();
    await Question.insertMany(allQuestions);

    console.log('✅ Données importées avec succès');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur lors de l\'importation des données', err);
    process.exit(1);
  }
};

importData();
