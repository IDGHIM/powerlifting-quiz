import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; 
import Navbar from '../components/Navbar.tsx'; 
import Footer from '../components/Footer.tsx'; 

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate('/categories'); // Redirige vers la page de quiz
  };

  return (
    <div>
      {/* Section de présentation */}
      <section id="powerlifting">
        <h1>Bienvenue sur Powerlifting Quiz</h1>
        <p>
          Le powerlifting est un sport de force où les athlètes réalisent trois mouvements principaux : le squat, le développé couché et le soulevé de terre. 
          Ce quiz vous permet de tester et d'améliorer vos connaissances sur la discipline, ses règles et son histoire.
        </p>
      </section>

      {/* Section quiz */}
      <section id="quiz">
        <h2>Testez vos connaissances</h2>
        <p>Sélectionnez un quiz !</p>
        <button onClick={handleStartQuiz}>Commencer le Quiz</button>
      </section>
      
    </div>
  );
};

export default HomePage;
