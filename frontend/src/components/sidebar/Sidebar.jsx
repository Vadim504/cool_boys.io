import './Sidebar.css';

const categories = [
  { name: 'Готовая еда', icon: '/images/svg_files/icon_ready_meal.svg' },
  { name: 'Овощи и фрукты', icon: '/images/svg_files/icon_veg_fruit.svg' },
  { name: 'Молоко, яйца и сыр', icon: '/images/svg_files/icon_dairy.svg' },
  { name: 'Хлеб и выпечка', icon: '/images/svg_files/icon_bread.svg' },
  { name: 'Мясо и птица', icon: '/images/svg_files/icon_meat.svg' },
  { name: 'Рыба и морепродукты', icon: '/images/svg_files/icon_fish.svg' },
  { name: 'Морозилка', icon: '/images/svg_files/icon_frozen.svg' },
  { name: 'Вода и напитки', icon: '/images/svg_files/icon_beverages.svg' },
  { name: 'Сладкое', icon: '/images/svg_files/icon_sweets.svg' },
  { name: 'Снеки', icon: '/images/svg_files/icon_snacks.svg' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="catalog-header">
        <h2 className="catalog-title">Каталог</h2>
      </div>
      <ul className="category-list">
        {categories.map((cat, idx) => (
          <li key={idx} className="category-item">
            <span className="category-icon">
              <img src={cat.icon} alt={cat.name} />
            </span>
            <span className="category-name">{cat.name}</span>
            <span className="category-arrow">›</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}