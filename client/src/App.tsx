import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import QuizPage from './features/quiz/QuizPage.tsx';
import ResultPage from './pages/ResultPage.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import Layout from './components/Layout.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
