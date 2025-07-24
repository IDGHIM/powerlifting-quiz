import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ListIcon, TrophyIcon, InfoIcon, UserIcon, LogIn, UserPlus, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
import '../components/Navbar.css';
import { useAuth } from '../features/context/authContext.tsx';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout(); 
    navigate('/');
  };

  return (
    <nav className="navbar">
  <Link to="/">
    <img src={logo} alt="PowerQuiz Logo" className="logo" />
  </Link>

  <div className="nav-links">
    <Link to="/" title="Accueil"><HomeIcon /><span className="tooltip">Accueil</span></Link>
    <Link to="/categories" title="Quiz"><ListIcon /><span className="tooltip">Quiz</span></Link>
    <Link to="/ranking" title="Classement"><TrophyIcon /><span className="tooltip">Classement</span></Link>
    <Link to="/about" title="À propos"><InfoIcon /><span className="tooltip">À propos</span></Link>
  </div>

  <div className="nav-auth">
    {isAuthenticated ? (
      <>
        <Link to="/dashboard" title="Mon profil"><UserIcon /><span className="tooltip">Mon profil</span></Link>
        <button onClick={logout} className="logout-button"><LogOut /><span className="tooltip"></span></button>
      </>
    ) : (
      <>
        <Link to="/login" title="Se connecter"><LogIn size={20} /><span className="tooltip">Se connecter</span></Link>
        <Link to="/register" title="Créer un compte"><UserPlus size={20} /><span className="tooltip">Créer un compte</span></Link>
      </>
    )}
  </div>

</nav>
  );
};

export default Navbar;
