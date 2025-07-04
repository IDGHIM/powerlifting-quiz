import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const quizData: Question[] = [
  { question: "Quel est le premier mouvement en compétition ?", options: ["Squat", "Développé couché", "Soulevé de terre"], answer: "Squat" },
  { question: "Quel est le deuxième mouvement en compétition ?", options: ["Squat", "Développé couché", "Soulevé de terre"], answer: "Développé couché" },
  { question: "Quel est le dernier mouvement en compétition ?", options: ["Squat", "Développé couché", "Soulevé de terre"], answer: "Soulevé de terre" },
  { question: "Quel est l'objectif principal en powerlifting ?", options: ["Soulever le maximum de poids sur trois mouvements", "Soulever le plus vite possible", "Faire des séries longues"], answer: "Soulever le maximum de poids sur trois mouvements" },
  { question: "Quel équipement est autorisé en powerlifting raw ?", options: ["Ceinture, genouillères, chaussettes montantes, chaussures plates", "Combinaison équipée, bandes de genoux", "Tout équipement est autorisé"], answer: "Ceinture, genouillères, chaussettes montantes, chaussures plates" },
  { question: "Combien de tentatives par mouvement sont autorisées ?", options: ["3", "4", "2"], answer: "3" },
  { question: "Quelle organisation internationale gère le powerlifting ?", options: ["IPF", "IFBB", "IWF"], answer: "IPF" },
  { question: "Quel est le rôle des arbitres ?", options: ["Valider ou refuser les tentatives", "Compter les répétitions", "Encourager les athlètes"], answer: "Valider ou refuser les tentatives" },
  { question: "Quel signal donne le début du squat ?", options: ["Squat", "Start", "Press"], answer: "Squat" },
  { question: "Quel signal donne le début du développé couché ?", options: ["Start", "Press", "Rack"], answer: "Start" },
  { question: "Quel signal donne la poussée au développé couché ?", options: ["Press", "Push", "Lift"], answer: "Press" },
  { question: "Quel signal termine le soulevé de terre ?", options: ["Down", "Stop", "Release"], answer: "Down" },
  { question: "Quelle est la largeur autorisée pour la prise au développé couché ?", options: ["81 cm maximum", "70 cm maximum", "90 cm maximum"], answer: "81 cm maximum" },
  { question: "Qu'est-ce qu'un total en powerlifting ?", options: ["La somme des meilleurs essais de chaque mouvement", "Le nombre total de répétitions", "Le poids total soulevé pendant l'échauffement"], answer: "La somme des meilleurs essais de chaque mouvement" },
  { question: "Quel est le temps maximum pour débuter une tentative après l'annonce ?", options: ["1 minute", "30 secondes", "2 minutes"], answer: "1 minute" },
  { question: "Quelle prise est autorisée au soulevé de terre ?", options: ["Prise mixte ou pronation", "Prise supination obligatoire", "Prise crochet obligatoire"], answer: "Prise mixte ou pronation" },
  { question: "Qu'est-ce qu'une barre validée à 3 blancs ?", options: ["Tentative réussie", "Tentative échouée", "Tentative en cours"], answer: "Tentative réussie" },
  { question: "Quel est le rôle du speaker ?", options: ["Annoncer les charges et les athlètes", "Donner les signaux", "Encourager les compétiteurs"], answer: "Annoncer les charges et les athlètes" },
  { question: "Combien d'arbitres sont présents sur la plateforme ?", options: ["3", "2", "4"], answer: "3" },
  { question: "Qu'est-ce qu'un 'bomb out' ?", options: ["Échec des trois tentatives sur un mouvement", "Soulever sans ceinture", "Refus de tentative"], answer: "Échec des trois tentatives sur un mouvement" },
  { question: "Que signifie RAW en powerlifting ?", options: ["Compétition sans matériel équipé", "Compétition rapide", "Compétition en extérieur"], answer: "Compétition sans matériel équipé" },
  { question: "Quel est le rôle de la ceinture ?", options: ["Stabiliser la ceinture abdominale", "Augmenter la charge", "Réduire la pression sanguine"], answer: "Stabiliser la ceinture abdominale" },
  { question: "Quel signal valide la remontée du squat ?", options: ["Squat", "Start", "None, l'athlète démarre seul"], answer: "Squat" },
  { question: "Que se passe-t-il si l'athlète débute avant le signal ?", options: ["Tentative invalidée", "Avertissement simple", "Deuxième chance immédiate"], answer: "Tentative invalidée" },
  { question: "Qu'est-ce qu'une catégorie de poids ?", options: ["Classement selon le poids de corps", "Classement selon la taille", "Classement selon l'âge"], answer: "Classement selon le poids de corps" },
  { question: "Combien d'essais peut-on changer au dernier moment ?", options: ["Le 3ème essai peut être modifié une fois", "Aucun changement possible", "Tous les essais sont modifiables"], answer: "Le 3ème essai peut être modifié une fois" },
  { question: "Quand le powerlifting est-il devenu sport officiel ?", options: ["Années 70", "Années 50", "Années 90"], answer: "Années 70" },
  { question: "Quel est le principal risque en powerlifting ?", options: ["Blessures lombaires", "Blessures cardiaques", "Blessures aux bras"], answer: "Blessures lombaires" },
  { question: "Quel est le matériel autorisé pour les poignets ?", options: ["Bandes de poignets", "Bracelets métalliques", "Gants de protection"], answer: "Bandes de poignets" },
  { question: "Quelle est la durée d'une compétition de powerlifting ?", options: ["Variable selon le nombre de participants", "2 heures", "4 heures"], answer: "Variable selon le nombre de participants" },
  { question: "Combien de catégories de poids existent chez les hommes ?", options: ["8", "10", "12"], answer: "8" },
  { question: "Combien de catégories de poids existent chez les femmes ?", options: ["7", "8", "9"], answer: "7" },
  { question: "Que signifie l’acronyme IPF ?", options: ["International Powerlifting Federation", "International Performance Federation", "International Power Federation"], answer: "International Powerlifting Federation" },
  { question: "Quel est l’objectif du développé couché ?", options: ["Amener la barre à la poitrine et la repousser", "Soulever la barre au-dessus de la tête", "Soulever la barre à une main"], answer: "Amener la barre à la poitrine et la repousser" },
  { question: "Quel est le bon placement des pieds au développé couché ?", options: ["Pieds bien ancrés au sol", "Pieds sur le banc", "Pieds dans le vide"], answer: "Pieds bien ancrés au sol" },
  { question: "Peut-on rebondir la barre sur la poitrine ?", options: ["Non", "Oui", "Uniquement en échauffement"], answer: "Non" },
  { question: "Quelle est la durée maximale pour se présenter sur la plateforme ?", options: ["1 minute", "2 minutes", "30 secondes"], answer: "1 minute" },
  { question: "Que signifie une barre validée à 2 blancs et 1 rouge ?", options: ["Tentative réussie", "Tentative échouée", "Tentative à refaire"], answer: "Tentative réussie" },
  { question: "Le soulevé de terre demande-t-il un équipement spécifique ?", options: ["Non, sauf ceinture et chaussettes hautes", "Oui, combinaison obligatoire", "Oui, harnais spécial"], answer: "Non, sauf ceinture et chaussettes hautes" },
  { question: "Quel est le signal pour reposer la barre au développé couché ?", options: ["Rack", "Stop", "Down"], answer: "Rack" },
  { question: "Peut-on échouer un mouvement si la profondeur n’est pas suffisante ?", options: ["Oui", "Non", "Uniquement si les arbitres avertissent"], answer: "Oui" },
  { question: "Qu’est-ce qu’un échec technique ?", options: ["Erreur dans l'exécution du mouvement", "Erreur de timing", "Erreur dans le choix de la charge"], answer: "Erreur dans l'exécution du mouvement" },
  { question: "Qu’est-ce qu’un ‘deadlift’ ?", options: ["Soulevé de terre", "Développé couché", "Squat profond"], answer: "Soulevé de terre" },
  { question: "Que signifie le signal ‘start’ au développé couché ?", options: ["Début du mouvement autorisé", "Fin du mouvement", "Arrêt de la tentative"], answer: "Début du mouvement autorisé" },
  { question: "Quels muscles sont principalement sollicités au squat ?", options: ["Quadriceps, fessiers, lombaires", "Biceps, triceps", "Mollets, épaules"], answer: "Quadriceps, fessiers, lombaires" },
  { question: "Quelle est la pénalité si l’athlète laisse tomber la barre ?", options: ["Tentative non validée", "Avertissement", "Exclusion de la compétition"], answer: "Tentative non validée" },
  { question: "Quel est le minimum d'arbitres requis pour une compétition officielle IPF ?", options: ["3", "2", "4"], answer: "3" },
  { question: "Quel est le rôle des genouillères ?", options: ["Maintien et protection des genoux", "Augmenter la charge", "Décoration uniquement"], answer: "Maintien et protection des genoux" },
];

const QuizPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    setSelectedOption(option);
    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestionIndex + 1 < quizData.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  return (
    <div>
      <h1>Quiz : {category === 'culture' ? 'Culture Powerlifting' : 'Autre Quiz'}</h1>
      <p>Ici, tu vas répondre à un quiz sur : {category}</p>

      {!showResult ? (
        <div>
          <h2>Question {currentQuestionIndex + 1} / {quizData.length}</h2>
          <p>{currentQuestion.question}</p>
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              style={{ margin: '5px' }}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <h2>Quiz terminé !</h2>
          <p>Votre score : {score} / {quizData.length}</p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
