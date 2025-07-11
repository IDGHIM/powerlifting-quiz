import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.tsx';
import './CategoryPage.css'; 

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleModeSelect = (mode: 'classic' | 'timer' | '2players') => {
    if (!selectedCategory) return;
    navigate(`/quiz?category=${selectedCategory}&mode=${mode}`);
  };

  return (
    <div className="category-page">
      <section className="category-section">
        <h1 className="category-title">Choisis une catégorie</h1>

        <div className="category-buttons">
          <Button
            text="Culture Powerlifting"
            className={`category-button ${selectedCategory === 'culture' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('culture')}
          />
          <Button
            text="Règles IPF"
            className={`category-button ${selectedCategory === 'Règlement' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('reglement')}
          />
          <Button
            text="Anatomie & Biomécanique"
            className={`category-button ${selectedCategory === 'Biomécanique' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('biomecanique')}
          />
        </div>

        {selectedCategory && (
          <>
            <h2 className="mode-title">Choisis un mode de jeu</h2>
            <div className="mode-buttons">
              <Button
                text="🎯 Classique"
                className="mode-button classic"
                onClick={() => handleModeSelect('classic')}
              />
              <Button
                text="⏱️ Contre-la-montre"
                className="mode-button timer"
                onClick={() => handleModeSelect('timer')}
              />
              <Button
                text="👥 2 Joueurs"
                className="mode-button two-players"
                onClick={() => handleModeSelect('2players')}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
