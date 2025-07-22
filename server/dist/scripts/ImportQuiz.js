"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const questionModel_1 = require("../models/questionModel");
const quizData_1 = require("../data/quizData");
const importData = async () => {
    try {
        await (0, db_1.default)();
        await questionModel_1.Question.deleteMany(); // facultatif
        const allQuestions = Object.values(quizData_1.quizDatabase).flat();
        await questionModel_1.Question.insertMany(allQuestions);
        console.log('✅ Données importées avec succès');
        process.exit();
    }
    catch (err) {
        console.error('❌ Erreur lors de l\'importation des données', err);
        process.exit(1);
    }
};
importData();
