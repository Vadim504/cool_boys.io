import React from "react";
import { useNavigate } from 'react-router-dom';
import './Header.css';

// Добавляем пропс onSearch
const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const handleSearchChange = (e) => {
    navigate(`/search?q=${text}`);
  };
  return (
    <div className="page-header">
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Поиск..." 
          onChange={(e) => onSearch(e.target.value)} // Вызываем функцию при изменении текста
        />
      </div>
    </div>
  );
};

export default Header;
