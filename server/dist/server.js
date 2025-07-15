"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5000;
// Activer CORS pour autoriser les requêtes frontend (localhost:3000 par ex.)
app.use((0, cors_1.default)());
// Exemple de base de données quiz (à remplacer par tes vraies données)
const quizDatabase = {
    culture: [
        { question: "Qui est considéré comme le 'GOAT' (Greatest Of All Time) du powerlifting ?", answers: ["Ed Coan", "Ray Williams", "John Haack"], correctAnswer: "Ed Coan", difficulty: 'medium', category: "culture" },
        { question: "Quel athlète a soulevé plus de 500 kg au deadlift pour la première fois ?", answers: ["Hafthor Bjornsson", "Eddie Hall", "Benedikt Magnússon"], correctAnswer: "Eddie Hall", difficulty: 'easy', category: "culture" },
        { question: "Quelle fédération organise les championnats du monde les plus reconnus en powerlifting ?", answers: ["IPF", "USPA", "WRPF"], correctAnswer: "IPF", difficulty: "easy", category: "culture" },
        { question: "Quel powerlifter détient le record du monde IPF en squat sans équipement en +120 kg (au moment de la rédaction) ?", answers: ["Ray Williams", "Blaine Sumner", "Jesus Olivares"], correctAnswer: "Jesus Olivares", difficulty: "hard", category: "culture" },
        { question: "Quel lifter est célèbre pour avoir battu des records dans trois catégories de poids différentes ?", answers: ["Ed Coan", "Russel Orhii", "Taylor Atwood"], correctAnswer: "Ed Coan", difficulty: "medium", category: "culture" },
        { question: "Quelle légende a été surnommée 'Mr. Squat' ?", answers: ["Fred Hatfield", "Dan Green", "Kirk Karwoski"], correctAnswer: "Kirk Karwoski", difficulty: "medium", category: "culture" },
        { question: "Qui a détenu un temps le plus gros total raw toutes catégories confondues ?", answers: ["John Haack", "Dan Bell", "Larry Wheels"], correctAnswer: "Dan Bell", difficulty: "medium", category: "culture" },
        { question: "Quel powerlifter est connu pour avoir popularisé le sumo deadlift ?", answers: ["Konstantin Konstantinovs", "Ed Coan", "Yury Belkin"], correctAnswer: "Yury Belkin", difficulty: "hard", category: "culture" },
        { question: "Quel pays domine historiquement le powerlifting IPF ?", answers: ["États-Unis", "Russie", "Ukraine"], correctAnswer: "États-Unis", difficulty: "easy", category: "culture" },
        { question: "Qui est célèbre pour avoir réalisé un deadlift de 426 kg à moins de 83 kg de poids de corps ?", answers: ["John Haack", "Russel Orhii", "Taylor Atwood"], correctAnswer: "John Haack", difficulty: "hard", category: "culture" },
        { question: "Quelle athlète est la première femme à avoir dépassé les 600 kg de total raw en IPF ?", answers: ["Amanda Lawrence", "Heather Connor", "Bonica Brown"], correctAnswer: "Amanda Lawrence", difficulty: "medium", category: "culture" },
        { question: "Quelle légende du powerlifting est célèbre pour son attitude humble et son respect des règles ?", answers: ["Ed Coan", "Dan Green", "Larry Wheels"], correctAnswer: "Ed Coan", difficulty: "easy", category: "culture" },
        { question: "Quel est le surnom du powerlifter Dan Green ?", answers: ["The Boss", "The Machine", "The Beast"], correctAnswer: "The Boss", difficulty: "medium", category: "culture" },
        { question: "Qui est reconnu pour avoir battu de nombreux records IPF en -74 kg avec une technique parfaite ?", answers: ["Taylor Atwood", "Russel Orhii", "John Haack"], correctAnswer: "Taylor Atwood", difficulty: "medium", category: "culture" },
        { question: "Quel powerlifter a réalisé le premier squat raw validé à plus de 460 kg ?", answers: ["Ray Williams", "Dan Bell", "Jesus Olivares"], correctAnswer: "Ray Williams", difficulty: "hard", category: "culture" },
        { question: "Quelle athlète IPF est célèbre pour son deadlift exceptionnel en -47 kg ?", answers: ["Heather Connor", "Amanda Lawrence", "Kimberly Walford"], correctAnswer: "Heather Connor", difficulty: "medium", category: "culture" },
        { question: "Qui est considéré comme l'un des meilleurs coachs et lifters de powerlifting moderne ?", answers: ["Joey Flexx", "Bryce Lewis", "Boris Sheiko"], correctAnswer: "Joey Flexx", difficulty: "medium", category: "culture" },
        { question: "Quel lifter est connu pour son physique impressionnant et ses performances dans plusieurs disciplines ?", answers: ["Larry Wheels", "Russel Orhii", "Dan Green"], correctAnswer: "Larry Wheels", difficulty: "easy", category: "culture" },
        { question: "Quel record mondial IPF a été détenu longtemps par Russel Orhii en -83 kg ?", answers: ["Squat", "Total", "Deadlift"], correctAnswer: "Squat", difficulty: "medium", category: "culture" },
        { question: "Quel lifter russe est célèbre pour ses records impressionnants en deadlift sumo ?", answers: ["Yury Belkin", "Benedikt Magnússon", "Konstantin Konstantinovs"], correctAnswer: "Yury Belkin", difficulty: "hard", category: "culture" },
        { question: "Qui détient le plus gros deadlift IPF féminin raw toutes catégories confondues ?", answers: ["Bonica Brown", "Amanda Lawrence", "Samantha Calhoun"], correctAnswer: "Amanda Lawrence", difficulty: "medium", category: "culture" },
        { question: "Quelle légende est célèbre pour ses vidéos de training sans ceinture ni équipement ?", answers: ["Konstantin Konstantinovs", "Kirk Karwoski", "Dan Bell"], correctAnswer: "Konstantin Konstantinovs", difficulty: "hard", category: "culture" },
        { question: "Quel est le record IPF actuel du total en -74 kg ?", answers: ["813 kg", "790 kg", "805 kg"], correctAnswer: "813 kg", difficulty: "hard", category: "culture" },
        { question: "Quelle fédération est connue pour organiser la compétition 'The Ghost Clash' ?", answers: ["WRPF", "USAPL", "IPF"], correctAnswer: "WRPF", difficulty: "medium", category: "culture" },
        { question: "Quelle légende féminine est reconnue pour son deadlift historique et son fair-play ?", answers: ["Kimberly Walford", "Amanda Lawrence", "Bonica Brown"], correctAnswer: "Kimberly Walford", difficulty: "medium", category: "culture" },
        { question: "Quelle compétition de powerlifting est considérée comme la plus prestigieuse au monde ?", answers: ["IPF World Championships", "The Kern US Open", "The Ghost Clash"], correctAnswer: "IPF World Championships", difficulty: "easy", category: "culture" },
        { question: "Qui a établi un total record mondial IPF en -93 kg en 2024 ?", answers: ["Gustav Hedlund", "Anatolii Novopismennyi", "Jonathan Cayco"], correctAnswer: "Gustav Hedlund", difficulty: "hard", category: "culture" },
        { question: "Quel lifter est célèbre pour son deadlift de 400 kg en -83 kg ?", answers: ["John Haack", "Russel Orhii", "Yury Belkin"], correctAnswer: "John Haack", difficulty: "hard", category: "culture" },
        { question: "Qui est le premier athlète IPF à avoir totalisé plus de 1000 kg raw en compétition officielle ?", answers: ["Jesus Olivares", "Ray Williams", "Dan Bell"], correctAnswer: "Jesus Olivares", difficulty: "hard", category: "culture" },
        { question: "Quelle légende est connue pour ses squats brutaux sans équipement et sans ceinture ?", answers: ["Kirk Karwoski", "Ed Coan", "Dan Green"], correctAnswer: "Kirk Karwoski", difficulty: "medium", category: "culture" },
        { question: "Quel lifter est célèbre pour avoir dominé la catégorie -105 kg IPF pendant plusieurs années ?", answers: ["Boris Sheiko", "Blaine Sumner", "Ashton Rouska"], correctAnswer: "Ashton Rouska", difficulty: "hard", category: "culture" },
        { question: "Quel powerlifter a battu plusieurs records IPF à seulement 19 ans ?", answers: ["Gustav Hedlund", "Jesus Olivares", "Bobbie Butters"], correctAnswer: "Jesus Olivares", difficulty: "hard", category: "culture" },
        { question: "Quel powerlifter est célèbre pour ses performances et son sourire constant sur le plateau ?", answers: ["Taylor Atwood", "Russel Orhii", "Bryce Lewis"], correctAnswer: "Russel Orhii", difficulty: "easy", category: "culture" },
        { question: "Quelle athlète est devenue une icône IPF en -63 kg avec un total record ?", answers: ["Samantha Eugenie", "Kristin Dunsmore", "Joy Nnamani"], correctAnswer: "Samantha Eugenie", difficulty: "medium", category: "culture" },
        { question: "Quel lifter est souvent surnommé 'l’ingénieur du powerlifting' pour ses analyses détaillées ?", answers: ["Bryce Lewis", "Taylor Atwood", "Joey Flexx"], correctAnswer: "Bryce Lewis", difficulty: "medium", category: "culture" },
        { question: "Quel powerlifter a réalisé un deadlift de 460 kg en compétition WRPF ?", answers: ["Yury Belkin", "Dan Bell", "Larry Wheels"], correctAnswer: "Yury Belkin", difficulty: "hard", category: "culture" },
        { question: "Qui est célèbre pour ses records en développé couché dans la catégorie -74 kg ?", answers: ["Jonathan Cayco", "Gustav Hedlund", "Taylor Atwood"], correctAnswer: "Jonathan Cayco", difficulty: "medium", category: "culture" },
        { question: "Quel powerlifter a inspiré la communauté par sa performance tout en étant partiellement aveugle ?", answers: ["David Ricks", "Chris Aiden", "Bobby Morgan"], correctAnswer: "David Ricks", difficulty: "medium", category: "culture" },
        { question: "Qui a dominé la catégorie -52 kg IPF avec un total exceptionnel ?", answers: ["Eddie Berglund", "Michael Davis", "Liao Hui"], correctAnswer: "Eddie Berglund", difficulty: "medium", category: "culture" },
        { question: "Quel athlète a réalisé un deadlift de 500 kg en compétition WRPF en 2020 ?", answers: ["Hafthor Bjornsson", "Eddie Hall", "Dan Bell"], correctAnswer: "Hafthor Bjornsson", difficulty: "easy", category: "culture" },
        { question: "Quel powerlifter légendaire a battu des records IPF vétérans à plus de 60 ans ?", answers: ["David Ricks", "Ed Coan", "Boris Sheiko"], correctAnswer: "David Ricks", difficulty: "medium", category: "culture" },
        { question: "Quelle athlète est devenue championne IPF mondiale en -47 kg en 2023 ?", answers: ["Heather Connor", "Evie Corrigan", "Joy Nnamani"], correctAnswer: "Evie Corrigan", difficulty: "hard", category: "culture" },
        { question: "Qui est l'auteur de nombreux livres et articles sur la programmation en powerlifting ?", answers: ["Boris Sheiko", "Joey Flexx", "Bryce Lewis"], correctAnswer: "Boris Sheiko", difficulty: "medium", category: "culture" },
        { question: "Quel athlète a été suspendu après avoir soulevé 501 kg au deadlift ?", answers: ["Hafthor Bjornsson", "Eddie Hall", "Larry Wheels"], correctAnswer: "Hafthor Bjornsson", difficulty: "medium", category: "culture" },
        { question: "Quel lifter détient le record IPF raw du squat en -66 kg (2024) ?", answers: ["Jonathan Garcia", "Panagiotis Tarinidis", "Eddie Berglund"], correctAnswer: "Panagiotis Tarinidis", difficulty: "hard", category: "culture" },
        { question: "Quelle compétition IPF rassemble les meilleurs lifters de chaque continent ?", answers: ["IPF World Classic", "IPF World Games", "IPF World Championships"], correctAnswer: "IPF World Games", difficulty: "medium", category: "culture" },
        { question: "Quelle athlète détient plusieurs records du monde IPF en -63 kg ?", answers: ["Joy Nnamani", "Samantha Eugenie", "Amanda Lawrence"], correctAnswer: "Joy Nnamani", difficulty: "hard", category: "culture" },
        { question: "Qui est considéré comme l’un des powerlifters les plus charismatiques et influents de la nouvelle génération ?", answers: ["Russel Orhii", "John Haack", "Gustav Hedlund"], correctAnswer: "Russel Orhii", difficulty: "easy", category: "culture" }
        // ➕ Ajoute ici toutes les questions de cultures
    ],
    reglement: [
        { question: "Quelle est la charge maximale autorisée pour la ceinture en compétition IPF ?", answers: ["13 mm d'épaisseur", "10 mm d'épaisseur", "15 mm d'épaisseur"], correctAnswer: "13 mm d'épaisseur", difficulty: "easy", category: "reglement" },
        { question: "Quelle est la largeur maximale autorisée pour les manches de la tenue IPF ?", answers: ["1 cm", "2 cm", "3 cm"], correctAnswer: "2 cm", difficulty: "hard", category: "reglement" },
        { question: "Quel critère doit respecter un spotter en IPF ?", answers: ["Être au moins aussi fort que le lifter", "Rester immobile et prêt à intervenir", "Porter des gants de sécurité"], correctAnswer: "Rester immobile et prêt à intervenir", difficulty: "medium", category: "reglement" },
        { question: "Quelle est la position des pieds au début du squat selon l'IPF ?", answers: ["Talons alignés sous les épaules", "Pieds parallèles à la largeur des épaules", "Pieds écartés au-delà des épaules"], correctAnswer: "Pieds parallèles à la largeur des épaules", difficulty: "medium", category: "reglement" },
        { question: "Quel est le signal de départ du développé couché donné par le juge IPF ?", answers: ["\"Start\"", "\"Press\"", "\"Go\""], correctAnswer: "\"Start\"", difficulty: "easy", category: "reglement" },
        { question: "Quelle est l'épaisseur maximale d'une genouillère autorisée ?", answers: ["7 mm", "10 mm", "5 mm"], correctAnswer: "7 mm", difficulty: "medium", category: "reglement" },
        { question: "Quel document le lifter doit-il fournir avant la compétition ?", answers: ["Carte d'identité", "Passeport", "Justificatif de domicile"], correctAnswer: "Carte d'identité", difficulty: "easy", category: "reglement" },
        { question: "Combien de temps a un lifter pour effectuer son premier essai ?", answers: ["60 s", "90 s", "120 s"], correctAnswer: "60 s", difficulty: "easy", category: "reglement" },
        { question: "Quelle est la profondeur minimale d’un squat validé ?", answers: ["Hanches sous les genoux", "Fémurs parallèles au sol", "Genoux à 90°"], correctAnswer: "Fémurs parallèles au sol", difficulty: "medium", category: "reglement" },
        { question: "Quel geste déclenche la fin de la descente au développé couché ?", answers: ["La barre touche la poitrine et s’immobilise", "Le lifter dit \"Down\"", "Le juge dit \"Rack\""], correctAnswer: "La barre touche la poitrine et s’immobilise", difficulty: "easy", category: "reglement" },
        { question: "Quelle couleur de bandage est interdite en IPF ?", answers: ["Bandage multicolore", "Bandage noir", "Bandage de couleur unie"], correctAnswer: "Bandage multicolore", difficulty: "medium", category: "reglement" },
        { question: "Quel est l’intervalle temporel entre deux tentatives consécutives valides ?", answers: ["3 essais", "2 minutes", "aucun délai obligatoire"], correctAnswer: "aucun délai obligatoire", difficulty: "medium", category: "reglement" },
        { question: "À quelle hauteur la barre doit‑elle être déroulée au deadlift ?", answers: ["Jusqu'aux hanches", "Jusqu'à une position verrouillée", "Jusqu'à la poitrine"], correctAnswer: "Jusqu'à une position verrouillée", difficulty: "easy", category: "reglement" },
        { question: "Quelle tenue est interdite en IPF ?", answers: ["Knee wraps", "Shorts de compression", "Lycra moulant"], correctAnswer: "Shorts de compression", difficulty: "easy", category: "reglement" },
        { question: "Quel élément la ceinture doit‑elle comporter ?", answers: ["Boucle rapide", "Attache en velcro", "Attache classique avec illets"], correctAnswer: "Attache classique avec illets", difficulty: "hard", category: "reglement" },
        { question: "Que signifie 'no‐lift' au développé couché ?", answers: ["Manque de contrôle", "Les coudes ne sont pas verrouillés", "Redressement de la barre avant le signal"], correctAnswer: "Redressement de la barre avant le signal", difficulty: "easy", category: "reglement" },
        { question: "Quelle est l’obligation concernant le regard du lifter au squat ?", answers: ["Regard vers le sol", "Regard fixe en avant", "Regard vers le plafond"], correctAnswer: "Regard fixe en avant", difficulty: "easy", category: "reglement" },
        { question: "À quoi sert le juge latéral lors du squat ?", answers: ["Vérifier la profondeur", "Contrôler le placement des pieds", "Donner le signal 'riser'"], correctAnswer: "Vérifier la profondeur", difficulty: "easy", category: "reglement" },
        { question: "Quelle condition invalide un essai au deadlift ?", answers: ["Barre rebondit sur les disques", "Le lifter lève les hanches en premier", "Le lifter ne verrouille pas les genoux"], correctAnswer: "Le lifter ne verrouille pas les genoux", difficulty: "easy", category: "reglement" },
        { question: "Combien de juges officiels supervise chaque élévation IPF ?", answers: ["1 juge", "2 juges", "3 juges"], correctAnswer: "3 juges", difficulty: "easy", category: "reglement" },
        { question: "À quel moment le lifter peut‑il saisir la barre au développé couché ?", answers: ["Après le signal 'Start'", "Avant le signal 'Start'", "Une fois la barre stable"], correctAnswer: "Après le signal 'Start'", difficulty: "easy", category: "reglement" },
        { question: "Quelle est la fonction du centre IPF 'Technical Controller' ?", answers: ["Permettre la sécurité et la conformité", "Chronométrer les essais", "Compter les répétitions"], correctAnswer: "Permettre la sécurité et la conformité", difficulty: "hard", category: "reglement" },
        { question: "Quel type de chaussures est autorisé ?", answers: ["Chaussures minimalistes", "Chaussures à talon élevé", "Chaussures plates"], correctAnswer: "Chaussures plates", difficulty: "easy", category: "reglement" },
        { question: "Que se passe‑t‑il si la barre se déplace latéralement au squat ?", answers: ["Le lifter doit recommencer", "Essai validé", "Essai annulé si déviation excessive"], correctAnswer: "Essai annulé si déviation excessive", difficulty: "medium", category: "reglement" },
        { question: "Quelle action déclenche la fin d’un essai de développé couché ?", answers: ["Le signal 'Rack' est donné", "La barre dépasse les coudes", "Le lifter relâche la barre"], correctAnswer: "Le signal 'Rack' est donné", difficulty: "easy", category: "reglement" },
        { question: "Que contrôle le juge de tête au deadlift ?", answers: ["Alignement du bassin", "Verrouillage complet", "Position fixe des pieds"], correctAnswer: "Verrouillage complet", difficulty: "easy", category: "reglement" },
        { question: "Quel est le placement des pieds au développé couché IPF ?", answers: ["Talons raprochant le corps", "Pieds décollés du sol", "Talons fermement au sol"], correctAnswer: "Talons fermement au sol", difficulty: "easy", category: "reglement" },
        { question: "Est‑ce que le lifter peut parler pendant l’élévation ?", answers: ["Oui, pour se motiver", "Non, c’est interdit", "Oui, seulement s’il demande le signal"], correctAnswer: "Non, c’est interdit", difficulty: "easy", category: "reglement" },
        { question: "Quelle est l’autorisation concernant les manchons de bras ?", answers: ["Interdits", "Autorisé maximum 2 mm", "Interdits sauf IPF Classic"], correctAnswer: "Interdits", difficulty: "easy", category: "reglement" },
        { question: "Un essai de développé couché est validé si la barre remonte légèrement hors verticalité ?", answers: ["Oui", "Non si déplacement important", "Toujours non"], correctAnswer: "Non si déplacement important", difficulty: "medium", category: "reglement" },
        { question: "Quel est l'objectif des règles IPF sur le placement de la barre ?", answers: ["Uniformiser les charges soulevées", "Garantir la sécurité et la comparabilité", "Limiter les performances"], correctAnswer: "Garantir la sécurité et la comparabilité", difficulty: "easy", category: "reglement" },
        { question: "Peut‑on utiliser des bandes de poignet en compétition IPF ?", answers: ["Oui, réglementées", "Non, interdites", "Oui, sans limite"], correctAnswer: "Oui, réglementées", difficulty: "easy", category: "reglement" },
        { question: "Quelle est la posture de départ au deadlift ?", answers: ["Dos arrondi", "Dos droit et poitrine sortie", "Basculé en avant"], correctAnswer: "Dos droit et poitrine sortie", difficulty: "easy", category: "reglement" },
        { question: "Que peut‑on dire du temps de pause sur la poitrine au développé couché ?", answers: ["Barre reste immobile jusqu’au signal 'Press'", "Immédiatement lever", "Lever dès qu’on sent la barre"], correctAnswer: "Barre reste immobile jusqu’au signal 'Press'", difficulty: "easy", category: "reglement" },
        { question: "Quel type de protège‐poids est autorisé ?", answers: ["Protège disques en plastique fin", "Protège disques en mousse épaisse", "Protège disques non fixé"], correctAnswer: "Protège disques en plastique fin", difficulty: "medium", category: "reglement" },
        { question: "Combien de tentatives au total un lifter a‑t‑il ?", answers: ["4 essais", "6 essais", "9 essais"], correctAnswer: "9 essais", difficulty: "easy", category: "reglement" },
        { question: "Que signifie un essai ‘openers’ ?", answers: ["Premier essai dans une élévation", "Essai facultatif", "Essai le plus lourd"], correctAnswer: "Premier essai dans une élévation", difficulty: "easy", category: "reglement" },
        { question: "Un lifter peut‑il retrousser la ceinture pendant l’essai ?", answers: ["Oui avant le signal 'Start'", "Non, interdit", "Oui, seulement après l’essai"], correctAnswer: "Non, interdit", difficulty: "easy", category: "reglement" },
        { question: "Quel est le critère pour valider la reprise de la barre au deadlift ?", answers: ["Barre reste immobile après verrouillage", "Poitrine se projette en avant", "Les épaules en retrait"], correctAnswer: "Barre reste immobile après verrouillage", difficulty: "medium", category: "reglement" },
        { question: "Quel accessoire est obligatoire pour le développé couché ?", answers: ["Stoppeurs de sécurité", "Chaussures Python", "Genouillères"], correctAnswer: "Stoppeurs de sécurité", difficulty: "easy", category: "reglement" },
        { question: "Combien de minces serviettes sont autorisées sous la barre en squat ?", answers: ["1 seule", "2 max", "aucune"], correctAnswer: "aucune", difficulty: "medium", category: "reglement" },
        { question: "Que se passe‑t‑il si un lifter relâche la barre au sol après le deadlift ?", answers: ["Essai validé", "Essai non validé", "Interdit et disqualification"], correctAnswer: "Essai validé", "difficulty": "medium", category: "reglement" },
        { question: "Doit‑on attendre le signal 'Down' pour enregistrer la fin du deadlift ?", answers: ["Oui", "Non", "Parfois"], correctAnswer: "Non", difficulty: "medium", category: "reglement" },
        { question: "Quelle est la position des coudes au développé couché ?", answers: ["Sous la barre", "Écartés latéralement", "Collés au corps"], correctAnswer: "Sous la barre", difficulty: "easy", category: "reglement" },
        { question: "Est‑ce que le rebond est autorisé au squat ?", answers: ["Non", "Oui s’il est contrôlé", "Oui"], correctAnswer: "Non", difficulty: "easy", category: "reglement" },
        { question: "Que signifie 'rack' au développé couché ?", answers: ["Reposer la barre après le signal", "Ranger les charges", "Arrêter le chrono"], correctAnswer: "Reposer la barre après le signal", difficulty: "easy", category: "reglement" },
        { question: "Quel vêtement est obligatoire en IPF Classic ?", answers: ["T‑shirt manches longues", "T‑shirt IPF", "T‑shirt moulant réglementé"], correctAnswer: "T‑shirt moulant réglementé", difficulty: "easy", category: "reglement" },
        { question: "Est‑ce que des protège‐poignets épais sont autorisés au deadlift ?", answers: ["Non", "Oui si < 14 cm", "Oui sans limite"], correctAnswer: "Non", difficulty: "medium", category: "reglement" },
        { question: "Quel signal indique au lifter qu’il doit redescendre la barre au squat ?", answers: ["\"Rack\"", "\"Down\"", "\"Riser\""], correctAnswer: "\"Rack\"", difficulty: "medium", category: "reglement" },
        { question: "Quelle est la règle concernant la poignée au développé couché ?", answers: ["Paumes vers le haut", "Poignée fermée sans trou pour le pouce", "Poignée à moitié ouverte"], correctAnswer: "Poignée fermée sans trou pour le pouce", difficulty: "easy", category: "reglement" },
        { question: "Les bandages de genou sont‑ils autorisés en full power ?", answers: ["Oui, selon épaisseur", "Non", "Oui, sans limite"], correctAnswer: "Oui, selon épaisseur", difficulty: "medium", category: "reglement" }
        // ➕ Ajoute ici toutes les questions de technique
    ],
    biomecanique: [
        { question: "Quel muscle est le principal moteur lors du squat ?", answers: ["Quadriceps", "Pectoraux", "Biceps"], correctAnswer: "Quadriceps", difficulty: "easy", category: "biomecanique" },
        { question: "Quel muscle est fortement sollicité pendant le deadlift ?", answers: ["Grand fessier", "Triceps", "Deltoïdes"], correctAnswer: "Grand fessier", difficulty: "easy", category: "biomecanique" },
        { question: "Quel est le rôle des ischio-jambiers dans le squat ?", answers: ["Stabilisation et extension de la hanche", "Flexion du bras", "Extension du coude"], correctAnswer: "Stabilisation et extension de la hanche", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est le plus activé dans le bench press ?", answers: ["Pectoraux", "Quadriceps", "Grand dorsal"], correctAnswer: "Pectoraux", difficulty: "easy", category: "biomecanique" },
        { question: "Quel groupe musculaire stabilise l'épaule lors du bench press ?", answers: ["Coiffe des rotateurs", "Triceps", "Quadriceps"], correctAnswer: "Coiffe des rotateurs", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle contribue le plus à la poussée dans le squat ?", answers: ["Quadriceps", "Triceps", "Deltoïdes"], correctAnswer: "Quadriceps", difficulty: "easy", category: "biomecanique" },
        { question: "Quels muscles assurent l'extension du genou dans le squat ?", answers: ["Quadriceps", "Ischio-jambiers", "Abdominaux"], correctAnswer: "Quadriceps", difficulty: "easy", category: "biomecanique" },
        { question: "Quel est le rôle principal des abdominaux dans le powerlifting ?", answers: ["Stabiliser la colonne vertébrale", "Soulever la barre", "Allonger les bras"], correctAnswer: "Stabiliser la colonne vertébrale", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est principalement sollicité dans le sumo deadlift ?", answers: ["Adducteurs", "Triceps", "Deltoïdes"], correctAnswer: "Adducteurs", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle joue un rôle clé dans le lockout du deadlift ?", answers: ["Grand fessier", "Biceps", "Pectoraux"], correctAnswer: "Grand fessier", difficulty: "medium", category: "biomecanique" },
        { question: "Quelle articulation est la plus sollicitée dans le squat ?", answers: ["Genou", "Coude", "Poignet"], correctAnswer: "Genou", difficulty: "easy", category: "biomecanique" },
        { question: "Quel mouvement articulaire se produit principalement dans le bench press ?", answers: ["Extension du coude", "Flexion du genou", "Abduction de la hanche"], correctAnswer: "Extension du coude", difficulty: "easy", category: "biomecanique" },
        { question: "Quel muscle aide à maintenir une posture neutre durant un squat ?", answers: ["Érecteurs du rachis", "Biceps", "Deltoïdes"], correctAnswer: "Érecteurs du rachis", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est le plus impliqué dans la flexion du coude lors du bench press ?", answers: ["Biceps", "Triceps", "Grand dorsal"], correctAnswer: "Biceps", difficulty: "medium", category: "biomecanique" },
        { question: "Quel est le rôle des muscles stabilisateurs dans le squat ?", answers: ["Maintenir l'équilibre et la posture", "Augmenter la force de poussée", "Réduire la fatigue musculaire"], correctAnswer: "Maintenir l'équilibre et la posture", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est le plus impliqué dans l’extension de la hanche ?", answers: ["Grand fessier", "Triceps", "Deltoïdes"], correctAnswer: "Grand fessier", difficulty: "easy", category: "biomecanique" },
        { question: "Quelle est la fonction biomécanique du triceps dans le bench press ?", answers: ["Extension du coude", "Stabilisation du genou", "Rotation de la hanche"], correctAnswer: "Extension du coude", difficulty: "easy", category: "biomecanique" },
        { question: "Quel muscle joue un rôle dans le maintien de la barre contre le dos pendant le squat ?", answers: ["Trapèzes", "Triceps", "Quadriceps"], correctAnswer: "Trapèzes", difficulty: "medium", category: "biomecanique" },
        { question: "Quel est l’avantage biomécanique du sumo deadlift ?", answers: ["Réduction de l’amplitude de mouvement", "Augmentation de la flexion du genou", "Diminution de l’implication des hanches"], correctAnswer: "Réduction de l’amplitude de mouvement", difficulty: "hard", category: "biomecanique" },
        { question: "Quel muscle est responsable de la flexion de la hanche pendant la descente du squat ?", answers: ["Psoas-iliaque", "Quadriceps", "Grand fessier"], correctAnswer: "Psoas-iliaque", difficulty: "hard", category: "biomecanique" },
        { question: "Quel est le rôle des érecteurs du rachis dans le deadlift ?", answers: ["Maintenir la colonne droite", "Créer de la force de poussée", "Allonger les bras"], correctAnswer: "Maintenir la colonne droite", difficulty: "medium", category: "biomecanique" },
        { question: "Quelle est la principale cause biomécanique du 'butt wink' ?", answers: ["Perte de mobilité de hanche", "Faiblesse des triceps", "Flexion du coude excessive"], correctAnswer: "Perte de mobilité de hanche", difficulty: "hard", category: "biomecanique" },
        { question: "Quel muscle est essentiel pour verrouiller la barre au bench press ?", answers: ["Triceps", "Quadriceps", "Ischio-jambiers"], correctAnswer: "Triceps", difficulty: "medium", category: "biomecanique" },
        { question: "Quel type de contraction musculaire prédomine lors de la descente du squat ?", answers: ["Concentrique", "Excentrique", "Isométrique"], correctAnswer: "Excentrique", difficulty: "medium", category: "biomecanique" },
        { question: "Quel type de levier est le deadlift au niveau biomécanique ?", answers: ["Levier de premier genre", "Levier de deuxième genre", "Levier de troisième genre"], correctAnswer: "Levier de premier genre", difficulty: "hard", category: "biomecanique" },
        { question: "Quel muscle est souvent sous-développé chez les débutants au deadlift ?", answers: ["Érecteurs du rachis", "Triceps", "Grand pectoral"], correctAnswer: "Érecteurs du rachis", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle permet de stabiliser la scapula au bench press ?", answers: ["Trapèzes inférieurs", "Quadriceps", "Adducteurs"], correctAnswer: "Trapèzes inférieurs", difficulty: "medium", category: "biomecanique" },
        { question: "Quel est le rôle biomécanique des adducteurs dans le squat ?", answers: ["Contribuer à l’extension de la hanche", "Fléchir le genou", "Stabiliser les épaules"], correctAnswer: "Contribuer à l’extension de la hanche", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle limite la rotation interne de l'épaule lors du bench press ?", answers: ["Coiffe des rotateurs", "Quadriceps", "Grand fessier"], correctAnswer: "Coiffe des rotateurs", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle contrôle la charge lors de la descente au deadlift ?", answers: ["Ischio-jambiers", "Triceps", "Deltoïdes"], correctAnswer: "Ischio-jambiers", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est principalement responsable du maintien d’une lordose lombaire dans le squat ?", answers: ["Érecteurs du rachis", "Biceps", "Pectoraux"], correctAnswer: "Érecteurs du rachis", difficulty: "medium", category: "biomecanique" },
        { question: "Quel est le rôle du diaphragme en powerlifting ?", answers: ["Créer une pression intra-abdominale", "Allonger les bras", "Stabiliser le genou"], correctAnswer: "Créer une pression intra-abdominale", difficulty: "hard", category: "biomecanique" },
        { question: "Quel muscle contrôle la charge pendant la phase excentrique du bench press ?", answers: ["Pectoraux", "Quadriceps", "Ischio-jambiers"], correctAnswer: "Pectoraux", difficulty: "medium", category: "biomecanique" },
        { question: "Quel mouvement articulaire est dominant dans le deadlift ?", answers: ["Extension de hanche", "Flexion du genou", "Rotation externe du bras"], correctAnswer: "Extension de hanche", difficulty: "easy", category: "biomecanique" },
        { question: "Quel muscle stabilise les genoux pendant le squat ?", answers: ["Adducteurs", "Biceps", "Deltoïdes"], correctAnswer: "Adducteurs", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est essentiel pour initier la poussée dans le deadlift ?", answers: ["Quadriceps", "Triceps", "Deltoïdes"], correctAnswer: "Quadriceps", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle prévient l’effondrement des épaules dans le deadlift ?", answers: ["Trapèzes", "Pectoraux", "Quadriceps"], correctAnswer: "Trapèzes", difficulty: "biomecanique", category: "biomecanique" },
        { question: "Quel est le principal risque biomécanique d’un dos arrondi au deadlift ?", answers: ["Augmentation de la pression discale", "Diminution de l’amplitude de mouvement", "Faible activation des triceps"], correctAnswer: "Augmentation de la pression discale", difficulty: "hard", category: "biomecanique" },
        { question: "Quel muscle est prioritairement ciblé dans le bench press prise serrée ?", answers: ["Triceps", "Pectoraux", "Deltoïdes postérieurs"], correctAnswer: "Triceps", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est le plus sollicité lors d’une déviation des genoux vers l’intérieur pendant le squat ?", answers: ["Adducteurs", "Quadriceps", "Ischio-jambiers"], correctAnswer: "Adducteurs", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est responsable de l'extension du coude dans le bench press ?", answers: ["Triceps", "Biceps", "Pectoraux"], correctAnswer: "Triceps", difficulty: "easy", category: "biomecanique" },
        { question: "Quel muscle stabilise le bassin dans le deadlift ?", answers: ["Grand fessier", "Trapèzes", "Pectoraux"], correctAnswer: "Grand fessier", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est essentiel pour contrôler la flexion de la hanche au squat ?", answers: ["Psoas-iliaque", "Triceps", "Grand dorsal"], correctAnswer: "Psoas-iliaque", difficulty: "hard", category: "biomecanique" },
        { question: "Quel muscle travaille de façon isométrique pour stabiliser le tronc lors du squat ?", answers: ["Abdominaux", "Quadriceps", "Biceps"], correctAnswer: "Abdominaux", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est le plus actif dans la phase finale du lockout au deadlift ?", answers: ["Grand fessier", "Biceps", "Quadriceps"], correctAnswer: "Grand fessier", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle est essentiel pour prévenir l’antéversion pelvienne pendant le squat ?", answers: ["Abdominaux profonds", "Triceps", "Grand dorsal"], correctAnswer: "Abdominaux profonds", difficulty: "hard", category: "biomecanique" },
        { question: "Quel muscle stabilise les omoplates pendant le bench press ?", answers: ["Trapèzes moyens", "Quadriceps", "Adducteurs"], correctAnswer: "Trapèzes moyens", difficulty: "medium", category: "biomecanique" },
        { question: "Quel muscle travaille en synergie avec les quadriceps pendant la poussée du squat ?", answers: ["Grand fessier", "Triceps", "Deltoïdes"], correctAnswer: "Grand fessier", difficulty: "medium", category: "biomecanique" }
        // ➕ Ajoute ici toutes les questions de biomécanique
    ],
};
// Route GET pour récupérer les questions d'une catégorie donnée
app.get('/api/quiz', (req, res) => {
    const category = req.query.category;
    if (!category) {
        return res.status(400).json({ error: 'Paramètre category requis' });
    }
    const questions = quizDatabase[category];
    if (!questions) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
    }
    res.json(questions);
});
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur API Quiz démarré sur http://localhost:${port}`);
});
