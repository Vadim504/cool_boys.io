// src/components/Sidebar/Sidebar.jsx
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../../constants/categories'; // Проверь путь (может быть один ../)

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="catalog-header">
        <h2 className="catalog-title">Каталог</h2>
      </div>
      <ul className="category-list">
        {CATEGORIES.map((cat) => (
          <li key={cat.id}>
            <NavLink 
              to={`/category/${cat.id}`} 
              className={({ isActive }) => 
                isActive ? 'category-item active' : 'category-item'
              }
            >
              <span className="category-icon">
                <img src={cat.icon} alt={cat.name} />
              </span>
              <span className="category-name">{cat.name}</span>
              <span className="category-arrow">›</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}