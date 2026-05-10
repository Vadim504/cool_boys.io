import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Добавили useDispatch
import { toggleProfile, toggleAuth } from '../../store/uiSlice'; // Импортируем экшены
import './CartSidebar.css';

const CartSidebar = ({ onAddressClick, onSupportClick, onCheckoutClick }) => {
  const dispatch = useDispatch();

  // 1. Данные корзины и адреса
  const cartItems = useSelector(state => state.cart.items);
  const reduxSelectedAddress = useSelector(state => state.addresses.selectedAddress);
  const totalSum = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 2. Данные авторизации
  const { isAuth, phoneNumber } = useSelector((state) => state.auth);

  // 3. Единая функция для клика по кнопке (Вход или Профиль)
  const handleUserAction = () => {
    if (isAuth) {
      dispatch(toggleProfile(true)); // Если вошел — открываем профиль
    } else {
      dispatch(toggleAuth(true));    // Если нет — открываем вход
    }
  };

  return (
    <aside className="map-sidebar">
      <div className="top-actions">
        {/* Одна кнопка, которая меняет вид и действие в зависимости от isAuth */}
        <button 
          className={isAuth ? "profile-btn-top" : "login-btn-top"} 
          onClick={handleUserAction}
        >
          {isAuth ? (
            <>
              <span className="icon">👤</span> 
              {phoneNumber || "Профиль"}
            </>
          ) : (
            "Войти"
          )}
        </button>
        
        <button className="support-btn" onClick={onSupportClick} title="Поддержка">
          💬
        </button>
      </div>

      <div className="address-selector" onClick={onAddressClick}>
        <div className="address-info-block">
          <div className="address-current">
            {reduxSelectedAddress || "Укажите адрес доставки"}
          </div>
          <div className="delivery-time">Доставка 15 минут</div>
        </div>
        <div className="address-arrow">›</div>
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
          <button className="order-button" disabled={cartItems.length === 0} onClick={onCheckoutClick}>
            Оформить заказ
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CartSidebar;