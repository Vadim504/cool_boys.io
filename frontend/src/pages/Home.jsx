import React, { useState, useMemo } from "react";
import { productsData } from "../data/product";
import { CATEGORIES } from "../constants/categories";
import { useAddress } from "../hooks/useAddress";
import { useParams, useNavigate } from 'react-router-dom';

import ProductCard from "../components/ProductCard/ProductCard";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import CartSidebar from "../components/CartSidebar/CartSidebar";
import AddressModal from "../components/AddressModal/AddressModal/AddressModal";
import ProductDetailModal from "../components/ProductDetailModal/ProductDetailModal";

const Home = () => {
  const { categoryId } = useParams(); 
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { currentAddress, selectAddress } = useAddress();

  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      if (!categoryId) return true;  
      return p.category.toLowerCase().trim() === categoryId.toLowerCase().trim();
    });
  }, [categoryId]); 

  return (
    <div className="container">
      <Sidebar 
        categories={CATEGORIES} 
        onCategorySelect={(name) => navigate(`/category/${name}`)} 
        activeCategory={categoryId}
      />

      <main className="main-content">
        <Header onSearch={setSearchQuery} />
        <div className="products-grid">
          {filteredProducts.map(item => (
            <ProductCard 
              key={item.id} 
              product={item} 
              onOpenDetail={() => setSelectedProduct(item)} 
            />
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

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default Home;

