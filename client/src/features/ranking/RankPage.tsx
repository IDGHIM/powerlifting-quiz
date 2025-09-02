import React, { useState, useEffect } from "react";
//import './RankPage.css';

// Interface pour typer les données utilisateur
interface User {
  _id: string;
  username: string;
  points: number;
  category: string;
  mode: string;
  createdAt?: string;
  updatedAt?: string;
}

// Composant principal pour afficher la page de classement
const RankPage: React.FC = () => {
  // États de filtre - utilisez les mêmes valeurs qu'en base de données
  const [selectedCategory, setSelectedCategory] = useState("biomecanique");
  const [selectedMode, setSelectedMode] = useState("timer");
  
  // Données récupérées
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Appel API pour récupérer les classements filtrés
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const fetchRankings = async () => {
      try {
        console.log('Récupération des données pour:', { selectedCategory, selectedMode });
        
        const res = await fetch(
          `http://https://powerlifting-quiz-2.onrender.com/api/ranking?category=${encodeURIComponent(
            selectedCategory
          )}&mode=${encodeURIComponent(selectedMode)}`
        );
        
        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(`Erreur ${res.status}: ${errorData}`);
        }
        
        const data = await res.json();
        console.log('Données reçues:', data);
        
        // Tri décroissant des scores (déjà fait côté serveur, mais on s'assure)
        const sorted = data.sort((a: User, b: User) => b.points - a.points);
        setUsers(sorted);
      } catch (err) {
        console.error('Erreur lors de la récupération:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
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
            <option value="culture">Culture</option>
            <option value="reglement">Règlement</option>
            <option value="biomecanique">Anatomies & Biomécaniques</option>
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

      {/* Affichage des erreurs */}
      {error && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
          Erreur: {error}
        </div>
      )}
      
      {/* Classement */}
      <div className="ranking-container">
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
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                  Chargement...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id || index}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{Math.floor(user.points)} pts</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                  Aucun joueur trouvé pour cette catégorie et ce mode
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Informations sur le nombre de résultats */}
        {!loading && users.length > 0 && (
          <div className="results-info" style={{ marginTop: '10px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
            {users.length} joueur{users.length > 1 ? 's' : ''} trouvé{users.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default RankPage;