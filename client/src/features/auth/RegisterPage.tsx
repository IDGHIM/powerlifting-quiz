import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password);
      setMessage('Compte créé ! Vous pouvez maintenant vous connecter.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      console.error('Erreur register:', error.response?.data || error.message);
      setMessage(`Erreur lors de la création du compte : ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Créer un compte</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Nom d'utilisateur" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" />
      <button type="submit">S'inscrire</button>
      {message && <p>{message}</p>}
    </form>
  );
};


export default RegisterPage;
