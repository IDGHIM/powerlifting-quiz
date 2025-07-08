import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { quizDatabase, Question } from '../../data/quizData.ts';
import Timer from '../../components/Timer.tsx';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const QuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const mode = queryParams.get('mode') || 'classic'; // 'classic' ou 'timer'

  const rawQuizData = quizDatabase[category as string];

  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (rawQuizData) {
      const shuffledQuestions = shuffleArray(rawQuizData).slice(0, 20);
      const randomizedQuiz = shuffledQuestions.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
      setQuizData(randomizedQuiz);
    }
  }, [rawQuizData]);

  const handleTimeUp = () => {
    setQuizFinished(true);
    navigate('/result', {
      state: { score, total: quizData.length, category, mode },
    });
  };

  if (!rawQuizData) {
    return (
      <div>
        <h2>Catégorie non trouvée</h2>
        <p>Veuillez choisir une catégorie valide.</p>
      </div>
    );
  }

  if (quizData.length === 0) return <p>Chargement du quiz...</p>;
  if (quizFinished) return null;

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) setScore((prev) => prev + 1);

    if (mode === 'classic') {
      setSelectedOption(option);
      setTimeout(() => {
        if (currentQuestionIndex + 1 < quizData.length) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedOption(null);
        } else {
          navigate('/result', {
            state: {
              score: isCorrect ? score + 1 : score,
              total: quizData.length,
              category,
              mode,
            },
          });
        }
      }, 1000);
    } else {
      // Mode timer : avance directement sans pause
      if (currentQuestionIndex + 1 < quizData.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setQuizFinished(true);
        navigate('/result', {
          state: {
            score: isCorrect ? score + 1 : score,
            total: quizData.length,
            category,
            mode,
          },
        });
      }
    }
  };

  return (
    <div className="quiz-container">
      <h1>Quiz : {category}</h1>
      <p>Mode sélectionné : <strong>{mode === 'timer' ? 'Contre-la-montre' : 'Classique'}</strong></p>

      {mode === 'timer' && (
        <Timer duration={60} onTimeUp={handleTimeUp} />
      )}

      <div className="quiz-card">
        <h2>Question {currentQuestionIndex + 1} / {quizData.length}</h2>
        <p>{currentQuestion.question}</p>
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`quiz-option ${
                mode === 'classic' && selectedOption
                  ? option === currentQuestion.answer
                    ? 'correct'
                    : option === selectedOption
                    ? 'incorrect'
                    : ''
                  : ''
              }`}
              disabled={mode === 'classic' && !!selectedOption}
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
