import { useMemo } from 'react';
import { addToCart, removeFromCart } from '../../store/cartSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { productsData } from '../../data/product';
import './CheckoutModal.css';

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const selectedAddress = useAppSelector((state) => state.addresses.selectedAddress);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const suggestions = useMemo(() => {
    const categoriesInCart = new Set(cartItems.map((item) => item.category));
    return productsData
      .filter((item) => !cartItems.some((cartItem) => cartItem.id === item.id))
      .filter((item) => categoriesInCart.size === 0 || categoriesInCart.has(item.category))
      .slice(0, 6);
  }, [cartItems]);

  if (!isOpen) return null;

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-close-btn" onClick={onClose}>×</button>
        <h2 className="checkout-title">{selectedAddress || 'Адрес не выбран'}</h2>

        <div className="checkout-columns">
          <div className="checkout-left">
            <section className="checkout-card">
              <h3>Доставка 15 минут</h3>
              {cartItems.length === 0 ? (
                <p className="checkout-empty">Корзина пока пуста</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="checkout-item">
                    <img src={item.image} alt={item.name} />
                    <div className="checkout-item-info">
                      <div className="checkout-item-name">{item.name}</div>
                      <div className="checkout-item-weight">{item.weight}</div>
                    </div>
                    <div className="checkout-stepper">
                      <button onClick={() => dispatch(removeFromCart(item.id))}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => dispatch(addToCart(item))}>+</button>
                    </div>
                    <div className="checkout-item-price">{item.price * item.quantity} ₽</div>
                  </div>
                ))
              )}
            </section>

            <section className="checkout-card">
              <h3>Добавить к заказу?</h3>
              <div className="checkout-suggestions">
                {suggestions.map((item) => (
                  <div key={item.id} className="checkout-suggestion-item">
                    <img src={item.image} alt={item.name} />
                    <div className="name">{item.name}</div>
                    <div className="bottom">
                      <span>{item.price} ₽</span>
                      <button onClick={() => dispatch(addToCart(item))}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="checkout-right">
            <section className="checkout-card">
              <h3>Скидки и выгода</h3>
              <div className="checkout-line">Скидка или промокод <span>›</span></div>
              <div className="checkout-line">СберПрайм <span>×</span></div>
            </section>

            <section className="checkout-summary">
              <div className="checkout-total-row">
                <span>Итого</span>
                <strong>{total} ₽</strong>
              </div>
              <button className="checkout-continue-btn" disabled={cartItems.length === 0}>
                Продолжить
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
