import { Link, useSearchParams } from 'react-router-dom';
import { productsData } from '../data/product';
import ProductCard from '../components/ProductCard/ProductCard';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import CartSidebar from '../components/CartSidebar/CartSidebar';
import ResponsiveActions from '../components/ResponsiveActions/ResponsiveActions';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';
  const normalizedQuery = query.toLowerCase();

  const results = normalizedQuery
    ? productsData.filter((product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description?.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const handleSearch = (value: string) => {
    const nextQuery = value.trim();
    setSearchParams(nextQuery ? { q: nextQuery } : {});
  };

  return (
    <div className="container">
      <Sidebar />

      <main className="main-content search-page">
        <ResponsiveActions />
        <Header value={query} onSearch={handleSearch} />

        <div className="search-page-header">
          <div>
            <h1>Поиск</h1>
            <p>{query ? `Результаты по запросу: ${query}` : 'Введите запрос в строке поиска'}</p>
          </div>
          <Link to="/" className="btn btn--pill-outline back-to-catalog-link">
            В каталог
          </Link>
        </div>

        {results.length > 0 ? (
          <div className="products-grid">
            {results.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          <div className="search-empty-state">
            <h2>Ничего не найдено</h2>
            <p>Попробуйте изменить запрос или вернуться в каталог.</p>
          </div>
        )}
      </main>

      <CartSidebar />
    </div>
  );
};

export default SearchPage;
