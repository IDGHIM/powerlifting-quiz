import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ListIcon, TrophyIcon, InfoIcon, Calculator, UserIcon, LogIn, UserPlus, LogOut, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import '../components/Navbar.css';
import { useAuth } from '../features/context/authContext.tsx';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Fermer le menu lors du redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu}>
          <img src={logo} alt="PowerQuiz Logo" className="logo" />
        </Link>

        {/* Menu Hamburger */}
        <button 
          className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" title="Accueil" onClick={closeMobileMenu}>
            <HomeIcon />
            <span className="nav-text">Accueil</span>
            <span className="tooltip">Accueil</span>
          </Link>
          <Link to="/categories" title="Quiz" onClick={closeMobileMenu}>
            <ListIcon />
            <span className="nav-text">Quiz</span>
            <span className="tooltip">Quiz</span>
          </Link>
          <Link to="/ranking" title="Classement" onClick={closeMobileMenu}>
            <TrophyIcon />
            <span className="nav-text">Classement</span>
            <span className="tooltip">Classement</span>
          </Link>
          <Link to="/indice" title="Indice" onClick={closeMobileMenu}>
            <Calculator />
            <span className="nav-text">Calcul</span>
            <span className="tooltip">Calcul de son indice</span>
          </Link>
          <Link to="/about" title="À propos" onClick={closeMobileMenu}>
            <InfoIcon />
            <span className="nav-text">À propos</span>
            <span className="tooltip">À propos</span>
          </Link>
        </div>

        {/* Navigation Auth */}
        <div className={`nav-auth ${isMobileMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/profile" title="Profil" onClick={closeMobileMenu}>
                <UserIcon />
                <span className="nav-text">Profil</span>
                <span className="tooltip">Mon profil</span>
              </Link>
              <button 
                className="logout-button" 
                onClick={handleLogout}
                title="Déconnexion"
              >
                <LogOut />
                <span className="nav-text">Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" title="Connexion" onClick={closeMobileMenu}>
                <LogIn />
                <span className="nav-text">Connexion</span>
                <span className="tooltip">Se connecter</span>
              </Link>
              <Link to="/register" title="Inscription" onClick={closeMobileMenu}>
                <UserPlus />
                <span className="nav-text">Inscription</span>
                <span className="tooltip">S'inscrire</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay active" 
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;