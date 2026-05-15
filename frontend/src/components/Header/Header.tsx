import './Header.css';

type HeaderProps = {
  value?: string;
  onSearch: (value: string) => void;
};

const Header = ({ value = '', onSearch }: HeaderProps) => {
  return (
    <div className="page-header">
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Поиск..." 
          value={value}
          onChange={(e) => onSearch(e.target.value)} // Вызываем функцию при изменении текста
        />
      </div>
    </div>
  );
};

export default Header;
