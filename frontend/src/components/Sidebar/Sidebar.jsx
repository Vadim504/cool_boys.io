import React from "react";
import "./Sidebar.css";

// Добавляем onCategorySelect и activeCategory в пропсы
const Sidebar = ({ categories, onCategorySelect, activeCategory }) => (
  <aside className="sidebar">
    <div className="catalog-header">
      <h2 className="catalog-title">Каталог</h2>
    </div>
    <ul className="category-list">
      {categories.map((cat) => (
        <li 
          key={cat.name} 
          // Если категория совпадает с активной, добавляем класс 'active'
          className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
          // При клике вызываем функцию из Home.jsx
          onClick={() => onCategorySelect(cat.name)}
        >
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

export default Sidebar;