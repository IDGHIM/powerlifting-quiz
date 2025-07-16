import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage.tsx';
import QuizPage from './features/quiz/QuizPage.tsx';
import ResultPage from './pages/ResultPage.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import RankPage from './features/ranking/RankPage.tsx';
import LoginPage from './features/auth/LoginPage.tsx';
import RegisterPage from './features/auth/RegisterPage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';

import Layout from './components/Layout.tsx';

import { AuthProvider } from './features/context/AuthContext.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import AdminRoute from './components/AdminRoute.tsx';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* 🌐 Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/ranking" element={<RankPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 🔐 Routes protégées */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* ❌ Route par défaut */}
            <Route path="*" element={<div>Page non trouvée</div>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
