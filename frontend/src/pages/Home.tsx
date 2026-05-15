import { useState, useMemo } from "react";
import { productsData } from "../data/product";
import type { Product } from "../types";
import { useParams } from 'react-router-dom';

import ProductCard from "../components/ProductCard/ProductCard";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import CartSidebar from "../components/CartSidebar/CartSidebar";
import AddressModal from "../components/AddressModal/AddressModal/AddressModal";
import ProductDetailModal from "../components/ProductDetailModal/ProductDetailModal";
import SupportChat from "../components/SupportChat/SupportChat";
import CheckoutModal from "../components/CheckoutModal/CheckoutModal";

const Home = () => {
  const { categoryId } = useParams(); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      const matchesCategory = !categoryId || p.category === categoryId;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryId, searchQuery]);

  return (
    <div className="container">
      <Sidebar />

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
        onAddressClick={() => setIsModalOpen(true)} 
        onSupportClick={() => setIsSupportOpen(true)}
        onCheckoutClick={() => setIsCheckoutOpen(true)}
      />

      <AddressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      {isSupportOpen && <SupportChat onClose={() => setIsSupportOpen(false)} />}
    </div>
  );
};

export default Home;
