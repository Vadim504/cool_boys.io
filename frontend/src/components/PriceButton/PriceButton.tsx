// src/components/PriceButton/PriceButton.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../store/cartSlice';
import './PriceButton.css';

const PriceButton = ({ product, isCompact = false }) => {
  const dispatch = useDispatch();
  const cartItem = useSelector(state => state.cart.items.find(i => i.id === product.id));
  const quantity = cartItem ? cartItem.quantity : 0;

  if (quantity === 0) {
    return (
      <button className="price-btn-initial" onClick={() => dispatch(addToCart(product))}>
        {product.price} ₽ <span className="plus-sign">+</span>
      </button>
    );
  }

  return (
    <div className={`price-btn-counter ${isCompact ? 'compact' : ''}`}>
      <button onClick={() => dispatch(removeFromCart(product.id))}>−</button>
      <span>{quantity}</span>
      <button onClick={() => dispatch(addToCart(product))}>+</button>
    </div>
  );
};

export default PriceButton;