import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
//import './ResetPasswordPage.css'; // 

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  // Ajoutez ce console.log pour vérifier le token
  console.log('Token récupéré depuis l\'URL:', token);
  
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Vérifiez si le token existe
    if (!token) {
      setError("Token manquant dans l'URL.");
      return;
    }

    console.log('Token envoyé à l\'API:', token); // Ajoutez ceci

    if (!newPassword || newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/reset-password', {
        token,
        newPassword,
      });
      
      console.log('Réponse de l\'API:', response.data); // Ajoutez ceci
      
      setMessage('Mot de passe mis à jour avec succès.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Erreur complète:', err); // Plus détaillé
      if (axios.isAxiosError(err)) {
        console.error('Réponse d\'erreur:', err.response?.data);
        console.error('Status:', err.response?.status);
      }
      setError("Lien invalide ou expiré.");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="reset-password-form">
      <h2>Réinitialiser le mot de passe</h2>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button type="submit">Réinitialiser</button>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default ResetPasswordPage;
