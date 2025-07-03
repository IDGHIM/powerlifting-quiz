# Powerlifting Quiz

Bienvenue dans **Powerlifting Quiz**, une application web interactive dédiée aux passionnés de powerlifting ! Teste tes connaissances sur la culture, les règles et l’histoire du powerlifting à travers un quiz ludique et compétitif.

---

## 🚀 Fonctionnalités principales (MVP)

- Inscription et connexion sécurisées des utilisateurs (authentification JWT)
- Quiz interactif avec timer et questions à choix multiples
- Enregistrement et affichage des scores
- Interface simple et responsive
- API RESTful en Node.js avec Express et MongoDB

---

## 🛠️ Technologies utilisées

- **Front-end :** React, TypeScript, React Router, Axios  
- **Back-end :** Node.js, Express, TypeScript, MongoDB, Mongoose
- **Authentification :** JSON Web Tokens (JWT)
- **Outils de développement :** Docker (optionnel), ESLint, Prettier

---

## 📁 Structure du projet

powerlifting-quiz/    
├── client/            # 🎨 Front-end React  
├── server/            # 🖥️ Back-end Node.js  
├── docker-compose.yml # 🐳 (Optionnel) Configuration Docker  
├── README.md          # 📝 Documentation du projet   
└── .gitignore         # 🚫 Fichiers ignorés par Git  

---

## ⚙️ Installation & démarrage

### Prérequis

- Node.js v14+ et npm ou yarn
- MongoDB (local ou cloud)
- (Optionnel) Docker & Docker Compose

### Installation

1. Cloner le dépôt

`git clone https://github.com/ton-utilisateur/powerlifting-quiz.git`     
`cd powerlifting-quiz`

2. Installer les dépendances front-end

`cd client`       
`npm install`

3. Installer les dépendances back-end

`cd ../server`         
`npm install`

### Configuration

Créer un fichier .env dans le dossier server avec les variables suivantes :     
`PORT=5000`     
`MONGO_URI=ton_uri_mongodb`       
`JWT_SECRET=ton_secret_jwt`

### Lancement

Dans un terminal : 
`cd server`       
`npm run dev`      
Dans un autre terminal : 
`cd client`       
`npm start`

---

## 🧩 Utilisation

Crée un compte ou connecte-toi.
Lance un quiz pour tester tes connaissances.
Obtiens ton score à la fin du quiz.
(À venir) Consulte le classement des meilleurs joueurs.

--- 

## 📄 Licence

Ce projet est sous licence XX. Voir le fichier ()[] pour plus de détails.

--- 

## 📫 Contact

- GitHub: [@idghim](https://github.com/idghim)  
- freeCodeCamp: [My Profile](https://www.freecodecamp.org/IchemD)
- Mail : [Email](ichemdghim@gmail.com)

---

⭐ *Merci d'avoir consulté ce projet ! N'hésitez pas à laisser une étoile si vous l'avez trouvé utile ou inspirant.*

