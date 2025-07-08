import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Badges from '../components/Badges.tsx';

interface LocationState {
  // Pour 1 joueur
  score?: number;
  // Pour 2 joueurs
  scores?: { 1: number; 2: number };
  total: number;
  category: string;
  mode: string;
  player1Name?: string;
  player2Name?: string;
}

const ResultPage: React.FC = () => {
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
  } = (location.state || {}) as LocationState;

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
          <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </>
    );
  }

  if (mode === '2players') {
    const player1Score = scores![1];
    const player2Score = scores![2];

    let winnerText = 'Égalité !';
    if (player1Score > player2Score) winnerText = `${player1Name} gagne ! 🎉`;
    else if (player2Score > player1Score) winnerText = `${player2Name} gagne ! 🎉`;

    const player1Percentage = (player1Score / total) * 100;
    const player2Percentage = (player2Score / total) * 100;

    return (
      <>
        <div className="result-container">
          <h1>Résultats : {category}</h1>

          <div>
            <p>
              {player1Name} : {player1Score} / {total} bonnes réponses
            </p>
            <Badges scorePercentage={player1Percentage} />
          </div>

          <div>
            <p>
              {player2Name} : {player2Score} / {total} bonnes réponses
            </p>
            <Badges scorePercentage={player2Percentage} />
          </div>

          <h2>{winnerText}</h2>
        </div>
        <div className="outside-button">
          <button onClick={() => navigate('/')}>Rejouer</button>
        </div>
      </>
    );
  }

  // Mode 1 joueur (classic ou timer)
  const percentage = (score! / total) * 100;

  return (
    <>
      <div className="result-container">
        <h1>Résultats : {category}</h1>
        <p>
          Tu as obtenu {score} / {total} bonnes réponses.
        </p>
        <Badges scorePercentage={percentage} />
      </div>
      <div className="outside-button">
        <button onClick={() => navigate('/')}>Rejouer</button>
      </div>
    </>
  );
};

export default ResultPage;
