import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { quizDatabase, Question } from '../../data/quizData.ts';
import './QuizPage.css';

const QuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  const quizData = quizDatabase[category as string];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

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

    const isCorrect = option === currentQuestion.answer;
    const newScore = isCorrect ? score + 1 : score;

    setTimeout(() => {
      if (currentQuestionIndex + 1 < quizData.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
        setScore(newScore);
      } else {
        navigate('/result', {
          state: { score: newScore, total: quizData.length, category }
        });
      }
    }, 1000);
  };

  return (
    <div className="quiz-container">
      <h1>Quiz : {category}</h1>
      <p>Ici, tu vas répondre à un quiz sur : {category}</p>

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
              disabled={!!selectedOption}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
