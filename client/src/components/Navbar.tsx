import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../components/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <img src={logo} alt="PowerQuiz Logo" className="logo" />
      </Link>
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/categories">Quiz</Link>
        <Link to="/about">À propos</Link>
      </div>
    </nav>
  );
};

export default Navbar;
