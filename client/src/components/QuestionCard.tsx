// client/src/components/QuestionCard.tsx
import React, { useState } from 'react';
import './QuestionCard.css';

interface QuestionCardProps {
  question: string;
  options: string[];
  correctAnswer: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, options, correctAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === correctAnswer);
  };

  return (
    <div className="question-card">
      <h2>{question}</h2>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleAnswerClick(option)}
          className={
            selectedAnswer
              ? option === correctAnswer
                ? 'correct'
                : option === selectedAnswer
                ? 'incorrect'
                : ''
              : ''
          }
          disabled={!!selectedAnswer}
        >
          {option}
        </button>
      ))}

      {selectedAnswer && (
        <p className={isCorrect ? 'feedback correct-text' : 'feedback incorrect-text'}>
          {isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse.'}
        </p>
      )}
    </div>
  );
};

export default QuestionCard;
