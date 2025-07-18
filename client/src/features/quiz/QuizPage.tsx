import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from '../../components/Timer.tsx';
import './QuizPage.css';
import { Question } from '../../../../types/Quiz.ts';

// Fonction utilitaire pour mélanger un tableau (questions ou réponses)
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Fonction de calcul du score en fonction du temps, de la difficulté et du combo
const calculateScore = (
  timeTakenMs: number | null,
  difficulty: string,
  consecutive: number
) => {
  const baseScore = 10;
  const timeScore = timeTakenMs !== null ? Math.max(0, baseScore - timeTakenMs / 1000) : baseScore;
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
  const comboBonus = consecutive > 1 ? consecutive - 1 : 0;
  return (timeScore + comboBonus) * difficultyMultiplier;
};

// Composant principal de la page Quiz
const QuizPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupération des paramètres de mode et catégorie depuis l'URL
  const mode = new URLSearchParams(location.search).get('mode') || 'classic';
  const category = new URLSearchParams(location.search).get('category') || 'culture';

  // États principaux liés au quiz
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // États pour le mode 2 joueurs
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [namesEntered, setNamesEntered] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState<{ 1: number; 2: number }>({ 1: 0, 2: 0 });
  const [hasPlayer1Answered, setHasPlayer1Answered] = useState(false);
  const [hasPlayer2Answered, setHasPlayer2Answered] = useState(false);

  // États liés au système de temps et combo
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [consecutiveCorrectP1, setConsecutiveCorrectP1] = useState(0);
  const [consecutiveCorrectP2, setConsecutiveCorrectP2] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Nouvel état pour stocker les réponses de l'utilisateur
  const [userAnswers, setUserAnswers] = useState<{
    question: string;
    correctAnswer: string;
    userAnswer: string;
    isCorrect: boolean;
    player?: 1 | 2;
  }[]>([]);

  // Effet qui récupère les questions au chargement de la page
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/quiz?category=${encodeURIComponent(category)}`);
        if (!res.ok) throw new Error('Erreur chargement questions');
        const data = (await res.json()) as Question[];
        // Mélange des questions et des réponses
        const shuffled = shuffleArray(data).slice(0, 20).map(q => ({ ...q, answers: shuffleArray(q.answers) }));
        setQuizData(shuffled);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [category]);

  // Initialise le timer au chargement de chaque nouvelle question en mode timer
  useEffect(() => {
    if (quizData.length > 0 && !quizFinished && mode === 'timer') {
      setQuestionStartTime(new Date());
    }
  }, [currentQuestionIndex, quizData, quizFinished, mode]);

  // Si currentQuestionIndex dépasse quizData.length, terminer le quiz
  useEffect(() => {
    if (currentQuestionIndex >= quizData.length && quizData.length > 0) {
      setQuizFinished(true);
    }
  }, [currentQuestionIndex, quizData]);

  // Gère la logique de réponse à une question
  const handleAnswer = (option: string) => {
    if (selectedOption || isPaused) return;
    const currentQuestion = quizData[currentQuestionIndex];
    if (!currentQuestion) return; // Sécurité supplémentaire

    const isCorrect = option === currentQuestion.correctAnswer;
    const now = new Date();
    const timeTaken = questionStartTime ? now.getTime() - questionStartTime.getTime() : null;

    // Stocke la réponse dans le state avec indication du joueur (mode 2 joueurs)
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
        } else {
          setConsecutiveCorrectP1(0);
        }
        setHasPlayer1Answered(true);
        setCurrentPlayer(2);
        return;
      }
      if (currentPlayer === 2) {
        if (isCorrect) {
          const points = calculateScore(null, currentQuestion.difficulty || 'easy', consecutiveCorrectP2 + 1);
          setScores(prev => ({ ...prev, 2: prev[2] + points }));
          setConsecutiveCorrectP2(prev => prev + 1);
        } else {
          setConsecutiveCorrectP2(0);
        }
        setHasPlayer2Answered(true);
        setTimeout(() => {
          nextQuestion();
          setCurrentPlayer(1);
          setHasPlayer1Answered(false);
          setHasPlayer2Answered(false);
        }, 500);
        return;
      }
    } else {
      // Mode solo ou timer
      if (isCorrect) {
        const points = calculateScore(
          mode === 'timer' ? timeTaken : null,
          currentQuestion.difficulty || 'easy',
          consecutiveCorrect + 1
        );
        setScore(prev => prev + points);
        setConsecutiveCorrect(prev => prev + 1);
      } else {
        setConsecutiveCorrect(0);
      }
      setSelectedOption(option);
      setTimeout(() => nextQuestion(), 1000);
    }
  };

  // Passe à la question suivante ou termine le quiz si toutes les questions sont répondues
  const nextQuestion = () => {
    setSelectedOption(null);

    if (currentQuestionIndex + 1 < quizData.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      if (mode === 'timer') setQuestionStartTime(new Date());
    } else {
      setQuizFinished(true);

      // Construire tableau questions avec réponses formatées pour la ResultPage
      let questionsForResult: {
        question: string;
        correct_answer: string;
        user_answer?: string;
        user_answers?: { 1: string; 2: string };
      }[] = [];

      if (mode === '2players') {
        questionsForResult = quizData.map(q => {
          // Trouver réponses des deux joueurs pour cette question
          const p1AnswerObj = userAnswers.find(
            ua => ua.question === q.question && ua.player === 1
          );
          const p2AnswerObj = userAnswers.find(
            ua => ua.question === q.question && ua.player === 2
          );
          return {
            question: q.question,
            correct_answer: q.correctAnswer,
            user_answers: {
              1: p1AnswerObj?.userAnswer ?? 'Non répondu',
              2: p2AnswerObj?.userAnswer ?? 'Non répondu',
            },
          };
        });
      } else {
        questionsForResult = quizData.map(q => {
          const answerObj = userAnswers.find(ua => ua.question === q.question);
          return {
            question: q.question,
            correct_answer: q.correctAnswer,
            user_answer: answerObj?.userAnswer ?? 'Non répondu',
          };
        });
      }

      navigate('/result', {
        state:
          mode === '2players'
            ? {
                scores,
                total: quizData.length,
                player1Name,
                player2Name,
                category,
                mode,
                questions: questionsForResult,
              }
            : {
                score,
                total: quizData.length,
                category,
                mode,
                questions: questionsForResult,
              },
      });
    }
  };

  // Fonction déclenchée quand le temps est écoulé en mode timer
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
          user_answer:
            userAnswers.find(ua => ua.question === q.question)?.userAnswer ?? 'Non répondu',
        })),
      },
    });
  };

  // Si les données ne sont pas encore chargées
  if (quizData.length === 0) return <p>Chargement du quiz...</p>;

  // Si le quiz est terminé
  if (quizFinished) return null;

  // Saisie des noms des joueurs pour le mode 2 joueurs
  if (mode === '2players' && !namesEntered) {
    return (
      <div className="quiz-container">
        <h2>Entrez les noms des joueurs</h2>
        <input
          value={player1Name}
          onChange={(e) => setPlayer1Name(e.target.value)}
          placeholder="Joueur 1"
          className="input-name"
        />
        <input
          value={player2Name}
          onChange={(e) => setPlayer2Name(e.target.value)}
          placeholder="Joueur 2"
          className="input-name"
        />
        <button
          onClick={() => {
            if (player1Name && player2Name) setNamesEntered(true);
          }}
          className="start-button"
        >
          Commencer
        </button>
      </div>
    );
  }

  // Récupération sécurisée de la question actuelle
  const currentQuestion = quizData[currentQuestionIndex];
  if (!currentQuestion) return <p>Chargement de la question...</p>;

  // Rendu principal du quiz
  return (
    <div className="quiz-container">
      <h1>Quiz : {category}</h1>

      {mode === 'timer' && <Timer duration={60} onTimeUp={handleTimeUp} isPaused={isPaused} />}

      {mode === '2players' && (
        <div>
          <h3>À toi {currentPlayer === 1 ? player1Name : player2Name}</h3>
          <p>
            {player1Name}: {Math.floor(scores[1])} pts | {player2Name}: {Math.floor(scores[2])} pts
          </p>
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

          return (
            <button
              key={idx}
              className={className}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedOption || isPaused}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizPage;
