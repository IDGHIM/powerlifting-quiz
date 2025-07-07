import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Badge from './../components/badges.tsx';
import './ResultPage.css';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, category } = location.state || {};

  if (score === undefined || total === undefined) {
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

  const percentage = (score / total) * 100;

  return (
    <>
      <div className="result-container">
        <h1>Résultats : {category}</h1>
        <p>Tu as obtenu {score} / {total} bonnes réponses.</p>
        <Badge scorePercentage={percentage} />
      </div>
      <div className="outside-button">
        <button onClick={() => navigate('/')}>Rejouer</button>
      </div>
    </>
  );
};

export default ResultPage;
