"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = __importDefault(require("../config/db"));
const Question_1 = require("../models/Question");
const quizData_1 = require("../data/quizData");
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        yield Question_1.Question.deleteMany(); // facultatif
        const allQuestions = Object.values(quizData_1.quizDatabase).flat();
        yield Question_1.Question.insertMany(allQuestions);
        console.log('✅ Données importées avec succès');
        process.exit();
    }
    catch (err) {
        console.error('❌ Erreur lors de l\'importation des données', err);
        process.exit(1);
    }
});
importData();
