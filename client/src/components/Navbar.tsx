import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>PowerQuiz</h1>
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/about">À propos</Link>
      </div>
    </nav>
  );
};

export default Navbar;
