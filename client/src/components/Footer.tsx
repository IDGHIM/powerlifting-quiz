import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} PowerQuiz. Tous droits réservés.</p>
    </footer>
  );
};

export default Footer;
