import {
  openAddressModal,
  openCart,
  openSupport,
  toggleAuth,
  toggleProfile,
} from '../../store/uiSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import './ResponsiveActions.css';

const ResponsiveActions = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const selectedAddress = useAppSelector((state) => state.addresses.selectedAddress);
  const { isAuth, phoneNumber } = useAppSelector((state) => state.auth);

  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalSum = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUserAction = () => {
    if (isAuth) {
      dispatch(toggleProfile(true));
      return;
    }

    dispatch(toggleAuth(true));
  };

  return (
    <section className="responsive-actions" aria-label="Быстрые действия">
      <button
        type="button"
        className="responsive-action responsive-address-action"
        onClick={() => dispatch(openAddressModal())}
      >
        <span className="responsive-action-label">Адрес</span>
        <span className="responsive-action-value">
          {selectedAddress || 'Укажите адрес'}
        </span>
      </button>

      <button
        type="button"
        className="responsive-action"
        aria-label={isAuth ? 'Открыть профиль' : 'Войти'}
        onClick={handleUserAction}
      >
        <span className="responsive-action-icon">👤</span>
        <span>{isAuth ? phoneNumber || 'Профиль' : 'Войти'}</span>
      </button>

      <button
        type="button"
        className="responsive-action"
        aria-label="Поддержка"
        onClick={() => dispatch(openSupport())}
      >
        <span className="responsive-action-icon">💬</span>
        <span>Помощь</span>
      </button>

      <button
        type="button"
        className="responsive-action responsive-cart-action"
        aria-label="Открыть корзину"
        onClick={() => dispatch(openCart())}
      >
        <span className="responsive-cart-count">{itemsCount}</span>
        <span>{totalSum > 0 ? `${totalSum} ₽` : 'Корзина'}</span>
      </button>
    </section>
  );
};

export default ResponsiveActions;
