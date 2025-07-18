import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.tsx';
import './CategoryPage.css'; 

const CategoryPage: React.FC = () => {
  // Hook pour naviguer entre les pages (react-router-dom)
  const navigate = useNavigate();

  // État pour stocker la catégorie sélectionnée (null au départ)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fonction appelée quand une catégorie est cliquée, elle met à jour la catégorie sélectionnée
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // Fonction appelée quand un mode de jeu est choisi
  // Elle vérifie qu'une catégorie est sélectionnée, puis navigue vers la page quiz avec paramètres dans l'URL
  const handleModeSelect = (mode: 'classic' | 'timer' | '2players') => {
    if (!selectedCategory) return; // Ne rien faire si aucune catégorie n'est sélectionnée
    navigate(`/quiz?category=${selectedCategory}&mode=${mode}`);
  };

  return (
    <div className="category-page">
      <section className="category-section">
        {/* Titre principal */}
        <h1 className="category-title">Choisis une catégorie</h1>

        {/* Boutons des catégories */}
        <div className="category-buttons">
          <Button
            text="Culture Powerlifting"
            // Ajoute la classe "active" si la catégorie est sélectionnée (style visuel)
            className={`category-button ${selectedCategory === 'culture' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('culture')}
          />
          <Button
            text="Règles IPF"
            className={`category-button ${selectedCategory === 'reglement' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('reglement')}
          />
          <Button
            text="Anatomie & Biomécanique"
            className={`category-button ${selectedCategory === 'biomecanique' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('biomecanique')}
          />
        </div>

        {/* Affiche les choix de mode uniquement si une catégorie est sélectionnée */}
        {selectedCategory && (
          <>
            <h2 className="mode-title">Choisis un mode de jeu</h2>

            {/* Boutons des modes de jeu */}
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
