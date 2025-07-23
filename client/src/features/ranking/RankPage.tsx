import React, { useState, useEffect } from "react";
import './RankPage.css';

// Composant principal pour afficher la page de classement
const RankPage: React.FC = () => {
  // États de filtre
  const [selectedCategory, setSelectedCategory] = useState("Culture");
  const [selectedMode, setSelectedMode] = useState("classic");

  // Données récupérées
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Appel API pour récupérer les classements filtrés
  useEffect(() => {
    setLoading(true);

    const fetchRankings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/ranking?category=${encodeURIComponent(
            selectedCategory
          )}&mode=${encodeURIComponent(selectedMode)}`
        );

        if (!res.ok) throw new Error("Erreur récupération classement");
        const data = await res.json();
        // Tri décroissant des scores
        const sorted = data.sort((a: any, b: any) => b.points - a.points);
        setUsers(sorted);
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [selectedCategory, selectedMode]);

  return (
    <div className="rank-page">
      <h1>Classement des Joueurs</h1>

      {/* Filtres */}
      <div className="filters">
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
            <option value="classic">Classique</option>
            <option value="timer">Contre la Montre</option>
            <option value="2players">2 Joueurs</option>
          </select>
        </label>
      </div>

      {/* Classement */}
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Nom</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={3}>Chargement...</td></tr>
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id || index}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{Math.floor(user.points)}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={3}>Aucun joueur trouvé</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RankPage;
