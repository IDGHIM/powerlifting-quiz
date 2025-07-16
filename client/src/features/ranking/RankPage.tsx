import React, { useState, useEffect } from "react";
import './RankPage.css';
const RankPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("Culture");
  const [selectedMode, setSelectedMode] = useState("Classique");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Ici récupérer les données depuis une base de données via une API
    // Exemple : fetch(`/api/rankings?category=${selectedCategory}&mode=${selectedMode}`)
    //   .then(res => res.json())
    //   .then(data => setUsers(data));
    setUsers([]); // Remplacer plus tard par l'appel API
  }, [selectedCategory, selectedMode]);

  return (
    <div className="rank-page">
      <h1>Classement des Joueurs</h1>

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
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.score}</td>
              </tr>
            ))
          ) : (
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
