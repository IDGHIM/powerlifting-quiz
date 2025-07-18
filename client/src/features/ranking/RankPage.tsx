import React, { useState, useEffect } from "react";
import './RankPage.css';

// Composant principal pour afficher la page de classement
const RankPage: React.FC = () => {
  // État pour la catégorie sélectionnée (par défaut : Culture)
  const [selectedCategory, setSelectedCategory] = useState("Culture");

  // État pour le mode de jeu sélectionné (par défaut : Classique)
  const [selectedMode, setSelectedMode] = useState("Classique");

  // État pour stocker la liste des utilisateurs (classement)
  const [users, setUsers] = useState<any[]>([]);

  // Hook useEffect pour charger les données à chaque fois que la catégorie ou le mode change
  useEffect(() => {
    // TODO: Remplacer cette partie par un vrai appel API pour récupérer les classements
    // Exemple d'appel API à implémenter plus tard :
    // fetch(`/api/rankings?category=${selectedCategory}&mode=${selectedMode}`)
    //   .then(res => res.json())
    //   .then(data => setUsers(data));

    // Actuellement, on vide la liste car il n'y a pas encore de backend
    setUsers([]);
  }, [selectedCategory, selectedMode]);

  return (
    <div className="rank-page">
      <h1>Classement des Joueurs</h1>

      {/* Sélection de la catégorie */}
      <div>
        <label>
          Catégorie:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="Culture">Culture</option>
            <option value="Règlement">Règlement</option>
            <option value="Anatomies & Biomécaniques">Anatomies & Biomécaniques</option>
          </select>
        </label>

        {/* Sélection du mode de jeu */}
        <label>
          Mode de Jeu:
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
          >
            <option value="Classique">Classique</option>
            <option value="Contre la Montre">Contre la Montre</option>
            <option value="2 Joueurs">2 Joueurs</option>
          </select>
        </label>
      </div>

      {/* Tableau pour afficher les résultats */}
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Nom</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            // Affichage des utilisateurs s'il y en a
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.score}</td>
              </tr>
            ))
          ) : (
            // Message par défaut s'il n'y a pas d'utilisateur
            <tr>
              <td colSpan={3}>Aucun joueur trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RankPage;
