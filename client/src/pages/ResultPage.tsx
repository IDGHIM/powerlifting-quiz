import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Badges from '../components/Badges.tsx';

// Interface pour typer les données reçues via la navigation (state)
interface LocationState {
  // Score pour 1 joueur
  score?: number;
  // Scores pour 2 joueurs
  scores?: { 1: number; 2: number };
  total: number; // Nombre total de questions
  category: string; // Catégorie du quiz
  mode: string; // Mode de jeu (classic, timer, 2players)
  player1Name?: string; // Nom du joueur 1 (optionnel)
  player2Name?: string; // Nom du joueur 2 (optionnel)
}

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extraction des données depuis le state de la navigation
  const {
    score,
    scores,
    total,
    category,
    mode,
    player1Name = 'Joueur 1', // Valeurs par défaut si noms non fournis
    player2Name = 'Joueur 2',
  } = (location.state || {}) as LocationState;

  // Vérification de la présence des données nécessaires en fonction du mode
  if (
    (mode === '2players' && (!scores || total === undefined)) ||
    ((mode === 'classic' || mode === 'timer') && (score === undefined || total === undefined))
  ) {
    // Si les données sont manquantes, afficher un message d'erreur simple
    return (
      <>
        <div className="result-container">
          <h2>Données manquantes</h2>
        </div>
        <div className="outside-button">
          {/* Bouton pour revenir à l'accueil */}
          <button onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </>
    );
  }

  // Cas du mode 2 joueurs
  if (mode === '2players') {
    const player1Score = scores![1];
    const player2Score = scores![2];

    // Détermination du gagnant ou égalité
    let winnerText = 'Égalité !';
    if (player1Score > player2Score) winnerText = `${player1Name} gagne ! 🎉`;
    else if (player2Score > player1Score) winnerText = `${player2Name} gagne ! 🎉`;

    // Calcul du pourcentage de bonnes réponses par joueur
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
            {/* Affichage des badges basés sur le pourcentage */}
            <Badges scorePercentage={player1Percentage} />
          </div>

          <div>
            <p>
              {player2Name} : {player2Score} / {total} bonnes réponses
            </p>
            <Badges scorePercentage={player2Percentage} />
          </div>

          {/* Message indiquant le gagnant ou l'égalité */}
          <h2>{winnerText}</h2>
        </div>

        {/* Bouton pour rejouer */}
        <div className="outside-button">
          <button onClick={() => navigate('/')}>Rejouer</button>
        </div>
      </>
    );
  }

  // Cas des modes 1 joueur (classic ou timer)
  const percentage = (score! / total) * 100;

  return (
    <>
      <div className="result-container">
        <h1>Résultats : {category}</h1>
        <p>
          Tu as obtenu {score} / {total} bonnes réponses.
        </p>
        {/* Affichage du badge basé sur le pourcentage */}
        <Badges scorePercentage={percentage} />
      </div>

      {/* Bouton pour rejouer */}
      <div className="outside-button">
        <button onClick={() => navigate('/')}>Rejouer</button>
      </div>
    </>
  );
};

export default ResultPage;
