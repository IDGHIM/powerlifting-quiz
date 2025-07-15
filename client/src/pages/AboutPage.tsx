import React from 'react';
import { useNavigate } from 'react-router-dom';

  const AboutPage: React.FC = () => {
    const navigate = useNavigate();
     const handleRedirectPortfolio = () => {
    window.location.href = 'https://idghim.github.io/fcc-Portofolio-Webpage/'; }
    const handleRedirectLinkedin = () => {
    window.location.href = 'https://www.linkedin.com/in/ichem-dghim/'; }
    const handleStartQuiz = () => {
        navigate('/about');
    };
    
    return (
        <div>
            <section id="about" className="section-about">
                <h1 className="title">À propos de moi</h1>
                <p className="description">
                    Forger du code comme on forge un corps. 
                </p>
                <p className="description">
                    Intégrateur web junior à Agen, je transforme des idées en interfaces modernes, fluides et responsives. Mais ma vraie force, 
                    je la tire du powerlifting un sport où chaque kilo soulevé est une leçon de rigueur, de patience et de dépassement de soi.
                </p>
                <p className="description">
                    C’est dans cette discipline exigeante que j’ai appris à viser l’excellence, à repousser mes limites,
                    et à ne jamais laisser place à l’à-peu-près. Autant de valeurs que j’applique au pixel près dans chacun de mes projets web.
                </p>
                <button className="start-button" onClick={handleRedirectPortfolio}>Mon portfolio</button>
                <button className="start-button" onClick={handleRedirectLinkedin}>Mon linkedin</button>
            </section>
        </div>
    );
  };

export default AboutPage;