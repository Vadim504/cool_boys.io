// src/components/Sidebar/Sidebar.jsx
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../../constants/categories';

type SidebarProps = {
  onCatalogClick?: () => void;
};

export default function Sidebar({ onCatalogClick }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="catalog-header">
        <NavLink to="/" className="catalog-title-link" onClick={onCatalogClick}>
          Каталог
        </NavLink>
      </div>
      <ul className="category-list">
        {/* 1. Выводим категории */}
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
