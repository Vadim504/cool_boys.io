// src/components/ProductDetailModal/ProductDetailModal.jsx
import React from 'react';
import './ProductDetailModal.css';
import PriceButton from '../PriceButton/PriceButton';

const ProductDetailModal = ({ product, onClose }) => {
  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-detail-btn" onClick={onClose}>×</button>
        
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-info">
          <h1>{product.price} ₽</h1>
          <h2>{product.name}</h2>
          <span className="detail-weight">{product.weight}</span>
          
          <div className="detail-description">
            <h3>Описание</h3>
            <p>{product.description || "Прекрасный свежий продукт из Самоката."}</p>
          </div>

          <div className="detail-footer">
            <PriceButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;