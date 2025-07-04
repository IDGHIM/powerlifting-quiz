// client/src/data/quizData.ts

export type Question = {
  question: string;
  options: string[];
  answer: string;
};

export const quizDatabase: Record<string, Question[]> = {
  culture: [
    { question: "Quel est le premier mouvement en compétition ?", options: ["Squat", "Développé couché", "Soulevé de terre"], answer: "Squat" },
    { question: "Quel est le deuxième mouvement en compétition ?", options: ["Squat", "Développé couché", "Soulevé de terre"], answer: "Développé couché" },
    // ➕ Ajoute ici toutes les questions de culture
  ],
  technique: [
    { question: "Quelle est la largeur autorisée pour la prise au développé couché ?", options: ["81 cm maximum", "70 cm maximum", "90 cm maximum"], answer: "81 cm maximum" },
    { question: "Peut-on rebondir la barre sur la poitrine ?", options: ["Non", "Oui", "Uniquement en échauffement"], answer: "Non" },
    // ➕ Ajoute ici toutes les questions de technique
  ],
  // ➕ Tu peux ajouter d'autres catégories : équipement, historique, etc.
};
