import { useMemo } from 'react';
import { addToCart, clearCart, removeFromCart } from '../../store/cartSlice';
import { selectCartItems } from '../../store/cartSelectors';
import { createOrder } from '../../store/ordersSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useUiNavigation } from '../../hooks/useUiNavigation';
import { productsData } from '../../data/product';
import { formatAddressLine } from '../../utils/address';
import './CheckoutModal.css';

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const dispatch = useAppDispatch();
  const ui = useUiNavigation();
  const cartItems = useAppSelector(selectCartItems);
  const selectedAddress = useAppSelector((state) => state.addresses.selectedAddress);
  const { isAuth, phoneNumber } = useAppSelector((state) => state.auth);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const canCreateOrder = cartItems.length > 0 && isAuth && Boolean(phoneNumber) && Boolean(selectedAddress);
  const checkoutBlockReason = !isAuth
    ? 'Войдите, чтобы оформить заказ'
    : !selectedAddress
    ? 'Укажите адрес доставки'
    : '';

  const suggestions = useMemo(() => {
    const categoriesInCart = new Set(cartItems.map((item) => item.category));
    return productsData
      .filter((item) => !cartItems.some((cartItem) => cartItem.id === item.id))
      .filter((item) => categoriesInCart.size === 0 || categoriesInCart.has(item.category))
      .slice(0, 6);
  }, [cartItems]);

  if (!isOpen) return null;

  const handleCreateOrder = () => {
    if (!isAuth || !phoneNumber) {
      onClose();
      ui.openAuth();
      return;
    }

    if (!selectedAddress) {
      onClose();
      ui.openAddressModal();
      return;
    }

    if (cartItems.length === 0) return;

    dispatch(createOrder({
      items: cartItems,
      address: selectedAddress,
      userPhone: phoneNumber,
    }));
    dispatch(clearCart());
    onClose();
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn-round close-btn-round--sm checkout-close-btn" onClick={onClose}>×</button>
        <h2 className="checkout-title">{formatAddressLine(selectedAddress) || 'Укажите адрес доставки'}</h2>

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
                    <div className="stepper stepper--neutral checkout-stepper">
                      <button type="button" className="stepper__btn" onClick={() => dispatch(removeFromCart(item.id))}>−</button>
                      <span className="stepper__count">{item.quantity}</span>
                      <button type="button" className="stepper__btn" onClick={() => dispatch(addToCart(item))}>+</button>
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
                      <button type="button" className="icon-btn icon-btn--tiny" onClick={() => dispatch(addToCart(item))}>+</button>
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
              <button
                className="btn btn--primary btn--lg btn--block checkout-continue-btn"
                disabled={!canCreateOrder}
                onClick={handleCreateOrder}
              >
                Продолжить
              </button>
              {checkoutBlockReason && (
                <p className="checkout-warning">{checkoutBlockReason}</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
