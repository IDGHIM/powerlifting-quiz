import React from 'react';
import { useNavigate } from 'react-router-dom';
//import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/categories');
  };

  return (
    <div className="homepage-container">

      {/* Section de présentation */}
      <section id="powerlifting" className="section-presentation">
        <h1 className="title">Bienvenue sur Powerlifting Quiz</h1>
        <button className="start-button" onClick={handleStartQuiz}>Commencer le Quiz</button>
      </section>

    </div>
  );
};

export default HomePage;
