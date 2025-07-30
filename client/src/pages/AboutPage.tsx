import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div>
      <section id="about" className="section-about">
        <h1 className="title">À propos du projet</h1>

        <p className="description">
          Le powerlifting est une discipline de force qui repose sur trois mouvements fondamentaux : le squat, le développé couché et le soulevé de terre.
          Plus qu’un simple sport, c’est une école de rigueur, de progression et de résilience.
        </p>

        <p className="description">
          Ce quiz a été conçu pour transmettre les bases et approfondir les connaissances autour du powerlifting — de manière ludique et structurée.
          Que vous soyez totalement novice ou déjà passionné par ce sport, vous y trouverez des questions pour apprendre, vous challenger et évoluer.
        </p>

        <p className="description">
          L’objectif est simple : <strong>tester, renforcer et élargir vos connaissances</strong> sur l’univers du powerlifting.
          Mouvements, techniques, programmation, nutrition, culture du sport... tout y passe.
        </p>

        <p className="description">
          Bonne chance et bonne progression !
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
