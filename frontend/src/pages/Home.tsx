import { useState, useMemo } from "react";
import { productsData } from "../data/product";
import { useParams } from 'react-router-dom';

import ProductCard from "../components/ProductCard/ProductCard";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import CartSidebar from "../components/CartSidebar/CartSidebar";
import ResponsiveActions from "../components/ResponsiveActions/ResponsiveActions";
import { matchesProductSearch } from "../utils/productSearch";

const Home = () => {
  const { categoryId } = useParams(); 
  const [searchQuery, setSearchQuery] = useState("");

  const resetFilters = () => {
    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      const matchesCategory = !categoryId || p.category === categoryId;
      const matchesSearch = matchesProductSearch(p, searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [categoryId, searchQuery]);

  return (
    <div className="container">
      <Sidebar onCatalogClick={resetFilters} />

      <main className="main-content">
        <ResponsiveActions />
        <Header value={searchQuery} onSearch={setSearchQuery} />
        <div className="products-grid">
          {filteredProducts.map(item => (
            <ProductCard 
              key={item.id} 
              product={item} 
            />
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="empty-state empty-state--boxed">
            <h2>Ничего не найдено</h2>
            <p>Измените запрос или сбросьте фильтры через «Каталог».</p>
          </div>
        )}
      </main>

      <CartSidebar />
    </div>
  );
};

export default Home;
