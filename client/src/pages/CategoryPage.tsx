import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Règles officielles IPF', path: '/quiz?category=ipf' },
  { name: 'Techniques de mouvements', path: '/quiz?category=technique' },
  { name: 'Stratégies en compétitions', path: '/quiz?category=strategie' },
  { name: 'Anatomie et biomécanique', path: '/quiz?category=anatomie' },
  { name: 'Culture powerlifting', path: '/quiz?category=culture' },
];

const CategoryPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Choisissez une catégorie</h2>
      <ul>
        {categories.map((cat) => (
          <li key={cat.name}>
            <button onClick={() => navigate(cat.path)}>{cat.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
