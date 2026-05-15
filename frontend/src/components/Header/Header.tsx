import './Header.css';

type HeaderProps = {
  value?: string;
  onSearch: (value: string) => void;
};

const Header = ({ value = '', onSearch }: HeaderProps) => {
  return (
    <div className="page-header">
      <div className="search-container">
        <span className="search-icon" aria-hidden="true" />
        <input 
          type="text" 
          className="catalog-search-input" 
          aria-label="Поиск товаров"
          placeholder="Поиск..." 
          value={value}
          onChange={(e) => onSearch(e.target.value)}
        />
        {value && (
          <button
            type="button"
            className="search-clear-button"
            aria-label="Очистить поиск"
            onClick={() => onSearch('')}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
