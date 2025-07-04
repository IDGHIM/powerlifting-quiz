// client/src/data/quizData.ts

export type Question = {
  question: string;
  options: string[];
  answer: string;
};

export const quizDatabase: Record<string, Question[]> = {
  culture: [
    { question: "Quelle fédération est la plus reconnue à l’international en powerlifting ?", options: ["IPF", "IFBB", "IWF"], answer: "IPF" },
    { question: "Quels sont les trois mouvements du powerlifting ?", options: ["Squat, développé couché, soulevé de terre", "Squat, arraché, épaulé-jeté", "Squat, tractions, pompes"], answer: "Squat, développé couché, soulevé de terre" },
    { question: "Quel équipement est interdit en powerlifting raw ?", options: ["Combinaisons renforcées", "Ceinture", "Genouillères"], answer: "Combinaisons renforcées" },
    { question: "Quel signal termine un soulevé de terre ?", options: ["Down", "Start", "Press"], answer: "Down" },
    { question: "Combien de tentatives par mouvement un athlète a-t-il ?", options: ["3", "2", "4"], answer: "3" },
    { question: "Quel est le rôle du speaker en compétition ?", options: ["Annoncer les charges et les athlètes", "Arbitrer les tentatives", "Donner les signaux de mouvement"], answer: "Annoncer les charges et les athlètes" },
    { question: "Que signifie RAW en powerlifting ?", options: ["Sans équipement renforcé", "Compétition rapide", "Compétition extérieure"], answer: "Sans équipement renforcé" },
    { question: "Quel est l’objectif d’un powerlifter ?", options: ["Soulever le plus lourd sur les 3 mouvements", "Soulever rapidement", "Faire un maximum de répétitions"], answer: "Soulever le plus lourd sur les 3 mouvements" },
    { question: "Quel signal autorise la descente du squat ?", options: ["Squat", "Start", "Down"], answer: "Squat" },
    { question: "Quelle est la largeur maximale des mains au développé couché IPF ?", options: ["81 cm", "75 cm", "85 cm"], answer: "81 cm" },
    { question: "Combien d'arbitres valident une tentative en compétition IPF ?", options: ["3", "2", "4"], answer: "3" },
    { question: "Quel équipement est obligatoire pour le soulevé de terre raw ?", options: ["Chaussettes montantes", "Gants", "Bandes de genoux"], answer: "Chaussettes montantes" },
    { question: "Que signifie un 'bomb out' ?", options: ["Échec des 3 essais d'un mouvement", "Échec du total", "Blessure pendant la compétition"], answer: "Échec des 3 essais d'un mouvement" },
    { question: "Quel est le signal pour reposer la barre au développé couché ?", options: ["Rack", "Press", "Down"], answer: "Rack" },
    { question: "Quelle est la prise la plus courante au soulevé de terre ?", options: ["Prise mixte", "Prise pronation pure", "Prise crochet"], answer: "Prise mixte" },
    { question: "Quel est le rôle des genouillères ?", options: ["Stabiliser et protéger les genoux", "Ajouter de la puissance", "Améliorer la flexibilité"], answer: "Stabiliser et protéger les genoux" },
    { question: "Quel est le temps maximum pour débuter une tentative ?", options: ["1 minute", "30 secondes", "2 minutes"], answer: "1 minute" },
    { question: "Quelle organisation gère les compétitions nationales en France ?", options: ["FFForce", "IFBB", "Fédération Française d'Haltérophilie"], answer: "FFForce" },
    { question: "Que signifie une tentative validée à 3 blancs ?", options: ["Tentative réussie", "Tentative échouée", "Tentative en cours"], answer: "Tentative réussie" },
    { question: "Quel type de chaussures est recommandé pour le squat ?", options: ["Chaussures plates ou talonnées", "Chaussures de course", "Chaussures à talons hauts"], answer: "Chaussures plates ou talonnées" },
    { question: "Que se passe-t-il si un athlète démarre sans signal ?", options: ["Tentative invalidée", "Simple avertissement", "Tentative à refaire"], answer: "Tentative invalidée" },
    { question: "Qu'est-ce qu'un total en powerlifting ?", options: ["La somme des meilleurs essais sur les 3 mouvements", "Le poids maximal soulevé en soulevé de terre", "Le poids moyen des tentatives"], answer: "La somme des meilleurs essais sur les 3 mouvements" },
    { question: "Peut-on porter des gants en compétition IPF ?", options: ["Non", "Oui", "Uniquement au soulevé de terre"], answer: "Non" },
    { question: "Quel est le poids standard d'une barre de compétition ?", options: ["20 kg", "15 kg", "25 kg"], answer: "20 kg" },
    { question: "Quel est le signal pour commencer le développé couché ?", options: ["Start", "Press", "Lift"], answer: "Start" },
    { question: "Quel est le signal pour pousser la barre au développé couché ?", options: ["Press", "Start", "Push"], answer: "Press" },
    { question: "Que signifie une barre validée à 2 blancs et 1 rouge ?", options: ["Tentative réussie", "Tentative échouée", "Tentative à refaire"], answer: "Tentative réussie" },
    { question: "Combien de compétitions peut-on faire dans une saison IPF ?", options: ["Autant que souhaité", "Maximum 3", "Une seule"], answer: "Autant que souhaité" },
    { question: "Quel est le rôle des bandes de poignets ?", options: ["Soutien et protection des poignets", "Augmenter la force", "Rendre la barre plus légère"], answer: "Soutien et protection des poignets" },
    { question: "Peut-on changer sa charge après avoir été appelé ?", options: ["Non", "Oui, une seule fois", "Oui, deux fois"], answer: "Non" },
    { question: "Quel signal donne la fin du squat ?", options: ["Rack", "Down", "Finish"], answer: "Rack" },
    { question: "Que signifie le terme 'open' en compétition ?", options: ["Catégorie sans limite d’âge", "Catégorie débutant", "Catégorie junior"], answer: "Catégorie sans limite d’âge" },
    { question: "Quelle partie du corps doit toucher la poitrine au développé couché ?", options: ["La barre", "Les poignets", "Les coudes"], answer: "La barre" },
    { question: "Que se passe-t-il si la barre est rebondie sur la poitrine ?", options: ["Tentative invalidée", "Tentative acceptée", "Tentative à refaire"], answer: "Tentative invalidée" },
    { question: "Comment sont appelées les barres aux extrémités colorées rouges ?", options: ["25 kg", "20 kg", "15 kg"], answer: "25 kg" },
    { question: "Quels sont les muscles principaux sollicités au soulevé de terre ?", options: ["Fessiers, ischios, dos", "Mollets, pectoraux", "Biceps, triceps"], answer: "Fessiers, ischios, dos" },
    { question: "Quel est le rôle de la ceinture en powerlifting ?", options: ["Stabiliser la ceinture abdominale", "Protéger les poignets", "Réduire la charge"], answer: "Stabiliser la ceinture abdominale" },
    { question: "Quelle catégorie de poids hommes existe en IPF ?", options: ["83 kg", "85 kg", "87 kg"], answer: "83 kg" },
    { question: "Quelle catégorie de poids femmes existe en IPF ?", options: ["63 kg", "65 kg", "67 kg"], answer: "63 kg" },
    { question: "Que signifie une barre refusée à 3 rouges ?", options: ["Tentative échouée", "Tentative réussie", "Tentative suspendue"], answer: "Tentative échouée" },
    { question: "Qui donne les signaux en compétition ?", options: ["L’arbitre central", "Le speaker", "Le coach"], answer: "L’arbitre central" },
    { question: "Peut-on porter des bandes de genoux en compétition raw ?", options: ["Non, uniquement des genouillères", "Oui, toujours", "Uniquement au squat"], answer: "Non, uniquement des genouillères" },
    { question: "Que doit-on faire avant chaque tentative ?", options: ["Attendre le signal de l’arbitre", "Soulever librement", "Regarder le coach"], answer: "Attendre le signal de l’arbitre" },
    { question: "Peut-on échouer une tentative pour mouvement non contrôlé ?", options: ["Oui", "Non", "Uniquement si l’arbitre le dit"], answer: "Oui" },
    { question: "Que signifie 'Wilks' ou 'IPF Points' ?", options: ["Coefficient de performance selon le poids de corps", "Poids maximal de la barre", "Nom d’un mouvement spécial"], answer: "Coefficient de performance selon le poids de corps" },
    { question: "Combien de temps dure généralement une compétition régionale ?", options: ["1 journée", "2 heures", "2 journées"], answer: "1 journée" },
    { question: "Quel est le matériel minimal obligatoire en compétition IPF ?", options: ["Maillot, short, chaussures plates", "Combinaison renforcée, bandes", "Chaussures de course, débardeur"], answer: "Maillot, short, chaussures plates" },
  ],
  technique: [
    { question: "Quelle est la largeur autorisée pour la prise au développé couché ?", options: ["81 cm maximum", "70 cm maximum", "90 cm maximum"], answer: "81 cm maximum" },
    { question: "Peut-on rebondir la barre sur la poitrine ?", options: ["Non", "Oui", "Uniquement en échauffement"], answer: "Non" },
    // ➕ Ajoute ici toutes les questions de technique
  ],
  // ➕ Tu peux ajouter d'autres catégories : équipement, historique, etc.
};
