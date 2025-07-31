import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext.tsx';
import { useNavigate, Link } from 'react-router-dom';
//import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);
      await login(identifier, password);
      navigate('/dashboard');
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("Nom d'utilisateur, email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Connexion</h2>
      <input
        value={identifier}
        onChange={e => setIdentifier(e.target.value)}
        placeholder="Nom d'utilisateur ou email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <button type="submit" disabled={loading} className="start-button">
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
      {error && <p className="error-message">{error}</p>}

      {/* 🔗 Lien vers la page mot de passe oublié */}
      <div className="forgot-password-link">
        <Link to="/forgot-password">Mot de passe oublié ?</Link>
      </div>
    </form>
  );
};

export default LoginPage;
