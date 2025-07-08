import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

  const AboutPage: React.FC = () => {
    const navigate = useNavigate();
     const handleRedirect = () => {
    window.location.href = 'https://idghim.github.io/fcc-Portofolio-Webpage/'; }
    const handleStartQuiz = () => {
        navigate('/about');
    };
    
    return (
        <div>
            <section id="about" className="section-about">
                <h1 className="title">À propos de moi</h1>
                <p className="description">
                    Forger du code comme on forge un corps.
                    Intégrateur web junior à Agen, je transforme des idées en interfaces modernes, fluides et responsives. Mais ma vraie force, 
                    je la tire du powerlifting un sport où chaque kilo soulevé est une leçon de rigueur, de patience et de dépassement de soi.
                    C’est dans cette discipline exigeante que j’ai appris à viser l’excellence, à repousser mes limites,
                    et à ne jamais laisser place à l’à-peu-près. Autant de valeurs que j’applique au pixel près dans chacun de mes projets web.
                </p>
                <button className="start-button" onClick={handleRedirect}>Mon portfolio</button>
            </section>
        </div>
    );
  };

export default AboutPage;