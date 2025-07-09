import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer.tsx';
import './QuizPage.css';
import { Question } from '../../../../types/Quiz.ts';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const QuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const mode = queryParams.get('mode') || 'classic';

  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [namesEntered, setNamesEntered] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState<{ 1: number; 2: number }>({ 1: 0, 2: 0 });
  const [hasPlayer1Answered, setHasPlayer1Answered] = useState(false);
  const [hasPlayer2Answered, setHasPlayer2Answered] = useState(false);

  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/quiz?category=${category}`);
        if (!res.ok) throw new Error('Erreur lors du chargement du quiz');
        const data = await res.json();

        const shuffled = shuffleArray(data).slice(0, 20);
        const randomized = shuffled.map((q: Question) => ({
          ...q,
          answers: shuffleArray(q.answers),
        }));
        setQuizData(randomized);
      } catch (error) {
        console.error(error);
      }
    };

    if (category) fetchQuiz();
  }, [category]);

  useEffect(() => {
    if (quizData.length > 0 && !quizFinished && mode === 'timer') {
      setQuestionStartTime(new Date());
    }
  }, [currentQuestionIndex, quizData, quizFinished, mode]);

  const handleTimeUp = () => {
    setQuizFinished(true);
    navigate('/result', {
      state: mode === '2players'
        ? { scores, total: quizData.length, player1Name, player2Name, category, mode }
        : { score, total: quizData.length, category, mode },
    });
  };

  const currentQuestion = quizData[currentQuestionIndex];

  const calculateScore = (timeTakenMs: number, difficulty: string, consecutive: number) => {
    const timeScore = Math.max(0, 10 - timeTakenMs / 1000);
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    const comboBonus = consecutive > 1 ? consecutive - 1 : 0;
    return (timeScore + comboBonus) * difficultyMultiplier;
  };

  const handleAnswer = (option: string) => {
    if (selectedOption) return;

    const isCorrect = option === currentQuestion.correctAnswer;
    const now = new Date();
    const timeTakenMs = questionStartTime ? now.getTime() - questionStartTime.getTime() : 0;

    if (mode === '2players') {
      if (isCorrect) {
        setScores((prev) => ({ ...prev, [currentPlayer]: prev[currentPlayer] + 1 }));
      }

      if (currentPlayer === 1) {
        setHasPlayer1Answered(true);
        setCurrentPlayer(2);
      } else {
        setHasPlayer2Answered(true);
      }

      // Attendre que les 2 joueurs aient répondu pour passer à la question suivante
      if (hasPlayer1Answered && currentPlayer === 2) {
        setTimeout(() => {
          const nextIndex = currentQuestionIndex + 1;
          if (nextIndex < quizData.length) {
            setCurrentQuestionIndex(nextIndex);
            setCurrentPlayer(1);
            setHasPlayer1Answered(false);
            setHasPlayer2Answered(false);
            setSelectedOption(null);
          } else {
            setQuizFinished(true);
            navigate('/result', {
              state: { scores, total: quizData.length, category, mode, player1Name, player2Name },
            });
          }
        }, 500);
      }

      setSelectedOption(option);
      return;
    }

    if (mode === 'timer') {
      if (isCorrect) {
        const points = calculateScore(timeTakenMs, currentQuestion.difficulty || 'easy', consecutiveCorrect + 1);
        setScore((prev) => prev + points);
        setConsecutiveCorrect((prev) => prev + 1);
      } else {
        setConsecutiveCorrect(0);
      }

      setSelectedOption(option);

      setTimeout(() => {
        if (currentQuestionIndex + 1 < quizData.length) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedOption(null);
          setQuestionStartTime(new Date());
        } else {
          setQuizFinished(true);
          navigate('/result', {
            state: { score, total: quizData.length, category, mode },
          });
        }
      }, 1000);
      return;
    }

    // Classic
    setSelectedOption(option);
    if (isCorrect) setScore((prev) => prev + 1);

    setTimeout(() => {
      if (currentQuestionIndex + 1 < quizData.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
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
    }, 1000);
  };

  if (!category) {
    return (
      <div>
        <h2>Catégorie non trouvée</h2>
        <p>Veuillez choisir une catégorie valide.</p>
      </div>
    );
  }

  if (mode === '2players' && !namesEntered) {
    return (
      <div className="quiz-container">
        <h2>Entrez les noms des joueurs</h2>
        <input
          type="text"
          placeholder="Nom Joueur 1"
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
          className="input-name"
        />
        <input
          type="text"
          placeholder="Nom Joueur 2"
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
          className="input-name"
        />
        <button
          onClick={() => {
            if (player1Name.trim() && player2Name.trim()) {
              setNamesEntered(true);
            } else {
              alert('Veuillez entrer les deux noms');
            }
          }}
          className="start-button"
        >
          Commencer le quiz
        </button>
      </div>
    );
  }

  if (quizData.length === 0) return <p>Chargement du quiz...</p>;
  if (quizFinished) return null;

  return (
    <div className="quiz-container">
      <h1>Quiz : {category}</h1>
      <p>
        Mode sélectionné :{' '}
        <strong>
          {mode === 'timer'
            ? 'Contre-la-montre'
            : mode === '2players'
            ? 'Joueur 1 vs Joueur 2 (répondent à la même question)'
            : 'Classique'}
        </strong>
      </p>

      {mode === 'timer' && <Timer duration={60} onTimeUp={handleTimeUp} />}

      {mode === '2players' && (
        <>
          <h3 className="player-turn">
            👉 {currentPlayer === 1 ? player1Name : player2Name}, à toi de répondre !
          </h3>
          <div className="scores">
            <p>🟦 {player1Name}: {scores[1]} pts</p>
            <p>🟥 {player2Name}: {scores[2]} pts</p>
          </div>
        </>
      )}

      <div className="quiz-card">
        <h2>
          Question {currentQuestionIndex + 1} / {quizData.length}
        </h2>
        <p>{currentQuestion.question}</p>
        <div className="quiz-options">
          {currentQuestion.answers.map((option, index) => {
            let optionClass = 'quiz-option';
            if (selectedOption) {
              if (option === currentQuestion.correctAnswer) {
                optionClass += ' correct';
              } else if (option === selectedOption) {
                optionClass += ' wrong';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={optionClass}
                disabled={
                  (mode === '2players' &&
                    ((currentPlayer === 1 && hasPlayer1Answered) ||
                      (currentPlayer === 2 && hasPlayer2Answered))) ||
                  (mode === 'classic' && !!selectedOption) ||
                  (mode === 'timer' && !!selectedOption)
                }
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
