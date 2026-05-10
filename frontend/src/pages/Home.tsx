import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux"; 
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
import Profile from "../components/Profile/Profile"; 
import AuthModal from "../components/AuthModal/AuthModal"; 
import SupportChat from "../components/SupportChat/SupportChat";
import CheckoutModal from "../components/CheckoutModal/CheckoutModal";

const Home = () => {
  const { categoryId } = useParams(); 
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { currentAddress, selectAddress } = useAddress();
 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false); 
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { isAuth } = useSelector((state) => state.auth); 

  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      const matchesCategory = !categoryId || p.category === categoryId;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryId, searchQuery]);

  return (
    <div className="container">
      <Sidebar 
        categories={CATEGORIES} 
        onCategorySelect={(name) => navigate(`/category/${name}`)} 
        activeCategory={categoryId}
        // Если залогинен — открываем профиль, если нет — окно входа
        onProfileClick={() => isAuth ? setIsProfileOpen(true) : setIsAuthOpen(true)} 
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
        // onAuthClick={() => setIsAuthOpen(true)} 
        // onProfileClick={() => isAuth ? setIsProfileOpen(true) : setIsAuthOpen(true)}
        onSupportClick={() => setIsSupportOpen(true)}
        onCheckoutClick={() => setIsCheckoutOpen(true)}
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
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      {isSupportOpen && <SupportChat onClose={() => setIsSupportOpen(false)} />}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </div>
  );
};

export default Home;