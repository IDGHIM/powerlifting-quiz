import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
//import './ResetPasswordPage.css'; // 

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newPassword || newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/reset-password', {
        token,
        newPassword,
      });
      setMessage('Mot de passe mis à jour avec succès.');
      setTimeout(() => navigate('/login'), 2000); // Redirige vers /login
    } catch (err) {
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
