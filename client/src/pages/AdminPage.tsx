import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  role: string;
}

interface CategoryScore {
  category: string;
  averageScore: number;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [categoryScores, setCategoryScores] = useState<CategoryScore[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchCategoryScores();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const fetchCategoryScores = async () => {
    const response = await fetch('/api/category-scores');
    const data = await response.json();
    setCategoryScores(data);
  };

  const handleDeleteUser = async (id: number) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <div>
     
      <section>
        <h2>Gestion des utilisateurs</h2>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>Aucun utilisateur</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Score moyen par catégorie</h2>
        <ul>
          {categoryScores.map(score => (
            <li key={score.category}>
              {score.category} : {score.averageScore}%
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;
