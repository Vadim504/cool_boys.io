import './MainContent.css';

export default function MainContent() {
  return (
    <main className="main-content">
      <div className="page-header">
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Поиск..." />
        </div>
      </div>
      <div className="products-area">
        <p style={{ color: '#888', marginTop: 20 }}>
          Товары появятся здесь после загрузки каталога
        </p>
      </div>
    </main>
  );
}

