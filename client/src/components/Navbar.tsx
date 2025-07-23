import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import logo from '../assets/logo.png';
import '../components/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="PowerQuiz Logo" className="logo" />
      </Link>

      {/* Liens principaux */}
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/categories">Quiz</Link>
        <Link to="/ranking">Classement</Link>
        <Link to="/about">À propos</Link>
      </div>

      {/* Espace auth */}
      <div className="nav-auth">
        <Link to="/dashboard">Mon profil</Link>
        <Link to="/login" title="Se connecter">
          <LogIn size={20} />
        </Link>
        <Link to="/register" title="Créer un compte">
          <UserPlus size={20} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
