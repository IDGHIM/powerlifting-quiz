import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div>
      <h1>Bienvenue sur le Powerlifting Quiz</h1>
      <button onClick={handleStartQuiz}>Commencer le Quiz</button>
    </div>
  );
};

export default HomePage;
