import React from "react";
import './Header.css';

// Добавляем пропс onSearch
const Header = ({ onSearch }) => {
  return (
    <div className="page-header">
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Поиск..." 
          // Каждый раз, когда пользователь пишет, вызываем функцию из пропсов
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Header;