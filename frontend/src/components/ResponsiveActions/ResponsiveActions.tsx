import { useAppSelector } from '../../store/hooks';
import { useUiNavigation } from '../../hooks/useUiNavigation';
import './ResponsiveActions.css';

const ResponsiveActions = () => {
  const ui = useUiNavigation();
  const cartItems = useAppSelector((state) => state.cart.items);
  const selectedAddress = useAppSelector((state) => state.addresses.selectedAddress);
  const { isAuth, phoneNumber } = useAppSelector((state) => state.auth);

  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalSum = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleUserAction = () => {
    if (isAuth) {
      ui.openProfile();
      return;
    }

    ui.openAuth();
  };

  return (
    <section className="responsive-actions" aria-label="Быстрые действия">
      <button
        type="button"
        className="responsive-action responsive-address-action"
        onClick={ui.openAddressModal}
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
        onClick={ui.openSupport}
      >
        <span className="responsive-action-icon">💬</span>
        <span>Помощь</span>
      </button>

      <button
        type="button"
        className="responsive-action responsive-cart-action btn btn--primary"
        aria-label="Открыть корзину"
        onClick={ui.openCart}
      >
        <span className="responsive-cart-count">{itemsCount}</span>
        <span>{totalSum > 0 ? `${totalSum} ₽` : 'Корзина'}</span>
      </button>
    </section>
  );
};

export default ResponsiveActions;
