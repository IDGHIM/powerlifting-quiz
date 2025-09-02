import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer.tsx';
import { Question } from '../../../../types/Quiz.ts';

// Mélange un tableau
const shuffleArray = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

// Calcul du score
const calculateScore = (timeTakenMs: number | null, difficulty: string, consecutive: number) => {
  const baseScore = 10;
  const timeScore = timeTakenMs !== null ? Math.max(0, baseScore - timeTakenMs / 1000) : baseScore;
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  const comboBonus = consecutive > 1 ? consecutive - 1 : 0;
  return (timeScore + comboBonus) * difficultyMultiplier;
};

// URL du backend (Render)
const API_URL = 'https://powerlifting-quiz-2.onrender.com/api';

const QuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = new URLSearchParams(location.search).get('mode') || 'classic';
  const category = new URLSearchParams(location.search).get('category') || 'culture';

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
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveCorrectP1, setConsecutiveCorrectP1] = useState(0);
  const [consecutiveCorrectP2, setConsecutiveCorrectP2] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const [userAnswers, setUserAnswers] = useState<
    { question: string; correctAnswer: string; userAnswer: string; isCorrect: boolean; player?: 1 | 2 }[]
  >([]);

  // ⚡ Récupère les questions depuis le backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_URL}/quiz?category=${encodeURIComponent(category)}`);
        if (!res.ok) throw new Error(`Erreur fetch questions: ${res.status}`);
        const data = (await res.json()) as Question[];
        const shuffled = shuffleArray(data).slice(0, 20).map(q => ({ ...q, answers: shuffleArray(q.answers) }));
        setQuizData(shuffled);
      } catch (err) {
        console.error('Erreur chargement questions:', err);
      }
    };
    fetchQuestions();
  }, [category]);

  useEffect(() => {
    if (quizData.length > 0 && !quizFinished && mode === 'timer') setQuestionStartTime(new Date());
  }, [currentQuestionIndex, quizData, quizFinished, mode]);

  useEffect(() => {
    if (currentQuestionIndex >= quizData.length && quizData.length > 0) setQuizFinished(true);
  }, [currentQuestionIndex, quizData]);

  const nextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex + 1 < quizData.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      if (mode === 'timer') setQuestionStartTime(new Date());
    } else {
      setQuizFinished(true);
      const questionsForResult = quizData.map(q => {
        if (mode === '2players') {
          const p1 = userAnswers.find(ua => ua.question === q.question && ua.player === 1);
          const p2 = userAnswers.find(ua => ua.question === q.question && ua.player === 2);
          return {
            question: q.question,
            correct_answer: q.correctAnswer,
            user_answers: {
              1: p1?.userAnswer ?? 'Non répondu',
              2: p2?.userAnswer ?? 'Non répondu',
            },
          };
        } else {
          const ua = userAnswers.find(ua => ua.question === q.question);
          return {
            question: q.question,
            correct_answer: q.correctAnswer,
            user_answer: ua?.userAnswer ?? 'Non répondu',
          };
        }
      });

      navigate('/result', {
        state:
          mode === '2players'
            ? { scores, total: quizData.length, player1Name, player2Name, category, mode, questions: questionsForResult }
            : { score, total: quizData.length, category, mode, questions: questionsForResult },
      });
    }
  };

  const handleAnswer = (option: string) => {
    if (selectedOption || isPaused) return;
    const currentQuestion = quizData[currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = option === currentQuestion.correctAnswer;
    const now = new Date();
    const timeTaken = questionStartTime ? now.getTime() - questionStartTime.getTime() : null;

    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        correctAnswer: currentQuestion.correctAnswer,
        userAnswer: option,
        isCorrect,
        player: mode === '2players' ? currentPlayer : undefined,
      },
    ]);

    if (mode === '2players') {
      if (currentPlayer === 1) {
        if (isCorrect) {
          const points = calculateScore(null, currentQuestion.difficulty || 'easy', consecutiveCorrectP1 + 1);
          setScores(prev => ({ ...prev, 1: prev[1] + points }));
          setConsecutiveCorrectP1(prev => prev + 1);
        } else setConsecutiveCorrectP1(0);
        setCurrentPlayer(2);
        return;
      }
      if (currentPlayer === 2) {
        if (isCorrect) {
          const points = calculateScore(null, currentQuestion.difficulty || 'easy', consecutiveCorrectP2 + 1);
          setScores(prev => ({ ...prev, 2: prev[2] + points }));
          setConsecutiveCorrectP2(prev => prev + 1);
        } else setConsecutiveCorrectP2(0);
        setTimeout(() => {
          nextQuestion();
          setCurrentPlayer(1);
        }, 500);
        return;
      }
    } else {
      if (isCorrect) {
        const points = calculateScore(mode === 'timer' ? timeTaken : null, currentQuestion.difficulty || 'easy', consecutiveCorrect + 1);
        setScore(prev => prev + points);
        setConsecutiveCorrect(prev => prev + 1);
      } else setConsecutiveCorrect(0);
      setSelectedOption(option);
      setTimeout(nextQuestion, 1000);
    }
  };

  const handleTimeUp = () => {
    setQuizFinished(true);
    navigate('/result', {
      state: {
        score,
        total: quizData.length,
        category,
        mode,
        questions: quizData.map(q => ({
          question: q.question,
          correct_answer: q.correctAnswer,
          user_answer: userAnswers.find(ua => ua.question === q.question)?.userAnswer ?? 'Non répondu',
        })),
      },
    });
  };

  if (quizData.length === 0) return <p>Chargement du quiz...</p>;
  if (quizFinished) return null;

  if (mode === '2players' && !namesEntered) {
    return (
      <div className="quiz-container">
        <h2>Entrez les noms des joueurs</h2>
        <input value={player1Name} onChange={e => setPlayer1Name(e.target.value)} placeholder="Joueur 1" />
        <input value={player2Name} onChange={e => setPlayer2Name(e.target.value)} placeholder="Joueur 2" />
        <button onClick={() => { if (player1Name && player2Name) setNamesEntered(true); }}>Commencer</button>
      </div>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];
  if (!currentQuestion) return <p>Chargement de la question...</p>;

  return (
    <div className="quiz-container">
      <h1>Quiz : {category}</h1>
      {mode === 'timer' && <Timer duration={60} onTimeUp={handleTimeUp} isPaused={isPaused} />}

      {mode === '2players' && (
        <div>
          <h3>À toi {currentPlayer === 1 ? player1Name : player2Name}</h3>
          <p>{player1Name}: {Math.floor(scores[1])} pts | {player2Name}: {Math.floor(scores[2])} pts</p>
        </div>
      )}

      <h2>{currentQuestion.question}</h2>
      <div className="quiz-options">
        {currentQuestion.answers.map((option, idx) => {
          const isCorrect = option === currentQuestion.correctAnswer;
          const isSelected = option === selectedOption;
          let className = 'quiz-option';
          if (selectedOption) {
            if (isCorrect) className += ' correct';
            else if (isSelected && !isCorrect) className += ' wrong';
          }
          return <button key={idx} className={className} onClick={() => handleAnswer(option)} disabled={!!selectedOption || isPaused}>{option}</button>;
        })}
      </div>

      <div className="quiz-controls">
        <button onClick={() => { if (!selectedOption) nextQuestion(); }} disabled={selectedOption !== null || quizFinished}>Passer</button>
        {mode === 'timer' && <button onClick={() => setIsPaused(prev => !prev)}>{isPaused ? 'Reprendre' : 'Pause'}</button>}
      </div>
    </div>
  );
};

export default QuizPage;
