import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="p-4 border-b flex justify-between items-center">
      <div className="text-xl font-bold">PowerQuiz</div>
      <div className="space-x-4">
        <Link to="/">Accueil</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/about">À propos</Link>
      </div>
    </nav>
  );
};

export default Navbar;
