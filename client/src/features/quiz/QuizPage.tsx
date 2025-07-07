import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { quizDatabase, Question } from '../../data/quizData.ts';
import './QuizPage.css';
import Badge from '../../components/badges.tsx';

const QuizPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  // Sélection des questions selon la catégorie
  const quizData = quizDatabase[category as string];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Gestion de l'absence de catégorie ou catégorie non trouvée
  if (!quizData) {
    return (
      <div>
        <h2>Catégorie non trouvée</h2>
        <p>Veuillez choisir une catégorie valide.</p>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestionIndex + 1 < quizData.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  return (
    
      <div className="quiz-container">
        <h1>Quiz : {category}</h1>
        <p>Ici, tu vas répondre à un quiz sur : {category}</p>

        {!showResult ? (
          <div className="quiz-card">
            <h2>Question {currentQuestionIndex + 1} / {quizData.length}</h2>
            <p>{currentQuestion.question}</p>
            <div className="quiz-options">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`quiz-option ${
                    selectedOption
                      ? option === currentQuestion.answer
                        ? 'correct'
                        : option === selectedOption
                        ? 'incorrect'
                        : ''
                      : ''
                  }`}
                  disabled={!!selectedOption} // désactive après sélection
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="quiz-result">
            <h2>Quiz terminé !</h2>
            <p>Votre score : {score} / {quizData.length}</p>
             <Badge scorePercentage={(score / quizData.length) * 100} />
          </div>
        )}
      </div>
  );
};

export default QuizPage;
