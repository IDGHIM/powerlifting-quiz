import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.tsx';
import './CategoryPage.css';

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectCategory = (category: string) => {
    navigate(`/quiz?category=${category}`);
  };

  return (
    <div className="category-page">
      <h1>Choisissez une catégorie</h1>
      <div className="category-buttons">
        <Button text="Culture Powerlifting" onClick={() => handleSelectCategory('culture')} />
        <Button text="Technique de Mouvement" onClick={() => handleSelectCategory('technique')} />
      </div>
    </div>
  );
};

export default CategoryPage;
