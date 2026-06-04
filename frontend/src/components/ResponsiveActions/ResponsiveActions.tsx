import { useAppSelector } from '../../store/hooks';
import { useUiNavigation } from '../../hooks/useUiNavigation';
import { selectCartItemsCount, selectCartTotal } from '../../store/cartSelectors';
import { formatAddressLine } from '../../utils/address';
import './ResponsiveActions.css';

const ResponsiveActions = () => {
  const ui = useUiNavigation();
  const selectedAddress = useAppSelector((state) => state.addresses.selectedAddress);
  const { isAuth, phoneNumber } = useAppSelector((state) => state.auth);

  const itemsCount = useAppSelector(selectCartItemsCount);
  const totalSum = useAppSelector(selectCartTotal);

  const handleUserAction = () => {
    if (isAuth) {
      ui.openProfile();
      return;
    }

    ui.openAuth();
  };

  const handleAddressAction = () => {
    if (isAuth) {
      ui.openAddressModal();
      return;
    }

    ui.openAuth();
  };

  return (
    <section className="responsive-actions" aria-label="Быстрые действия">
      <button
        type="button"
        className="responsive-action responsive-address-action"
        onClick={handleAddressAction}
      >
        <span className="responsive-action-label">Адрес</span>
        <span className="responsive-action-value">
          {formatAddressLine(selectedAddress) || 'Укажите адрес'}
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
