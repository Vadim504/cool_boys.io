import './MapSidebar.css';

export default function MapSidebar({ currentAddress, onAddressClick, onSupportClick, onProfileClick, onLogout, onLoginClick, user }) {
  return (
    <aside className="map-sidebar">
      <div className="top-actions">
        {/* УСЛОВНОЕ ОТОБРАЖЕНИЕ КНОПКИ */}
        {user ? (
          // Кнопка ПРОФИЛЯ (если вошли)
          <div className="profile-dropdown">
             <button className="profile-btn" onClick={onProfileClick}>
                <div className="avatar">{user.name[0]}</div>
                <span className="profile-name">Профиль</span>
             </button>
          </div>
        ) : (
          // Кнопка ВОЙТИ (если не вошли)
          <button className="login-btn-top" onClick={onLoginClick}>
            Войти
          </button>
        )}
        <button 
            className="support-btn" 
            title="Поддержка"
            onClick={onSupportClick} // Добавляем обработчик
          >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      <div className="map-card">
        <div className="address-selector" onClick={onAddressClick}>
          <span className="address-current">{currentAddress}</span>
          <span className="address-chevron">▾</span>
        </div>

        <div className="cart-title">Корзина</div>

        <div className="cart-items-list">
          <div className="cart-item">
            <div className="item-details">
              <div className="item-name">Пицца Маргарита</div>
              <div className="item-subinfo">
                <span className="item-count">2 шт.</span> × 
                <span className="item-price-unit">450 ₽</span>
              </div>
            </div>
            <div className="item-total-price">900 ₽</div>
          </div>
          <div className="cart-item">
            <div className="item-details">
              <div className="item-name">Кока-кола 0.5л</div>
              <div className="item-subinfo">
                <span className="item-count">1 шт.</span> × 
                <span className="item-price-unit">120 ₽</span>
              </div>
            </div>
            <div className="item-total-price">120 ₽</div>
          </div>
        </div>

        <div className="cart-footer">
          <div className="total-row">
            <span>Итого:</span>
            <span className="total-sum">1020 ₽</span>
          </div>
          <button className="order-button">Оформить заказ</button>
        </div>
      </div>
    </aside>
  );
}