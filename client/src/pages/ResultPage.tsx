import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Badges from '../components/Badges.tsx';
import './ResultPage.css';

// Interface pour typer une question et ses réponses
interface Question {
  question: string;
  correct_answer: string;
  user_answer?: string; // Réponse du joueur (mode solo)
  user_answers?: { 1: string; 2: string }; // Réponses des deux joueurs
}

// Interface pour typer les données envoyées via navigation
interface LocationState {
  score?: number;
  scores?: { 1: number; 2: number };
  total: number;
  category: string;
  mode: string;
  player1Name?: string;
  player2Name?: string;
  questions: Question[];
}

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Récupération des données envoyées dans state
  const {
    score,
    scores,
    total,
    category,
    mode,
    player1Name = 'Joueur 1',
    player2Name = 'Joueur 2',
    questions = [],
  } = (location.state || {}) as LocationState;

  const [published, setPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);

    const payload = mode === '2players'
      ? [
          {
            username: player1Name,
            points: Math.floor(scores![1]),
            mode,
            category,
          },
          {
            username: player2Name,
            points: Math.floor(scores![2]),
            mode,
            category,
          },
        ]
      : [
          {
            username: 'Utilisateur', // Remplace par un vrai nom si disponible
            points: Math.floor(score!),
            mode,
            category,
          },
        ];

    try {
      const res = await fetch('http://localhost:5001/api/ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setPublished(true);
      } else {
        alert('Erreur lors de la publication du score.');
      }
    } catch (err) {
      console.error('Erreur lors de la publication :', err);
    } finally {
      setIsPublishing(false);
    }
  };

  // Vérification de la présence des données essentielles
  if (
    (mode === '2players' && (!scores || total === undefined)) ||
    ((mode === 'classic' || mode === 'timer') && (score === undefined || total === undefined))
  ) {
    return (
      <>
        <div className="result-container">
          <h2>Données manquantes</h2>
        </div>
        <div className="outside-button">
          <button className="quiz-option" onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </>
    );
  }

  // Affichage spécifique au mode 2 joueurs
  if (mode === '2players' && scores) {
    const player1Score = scores[1];
    const player2Score = scores[2];

    const player1Percentage = (player1Score / total) * 100;
    const player2Percentage = (player2Score / total) * 100;

    const winnerText = player1Score === player2Score
      ? 'Égalité !'
      : player1Score > player2Score
      ? `${player1Name} a gagné(e) ! 🎉`
      : `${player2Name} a gagné(e) ! 🎉`;

    return (
      <>
        <div className="result-container">
          <h1>Résultats : {category}</h1>

          <div>
            <p>{player1Name} : {Math.floor(player1Score)} points</p>
            <Badges scorePercentage={player1Percentage} />
          </div>

          <div>
            <p>{player2Name} : {Math.floor(player2Score)} points</p>
            <Badges scorePercentage={player2Percentage} />
          </div>

          <h2>{winnerText}</h2>

          {/* Affichage des questions et corrections */}
          <div className="corrections">
            <h3>Correction des questions :</h3>
            {questions.length === 0 ? (
              <p>Aucune question trouvée.</p>
            ) : (
              questions.map((q, idx) => (
                <div key={idx} className="question-correction">
                  <p><strong>Question {idx + 1} :</strong> {q.question}</p>
                  <p>✔️ Bonne réponse : {q.correct_answer}</p>
                  <p>
                    👤 {player1Name} : {q.user_answers?.[1] ?? 'Non répondu'}{' '}
                    {q.user_answers?.[1] === q.correct_answer ? '✅' : '❌'}
                  </p>
                  <p>
                    👤 {player2Name} : {q.user_answers?.[2] ?? 'Non répondu'}{' '}
                    {q.user_answers?.[2] === q.correct_answer ? '✅' : '❌'}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="outside-button">
          {!published ? (
            <button className="quiz-option" onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? 'Publication...' : 'Publier les scores'}
            </button>
          ) : (
            <p>✅ Scores publiés avec succès !</p>
          )}
          <button className="quiz-option" onClick={() => navigate('/')}>Rejouer</button>
        </div>
      </>
    );
  }

  // Affichage pour mode solo (classic ou timer)
  const percentage = (score! / total) * 100;

  return (
    <>
      <div className="result-container">
        <h1>Résultats : {category}</h1>
        <p>Tu as obtenu {score} points</p>
        <Badges scorePercentage={percentage} />

        {/* Correction des questions */}
        <div className="corrections">
          <h3>Correction des questions :</h3>
          {questions.length === 0 ? (
            <p>Aucune question trouvée.</p>
          ) : (
            questions.map((q, idx) => (
              <div key={idx} className="question-correction">
                <p><strong>Question {idx + 1} :</strong> {q.question}</p>
                <p>✔️ Bonne réponse : {q.correct_answer}</p>
                <p>
                  👤 Ta réponse : {q.user_answer ?? 'Non répondu'}{' '}
                  {q.user_answer === q.correct_answer ? '✅' : '❌'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="outside-button">
        {!published ? (
          <button className="quiz-option" onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? 'Publication...' : 'Publier mon score'}
          </button>
        ) : (
          <p>✅ Score publié avec succès !</p>
        )}
        <button className="quiz-option" onClick={() => navigate('/categories')}>Rejouer</button>
      </div>
    </>
  );
};

export default ResultPage;
