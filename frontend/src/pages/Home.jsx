import React, { useState, useMemo } from "react";
import { productsData } from "../data/product";
import { CATEGORIES } from "../constants/categories"; // Данные отдельно
import { useAddress } from "../hooks/useAddress";       // Логика отдельно

import ProductCard from "../components/ProductCard/ProductCard";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import CartSidebar from "../components/CartSidebar/CartSidebar";
import AddressModal from "../components/AddressModal/AddressModal/AddressModal";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Используем наш кастомный хук
  const { currentAddress, selectAddress } = useAddress();

  // Фильтрация
  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="container">
      <Sidebar 
        categories={CATEGORIES} 
        onCategorySelect={setSelectedCategory} 
        activeCategory={selectedCategory}
      />

      <main className="main-content">
        <Header onSearch={setSearchQuery} />
        <div className="products-grid">
          {filteredProducts.map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </main>

      <CartSidebar 
        currentAddress={currentAddress} 
        onAddressClick={() => setIsModalOpen(true)} 
      />

      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelectFinalAddress={selectAddress} 
      />
    </div>
  );
};

export default Home;