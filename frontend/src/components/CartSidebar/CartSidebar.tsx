import {
  addToCart,
  clearCart,
  removeFromCart,
  removeItemFromCart,
} from '../../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useUiNavigation } from '../../hooks/useUiNavigation';
import './CartSidebar.css';

const CartSidebar = () => {
  const dispatch = useAppDispatch();
  const ui = useUiNavigation();

  // 1. Данные корзины и адреса
  const cartItems = useAppSelector(state => state.cart.items);
  const reduxSelectedAddress = useAppSelector(state => state.addresses.selectedAddress);
  const isCartOpen = useAppSelector(state => state.ui.isCartOpen);
  const totalSum = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 2. Данные авторизации
  const { isAuth, phoneNumber } = useAppSelector((state) => state.auth);

  // 3. Единая функция для клика по кнопке (Вход или Профиль)
  const handleUserAction = () => {
    if (isAuth) {
      ui.openProfile();
    } else {
      ui.openAuth();
    }
  };

  const handleCheckout = () => {
    ui.openCheckout();
  };

  return (
    <>
    <div
      className={isCartOpen ? 'cart-drawer-backdrop is-open' : 'cart-drawer-backdrop'}
      onClick={ui.closeCart}
      aria-hidden="true"
    />

    <aside className={isCartOpen ? 'map-sidebar is-open' : 'map-sidebar'}>
      <div className="top-actions">
        {/* Одна кнопка, которая меняет вид и действие в зависимости от isAuth */}
        <button 
          className={isAuth ? "btn btn--secondary btn--md btn--block" : "btn btn--primary btn--md btn--block"} 
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
        
        <button className="btn btn--secondary btn--square" onClick={ui.openSupport} title="Поддержка">
          💬
        </button>
      </div>

      <div className="address-selector" onClick={ui.openAddressModal}>
        <div className="address-info-block">
          <div className="address-current">
            {reduxSelectedAddress || "Укажите адрес доставки"}
          </div>
          <div className="delivery-time">Доставка 15 минут</div>
        </div>
        <div className="address-arrow">›</div>
      </div>

      <div className="cart-card">
        <div className="cart-header">
          <div className="cart-title">Корзина</div>
          <button
            type="button"
            className="close-btn-round close-btn-round--sm cart-drawer-close"
            aria-label="Закрыть корзину"
            onClick={ui.closeCart}
          >
            ×
          </button>
          {cartItems.length > 0 && (
            <button
              type="button"
              className="btn btn--danger btn--sm"
              onClick={() => dispatch(clearCart())}
            >
              Очистить
            </button>
          )}
        </div>
        <div className="cart-items-list">
          {cartItems.length === 0 ? (
            <div className="empty-cart-msg">Корзина пока пуста</div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-main">
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-subinfo">
                      {item.quantity} шт. × {item.price} ₽
                    </div>
                  </div>
                  <div className="item-total-price">{item.price * item.quantity} ₽</div>
                </div>
                <div className="cart-item-actions">
                  <div className="stepper stepper--sm">
                    <button
                      type="button"
                      className="stepper__btn"
                      aria-label={`Уменьшить ${item.name}`}
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      −
                    </button>
                    <span className="stepper__count">{item.quantity}</span>
                    <button
                      type="button"
                      className="stepper__btn"
                      aria-label={`Добавить ${item.name}`}
                      disabled={item.quantity >= item.stock}
                      onClick={() => dispatch(addToCart(item))}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn--muted-danger btn--sm"
                    aria-label={`Удалить ${item.name}`}
                    onClick={() => dispatch(removeItemFromCart(item.id))}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="total-row">
            <span>Итого:</span>
            <span className="total-sum">{totalSum} ₽</span>
          </div>
          <button className="btn btn--primary btn--xl btn--block" disabled={cartItems.length === 0} onClick={handleCheckout}>
            Оформить заказ
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};

export default CartSidebar;
