import React from 'react';
import { useSelector } from 'react-redux';
import './CartSidebar.css';

const CartSidebar = ({ currentAddress, onAddressClick }) => {
  // 1. Берем товары из Redux
  const cartItems = useSelector(state => state.cart.items);
  
  // 2. Считаем сумму
  const totalSum = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <aside className="map-sidebar">
      <div className="address-selector" onClick={onAddressClick}>
        <div className="address-current">{currentAddress}</div>
        <div className="delivery-time">Доставка 15 минут</div>
      </div>

      <div className="cart-card">
        <div className="cart-title">Корзина</div>
        
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="empty-cart-msg">Корзина пока пуста</div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-subinfo">
                    {item.quantity} шт. × {item.price} ₽
                  </div>
                </div>
                <div className="item-total-price">{item.price * item.quantity} ₽</div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="total-row">
            <span>Итого:</span>
            <span className="total-sum">{totalSum} ₽</span>
          </div>
          <button className="order-button" disabled={cartItems.length === 0}>
            Оформить заказ
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CartSidebar;