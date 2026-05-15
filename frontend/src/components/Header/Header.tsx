import './Header.css';

type HeaderProps = {
  onSearch: (value: string) => void;
};

const Header = ({ onSearch }: HeaderProps) => {
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
