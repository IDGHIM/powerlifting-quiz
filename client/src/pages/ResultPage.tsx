import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Badges from '../components/Badges.tsx';
import { useAuth } from '../features/context/authContext.tsx';

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
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
  const [guestName, setGuestName] = useState(''); // état pour le nom invité

  const handlePublish = async () => {
    const usernameToSend = user?.username || guestName.trim();

    if (!usernameToSend) {
      alert('Veuillez entrer votre nom avant de publier le score.');
      return;
    }

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
            username: usernameToSend,
            points: Math.floor(score!),
            mode,
            category,
          },
        ];

    try {
      const res = await fetch('https://powerlifting-quiz-2.onrender.com/api/ranking', {
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

  // Gestion des cas où les données sont manquantes
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

  // Mode deux joueurs
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

  // Mode solo
  const percentage = (score! / total) * 100;

  return (
    <>
      <div className="result-container">
        <h1>Résultats : {category}</h1>
        <p>Tu as obtenu {score} points</p>
        <Badges scorePercentage={percentage} />

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
        {!published && !user?.username && (
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Entrez votre nom"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="quiz-option"
            />
          </div>
        )}

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
