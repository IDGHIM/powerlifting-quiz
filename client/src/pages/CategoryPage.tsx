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
      <section className="category-section">
        <h1 className="category-title">Choisissez une catégorie</h1>
        <div className="category-buttons">
          <Button
            text="Culture Powerlifting"
            className="category-button"
            onClick={() => handleSelectCategory('culture')}
          />
          <Button
            text="Règles IPF"
            className="category-button"
            onClick={() => handleSelectCategory('Règlement')}
          />
          <Button
            text="Anatomie & Biomécanique"
            className="category-button"
            onClick={() => handleSelectCategory('Biomécanique')}
          />
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
